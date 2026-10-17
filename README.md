# Agradia

**A calm, free study companion that lives on your phone. Give it your study routine and it becomes your personal planner, focus timer and progress record.**

বাংলায় পড়তে নিচে যান: [বাংলা বিবরণ](#বাংলা-বিবরণ)

---

## What is this?

Agradia is a small app for students. You tell it what you plan to study each day. It then helps you:

- see what you have to do today,
- tick tasks as you finish them,
- time your study sessions and record how many hours you really studied,
- look back at your progress by day, week, month and year.

It works like a normal app on your phone, but there is nothing to download from a store. It opens in Chrome and can be added to your home screen.

**Everything stays on your own phone.** There is no sign-up, no account, no advertising and no server collecting your data. After the first visit it also works without internet.

## Who is it for?

Any student who follows a study routine: school, college, admission or exam preparation. It has no fixed subjects or dates. Your routine decides everything.

---

## How to start (3 steps)

1. **Open the app.** On first launch it asks you to upload your routine.
2. **Get your routine into the app's format.** The app shows a ready-made prompt. Tap *Copy prompt*, then give it to any AI tool (ChatGPT, Gemini, Grok or others) together with your routine, in any form or language. The AI replies with a neat text.
3. **Paste that reply into the app** and tap *Continue*. The app reads it and builds your whole study plan.

You do this only once. If something in the text is wrong, the app shows which line, and builds nothing until it is fixed. If you did not give study times, the AI estimates sensible ones.

---

## Look and feel

- Minimal, quiet design with generous white space, no boxes, borders or glowing effects
- A forest-green palette in **Light**, **Dark** and **Custom** modes
- The bottom bar has three icons only: **Home, Routine, Records**
- Search and a three-dot menu at the top of the main pages
- A few soft line illustrations on empty screens
- Poppins for English and Hind Siliguri for Bengali

---

## Pages

### Home
- Greeting, your avatar (tap it to change), today's progress ring and overall progress
- **Study timer:** choose a subject, start, pause, stop. The time is saved as a record
- Today's tasks with tick boxes, study time and subject records
- Warnings for overdue tasks and for days planned above your daily limit

### Routine
- Three-dot menu: **Edit routine**, **View** (List view or Calendar view), **Settings**
- Tick tasks, log study time, add records for several subjects on the same day
- Edit mode: add, edit, move, copy, delete and reorder tasks and dates, day notes
- Backlog and overdue lists, Undo, and **Update your routine** at the bottom

### Records
- **Daily, Weekly, Monthly, Yearly** graphs with previous and next paging
- Solid bars show time studied (split by subject colour when you record subjects). Light bars behind them show your target
- Totals, average per study day, best day, details list
- **Subjects:** study time per subject (pick each subject's colour) and task progress

### Search
Finds tasks, subjects, chapters, weak chapters and mistakes.

### Settings
Open it from the three-dot menu. Each category opens its own page with a back button.
- **Appearance:** Light, Dark or Custom (accent, background, surface, text, secondary text and warning colours); pop-up message time
- **Language & Text:** English or বাংলা, seven text sizes
- **Profile & Avatar:** your name, a collection of avatars, your own avatar designer, or your own cropped photo
- **Routine & Data:** update your routine, daily study limit, backup and restore, copy or download your information as readable text, remove routine, reset study records
- **Logs:** weak chapters list and mistake log
- **About Agradia:** version, how your data is kept, install guide

### Updating your routine
Paste a new routine and choose one of three ways:

| Option | What happens |
|---|---|
| **Add to current routine** | Everything stays. New dates and tasks are added |
| **Replace matching dates only** | Dates found in the new routine are replaced, all other dates stay |
| **Reset everything** | The whole old routine is replaced |

Study time, weak chapters and mistakes are never deleted by these options. **Undo** is available straight after.

---

## The routine text format

```
STUDY_ROUTINE_V1
LIMIT: 7h 30m
SUBJECTS: Physics, Math, English

DATE: 2026-10-17
NOTE: Light day
TASK: Chapter 3 first read | SUBJECT: Physics | CHAPTER: Ch 3 | TIME: 1h 30m
TASK: Practice set | SUBJECT: Math | TIME: 45m

DATE: 2026-10-18
NOTE: Rest day

BACKLOG
TASK: Mock test review | SUBJECT: Physics, Math | TIME: 2h
```

Required: `STUDY_ROUTINE_V1`, `DATE`, `TASK`, `TIME`. Optional: `LIMIT`, `SUBJECTS`, `NOTE`, `SUBJECT`, `CHAPTER`, `BACKLOG`.

---

## Your privacy and your data

- All your data is stored only in your phone's browser; nothing is sent anywhere and devices do not sync
- Clearing the browser's data deletes the app's data, so **export a backup** now and then
- Backups from earlier versions still import correctly

## Install on Android

1. Open the app's link in Chrome and let it load once with internet.
2. Tap the three-dot menu, then **Install app** (or *Add to Home screen*).

---

## For the person who publishes it (GitHub Pages)

The app is a few plain files. There is nothing to build.

| File | What it is |
|---|---|
| `index.html` | The entire app. **Replace only this file to update the app** |
| `sw.js` | Offline support. Loads the newest `index.html` whenever you are online |
| `manifest.json` | App name and icons for installing |
| `icon.svg`, `icon-192.png`, `icon-512.png` | The app logo |
| `README.md` | This page |

Fonts (Poppins, Hind Siliguri) load from Google Fonts on the first online visit and are then kept for offline use. Without that first visit the app uses the phone's own fonts.

To publish: put the files in the repository, open *Settings → Pages*, choose the main branch, and share the link.

---

# বাংলা বিবরণ

## এটা কী?

Agradia শিক্ষার্থীদের জন্য একটা শান্ত, বিনামূল্যের পড়ার সঙ্গী। আপনার রুটিন দিলে এটি আপনার প্ল্যানার, ফোকাস টাইমার ও অগ্রগতির রেকর্ড হয়ে যায়। সাইন আপ, অ্যাকাউন্ট, বিজ্ঞাপন বা সার্ভার নেই। সব তথ্য শুধু আপনার ফোনেই থাকে। প্রথমবার খোলার পর ইন্টারনেট ছাড়াও চলে।

## শুরু করার ৩ ধাপ

1. অ্যাপ খুলুন, এটা আপনার রুটিন চাইবে।
2. "Copy prompt" চাপুন, যেকোনো এআই টুলে (ChatGPT, Gemini, Grok ইত্যাদি) রুটিনসহ দিন। এআই একটা সাজানো টেক্সট দেবে।
3. সেই টেক্সট অ্যাপে পেস্ট করে "Continue" চাপুন। অ্যাপ পুরো প্ল্যান বানিয়ে ফেলবে।

এটা শুধু একবারই করতে হয়। ভুল থাকলে অ্যাপ বলে দেবে কোন লাইনে ভুল।

## চেহারা

- মিনিমাল ডিজাইন, প্রচুর ফাঁকা জায়গা, কোনো বর্ডার বা নিয়ন নেই
- ফরেস্ট গ্রিন রঙে **লাইট**, **ডার্ক** ও **কাস্টম** মোড
- নিচের বারে শুধু তিনটা আইকন: হোম, রুটিন, রেকর্ডস
- ওপরে সার্চ ও থ্রি ডট মেনু

## কী কী করা যায়

- **হোম:** আজকের প্রগ্রেস, স্টাডি টাইমার, আজকের কাজ ও পড়ার রেকর্ড
- **রুটিন:** তালিকা বা ক্যালেন্ডার ভিউ, টিক, এডিট, আন্ডু, রুটিন আপডেট
- **রেকর্ডস:** দৈনিক, সাপ্তাহিক, মাসিক ও বাৎসরিক গ্রাফ (গাঢ় = পড়েছেন, হালকা = লক্ষ্য), বিষয় অনুযায়ী সময়
- **সার্চ:** কাজ, বিষয়, অধ্যায়, দুর্বল অধ্যায় ও ভুলের খাতায় খোঁজা
- **সেটিংস:** চেহারা, ভাষা ও লেখা, প্রোফাইল ও অ্যাভাটার, রুটিন ও ডেটা, লগ (দুর্বল অধ্যায় ও ভুলের খাতা), অ্যাপ সম্পর্কে

## আপনার তথ্য

- সব তথ্য শুধু ফোনের ব্রাউজারে থাকে, কোথাও পাঠানো হয় না
- ব্রাউজারের ডেটা মুছলে অ্যাপের ডেটাও মুছে যায়, তাই মাঝে মাঝে **ব্যাকআপ এক্সপোর্ট** করে রাখুন

## অ্যান্ড্রয়েডে ইনস্টল

Chrome-এ অ্যাপের লিংক খুলে একবার লোড হতে দিন, তারপর থ্রি ডট মেনু থেকে **Install app** চাপুন।
