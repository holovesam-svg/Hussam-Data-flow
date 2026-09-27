# ALAR Operations Hub (Hussam-Data-flow)

> **This repository is PUBLIC.** Never commit internal Air Liquide documents, employee data, email addresses, keys or tokens here. Keep internal notes in the private repos.

- Google Apps Script web app (`Code.gs`, `Index.html`, `appsscript.json`), deployed with clasp. See `START_HERE.md` and `README.md`.
- **Home: Focus Assistant.** Calendar + Gmail brief (audit / IMS / corrective-action emails), buckets Do today / This week / Can wait, meeting-prep cards, optional Gemini summary (key in the `GEMINI_API_KEY` Script Property, never in code).
- **Operations section:**
  - Reads the "IMS Audit Operations Dashboard" tab (read-only).
  - **IMS audit action reminders:** Audit Email Directory + Audit Reminder Checklist, due-within-7-days / overdue, daily 08:00 trigger, editable greeting box.
- Links out to the HSE KPI dashboard and the T&Q portal (separate repos).
- Web app must run as **User accessing the web app** (it reads that user's Calendar and Gmail).

## About the owner
Hussam Alghamdi, IMS Manager (Industrial Management System), Air Liquide Arabia (ALAR), Saudi Arabia. Timezone Asia/Riyadh.
He writes briefly in Gulf Arabic or English, often from his phone. Answer clearly and simply; Arabic is welcome; keep technical terms in English.

## How to work with me
1. Show a rendered preview (screenshot / still frame / email preview) of any visual change and wait for my OK before deploying or sending.
2. Give complete files, not snippets. Partial edits have broken menus and functions before.
3. Numbered lists use 1, 2, 3, never roman numerals.
4. Quality over speed. On long jobs, report progress % and time left.
5. Never invent requirements or technical content. Mark anything unverified **[To confirm]**.
6. Ask before emailing anyone other than me. Preview first.
7. Files over 30 MB can't reach my phone; send a lighter copy.
8. Keep this repo's README / handoff file updated with current state, next step and traps. I switch between PCs and tools (Claude Code, Cursor, ChatGPT, Gemini).

## Apps Script conventions (all my projects)
- Source data tabs are **read-only**. Write only to the script's own config/log tabs or to columns it appends. Find headers by alias (English + Arabic), never by fixed position.
- No emails, IDs or keys in code. Use Script Properties or a directory tab that can be edited in the app. Never commit clasp tokens (`.clasprc.json`).
- Two Google accounts (work and personal), so clasp uses separate profiles. Before `clasp push`, confirm the Script ID (not the Sheet ID) and the account.
- Deploy: `clasp push`, then redeploy to the **same deployment ID** so the link never changes. Commit to GitHub after every push.
- Web apps are limited to the Air Liquide domain. Timezone Asia/Riyadh. Parse dd/MM/yyyy before JS reads it as a US date.
- Branding: Air Liquide dark blue #003B76, bright blue #00A0E1, cyan #62C8F2, red #E30613; Instrument Sans font; glass cards; blue-to-red rule under headers.
- Emails: `<table role="presentation">` with inline styles only (works in Outlook and Gmail), 640 px max width, plus a plain-text version.
- Reminder pattern: directory tab + checklist tab + preview (never sends) + confirmed send-now + daily 08:00 trigger + send log.
