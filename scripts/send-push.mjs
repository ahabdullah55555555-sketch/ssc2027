// Agradia push sender — Phase 2 (cardless GitHub Actions route).
//
// What it does:
//   - MANUAL mode (workflow_dispatch with a title and/or body): sends one
//     broadcast push to every user document that has a push subscription.
//     Used for real delivery tests (including with the app closed).
//   - SCHEDULED mode (cron, or dispatch with no title/body): sends a
//     "timer finished" push for each user whose synced app state shows a
//     running timer whose endAt passed within the last 10 minutes and has
//     not been notified for that endAt yet.
//   - Also in SCHEDULED mode: an unseen-message reminder for each user
//     with a chat message from someone else unread for >= 24h (once per
//     message, tap opens the inbox). Reads the chats collection directly,
//     so it also works when the app was closed since the message arrived.
//   - DRY RUN (PUSH_DRY_RUN=true): logs what would be sent, sends nothing,
//     writes nothing.
//
// What it deliberately does NOT do:
//   - It does NOT send timed reminders: the app currently has NO reminder
//     data model (no reminder list, times, or storage anywhere in the app),
//     so there is nothing due to send. Timed reminders need a separate
//     app change first (reminder model + UI + sync); see the parent report.
//   - It never deletes a subscription or any user data. Expired endpoints
//     (HTTP 410/404) are only logged and skipped.
//   - It never logs secrets, endpoints, push keys, or message bodies.
//     Logs carry counts and truncated user ids only.
//
// Secrets (environment only, never in this file):
//   FIREBASE_SERVICE_ACCOUNT_JSON — full service-account JSON (one line in
//     the GitHub secret), from Firebase Console -> Project settings ->
//     Service accounts -> Generate new private key (project agradia-test).
//   VAPID_PRIVATE_KEY — the VAPID private key paired with the app's public
//     key, from Firebase Console -> Project settings -> Cloud Messaging ->
//     Web Push certificates. Never share it with Muse or anyone else.
// Optional environment:
//   MANUAL_TITLE / MANUAL_BODY — set by the workflow's dispatch inputs.
//   PUSH_DRY_RUN — 'true' to log only.
//
// Payload contract (must match the app's service worker, sw.js):
//   The worker parses event.data as JSON and shows title (default
//   'Agradia'), body (default ''), fixed icon './notif-icon.svg', and opens
//   data.url (default './') on tap. It does NOT honour tag, so dedup below
//   is what stops repeats. Keep payloads to {title, body, url} only.

import admin from 'firebase-admin';
import webpush from 'web-push';

// Public by design: this is the same PUSH_VAPID constant embedded in the
// app (index.html). If the app's key ever changes, this MUST change too,
// otherwise pushes will fail authentication.
const VAPID_PUBLIC_KEY =
  'BFnJLjpn2JkaVAec4Bv_7KoKeKSklAEOcSNM1j955Tt6M5PTuAaK7d2B2ZL1ogvZ8roWxXLGBKFCTQIdhRw1q_A';
const VAPID_SUBJECT = 'https://ahabdullah55555555-sketch.github.io/ssc2027/';

// Timer-finish window: a timer that ended more than this long ago is too
// stale to announce (the in-app timer already shows completion on open).
const TIMER_WINDOW_MS = 10 * 60 * 1000;

const trunc = (uid) => String(uid).slice(0, 6) + '…';

function fail(message) {
  console.error('ERROR: ' + message);
  process.exit(1);
}

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
if (!serviceAccountJson) fail('FIREBASE_SERVICE_ACCOUNT_JSON is not set');
if (!vapidPrivateKey) fail('VAPID_PRIVATE_KEY is not set');

let serviceAccount;
try {
  serviceAccount = JSON.parse(serviceAccountJson);
} catch {
  fail('FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON');
}
if (!serviceAccount || typeof serviceAccount !== 'object' || !serviceAccount.project_id) {
  fail('FIREBASE_SERVICE_ACCOUNT_JSON does not look like a service-account key');
}

const manualTitle = (process.env.MANUAL_TITLE || '').trim();
const manualBody = (process.env.MANUAL_BODY || '').trim();
const dryRun = String(process.env.PUSH_DRY_RUN || '').toLowerCase() === 'true';
const manualMode = manualTitle !== '' || manualBody !== '';

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, vapidPrivateKey);

const db = admin.firestore();
let snapshot;
try {
  snapshot = await db.collection('users').get();
} catch (err) {
  fail('Could not read Firestore users collection: ' + (err && err.message ? err.message : err));
}

const counts = {
  users: 0,
  withSub: 0,
  skippedNoSub: 0,
  skippedNoState: 0,
  manualSent: 0,
  timerSent: 0,
  timerSkippedNotRunning: 0,
  timerSkippedNotDue: 0,
  timerSkippedWindow: 0,
  timerSkippedAlreadySent: 0,
    msgSent: 0, msgSkippedMuted: 0, msgSkippedNone: 0, msgSkippedSeen: 0,
    msgSkippedRecent: 0, msgSkippedAlreadySent: 0, msgCheckFailed: 0,
  expired: 0,
  failed: 0,
  failedByStatus: {},
};
const failedDetails = [];

function validSub(sub) {
  return (
    sub &&
    typeof sub === 'object' &&
    typeof sub.endpoint === 'string' &&
    sub.endpoint.length > 0 &&
    sub.keys &&
    typeof sub.keys.p256dh === 'string' &&
    typeof sub.keys.auth === 'string'
  );
}

async function sendOne(uid, sub, payload, ttlSeconds) {
  if (dryRun) return 'dry-run';
  try {
    await webpush.sendNotification(sub, JSON.stringify(payload), { TTL: ttlSeconds });
    return 'sent';
  } catch (err) {
    const status = err && err.statusCode ? String(err.statusCode) : 'unknown';
    counts.failedByStatus[status] = (counts.failedByStatus[status] || 0) + 1;
    if (status === '404' || status === '410') {
      // Expired subscription: log and skip only. Never delete user data.
      counts.expired += 1;
    } else {
      counts.failed += 1;
      failedDetails.push(trunc(uid) + ':' + status);
    }
    return 'failed';
  }
}

const now = Date.now();

for (const doc of snapshot.docs) {
  const uid = doc.id;
  const data = doc.data() || {};
  counts.users += 1;

  let sub = data.pushSub;
  if (typeof sub === 'string') {
    try {
      sub = JSON.parse(sub);
    } catch {
      sub = null;
    }
  }
  if (!validSub(sub)) {
    counts.skippedNoSub += 1;
    continue;
  }
  counts.withSub += 1;

  if (manualMode) {
    const payload = {
      title: manualTitle || 'Agradia',
      body: manualBody,
      url: './',
    };
    const result = await sendOne(uid, sub, payload, 3600);
    if (result === 'sent' || result === 'dry-run') counts.manualSent += 1;
    continue;
  }

  // Scheduled mode: timer-finish only.
  let state = null;
  if (typeof data.state === 'string' && data.state.length > 0) {
    try {
      state = JSON.parse(data.state);
    } catch {
      state = null;
    }
  }
  if (!state) {
    counts.skippedNoState += 1;
    continue;
  }
  const pushSent = data.pushSent && typeof data.pushSent === 'object' ? data.pushSent : {};

  // Unseen-message reminder: a chat message from someone else that stayed
  // unread for >= 24h gets one reminder push (exact user wording), opening
  // the inbox on tap. Dedup: once per message (keyed by last.ts).
  // Reads chats directly (members array-contains uid), so it also works
  // when the app has been closed since the message arrived. chatSeen /
  // chatMuted come from the user's synced app state.
  const MSG_DAY_MS = 24 * 60 * 60 * 1000;
  const chatSeen = state.chatSeen && typeof state.chatSeen === 'object' ? state.chatSeen : {};
  const chatMuted = state.chatMuted && typeof state.chatMuted === 'object' ? state.chatMuted : {};
  try {
    const chatsSnap = await db.collection('chats').where('members', 'array-contains', uid).get();
    for (const chatDoc of chatsSnap.docs) {
      const cid = chatDoc.id;
      const mm = chatMuted[cid];
      if (mm && (mm.until === 0 || now < mm.until)) { counts.msgSkippedMuted += 1; continue; }
      const lastSnap = await db.collection('chats').doc(cid).collection('messages').orderBy('ts', 'desc').limit(1).get();
      let last = null;
      lastSnap.forEach((d) => { const dd = d.data(); last = { from: dd.from, ts: dd.ts }; });
      if (!last || !last.ts || last.from === uid) { counts.msgSkippedNone += 1; continue; }
      if (last.ts <= (chatSeen[cid] || 0)) { counts.msgSkippedSeen += 1; continue; }
      if (now - last.ts < MSG_DAY_MS) { counts.msgSkippedRecent += 1; continue; }
      const sentForCid = pushSent.msg && typeof pushSent.msg === 'object' ? pushSent.msg[cid] : undefined;
      if (sentForCid === last.ts) { counts.msgSkippedAlreadySent += 1; continue; }
      const payload = { title: 'Agradia', body: 'You may have a new message. Check it now.', url: './#messages' };
      const mres = await sendOne(uid, sub, payload, 3600);
      if (mres === 'sent') {
        counts.msgSent += 1;
        pushSent.msg = { ...(pushSent.msg && typeof pushSent.msg === 'object' ? pushSent.msg : {}), [cid]: last.ts };
        try { await doc.ref.set({ pushSent: { ...pushSent } }, { merge: true }); }
        catch (err) { console.log('WARN: could not record msg marker for ' + trunc(uid)); }
      } else if (mres === 'dry-run') { counts.msgSent += 1; }
    }
  } catch (err) { counts.msgCheckFailed += 1; }

  const timer = state.timer;
  if (!timer || timer.run !== true || typeof timer.endAt !== 'number' || !Number.isFinite(timer.endAt)) {
    counts.timerSkippedNotRunning += 1;
    continue;
  }
  const endAt = timer.endAt;
  if (endAt > now) {
    counts.timerSkippedNotDue += 1;
    continue;
  }
  if (now >= endAt + TIMER_WINDOW_MS) {
    counts.timerSkippedWindow += 1;
    continue;
  }
  if (pushSent.timer === endAt) {
    counts.timerSkippedAlreadySent += 1;
    continue;
  }

  const lang = state.prefs && state.prefs.lang === 'bn' ? 'bn' : 'en';
  const subj = typeof timer.subj === 'string' ? timer.subj.trim() : '';
  const body =
    (lang === 'bn' ? 'টাইমার শেষ হয়েছে' : 'Timer finished') + (subj ? ' • ' + subj : '');
  const payload = { title: 'Agradia', body, url: './' };
  const result = await sendOne(uid, sub, payload, 600);
  if (result === 'sent') {
    counts.timerSent += 1;
    try {
      await doc.ref.set({ pushSent: { ...pushSent, timer: endAt } }, { merge: true });
      pushSent.timer = endAt;
    } catch (err) {
      console.log('WARN: could not record sent marker for ' + trunc(uid));
    }
  } else if (result === 'dry-run') {
    counts.timerSent += 1;
  }
}

console.log(
  JSON.stringify({
    mode: dryRun ? (manualMode ? 'manual-dry-run' : 'scheduled-dry-run') : manualMode ? 'manual' : 'scheduled',
    ...counts,
    failedDetails: failedDetails.slice(0, 20),
  }),
);

// In manual mode, zero deliveries to real subscribers means the test did
// not prove anything — fail loudly so the workflow run shows red.
if (manualMode && !dryRun && counts.manualSent === 0 && counts.withSub > 0) {
  fail('Manual push sent to 0 subscribers despite subscriptions present');
}
