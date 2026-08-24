# Hussam Data Flow

Air Liquide ALAR operations data stack — multi-section hub, HSE KPI dashboard, and related Apps Script projects.

## Projects

| Folder | App | Description |
|---|---|---|
| **Root** (`Code.gs`, `Index.html`) | [ALAR Operations Hub](https://script.google.com/macros/s/AKfycbxglDjvaFmCBhp5xZFS74Rc0u40GMQ4Rm0f1OZj83VhD20MRUb1sfBBDg8MabvshF7sAQ/exec) | Multi-section portal with Focus Assistant, Operations Tracker, and IMS audit reminders |
| **`hse-kpi-dashboard/`** | HSE KPI Dashboard | Standalone HSE KPI dashboard (also at [holovesam-svg/HSE-KPI-Dashboard](https://github.com/holovesam-svg/HSE-KPI-Dashboard)) |

## Quick start

See [START_HERE.md](START_HERE.md) for clasp setup, authorization, and deployment.

**Moving to another laptop?** See [Continue on another laptop](START_HERE.md#continue-on-another-laptop) in START_HERE.md.

### Clasp (Operations Hub)

```powershell
cd C:\Users\USER\Multi-Sheet-Tracker
copy .clasp.json.example .clasp.json
# Edit .clasp.json with your script ID
clasp login
clasp push --force
```

**Never commit `.clasp.json`** — it contains your Apps Script project ID.

## Focus Assistant

Hub Home landing page: rule-based daily brief, priority buckets, meeting prep cards, and optional Gemini AI summarization.

Add `GEMINI_API_KEY` in Apps Script → Project Settings → Script Properties (see START_HERE.md).
