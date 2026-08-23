# ALAR Operations Hub — START HERE

Local folder: `C:\Users\USER\Multi-Sheet-Tracker`  
Apps Script project ID: `14GqScftxmx-RahW6TdYtwLAJRyEWPD5m5EU_GvYG6yyNWwJ8YACmVFSo`  
Operations spreadsheet: `1nm1l9Vuj3ztU8OD06oDpkUoqSX-P-Zb1yliULmYUdDg`

## What this is

One multi-section portal:

| Area | Where in UI | What it does |
|---|---|---|
| **Focus Assistant** | **Hub Home** (landing) | Your calendar (30 days), audit-related Gmail scan, cross-section priorities — computed on the fly, never saved to sheets |
| **Operations Tracker** | Operations section | Sheet data + **IMS Audit reminders only** (Audit_Findings_Detail, email directory, preview/send) |
| **HSE KPI** | Launcher card | Opens existing HSE KPI dashboard |
| **T&Q** | Launcher card | Opens existing T&Q portal |

## Clasp setup (this PC)

```powershell
cd C:\Users\USER\Multi-Sheet-Tracker
clasp login
clasp push --force
clasp open-script
clasp deployments
```

Editor URL:  
https://script.google.com/home/projects/14GqScftxmx-RahW6TdYtwLAJRyEWPD5m5EU_GvYG6yyNWwJ8YACmVFSo/edit

### First-time authorize + deploy

1. `clasp push --force`
2. Open the Apps Script editor
3. Run these functions once (Review Permissions → Allow each time scopes change):
   - **`authorizeSheets`** — spreadsheet access
   - **`authorizeFocusAssistant`** — Calendar + Gmail (for hub Focus Assistant)
   - **`setupAuditReminders`** — creates Audit Email Directory + Audit Reminder Checklist tabs (editor only)
4. **Deploy → New deployment → Web app**
   - Execute as: **User accessing the web app** ← required for Focus Assistant (reads *your* calendar/Gmail)
   - Who has access: your org preference
5. Open the `/exec` URL while signed in as Hussam

After code changes:

```powershell
cd C:\Users\USER\Multi-Sheet-Tracker
clasp push --force
```

Then **Deploy → Manage deployments → Edit → New version → Deploy**.

## IMS Audit reminders (Operations section only)

Written tabs (dashboard-managed, not source data):

- `Audit Email Directory` — owner name, email, active, CC
- `Audit Reminder Checklist` — which open actions get daily reminders

Source tab (read-only): `Audit_Findings_Detail`

Setup steps:

1. Share the spreadsheet with your Google account (Editor for reminder admin)
2. Run **`setupAuditReminders`** in the Apps Script editor
3. Open hub → **Operations Tracker** → **Audit reminders**
4. **Email directory** — add/activate Process Owner emails
5. **Refresh checklist** — sync open non-completed rows
6. **Preview & send** — review exact To/CC/subject/body, then confirm Send now
7. Toggle **Daily reminders 08:00** (Asia/Riyadh time trigger)

Daily trigger function: `runDailyAuditReminderCheck`

## Focus Assistant (Hub Home only)

- Lives on **Home** landing — not inside Operations
- Uses `getFocusAssistantData()` — Calendar + Gmail + optional audit summary from Operations sheet
- **Daily brief:** rule-based "Start here" one-liner + 3 priority bullets
- **Buckets:** Do today · This week · Can wait
- **Meeting prep cards** before busy calendar days (audit + email links)
- **Copy brief for Gemini** — clipboard JSON/text for external use
- **Summarize with Gemini** — optional AI summary via Google AI API (see below)
- If calendar/email show “Connect”, run **`authorizeFocusAssistant`** in the editor and refresh
- Web app **must** deploy as **User accessing the web app**

### Gemini API key (optional)

1. Get an API key from [Google AI Studio](https://aistudio.google.com/apikey)
2. Apps Script editor → **Project Settings** (gear) → **Script properties**
3. Add property: **Name** `GEMINI_API_KEY` · **Value** your API key
4. Save — no clasp, no third-party OAuth, key never goes in source code
5. Hub Home → **Summarize with Gemini** (falls back to rule-based brief if key missing or API blocked)

Uses `gemini-2.0-flash` via `generativelanguage.googleapis.com`. First Gemini call may prompt for `external_request` scope re-authorization.

OAuth scopes in `appsscript.json`:

- `spreadsheets`, `userinfo.email`, `script.container.ui`
- `calendar.readonly`, `gmail.readonly`
- `script.send_mail`, `script.scriptapp` (audit reminders)

## Share permissions

Share the Operations spreadsheet with accounts that need to view or manage reminders:

https://docs.google.com/spreadsheets/d/1nm1l9Vuj3ztU8OD06oDpkUoqSX-P-Zb1yliULmYUdDg/edit

## Files

- `Code.gs` — hub API, Focus Assistant, audit reminders
- `Index.html` — hub home + section panels
- `appsscript.json` — scopes + Asia/Riyadh timezone
