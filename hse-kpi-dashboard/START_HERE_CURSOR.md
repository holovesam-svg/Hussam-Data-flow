# ALAR HSE KPI Dashboard — Cursor handoff

Handoff date: 23 August 2026  
Current backend build: `2026.08.17-webapp-url-v13`

## Start here

This folder contains the complete current Google Apps Script project:

- `Code.gs` — complete Apps Script backend.
- `Index.html` — complete dashboard frontend.

These two files are the working source of truth. Do not combine them with older downloaded versions. The user prefers complete-file replacements instead of partial snippets because partial changes have previously caused missing functions and duplicate menu items.

## Copy this prompt into Cursor

> Continue development of my ALAR HSE KPI Google Apps Script dashboard using the files in this folder as the current source of truth. Read `START_HERE_CURSOR.md`, then inspect all of `Code.gs` and `Index.html` before changing anything. Preserve existing live data parsing, the Performance Analytics section, the Ownership section, responsive charts, the Air Liquide premium glass design, the Google Sheet launcher, email directory, site-owner mappings, KPI checklist, card selector, test email, exact reminder preview, and daily reminder automation. Do not place employee email addresses in source code. Emails must remain editable in the dashboard and stored in the `KPI Email Directory` sheet. Use full replacement files in your final output, validate JavaScript syntax, and clearly explain any Apps Script deployment or authorization steps. Do not change the Performance Analytics chart layout unless I explicitly request it.

## Project objective

Build a live executive HSE KPI portal backed by a Google Sheet:

`Google Sheet KPI tabs → Apps Script backend → HTML/CSS/JavaScript dashboard`

The dashboard must read the live KPI tabs without writing to them. Only dashboard-owned configuration tabs may be written:

- `KPI Email Directory`
- `KPI Reminder Checklist`
- `KPI Visit Log` (hidden private visitor history; dashboard UI is shown only to Hussam)

## Workbook and site configuration

The backend currently expects these tabs:

| Source tab | Displayed site | Site code | Group |
|---|---|---|---|
| `YAN-HYCO KPIs` | Yanbu HGU | YAN-HGU | West Coast |
| `QUR KPIs` | Qurayyah | QUR | East Coast |
| `YAN-Pipeline KPIs` | Yanbu Pipeline | YPL | West Coast |
| `JUB-Pipeline KPIs` | Jubail Pipeline | JUB | East Coast |
| `ALAR - HO` | Khobar HO | HO | Office |
| `ALAR - RHQ` | Riyadh RHQ | RHQ | Office |

The configured reporting year is currently `2026`. The backend discovers header and month columns rather than assuming one completely uniform source layout. Qurayyah has historically used a slightly different layout. Percentage values may appear as either decimals such as `0.90` or whole percentages such as `90`, and the parser normalizes them.

## Visual direction that must be preserved

- Air Liquide palette:
  - dark blue `#003B76`
  - bright blue `#00A0E1`
  - cyan `#62C8F2`
  - Air Liquide red `#E30613`
- `Instrument Sans` font.
- Premium Apple-style glass cards, soft shadows, rounded corners and restrained motion.
- Light blue dotted background.
- Centered Air Liquide identity in the main experience.
- Responsive laptop and large-screen layout.
- Light and dark modes.
- Real staged loading screen with progress percentage.
- The current Performance Analytics area and its four-chart layout must remain unchanged unless explicitly requested:
  - BSV by site.
  - Workforce exposure.
  - Monthly trend.
  - Event profile.
- The Overview, Performance and Ownership navigation must continue to work.

## Existing dashboard features

- Executive KPI cards and site overview.
- Safety and process event cards.
- Performance Analytics charts using Chart.js.
- Site and period filters.
- KPI explorer and detail modal.
- Ownership view.
- Auto refresh every 60 seconds.
- Shared executive-card selector. The saved selection is global for everyone and stored in Apps Script Script Properties.
- Admin email directory in the dashboard.
- Site/KPI owner email mapping; email addresses are never hard-coded.
- Test email from the dashboard.
- Site-by-site KPI reminder checklist.
- Daily reminder enable/disable controls.
- Dashboard reminder preview showing To, CC and exact email content.
- Dashboard Send now, with in-modal confirmation, without waiting for the 08:00 schedule.
- Overview completeness strip from January through the last completed month, with Preview & send now on the first screen.
- Private visitor history (email, last visit, visit count) visible only to Hussam.
- Google Sheet top menu and in-sheet launcher.

## Google Sheet menu

The bound spreadsheet creates one top-level menu:

`📊 HSE Dashboard`

Current menu actions include:

- `🖥️ Open dashboard inside Sheet`
- `🪟 Open dashboard while working`
- `↗️ Open dashboard full-screen`
- `🔄 Initialize / Reconnect`
- `🔗 Show Web App URL`

The email submenu is:

`✉️ KPI Email Reminders`

With these actions:

- `🔐 Authorize email service`
- `☑️ Build / refresh KPI checklist`
- `🔎 Check missing KPIs (summary)`
- `📝 Preview exact reminder emails`
- `📨 Send reminder emails from Sheet`
- `⏰ Enable daily reminders`
- `⏹️ Disable daily reminders`

`onOpen()` builds the menu. `repairDashboardMenu()` rebuilds it manually. Do not create another `onOpen()` or another top-level HSE Dashboard menu because that previously caused duplicate menu headings.

## Email directory and access model

Employee emails must not be stored in code.

They are entered through the dashboard and saved in the sheet tab `KPI Email Directory` with these columns:

1. Employee Name
2. Email Address
3. Active
4. CC Daily Reminders
5. Updated At
6. Updated By

The dashboard merges the saved directory with KPI owner names read from the source KPI tabs, so each site owner can enter their address. Only the spreadsheet owner or an editor may manage email settings. `assertDashboardEmailAdmin_()` performs this check.

The web app should be deployed as **User accessing the web app** and restricted to the organization if the email-management UI must reliably identify the signed-in employee. Do not weaken the editor/owner authorization without an explicit security decision.

## Private visit log

The dashboard records one visit per signed-in page load (not on the 60-second auto-refresh). Storage is the hidden sheet tab `KPI Visit Log` with columns Email, First Visit, Last Visit, Visit Count.

The **Visits** button and `getDashboardVisitLog()` are available only to Hussam (`hussam.alghamdi@airliquide.com`, including the `@airliquide` form he provided). Reminder employee emails remain in `KPI Email Directory`. Extra viewer addresses can be added in Script Property `ALAR_HSE_VISIT_LOG_VIEWERS` without a code change.

Anyone with spreadsheet edit access can still unhide the `KPI Visit Log` tab in Google Sheets. The dashboard UI is the access control for other users of the web app.

If visits show `(not signed in)` or only one email for everyone, the web app is not executing as the visitor. Redeploy as **User accessing the web app**.

## Test email behavior

`sendDashboardTestEmail(recipient)` sends a harmless test notification.

- It accepts the signed-in user's address or an active address already stored in `KPI Email Directory`.
- It does not change KPI data.
- Its subject is `[TEST] ALAR HSE KPI email notification`.
- The message confirms the email connection and includes the spreadsheet name and sent time.

`authorizeKpiEmailService()` checks MailApp quota and returns quickly. It sends no email. This function was deliberately changed to avoid an endless-looking execution.

## KPI checklist behavior

The dashboard/system creates `KPI Reminder Checklist` with these columns:

1. Monitor Daily
2. Site
3. KPI
4. KPI Owner
5. Category
6. Source Sheet
7. Source Row
8. Metric Key
9. Updated At
10. Updated By

Each site lists its eligible metrics. The user checks only the KPIs that are mandatory for daily reminder monitoring. Not every KPI must be selected.

Important rules:

- The KPI identity always comes from the live source tabs.
- The configuration only saves the checkbox choice.
- Derived total rows and labels starting with `Total` are excluded.
- A numeric zero is a valid completed value and must not be treated as blank.
- An unchecked KPI never creates a reminder.
- Owner names are read from the KPI source data and matched to the directory using normalized text.

## Automatic reminder logic

The scheduled function is `runDailyKpiReminderCheck()`.

- It checks January through the last completed month.
- It remains silent on day 1.
- Checks start from day 2 of each month.
- The trigger is currently configured around hour 8 in the Apps Script timezone.
- It sends one consolidated email per KPI owner, listing all their missing selected KPI entries by month.
- It runs daily until those cells are filled.
- The current in-progress month is not included.
- Scheduled automation prevents a second send to the same owner on the same day using Script Properties.
- Manual send is intentionally forced and may resend on the same day after Yes/No confirmation.
- Owners without active email mappings are reported but cannot receive mail.
- Missing KPI rows without an owner are shown in the preview as unassigned.
- Daily triggers run as the Google account that created/authorized the installable trigger.

## Reminder email content

Current subject:

`[Action Required] Missing HSE KPI entries — January–{Last completed month} {Year}`

Each consolidated email includes:

- Recipient owner name.
- Reporting period (January through last completed month).
- Total number of missing required KPI entries.
- A table containing Month, Site, KPI, Category and Source location.
- Source location contains source sheet name and row number.
- A direct link to the KPI reporting sheet.
- A clear instruction to complete the listed entries.
- A note that the daily reminder stops automatically after completion.
- A note that only KPIs selected in the checklist are monitored.

Both HTML and plain-text email bodies are generated.

## Exact email preview and direct Sheet sending

`showDetailedReminderEmailPreview()` opens a modal from Google Sheets showing:

- A prominent `PREVIEW ONLY — NOTHING HAS BEEN SENT` banner.
- Exact To address.
- Exact CC list.
- Exact subject.
- Exact HTML email body.
- One preview card per recipient.
- Owners missing configured email addresses.
- Unassigned missing KPI rows.

The preview uses the same subject helper and HTML generator as the actual send, so it is not a separate approximation.

`sendMissingKpiRemindersNow()` performs a fresh audit and opens a Yes/No confirmation listing the recipients, CC, reporting period, email count and missing KPI count. It sends only after Yes is selected.

## Dashboard preview and send now

The KPI checklist modal includes **Preview & send now**. That opens a dashboard modal that uses the same audit, subject and HTML/text bodies as the Sheet preview.

`getDashboardReminderEmailPreview()` is read-only and never sends email. It returns:

- Reporting period (January through last completed month).
- The exact CC list from Email Directory → CC Daily Reminders.
- One card per recipient with To, CC, subject and the live HTML body.
- Owners without an email address.
- Unassigned missing KPI rows.

`sendDashboardReminderEmailsNow(confirmed)` sends immediately only when `confirmed === true`. It does not wait for the daily 08:00 trigger. Manual send is forced and may resend on the same day. If no deliverable emails exist, Send now stays disabled.

## Important backend functions

- `doGet()` — serves the web dashboard.
- `onOpen()` / `buildDashboardMenu_()` — Google Sheet menu.
- `setupDashboard()` — stores spreadsheet ID, initializes the launcher and menu.
- `installDashboardLauncher()` — creates the dashboard home/launcher in the spreadsheet.
- `getDashboardHtml_()` — evaluates the `Index` Apps Script HTML file.
- `getDashboardMeta()` — lightweight first loading request; also records one visit and returns `canViewVisitLog`.
- `getDashboardData()` — re-reads and aggregates live source tabs.
- `getDashboardVisitLog()` — private visitor list; throws unless the signed-in user is Hussam.
- `parseSiteSheet_()` — layout-tolerant KPI parsing.
- `getDashboardCardVisibility()` / `saveDashboardCardVisibility()` — global card choices.
- `getDashboardEmailDirectory()` / `saveDashboardEmailDirectory()` — email directory API.
- `sendDashboardTestEmail()` — controlled test email.
- `getDashboardReminderChecklist()` / `saveDashboardReminderChecklist()` — checklist API.
- `getDashboardReminderEmailPreview()` — exact dashboard preview; never sends.
- `sendDashboardReminderEmailsNow(confirmed)` — confirmed immediate send from the dashboard.
- `getDashboardOverviewCompleteness()` — January-through-last-month required-KPI completeness for Overview; never returns emails.
- `initializeKpiReminderChecklist()` — creates/refreshes the Sheet checklist.
- `collectMissingKpisForLastCompletedMonth_()` — missing-KPI audit from January through last completed month.
- `showDetailedReminderEmailPreview()` — exact preview dialog.
- `sendMissingKpiRemindersNow()` — confirmed manual send from Sheet.
- `enableDailyKpiReminders()` / `disableDailyKpiReminders()` — scheduled trigger management.
- `runDailyKpiReminderCheck()` — scheduled daily automation.

## Frontend-to-backend APIs

`Index.html` uses `google.script.run`. Important calls include:

- `getDashboardMeta()`
- `getDashboardData()`
- `getDashboardVisitLog()`
- `getDashboardCardVisibility()`
- `saveDashboardCardVisibility()`
- `getDashboardEmailDirectory()`
- `saveDashboardEmailDirectory()`
- `sendDashboardTestEmail()`
- `getDashboardReminderChecklist()`
- `saveDashboardReminderChecklist()`
- `setDashboardDailyReminderState()`
- `getDashboardReminderEmailPreview()`
- `sendDashboardReminderEmailsNow()`
- `getDashboardOverviewCompleteness()`

Opening `Index.html` directly with a `file:///` URL cannot provide live Apps Script data because `google.script.run` exists only when the page is served by Apps Script. Use a deployed web app or the in-Sheet dashboard launcher for functional testing.

## Clasp (read/push live Apps Script)

`clasp` is installed and authenticated as `hussam.alghamdi@airliquide.com`. This folder includes `appsscript.json`, `.clasp.json` (Script ID configured for the bound KPI project), and `.clasp.json.example`.

**Linked (23 Aug 2026):** `.clasp.json` points at the live bound Apps Script project; `clasp pull` works and downloads live sources (clasp writes `Code.js` on pull—promote into `Code.gs` for this repo). Commit `.clasp.json` in this private repo so the Script ID stays with the codebase.

To read or push the **live** bound project:

1. From this folder, run `clasp pull` to download live code (`Code.js`, `Index.html`, manifest).
2. Promote pulled files into `Code.gs` and `Index.html` (canonical names for this handoff folder).
3. Run `clasp push` only when you intentionally want to upload local files to Apps Script.
4. After a push, still create a **New version** of the web app deployment if the live URL must pick up changes.

If clasp is not set up on a new machine: open the KPI Sheet → **Extensions → Apps Script** → **Project settings** → copy **Script ID** into `.clasp.json`.

## Installation and deployment

1. Open the KPI Google Sheet.
2. Select **Extensions → Apps Script**.
3. Replace the complete Apps Script `Code.gs` content with this folder's `Code.gs`.
4. Replace the complete Apps Script HTML file named `Index` with this folder's `Index.html`.
5. Save the project.
6. Run `setupDashboard()` once and approve the requested permissions.
7. Run `authorizeKpiEmailService()` once if MailApp authorization is not already granted.
8. Return to the Sheet and refresh it. If needed, run `repairDashboardMenu()` once.
9. Deploy or update the web app deployment:
   - Deploy → Manage deployments.
   - Edit the current deployment.
   - Select a new version.
   - Keep the intended organization access restriction.
10. Test the dashboard through the Apps Script web-app URL, not a local file.
11. In the Sheet menu, preview the exact reminder emails before performing a manual send.

The dashboard's full-screen link depends on Script Property `WEB_APP_URL`. `setupDashboard()` attempts to initialize the Sheet connection, while deployment information may still need to be refreshed after a new web-app version.

## Validation before delivering future changes

Always perform at least these checks:

1. Validate JavaScript syntax in `Code.gs` using a JavaScript parser/runtime.
2. Ensure every `google.script.run` function called by `Index.html` exists in `Code.gs`.
3. Check that there is only one `onOpen()` and one top-level HSE Dashboard menu.
4. Confirm Overview, Performance and Ownership navigation works.
5. Confirm all four Performance Analytics charts still render.
6. Confirm `0` is treated as reported data, not missing.
7. Confirm reminder employee emails are not hard-coded. The visit-log viewer allowlist is the owner-requested exception.
8. Confirm preview sends nothing.
9. Confirm manual sending requires Yes/No confirmation.
10. Confirm automatic reminders use only checked KPIs from January through the last completed month.
11. Confirm source KPI tabs remain read-only.
12. Return complete updated `Code.gs` and `Index.html` files, even if only one changed.

## Current validation status

- `Code.gs` and the `Index.html` script block passed JavaScript syntax validation.
- Every `google.script.run` call in `Index.html` has a matching function in `Code.gs`.
- There is still one `onOpen()` and one top-level `📊 HSE Dashboard` menu.
- Preview APIs send nothing. Dashboard send requires `confirmed === true`.
- Automatic reminders still use only checked KPIs from January through the last completed month.

## Guardrails for future work

- Do not invent Air Liquide requirements or imply corporate approval.
- Do not send or expose employee emails publicly.
- Do not allow arbitrary public visitors to use the test-email feature.
- Do not change or write KPI source cells from the dashboard backend.
- Do not remove editor/owner checks without a documented access-control replacement.
- Do not duplicate menus or initialization functions.
- Do not redesign Performance Analytics unless explicitly requested.
- Preserve user edits in the Sheet and configuration tabs.
- If changing reminder timing, state clearly which month is audited, start day, trigger hour, timezone and duplicate-prevention behavior.

## Recommended next-session opening message

Use this when starting a new Cursor chat:

> This is an existing live Google Apps Script dashboard, not a new project. Read `START_HERE_CURSOR.md`, `Code.gs`, and `Index.html` completely. First summarize the current architecture and tell me which exact functions/sections will be affected by my next request. Then make the requested change while preserving all features and provide full validated replacement files.
