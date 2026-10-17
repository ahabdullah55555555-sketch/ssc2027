# SSC 2027 Study Tracker

A free, offline study tracker that runs in your phone's browser and installs like an app. Give it any study routine and it builds the whole app around it: every date, task and subject. Everything is saved on your own phone. There are no accounts, no ads and no servers.

Version 2.4.0 · Android (Chrome) · English and বাংলা

---

## How it works

1. **First launch:** the app asks you to upload your routine. There is no built-in routine.
2. **Copy the prompt** shown in the app and give it to any AI tool (Gemini, ChatGPT, Grok or others) together with your routine, in any format or language.
3. **Paste the AI's reply** into the app and tap Continue. The app reads it, checks it and builds your routine.
4. The routine is asked for only once. Change it later from **Update your routine** (Settings, or the bottom of the Routine page).

---

## Pages

Bottom bar: **Home · Routine · Records**. Every page has a three-dot menu at the top right. **Settings** opens from that menu as its own page.

### Home
- Your avatar (tap it to customize), today's progress ring, overall progress
- Study timer (stopwatch) that saves your study time as a record for the chosen subject
- Today's tasks with tick boxes, study time for the day and per-subject records
- Overdue warning and daily-limit warning

### Routine
- Three-dot menu: **Edit routine**, **View** (List view or Calendar view), **Settings**
- List view: date chips. Calendar view: month grid with marks for days that have tasks, completed days and today
- Tick tasks, log study time, add subject records (several subjects per day)
- Edit mode: add, edit, move, duplicate, delete, reorder, copy a day, add or delete dates, day notes
- Backlog and overdue lists, Undo
- **Update your routine** at the bottom of the page

### Records
- **Daily, Weekly, Monthly, Yearly** buttons with previous and next paging
- Bar graph: solid bars show time studied (coloured by subject when records have subjects), light bars behind show your target
- Totals, average per study day, best day and a details list
- **Subjects** button: study time per subject (choose each subject's colour) and the task progress cards

### Settings (three-dot menu → Settings)
- **Logs:** weak chapters and mistake log
- **Avatar:** customize hair, face, skin, eyes, mouth, glasses, outfit, accessories and colours, or upload your own photo and crop it square
- **Language:** বাংলা or English. **Text size:** seven levels
- **Colors and theme:** six ready themes, live colour pickers and your own saved themes (accent, background, card and text colours; delete any time)
- **Message duration:** 2 to 8 seconds (default 4). Tap or swipe a message to close it at once
- Daily study limit, Backup and restore, Update your routine, Routine tools (remove routine and start fresh)
- Reset study records, install guide, how your data is kept
- **Download your information:** copy or download your routine and progress as readable text to give to any AI tool

### Update your routine
Paste a new routine and choose:
- **Add to current routine** keeps everything and adds new dates and tasks
- **Replace matching dates only** replaces the dates found in the new routine, the rest stays
- **Reset everything** replaces the whole routine
Study time, weak chapters and mistakes are never deleted by these. Undo is available after each.

---

## Routine text format

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

Required: `STUDY_ROUTINE_V1`, `DATE`, `TASK`, `TIME`. Optional: `LIMIT`, `SUBJECTS`, `NOTE`, `SUBJECT`, `CHAPTER`, `BACKLOG`. If a line is wrong the app shows which line, and builds nothing until it is fixed.

---

## Your data

- Stored only in your phone's browser. Nothing is uploaded and there is no sync between devices
- Use **Export backup** regularly; clearing browser data deletes the app's data
- Backups from earlier versions still import correctly

---

## Files and updating

| File | Purpose | Changes when you update? |
|---|---|---|
| `index.html` | The whole app (code, Bangla translations) | **Yes. This is the only file you replace.** |
| `sw.js` | Offline support. Loads the newest `index.html` whenever you are online | No |
| `manifest.json`, `icon.svg` | Install on the home screen | No |

Upgrading from 2.3.0 or older: replace these four files and **delete `routine-default.js` and `i18n.js`** from the repository.

## Publishing on GitHub Pages

1. Put the four files in the repository root.
2. Settings → Pages → deploy from the main branch.
3. Open the Pages link in Chrome, let it load once, then menu → **Install app**.
