/**
 * ALAR Multi-Section Portal ? hub + new-sheet dashboard
 * Build: 2026.08.23-hub-v2
 *
 * Sections:
 *  - Operations Tracker (NEW spreadsheet) ? live HTML built here
 *  - HSE KPI ? opens existing deployed dashboard
 *  - T&Q ? opens existing deployed dashboard
 */

const APP = Object.freeze({
  BUILD: '2026.08.23-focus-gemini-v1',
  TITLE: 'ALAR Operations Hub',
  TIMEZONE: 'Asia/Riyadh',
  AUTO_REFRESH_SECONDS: 60
});

/**
 * IMS Audit action reminders — employee emails live in Audit Email Directory;
 * monitored rows live in Audit Reminder Checklist. IMS audit dashboard tab is read-only.
 */
const AUDIT_REMINDER_CONFIG = Object.freeze({
  DIRECTORY_SHEET: 'Audit Email Directory',
  DIRECTORY_HEADERS: Object.freeze([
    'Employee Name', 'Email Address', 'Active', 'CC Daily Reminders', 'Updated At', 'Updated By'
  ]),
  CHECKLIST_SHEET: 'Audit Reminder Checklist',
  CHECKLIST_HEADERS: Object.freeze([
    'Monitor Daily', 'Process ID', 'Process Name', 'Process Owner', 'Classification',
    'Due Date', 'Action Status', 'Days Overdue', 'Source Row', 'Updated At', 'Updated By'
  ]),
  SOURCE_SHEET: 'IMS Audit Operations Dashboard',
  SOURCE_SHEET_ALIASES: Object.freeze([
    'IMS Audit Operations Dashboard',
    'IMS Audit Center Dashboard',
    'Audit Operations Dashboard',
    'Audit Center Dashboard',
    'Audit_Findings_Detail',
    'Audit Findings Detail',
    'Audit-Findings-Detail',
    'Audit_Findings',
    'Audit Findings',
    'Findings Detail',
    'Findings'
  ]),
  SENDER_NAME: 'ALAR Operations Hub — IMS Audit',
  TRIGGER_HOUR: 8,
  REMINDER_WINDOW_DAYS: 7,
  TRIGGER_HANDLER: 'runDailyAuditReminderCheck',
  COL: Object.freeze({
    PROCESS_ID: 0,
    PROCESS_NAME: 1,
    PROCESS_OWNER: 2,
    CLASSIFICATION: 3,
    ISSUE: 4,
    CORRECTIVE_ACTION: 5,
    STATUS: 6,
    CLOSURE_DATE: 7,
    DUE_DATE: 8,
    REMARK: 9,
    EVIDENCE: 10,
    OVERDUE_DAY: 11
  }),
  COLUMN_ALIASES: Object.freeze({
    PROCESS_ID: Object.freeze(['process id', 'processid']),
    PROCESS_NAME: Object.freeze(['process name', 'process']),
    PROCESS_OWNER: Object.freeze(['process owner', 'owner', 'action owner', 'responsible']),
    CLASSIFICATION: Object.freeze(['classification', 'class', 'category']),
    ISSUE: Object.freeze(['issue description', 'issue', 'finding', 'finding description']),
    CORRECTIVE_ACTION: Object.freeze([
      'required corrective action', 'corrective action', 'action required', 'action plan'
    ]),
    STATUS: Object.freeze(['action status', 'status']),
    CLOSURE_DATE: Object.freeze(['action closure date', 'closure date', 'closed date']),
    DUE_DATE: Object.freeze(['due date', 'target date', 'deadline']),
    REMARK: Object.freeze(['remark', 'remarks', 'comment', 'comments']),
    EVIDENCE: Object.freeze(['evidence', 'proof']),
    OVERDUE_DAY: Object.freeze(['overdue day', 'days overdue', 'overdue days', 'overdue'])
  })
});

/** Focus Assistant ? calendar + Gmail read on the fly; nothing persisted to sheets. */
const FOCUS_CONFIG = Object.freeze({
  CALENDAR_DAYS: 30,
  WEEK_GLANCE_DAYS: 14,
  GMAIL_DAYS: 7,
  MAX_GMAIL_THREADS: 20,
  MAX_GMAIL_DISPLAY: 5,
  MAX_EMAIL_PRIORITIES: 3,
  MAX_PRIORITIES: 10,
  MAX_CAN_WAIT: 5,
  BUSY_DAY_MEETINGS: 3,
  USER_FIRST_NAME: 'Hussam',
  GMAIL_QUERY: 'newer_than:7d (is:unread OR is:starred) (audit OR IMS OR action OR corrective OR finding)',
  GEMINI_MODEL: 'gemini-2.0-flash',
  GEMINI_API_PROP: 'GEMINI_API_KEY'
});

/**
 * Edit openUrl values after Deploy ? Manage deployments if a link 404s.
 * Deployment IDs were read from local clasp deployments on this PC.
 */
const SECTIONS = Object.freeze([
  Object.freeze({
    id: 'ops',
    kind: 'sheet',
    label: 'Operations Tracker',
    shortLabel: 'Ops',
    description: 'Live dashboard for the new Google Sheet bound to this hub.',
    spreadsheetId: '1nm1l9Vuj3ztU8OD06oDpkUoqSX-P-Zb1yliULmYUdDg',
    openUrl: '',
    enabled: true
  }),
  Object.freeze({
    id: 'hse',
    kind: 'external',
    label: 'HSE KPI',
    shortLabel: 'HSE',
    description: 'Opens the existing ALAR HSE KPI Dashboard (2026).',
    spreadsheetId: '',
    openUrl: 'https://script.google.com/macros/s/AKfycbx_YipjcIO62NxuRXvnczxMhOx1sN3Q1rZlG01GOo2vV2EPLo1x2yKjAPMcfHkHIgw/exec',
    enabled: true
  }),
  Object.freeze({
    id: 'tq',
    kind: 'external',
    label: 'T&Q',
    shortLabel: 'T&Q',
    description: 'Opens the existing Training & Qualification Manager Portal.',
    spreadsheetId: '1_lpzhgHwHUhR00r4l_uDJEVHAVCHQAt1XI1bZHJ4AVE',
    openUrl: 'https://script.google.com/macros/s/AKfycbxZhB2FV15enHjTBFqcPUuf4VdRcRzpwEs6-tvC6ajthOnY6zmmgEpYLtenD5Z4QnMG/exec',
    enabled: true
  }),
  Object.freeze({
    id: 'slot4',
    kind: 'placeholder',
    label: 'Section 4',
    shortLabel: 'Soon',
    description: 'Paste a spreadsheetId and openUrl in Code.gs SECTIONS when ready.',
    spreadsheetId: '',
    openUrl: '',
    enabled: false
  })
]);

/** Air Liquide brand assets - logo PNG from ALAR HSE dashboard / group guidelines. */
const BRAND = Object.freeze({
  LOGO_PNG_BASE64: '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qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqrQHhwQAAAAAgv6/9oMZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB4AkLnYov9qhU2AAAAAElFTkSuQmCC'
});

function getBrandLogoDataUri_() {
  return 'data:image/png;base64,' + BRAND.LOGO_PNG_BASE64;
}

function doGet() {
  const t = HtmlService.createTemplateFromFile('Index');
  t.logoDataUri = getBrandLogoDataUri_();
  return t.evaluate()
    .setTitle(APP.TITLE)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/** Dashboard API: hub cards + live data for the Operations Tracker sheet. */
function getPortalData() {
  const generatedAt = Utilities.formatDate(new Date(), APP.TIMEZONE, 'yyyy-MM-dd HH:mm:ss');
  const ops = SECTIONS.filter(function (s) { return s.id === 'ops'; })[0];
  let workbook = null;
  let error = '';

  try {
    workbook = readWorkbookSummary_(ops.spreadsheetId);
  } catch (err) {
    error = formatError_(err);
    Logger.log('getPortalData workbook error: ' + error);
    workbook = emptyWorkbook_(ops.spreadsheetId, [error]);
  }

  const cards = SECTIONS.map(function (section) {
    if (section.kind === 'sheet' && section.spreadsheetId === ops.spreadsheetId && workbook) {
      return buildSectionCard_(section, workbook);
    }
    return buildSectionCard_(section);
  });

  return {
    appTitle: APP.TITLE,
    build: APP.BUILD,
    generatedAt: generatedAt,
    autoRefreshSeconds: APP.AUTO_REFRESH_SECONDS,
    userEmail: Session.getActiveUser().getEmail() || '',
    cards: cards,
    workbook: workbook,
    error: error
  };
}

/**
 * Run once after clasp push when scopes change ? triggers the OAuth consent dialog.
 * Select this function in the editor ? Run ? Review Permissions ? Authorize.
 */
function authorizeSheets() {
  const ops = SECTIONS.filter(function (s) { return s.id === 'ops'; })[0];
  try {
    const ss = openSpreadsheetSafe_(ops.spreadsheetId);
    const tabNames = [];
    const skipped = [];
    ss.getSheets().forEach(function (sheet) {
      const name = safeSheetName_(sheet);
      if (!isGridSheet_(sheet)) {
        skipped.push(name + ' (' + safeSheetTypeLabel_(sheet) + ')');
        return;
      }
      tabNames.push(name);
    });
    const msg = 'Authorized: ' + ss.getName() + ' ? ' + tabNames.length + ' grid tab(s)';
    Logger.log(msg);
    Logger.log('Grid tabs: ' + (tabNames.length ? tabNames.join(', ') : '(none)'));
    if (skipped.length) Logger.log('Skipped non-grid tabs: ' + skipped.join(', '));
    return msg;
  } catch (err) {
    const msg = formatError_(err);
    Logger.log('authorizeSheets failed: ' + msg);
    throw new Error(msg);
  }
}

/** Lightweight probe ? run once from the Apps Script editor to inspect tabs. */
function inspectOperationsSheet() {
  const ops = SECTIONS.filter(function (s) { return s.id === 'ops'; })[0];
  try {
    const ss = openSpreadsheetSafe_(ops.spreadsheetId);
    const gridTabs = listGridTabNames_(ss);
    const summary = readWorkbookSummary_(ops.spreadsheetId);
    summary.gridTabNames = gridTabs;
    summary.auditSourcePreferred = AUDIT_REMINDER_CONFIG.SOURCE_SHEET;
    try {
      const resolved = resolveAuditSourceSheet_(ss, AUDIT_REMINDER_CONFIG.SOURCE_SHEET);
      summary.auditSourceMatched = resolved.matchedName;
      summary.auditSourceMatchType = resolved.matchType;
    } catch (resolveErr) {
      summary.auditSourceMatched = null;
      summary.auditSourceError = formatError_(resolveErr);
    }
    Logger.log('GRID tabs: ' + (gridTabs.length ? gridTabs.join(', ') : '(none)'));
    Logger.log(JSON.stringify(summary, null, 2));
    return summary;
  } catch (err) {
    const msg = formatError_(err);
    Logger.log('inspectOperationsSheet failed: ' + msg);
    throw new Error(msg);
  }
}

function buildSectionCard_(section, preloadedWorkbook) {
  const base = {
    id: section.id,
    kind: section.kind,
    label: section.label,
    shortLabel: section.shortLabel,
    description: section.description,
    enabled: !!section.enabled,
    openUrl: section.openUrl || '',
    spreadsheetId: section.spreadsheetId || '',
    sheetUrl: section.spreadsheetId ? sheetUrl_(section.spreadsheetId) : '',
    status: section.enabled ? 'ready' : 'coming-soon',
    statusLabel: section.enabled ? 'Ready' : 'Coming soon',
    metrics: []
  };

  if (section.kind === 'sheet' && section.spreadsheetId) {
    try {
      const wb = preloadedWorkbook || readWorkbookSummary_(section.spreadsheetId);
      base.status = 'live';
      base.statusLabel = 'Live';
      base.title = wb.title;
      const gridTabs = (wb.tabs || []).filter(function (t) { return !t.skipped && !t.error; });
      base.metrics = [
        { key: 'tabs', label: 'Tabs', value: String(gridTabs.length) },
        { key: 'rows', label: 'Data rows', value: String(wb.totalDataRows || 0) },
        { key: 'updated', label: 'Checked', value: wb.checkedAt || '' }
      ];
      if (wb.warnings && wb.warnings.length) {
        base.status = 'warn';
        base.statusLabel = 'Check sheet';
      }
      const tabErrors = (wb.tabs || []).filter(function (t) { return t.error; });
      if (tabErrors.length) {
        base.status = 'warn';
        base.statusLabel = tabErrors.length + ' tab(s) failed';
      }
    } catch (err) {
      base.status = 'error';
      base.statusLabel = 'Cannot open sheet';
      base.metrics = [
        { key: 'error', label: 'Error', value: formatError_(err) }
      ];
    }
  }

  if (section.kind === 'external') {
    base.status = section.openUrl ? 'external' : 'needs-url';
    base.statusLabel = section.openUrl ? 'Open existing app' : 'Paste /exec URL';
    base.metrics = [
      { key: 'link', label: 'Dashboard', value: section.openUrl ? 'Configured' : 'Missing' }
    ];
    if (section.spreadsheetId) {
      base.sheetUrl = sheetUrl_(section.spreadsheetId);
    }
  }

  return base;
}

function readWorkbookSummary_(spreadsheetId) {
  if (!spreadsheetId) throw new Error('spreadsheetId is empty.');
  const ss = openSpreadsheetSafe_(spreadsheetId);
  const checkedAt = Utilities.formatDate(new Date(), APP.TIMEZONE, 'HH:mm:ss');
  const warnings = [];
  const tabs = [];
  let totalDataRows = 0;

  ss.getSheets().forEach(function (sheet) {
    const tab = readSheetTab_(sheet);
    tabs.push(tab);
    if (!tab.skipped && !tab.error && !tab.empty) {
      totalDataRows += tab.rowCount || 0;
    }
    if (tab.error) {
      warnings.push('Tab "' + tab.name + '": ' + tab.error);
      Logger.log('readWorkbookSummary_ tab error [' + tab.name + ']: ' + tab.error);
    }
  });

  if (!tabs.length) warnings.push('No visible tabs found.');
  const gridTabs = tabs.filter(function (t) { return !t.skipped && !t.error; });
  if (!gridTabs.length && tabs.length) {
    warnings.push('No readable grid tabs found ? only charts, objects, or failed tabs.');
  } else if (gridTabs.length && gridTabs.every(function (t) { return t.empty; })) {
    warnings.push('All tabs look empty ? add headers and rows, then refresh.');
  }

  return {
    title: ss.getName(),
    spreadsheetId: spreadsheetId,
    url: sheetUrl_(spreadsheetId),
    checkedAt: checkedAt,
    totalDataRows: totalDataRows,
    tabs: tabs,
    warnings: warnings
  };
}

function readSheetTab_(sheet) {
  let name = 'Unknown tab';
  try {
    name = sheet.getName();
  } catch (err) {
    return skippedTab_('Unknown tab', safeSheetTypeLabel_(sheet), formatError_(err));
  }

  try {
    if (sheet.isSheetHidden()) {
      return skippedTab_(name, 'HIDDEN', 'hidden tab (skipped)');
    }
  } catch (err) {
    Logger.log('readSheetTab_ hidden check failed [' + name + ']: ' + formatError_(err));
  }

  if (!isGridSheet_(sheet)) {
    return skippedTab_(name, safeSheetTypeLabel_(sheet), 'skipped (not a data grid)');
  }

  try {
    const lastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();
    if (lastRow < 1 || lastCol < 1) {
      return {
        name: name,
        sheetType: 'GRID',
        headers: [],
        rows: [],
        rowCount: 0,
        colCount: 0,
        empty: true
      };
    }

    const maxCols = Math.min(lastCol, 20);
    const maxRows = Math.min(lastRow, 101);
    const values = sheet.getRange(1, 1, maxRows, maxCols).getDisplayValues();
    const headers = (values[0] || []).map(function (h) { return String(h || '').trim(); });
    const hasHeader = headers.some(function (h) { return !!h; });
    const data = [];
    for (let r = hasHeader ? 1 : 0; r < values.length; r++) {
      const row = values[r];
      const nonempty = row.some(function (c) { return String(c || '').trim() !== ''; });
      if (!nonempty) continue;
      data.push(row.map(function (c) { return String(c == null ? '' : c); }));
      if (data.length >= 50) break;
    }

    const dataRowCount = Math.max(0, lastRow - (hasHeader ? 1 : 0));
    return {
      name: name,
      sheetType: 'GRID',
      headers: hasHeader ? headers : headers.map(function (_, i) { return 'Column ' + (i + 1); }),
      rows: data,
      rowCount: dataRowCount,
      colCount: lastCol,
      empty: dataRowCount === 0,
      truncated: lastRow > maxRows || lastCol > maxCols
    };
  } catch (err) {
    const msg = formatError_(err);
    Logger.log('readSheetTab_ read failed [' + name + ']: ' + msg);
    return {
      name: name,
      sheetType: safeSheetTypeLabel_(sheet),
      skipped: false,
      error: msg,
      headers: [],
      rows: [],
      rowCount: 0,
      colCount: 0,
      empty: true
    };
  }
}

function openSpreadsheetSafe_(spreadsheetId) {
  try {
    return SpreadsheetApp.openById(spreadsheetId);
  } catch (err) {
    const raw = formatError_(err);
    if (/permission|access denied|not have permission|insufficient/i.test(raw)) {
      throw new Error(
        'Cannot open spreadsheet ? share it with your Google account and re-run authorizeSheets. (' + raw + ')'
      );
    }
    if (/not found|unable to find|invalid/i.test(raw)) {
      throw new Error('Spreadsheet not found ? check spreadsheetId in Code.gs SECTIONS. (' + raw + ')');
    }
    throw new Error('SpreadsheetApp.openById failed: ' + raw);
  }
}

function isGridSheet_(sheet) {
  try {
    if (typeof sheet.getSheetType !== 'function') return true;
    return sheet.getSheetType() === SpreadsheetApp.SheetType.GRID;
  } catch (err) {
    Logger.log('isGridSheet_ type check failed: ' + formatError_(err));
    return false;
  }
}

function safeSheetTypeLabel_(sheet) {
  try {
    if (typeof sheet.getSheetType !== 'function') return 'UNKNOWN';
    return String(sheet.getSheetType());
  } catch (err) {
    return 'UNKNOWN';
  }
}

function safeSheetName_(sheet) {
  try {
    return sheet.getName();
  } catch (err) {
    return 'Unknown tab';
  }
}

function skippedTab_(name, sheetType, note) {
  return {
    name: name,
    sheetType: sheetType,
    skipped: true,
    note: note,
    headers: [],
    rows: [],
    rowCount: 0,
    colCount: 0,
    empty: true
  };
}

function emptyWorkbook_(spreadsheetId, warnings) {
  return {
    title: '',
    spreadsheetId: spreadsheetId,
    url: sheetUrl_(spreadsheetId),
    checkedAt: Utilities.formatDate(new Date(), APP.TIMEZONE, 'HH:mm:ss'),
    totalDataRows: 0,
    tabs: [],
    warnings: warnings || []
  };
}

function formatError_(err) {
  if (!err) return 'Unknown error';
  if (typeof err === 'string') return err;
  if (err.message) return String(err.message);
  return String(err);
}

function sheetUrl_(id) {
  return 'https://docs.google.com/spreadsheets/d/' + id + '/edit';
}

function include_(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// ??? Ops spreadsheet helpers ???????????????????????????????????????????????

function getOpsSection_() {
  return SECTIONS.filter(function (s) { return s.id === 'ops'; })[0];
}

function getOpsSpreadsheetId_() {
  const ops = getOpsSection_();
  if (!ops || !ops.spreadsheetId) throw new Error('Operations spreadsheetId is not configured.');
  return ops.spreadsheetId;
}

function getOpsSpreadsheet_() {
  return openSpreadsheetSafe_(getOpsSpreadsheetId_());
}

function cleanCellText_(value) {
  if (value === null || value === undefined) return '';
  if (value instanceof Date) {
    return Utilities.formatDate(value, APP.TIMEZONE, 'yyyy-MM-dd');
  }
  return String(value).trim();
}

function normalizeText_(value) {
  return cleanCellText_(value)
    .toLowerCase()
    .replace(/[_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function toBoolean_(value) {
  if (value === true || value === false) return value;
  const s = String(value || '').trim().toLowerCase();
  return s === 'true' || s === 'yes' || s === '1' || s === 'x';
}

function isValidEmail_(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

function escapeHtml_(value) {
  return String(value === null || value === undefined ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function parseSheetDate_(value) {
  if (value instanceof Date && !isNaN(value.getTime())) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }
  const text = cleanCellText_(value);
  if (!text) return null;
  const iso = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (iso) return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
  const mdy = text.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
  if (mdy) {
    let y = Number(mdy[3]);
    if (y < 100) y += 2000;
    return new Date(y, Number(mdy[1]) - 1, Number(mdy[2]));
  }
  const dmy = text.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
  if (dmy && Number(dmy[2]) <= 12) {
    return new Date(Number(dmy[3]), Number(dmy[2]) - 1, Number(dmy[1]));
  }
  try {
    const parsed = new Date(text);
    if (!isNaN(parsed.getTime())) {
      return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
    }
  } catch (err) { /* ignore */ }
  return null;
}

function todayDate_() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function daysBetween_(from, to) {
  return Math.round((to.getTime() - from.getTime()) / 86400000);
}

function formatDisplayDate_(date) {
  if (!(date instanceof Date) || isNaN(date.getTime())) return '';
  return Utilities.formatDate(date, APP.TIMEZONE, 'dd MMM yyyy');
}

function isAuditCompleted_(status) {
  return /^completed?\b/i.test(cleanCellText_(status));
}

function assertDashboardEmailAdmin_() {
  const ss = getOpsSpreadsheet_();
  const userEmail = String(Session.getActiveUser().getEmail() || '').trim().toLowerCase();
  if (!userEmail) {
    throw new Error(
      'Your signed-in email is not available. Deploy as "User accessing the web app" before managing reminders.'
    );
  }
  let ownerEmail = '';
  let editorEmails = [];
  try {
    const owner = ss.getOwner();
    ownerEmail = owner ? String(owner.getEmail() || '').trim().toLowerCase() : '';
    editorEmails = ss.getEditors().map(function (u) {
      return String(u.getEmail() || '').trim().toLowerCase();
    });
  } catch (err) {
    throw new Error('Could not verify spreadsheet editor access for ' + userEmail + '.');
  }
  if (userEmail !== ownerEmail && editorEmails.indexOf(userEmail) < 0) {
    throw new Error('Only the spreadsheet owner or an editor can manage audit email reminders.');
  }
  return { spreadsheet: ss, userEmail: userEmail };
}

function normalizeSheetKey_(name) {
  return String(name || '')
    .trim()
    .toLowerCase()
    .replace(/[\s_\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function listGridTabNames_(ss) {
  const names = [];
  ss.getSheets().forEach(function (sheet) {
    try {
      if (sheet.isSheetHidden && sheet.isSheetHidden()) return;
    } catch (err) { /* ignore */ }
    if (!isGridSheet_(sheet)) return;
    names.push(safeSheetName_(sheet));
  });
  return names;
}

/**
 * Resolve a sheet by preferred name, then aliases, then fuzzy (Audit + Finding).
 * Returns { sheet, matchedName, matchType } or throws with available GRID tab names.
 */
function resolveAuditSourceSheet_(ss, preferredName) {
  const cfg = AUDIT_REMINDER_CONFIG;
  const preferred = String(preferredName || cfg.SOURCE_SHEET || '').trim();
  const aliases = [preferred].concat(cfg.SOURCE_SHEET_ALIASES || []);
  const seen = {};
  const candidates = [];
  aliases.forEach(function (a) {
    const key = normalizeSheetKey_(a);
    if (!key || seen[key]) return;
    seen[key] = true;
    candidates.push(String(a).trim());
  });

  const sheets = ss.getSheets();
  const byExact = {};
  const byNorm = {};
  sheets.forEach(function (sheet) {
    const name = safeSheetName_(sheet);
    byExact[name] = sheet;
    const norm = normalizeSheetKey_(name);
    if (!byNorm[norm]) byNorm[norm] = sheet;
  });

  // 1) Exact getSheetByName (Google Sheets is case-sensitive; try preferred first)
  for (let i = 0; i < candidates.length; i++) {
    const exact = ss.getSheetByName(candidates[i]);
    if (exact) {
      return { sheet: exact, matchedName: exact.getName(), matchType: 'exact' };
    }
  }

  // 2) Case-insensitive / space-underscore normalized match against preferred + aliases
  for (let i = 0; i < candidates.length; i++) {
    const norm = normalizeSheetKey_(candidates[i]);
    if (byNorm[norm]) {
      const sheet = byNorm[norm];
      return { sheet: sheet, matchedName: sheet.getName(), matchType: 'normalized' };
    }
  }

  // 3) Fuzzy: IMS audit operations dashboard
  let fuzzyOps = null;
  sheets.forEach(function (sheet) {
    const norm = normalizeSheetKey_(safeSheetName_(sheet));
    if (norm.indexOf('audit') >= 0 && norm.indexOf('operations') >= 0) {
      if (!fuzzyOps) fuzzyOps = sheet;
    }
  });
  if (fuzzyOps) {
    return { sheet: fuzzyOps, matchedName: fuzzyOps.getName(), matchType: 'fuzzy-audit-operations' };
  }

  // 4) Fuzzy: IMS audit center dashboard
  let fuzzyCenter = null;
  sheets.forEach(function (sheet) {
    const norm = normalizeSheetKey_(safeSheetName_(sheet));
    if (norm.indexOf('audit') >= 0 && norm.indexOf('center') >= 0) {
      if (!fuzzyCenter) fuzzyCenter = sheet;
    }
  });
  if (fuzzyCenter) {
    return { sheet: fuzzyCenter, matchedName: fuzzyCenter.getName(), matchType: 'fuzzy-audit-center' };
  }

  // 5) Fuzzy: tab name contains both "audit" and "finding"
  let fuzzyFinding = null;
  sheets.forEach(function (sheet) {
    const norm = normalizeSheetKey_(safeSheetName_(sheet));
    if (norm.indexOf('audit') >= 0 && norm.indexOf('finding') >= 0) {
      if (!fuzzyFinding) fuzzyFinding = sheet;
    }
  });
  if (fuzzyFinding) {
    return { sheet: fuzzyFinding, matchedName: fuzzyFinding.getName(), matchType: 'fuzzy-audit-finding' };
  }

  // 6) Fuzzy: single tab with "audit" and "dashboard"
  const auditDashboards = sheets.filter(function (sheet) {
    const norm = normalizeSheetKey_(safeSheetName_(sheet));
    return norm.indexOf('audit') >= 0 && norm.indexOf('dashboard') >= 0;
  });
  if (auditDashboards.length === 1) {
    return {
      sheet: auditDashboards[0],
      matchedName: auditDashboards[0].getName(),
      matchType: 'fuzzy-audit-dashboard'
    };
  }

  // 7) Weaker fuzzy: alias "Findings" only if a single grid tab looks like findings
  const findingsOnly = sheets.filter(function (sheet) {
    const norm = normalizeSheetKey_(safeSheetName_(sheet));
    return norm === 'findings' || norm.indexOf('findings detail') >= 0;
  });
  if (findingsOnly.length === 1) {
    return {
      sheet: findingsOnly[0],
      matchedName: findingsOnly[0].getName(),
      matchType: 'fuzzy-findings'
    };
  }

  const available = listGridTabNames_(ss);
  const availLabel = available.length ? available.join(', ') : '(none)';
  Logger.log('resolveAuditSourceSheet_ failed. Looking for "' + preferred + '". Available GRID tabs: ' + availLabel);
  throw new Error(
    'Source tab "' + preferred + '" was not found. Available tabs: ' + availLabel
  );
}

// --- Audit findings (read-only) ------------------------------------------------

function normalizeHeaderKey_(value) {
  return normalizeText_(value).replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function auditColIndex_(colMap, key, fallbackCol) {
  if (colMap && colMap[key] != null) return colMap[key];
  return fallbackCol[key];
}

function resolveAuditColumnMap_(sheet) {
  const cfg = AUDIT_REMINDER_CONFIG;
  const defaults = cfg.COL;
  const aliasMap = cfg.COLUMN_ALIASES || {};
  const lastRow = Math.min(sheet.getLastRow(), 20);
  const lastCol = Math.min(Math.max(sheet.getLastColumn(), 12), 40);
  if (lastRow < 1 || lastCol < 1) {
    return { col: Object.assign({}, defaults), headerRow: 1, dataStartRow: 2, fallback: true };
  }

  const grid = sheet.getRange(1, 1, lastRow, lastCol).getDisplayValues();
  let best = null;

  for (let r = 0; r < grid.length; r++) {
    const row = grid[r];
    const normHeaders = row.map(function (h) { return normalizeHeaderKey_(h); });
    const col = {};
    let matchCount = 0;

    Object.keys(aliasMap).forEach(function (key) {
      const aliases = aliasMap[key];
      for (let c = 0; c < normHeaders.length; c++) {
        const header = normHeaders[c];
        if (!header) continue;
        let hit = false;
        for (let a = 0; a < aliases.length; a++) {
          const alias = aliases[a];
          if (header === alias || header.indexOf(alias) >= 0) {
            hit = true;
            break;
          }
        }
        if (hit) {
          col[key] = c;
          matchCount++;
          break;
        }
      }
    });

    const hasCore = col.PROCESS_ID != null || col.PROCESS_NAME != null;
    const score = matchCount +
      (hasCore ? 3 : 0) +
      (col.PROCESS_OWNER != null ? 2 : 0) +
      (col.DUE_DATE != null ? 2 : 0) +
      (col.STATUS != null ? 1 : 0);

    if (score >= 6 && (!best || score > best.score)) {
      best = { col: col, headerRow: r + 1, dataStartRow: r + 2, score: score };
    }
  }

  if (!best) {
    return { col: Object.assign({}, defaults), headerRow: 1, dataStartRow: 2, fallback: true };
  }

  Object.keys(defaults).forEach(function (key) {
    if (best.col[key] == null) best.col[key] = defaults[key];
  });
  return best;
}

function readAuditFindingsRows_(ss) {
  const cfg = AUDIT_REMINDER_CONFIG;
  const resolved = resolveAuditSourceSheet_(ss, cfg.SOURCE_SHEET);
  const sheet = resolved.sheet;
  if (resolved.matchType !== 'exact') {
    Logger.log(
      'Audit source tab resolved via ' + resolved.matchType +
      ': "' + resolved.matchedName + '" (preferred "' + cfg.SOURCE_SHEET + '")'
    );
  }

  const layout = resolveAuditColumnMap_(sheet);
  const col = layout.col;
  const dataStartRow = layout.dataStartRow;
  if (layout.fallback) {
    Logger.log('Audit column map using positional fallback on "' + resolved.matchedName + '"');
  } else {
    Logger.log(
      'Audit column map from header row ' + layout.headerRow + ' on "' + resolved.matchedName + '"'
    );
  }

  const lastRow = sheet.getLastRow();
  if (lastRow < dataStartRow) return [];

  const lastCol = Math.max(sheet.getLastColumn(), auditColIndex_(col, 'OVERDUE_DAY', cfg.COL) + 1);
  const values = sheet.getRange(dataStartRow, 1, lastRow, lastCol).getValues();
  const display = sheet.getRange(dataStartRow, 1, lastRow, lastCol).getDisplayValues();
  const rows = [];

  for (let i = 0; i < values.length; i++) {
    const row = values[i];
    const disp = display[i] || row;
    const processId = cleanCellText_(disp[auditColIndex_(col, 'PROCESS_ID', cfg.COL)]);
    const processName = cleanCellText_(disp[auditColIndex_(col, 'PROCESS_NAME', cfg.COL)]);
    const owner = cleanCellText_(disp[auditColIndex_(col, 'PROCESS_OWNER', cfg.COL)]);
    const status = cleanCellText_(disp[auditColIndex_(col, 'STATUS', cfg.COL)]);
    if (!processId && !processName && !owner) continue;

    const dueCol = auditColIndex_(col, 'DUE_DATE', cfg.COL);
    const dueDate = parseSheetDate_(row[dueCol]) || parseSheetDate_(disp[dueCol]);
    const today = todayDate_();
    let daysOverdue = null;
    let daysUntilDue = null;
    if (dueDate) {
      daysOverdue = daysBetween_(dueDate, today);
      daysUntilDue = -daysOverdue;
    }

    rows.push({
      sourceRow: i + dataStartRow,
      processId: processId,
      processName: processName,
      owner: owner,
      classification: cleanCellText_(disp[auditColIndex_(col, 'CLASSIFICATION', cfg.COL)]),
      issue: cleanCellText_(disp[auditColIndex_(col, 'ISSUE', cfg.COL)]),
      correctiveAction: cleanCellText_(disp[auditColIndex_(col, 'CORRECTIVE_ACTION', cfg.COL)]),
      status: status,
      dueDate: dueDate ? formatDisplayDate_(dueDate) : cleanCellText_(disp[dueCol]),
      dueDateObj: dueDate,
      daysOverdue: daysOverdue,
      daysUntilDue: daysUntilDue,
      completed: isAuditCompleted_(status),
      unassigned: !owner
    });
  }
  return rows;
}

function auditRowKey_(row) {
  return String(row.sourceRow) + '|' + normalizeText_(row.processId || row.processName);
}

function collectAuditOpenActions_(options) {
  options = options || {};
  const ss = getOpsSpreadsheet_();
  const allRows = readAuditFindingsRows_(ss);
  const checklistMap = options.ignoreChecklist ? {} : getAuditChecklistSelectionMap_(ss);
  const useChecklist = !options.ignoreChecklist && Object.keys(checklistMap).length > 0;
  const windowDays = options.windowDays != null ? options.windowDays : AUDIT_REMINDER_CONFIG.REMINDER_WINDOW_DAYS;
  const today = todayDate_();
  const weekEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);

  const open = [];
  allRows.forEach(function (row) {
    if (row.completed) return;
    if (useChecklist && !checklistMap[auditRowKey_(row)]) return;

    let include = false;
    let urgency = 'open';
    if (row.dueDateObj) {
      if (row.daysOverdue > 0) {
        include = true;
        urgency = 'overdue';
      } else if (row.dueDateObj.getTime() <= weekEnd.getTime()) {
        include = true;
        urgency = row.daysOverdue === 0 ? 'due-today' : 'due-soon';
      } else if (row.daysUntilDue <= windowDays) {
        include = true;
        urgency = 'due-window';
      } else if (!useChecklist && options.includeAllOpen) {
        include = true;
      }
    } else if (!useChecklist && options.includeAllOpen) {
      include = true;
      urgency = 'no-date';
    }

    if (include || options.includeAllOpen) {
      open.push(Object.assign({}, row, { urgency: urgency }));
    }
  });

  open.sort(function (a, b) {
    const ao = a.daysOverdue != null && a.daysOverdue > 0 ? a.daysOverdue : -9999;
    const bo = b.daysOverdue != null && b.daysOverdue > 0 ? b.daysOverdue : -9999;
    if (bo !== ao) return bo - ao;
    const ad = a.dueDateObj ? a.dueDateObj.getTime() : 9999999999999;
    const bd = b.dueDateObj ? b.dueDateObj.getTime() : 9999999999999;
    return ad - bd;
  });
  return open;
}

function getAuditSummaryForHub_() {
  try {
    const ss = getOpsSpreadsheet_();
    let availableTabs = [];
    try {
      availableTabs = listGridTabNames_(ss);
    } catch (tabErr) {
      Logger.log('listGridTabNames_ failed: ' + formatError_(tabErr));
    }
    const allRows = readAuditFindingsRows_(ss);
    const open = allRows.filter(function (r) { return !r.completed; });
    const overdue = open.filter(function (r) { return r.daysOverdue != null && r.daysOverdue > 0; });
    const dueThisWeek = open.filter(function (r) {
      return r.dueDateObj && r.daysUntilDue != null && r.daysUntilDue >= 0 && r.daysUntilDue <= 7;
    });
    const unassigned = open.filter(function (r) { return r.unassigned; });
    return {
      ok: true,
      availableTabs: availableTabs,
      overdueCount: overdue.length,
      dueThisWeekCount: dueThisWeek.length,
      openCount: open.length,
      unassignedCount: unassigned.length,
      topOverdue: overdue.slice(0, 5).map(function (r) {
        return {
          processId: r.processId,
          processName: r.processName,
          owner: r.owner,
          dueDate: r.dueDate,
          daysOverdue: r.daysOverdue
        };
      }),
      topDueSoon: dueThisWeek.slice(0, 5).map(function (r) {
        return {
          processId: r.processId,
          processName: r.processName,
          owner: r.owner,
          dueDate: r.dueDate,
          daysUntilDue: r.daysUntilDue
        };
      })
    };
  } catch (err) {
    const msg = formatError_(err);
    let availableTabs = [];
    let shareHint = false;
    if (/Cannot open spreadsheet|share it with your Google account|permission|access denied|not have permission/i.test(msg)) {
      shareHint = true;
    } else {
      try {
        const ss = getOpsSpreadsheet_();
        availableTabs = listGridTabNames_(ss);
      } catch (listErr) {
        Logger.log('getAuditSummaryForHub_ tab list failed: ' + formatError_(listErr));
      }
    }
    let error = msg;
    if (shareHint) {
      error = 'Cannot open Operations spreadsheet — share it with your account if needed. (' + msg + ')';
    } else if (availableTabs.length && error.indexOf('Available tabs:') < 0) {
      error = error + ' Available tabs: ' + availableTabs.join(', ');
    }
    Logger.log('getAuditSummaryForHub_ failed: ' + error);
    return {
      ok: false,
      error: error,
      availableTabs: availableTabs,
      guidance: shareHint
        ? 'Confirm the Operations spreadsheet is shared with you, then hard-refresh the hub.'
        : 'Confirm IMS Audit Operations Dashboard (or IMS Audit Center Dashboard) exists, then hard-refresh.'
    };
  }
}

// ??? Email directory ???????????????????????????????????????????????????????

function ensureAuditEmailDirectorySheet_(ss) {
  const cfg = AUDIT_REMINDER_CONFIG;
  let sheet = ss.getSheetByName(cfg.DIRECTORY_SHEET);
  if (!sheet) sheet = ss.insertSheet(cfg.DIRECTORY_SHEET);
  const headerRange = sheet.getRange(1, 1, 1, cfg.DIRECTORY_HEADERS.length);
  const current = headerRange.getValues()[0].map(cleanCellText_);
  if (current.join('|') !== cfg.DIRECTORY_HEADERS.join('|')) {
    headerRange.setValues([cfg.DIRECTORY_HEADERS.slice()]);
  }
  headerRange.setBackground('#003b76').setFontColor('#ffffff').setFontWeight('bold');
  sheet.setFrozenRows(1);
  return sheet;
}

function readAuditEmailDirectory_(ss) {
  const cfg = AUDIT_REMINDER_CONFIG;
  const sheet = ss.getSheetByName(cfg.DIRECTORY_SHEET);
  if (!sheet || sheet.getLastRow() < 2) return [];
  return sheet.getRange(2, 1, sheet.getLastRow() - 1, cfg.DIRECTORY_HEADERS.length)
    .getValues()
    .map(function (row) {
      return {
        name: cleanCellText_(row[0]),
        email: cleanCellText_(row[1]).toLowerCase(),
        active: toBoolean_(row[2]),
        cc: toBoolean_(row[3]),
        updatedAt: row[4] instanceof Date ? row[4].toISOString() : cleanCellText_(row[4]),
        updatedBy: cleanCellText_(row[5])
      };
    })
    .filter(function (e) { return e.name || e.email; });
}

function collectAuditOwners_(ss) {
  const map = {};
  readAuditFindingsRows_(ss).forEach(function (row) {
    if (!row.owner || row.completed) return;
    const key = normalizeText_(row.owner);
    if (!map[key]) map[key] = { name: row.owner, openCount: 0 };
    map[key].openCount++;
  });
  return Object.keys(map).map(function (k) { return map[k]; })
    .sort(function (a, b) { return a.name.localeCompare(b.name); });
}

function mergeDirectoryWithAuditOwners_(ss, storedRows) {
  const storedMap = {};
  (storedRows || []).forEach(function (row) {
    if (row.name) storedMap[normalizeText_(row.name)] = row;
  });
  const used = {};
  const merged = collectAuditOwners_(ss).map(function (owner) {
    const key = normalizeText_(owner.name);
    const stored = storedMap[key] || {};
    used[key] = true;
    return {
      name: owner.name,
      email: stored.email || '',
      active: stored.email ? stored.active !== false : false,
      cc: stored.email ? !!stored.cc : false,
      openCount: owner.openCount,
      fromAuditSheet: true,
      updatedAt: stored.updatedAt || '',
      updatedBy: stored.updatedBy || ''
    };
  });
  (storedRows || []).forEach(function (row) {
    const key = normalizeText_(row.name);
    if (!key || used[key]) return;
    merged.push({
      name: row.name,
      email: row.email,
      active: row.active,
      cc: row.cc,
      openCount: 0,
      fromAuditSheet: false,
      updatedAt: row.updatedAt || '',
      updatedBy: row.updatedBy || ''
    });
  });
  return merged;
}

function getAuditEmailDirectoryMap_(entries) {
  const map = {};
  (entries || []).forEach(function (entry) {
    if (!entry.active || !entry.name || !isValidEmail_(entry.email)) return;
    map[normalizeText_(entry.name)] = entry.email;
  });
  return map;
}

function getAuditEmailDirectory() {
  const context = assertDashboardEmailAdmin_();
  const stored = readAuditEmailDirectory_(context.spreadsheet);
  const rows = mergeDirectoryWithAuditOwners_(context.spreadsheet, stored);
  return {
    ok: true,
    userEmail: context.userEmail,
    sheetName: AUDIT_REMINDER_CONFIG.DIRECTORY_SHEET,
    rows: rows
  };
}

function saveAuditEmailDirectory(entries) {
  const context = assertDashboardEmailAdmin_();
  if (!Array.isArray(entries)) throw new Error('The email directory payload is invalid.');
  const cleaned = [];
  const seen = {};
  entries.forEach(function (entry, index) {
    const name = cleanCellText_(entry && entry.name);
    const email = cleanCellText_(entry && entry.email).toLowerCase();
    const active = !!(entry && entry.active) && !!email;
    const cc = !!(entry && entry.cc) && !!email;
    if (!name && !email) return;
    if (!name) throw new Error('Row ' + (index + 1) + ': employee name is required.');
    if (email && !isValidEmail_(email)) {
      throw new Error('Row ' + (index + 1) + ': enter a valid email address or leave it blank.');
    }
    const key = normalizeText_(name);
    if (seen[key]) throw new Error('Duplicate employee name: ' + name);
    seen[key] = true;
    cleaned.push({ name: name, email: email, active: active, cc: cc });
  });

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sheet = ensureAuditEmailDirectorySheet_(context.spreadsheet);
    const oldRows = Math.max(0, sheet.getLastRow() - 1);
    if (oldRows) {
      sheet.getRange(2, 1, oldRows, AUDIT_REMINDER_CONFIG.DIRECTORY_HEADERS.length).clearContent();
    }
    if (cleaned.length) {
      const now = new Date();
      const values = cleaned.map(function (e) {
        return [e.name, e.email, e.active, e.cc, now, context.userEmail];
      });
      const range = sheet.getRange(2, 1, values.length, AUDIT_REMINDER_CONFIG.DIRECTORY_HEADERS.length);
      sheet.getRange(2, 3, values.length, 2).insertCheckboxes();
      range.setValues(values);
      sheet.getRange(2, 5, values.length, 1).setNumberFormat('dd mmm yyyy hh:mm');
    }
    SpreadsheetApp.flush();
  } finally {
    lock.releaseLock();
  }
  return getAuditEmailDirectory();
}

// ??? Reminder checklist ????????????????????????????????????????????????????

function ensureAuditChecklistSheet_(ss) {
  const cfg = AUDIT_REMINDER_CONFIG;
  let sheet = ss.getSheetByName(cfg.CHECKLIST_SHEET);
  if (!sheet) sheet = ss.insertSheet(cfg.CHECKLIST_SHEET);
  const headerRange = sheet.getRange(1, 1, 1, cfg.CHECKLIST_HEADERS.length);
  const current = headerRange.getValues()[0].map(cleanCellText_);
  if (current.join('|') !== cfg.CHECKLIST_HEADERS.join('|')) {
    headerRange.setValues([cfg.CHECKLIST_HEADERS.slice()]);
  }
  headerRange.setBackground('#003b76').setFontColor('#ffffff').setFontWeight('bold');
  sheet.setFrozenRows(1);
  return sheet;
}

function readAuditReminderChecklist_(ss) {
  const cfg = AUDIT_REMINDER_CONFIG;
  const sheet = ss.getSheetByName(cfg.CHECKLIST_SHEET);
  if (!sheet || sheet.getLastRow() < 2) return [];
  return sheet.getRange(2, 1, sheet.getLastRow() - 1, cfg.CHECKLIST_HEADERS.length)
    .getValues()
    .map(function (row, i) {
      return {
        monitor: toBoolean_(row[0]),
        processId: cleanCellText_(row[1]),
        processName: cleanCellText_(row[2]),
        owner: cleanCellText_(row[3]),
        classification: cleanCellText_(row[4]),
        dueDate: cleanCellText_(row[5]),
        status: cleanCellText_(row[6]),
        daysOverdue: cleanCellText_(row[7]),
        sourceRow: Number(row[8]) || i + 2,
        key: String(Number(row[8]) || i + 2) + '|' + normalizeText_(cleanCellText_(row[1] || row[2]))
      };
    });
}

function getAuditChecklistSelectionMap_(ss) {
  const map = {};
  readAuditReminderChecklist_(ss).forEach(function (row) {
    if (row.monitor) map[row.key] = true;
  });
  return map;
}

function syncAuditReminderChecklist_(ss, selections, userEmail) {
  const openRows = readAuditFindingsRows_(ss).filter(function (r) { return !r.completed; });
  const existing = readAuditReminderChecklist_(ss);
  const existingMap = {};
  existing.forEach(function (row) { existingMap[row.key] = row; });

  const now = new Date();
  const values = openRows.map(function (row) {
    const key = auditRowKey_(row);
    const prev = existingMap[key];
    let monitor = prev ? prev.monitor : true;
    if (selections && Object.prototype.hasOwnProperty.call(selections, key)) {
      monitor = !!selections[key];
    }
    return [
      monitor,
      row.processId,
      row.processName,
      row.owner,
      row.classification,
      row.dueDate,
      row.status,
      row.daysOverdue != null && row.daysOverdue > 0 ? String(row.daysOverdue) : '',
      row.sourceRow,
      now,
      userEmail || ''
    ];
  });

  const sheet = ensureAuditChecklistSheet_(ss);
  const oldRows = Math.max(0, sheet.getLastRow() - 1);
  if (oldRows) sheet.getRange(2, 1, oldRows, AUDIT_REMINDER_CONFIG.CHECKLIST_HEADERS.length).clearContent();
  if (values.length) {
    const range = sheet.getRange(2, 1, values.length, AUDIT_REMINDER_CONFIG.CHECKLIST_HEADERS.length);
    sheet.getRange(2, 1, values.length, 1).insertCheckboxes();
    range.setValues(values);
    sheet.getRange(2, 10, values.length, 1).setNumberFormat('dd mmm yyyy hh:mm');
  }
  SpreadsheetApp.flush();
  return readAuditReminderChecklist_(ss);
}

function getAuditReminderChecklist() {
  const context = assertDashboardEmailAdmin_();
  const rows = syncAuditReminderChecklist_(context.spreadsheet, null, context.userEmail);
  return {
    rows: rows,
    selectedCount: rows.filter(function (r) { return r.monitor; }).length,
    sheetName: AUDIT_REMINDER_CONFIG.CHECKLIST_SHEET,
    triggerHour: AUDIT_REMINDER_CONFIG.TRIGGER_HOUR,
    dailyEnabled: isAuditDailyReminderEnabled_(),
    userEmail: context.userEmail
  };
}

function saveAuditReminderChecklist(entries) {
  const context = assertDashboardEmailAdmin_();
  if (!Array.isArray(entries)) throw new Error('The checklist payload is invalid.');
  const selections = {};
  entries.forEach(function (entry, index) {
    const key = cleanCellText_(entry && entry.key);
    if (!key) throw new Error('Checklist row ' + (index + 1) + ' has no key.');
    selections[key] = !!entry.monitor;
  });
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    syncAuditReminderChecklist_(context.spreadsheet, selections, context.userEmail);
  } finally {
    lock.releaseLock();
  }
  return getAuditReminderChecklist();
}

function initializeAuditReminderChecklist() {
  const context = assertDashboardEmailAdmin_();
  const rows = syncAuditReminderChecklist_(context.spreadsheet, null, context.userEmail);
  return {
    ok: true,
    count: rows.length,
    message: 'Audit Reminder Checklist refreshed with ' + rows.length + ' open action(s).'
  };
}

// ??? Reminder dashboard & email ????????????????????????????????????????????

function getAuditReminderDashboard() {
  let canManage = false;
  try {
    assertDashboardEmailAdmin_();
    canManage = true;
  } catch (err) {
    canManage = false;
  }

  const ss = getOpsSpreadsheet_();
  const allRows = readAuditFindingsRows_(ss);
  const open = allRows.filter(function (r) { return !r.completed; });
  const overdue = open.filter(function (r) { return r.daysOverdue != null && r.daysOverdue > 0; });
  const dueThisWeek = open.filter(function (r) {
    return r.dueDateObj && r.daysUntilDue != null && r.daysUntilDue >= 0 && r.daysUntilDue <= 7;
  });
  const completed = allRows.filter(function (r) { return r.completed; });
  const unassigned = open.filter(function (r) { return r.unassigned; });
  const reminderActions = collectAuditOpenActions_({ includeAllOpen: false });

  return {
    ok: true,
    canManage: canManage,
    summary: {
      overdue: overdue.length,
      dueThisWeek: dueThisWeek.length,
      completed: completed.length,
      open: open.length,
      unassigned: unassigned.length,
      reminderEligible: reminderActions.length
    },
    dailyEnabled: isAuditDailyReminderEnabled_(),
    triggerHour: AUDIT_REMINDER_CONFIG.TRIGGER_HOUR,
    actions: open.map(function (r) {
      return {
        processId: r.processId,
        processName: r.processName,
        owner: r.owner || '(unassigned)',
        dueDate: r.dueDate,
        status: r.status,
        daysOverdue: r.daysOverdue,
        sourceRow: r.sourceRow,
        key: auditRowKey_(r)
      };
    }),
    spreadsheetUrl: ss.getUrl(),
    spreadsheetName: ss.getName()
  };
}

function collectAuditReminderAudit_() {
  const ss = getOpsSpreadsheet_();
  const directory = readAuditEmailDirectory_(ss);
  const directoryMap = getAuditEmailDirectoryMap_(directory);
  const ccEmails = directory
    .filter(function (e) { return e.active && e.cc && isValidEmail_(e.email); })
    .map(function (e) { return e.email; });
  const actions = collectAuditOpenActions_({});
  const ownerMap = {};
  const unassigned = [];

  actions.forEach(function (action) {
    if (!action.owner) {
      unassigned.push(action);
      return;
    }
    const key = normalizeText_(action.owner);
    if (!ownerMap[key]) {
      ownerMap[key] = {
        name: action.owner,
        email: directoryMap[key] || '',
        items: []
      };
    }
    ownerMap[key].items.push(action);
  });

  const owners = Object.keys(ownerMap).map(function (k) { return ownerMap[k]; })
    .sort(function (a, b) { return a.name.localeCompare(b.name); });

  return {
    spreadsheetName: ss.getName(),
    spreadsheetUrl: ss.getUrl(),
    ccEmails: Array.from(new Set(ccEmails)),
    owners: owners,
    unassigned: unassigned,
    missingCount: actions.length,
    generatedAt: new Date().toISOString()
  };
}

function auditReminderSubject_() {
  return '[Action Required] Open IMS audit actions ? ALAR Operations Hub';
}

function buildAuditReminderEmailHtml_(audit, owner) {
  const rows = owner.items.map(function (item) {
    const overdueLabel = item.daysOverdue > 0 ? item.daysOverdue + ' day(s) overdue' : 'Due ' + item.dueDate;
    return '<tr>' +
      '<td style="padding:9px 10px;border-bottom:1px solid #dceaf3">' + escapeHtml_(item.processId) + '</td>' +
      '<td style="padding:9px 10px;border-bottom:1px solid #dceaf3">' + escapeHtml_(item.processName) + '</td>' +
      '<td style="padding:9px 10px;border-bottom:1px solid #dceaf3">' + escapeHtml_(item.status) + '</td>' +
      '<td style="padding:9px 10px;border-bottom:1px solid #dceaf3">' + escapeHtml_(item.dueDate || '?') + '</td>' +
      '<td style="padding:9px 10px;border-bottom:1px solid #dceaf3">' + escapeHtml_(overdueLabel) + '</td>' +
      '</tr>';
  }).join('');

  return '<div style="font-family:Arial,sans-serif;color:#092947;line-height:1.55">' +
    '<div style="background:#003b76;color:#fff;padding:20px 24px;border-radius:14px 14px 0 0">' +
    '<div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#8edcff">ALAR Operations Hub</div>' +
    '<div style="font-size:22px;font-weight:700;margin-top:5px">IMS audit action reminder</div></div>' +
    '<div style="padding:22px 24px;border:1px solid #dceaf3;border-top:0;border-radius:0 0 14px 14px">' +
    '<p>Hello ' + escapeHtml_(owner.name) + ',</p>' +
    '<p>The following audit actions assigned to you are still open and due or overdue. Please update the action plan sheet.</p>' +
    '<table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:13px">' +
    '<thead><tr style="background:#edf8fd;text-align:left">' +
    '<th style="padding:9px 10px">Process ID</th><th style="padding:9px 10px">Process</th>' +
    '<th style="padding:9px 10px">Status</th><th style="padding:9px 10px">Due date</th><th style="padding:9px 10px">Timing</th>' +
    '</tr></thead><tbody>' + rows + '</tbody></table>' +
    '<p><a href="' + escapeHtml_(audit.spreadsheetUrl) + '" style="display:inline-block;background:#00a0e1;color:#fff;text-decoration:none;padding:10px 16px;border-radius:9px;font-weight:700">Open audit action plan</a></p>' +
    '<p style="font-size:12px;color:#587187;margin-top:20px">Automated reminder from ' + escapeHtml_(audit.spreadsheetName) +
    '. Only actions selected in the Audit Reminder Checklist with due dates in the reminder window are included.</p></div></div>';
}

function buildAuditReminderEmailText_(audit, owner) {
  const lines = owner.items.map(function (item) {
    const timing = item.daysOverdue > 0 ? item.daysOverdue + ' day(s) overdue' : 'Due ' + (item.dueDate || '?');
    return '- ' + item.processId + ' / ' + item.processName + ' ? ' + item.status + ' ? ' + timing;
  });
  return 'Hello ' + owner.name + ',\n\nThe following IMS audit actions are still open:\n\n' +
    lines.join('\n') + '\n\nOpen the sheet: ' + audit.spreadsheetUrl + '\n\n' +
    'Automated reminder from ' + audit.spreadsheetName + '.';
}

function serializeAuditReminderPreview_(audit, userEmail) {
  const deliverable = audit.owners.filter(function (o) { return o.email && o.items.length; });
  const withoutEmail = audit.owners.filter(function (o) { return !o.email && o.items.length; });
  const subject = auditReminderSubject_();
  return {
    ok: true,
    previewOnly: true,
    userEmail: userEmail || '',
    spreadsheetName: audit.spreadsheetName,
    spreadsheetUrl: audit.spreadsheetUrl,
    missingCount: audit.missingCount,
    ccEmails: audit.ccEmails || [],
    emails: deliverable.map(function (owner) {
      return {
        ownerName: owner.name,
        to: owner.email,
        cc: (audit.ccEmails || []).slice(),
        subject: subject,
        htmlBody: buildAuditReminderEmailHtml_(audit, owner),
        textBody: buildAuditReminderEmailText_(audit, owner),
        missingCount: owner.items.length,
        items: owner.items.map(function (item) {
          return {
            processId: item.processId,
            processName: item.processName,
            dueDate: item.dueDate,
            status: item.status,
            daysOverdue: item.daysOverdue
          };
        })
      };
    }),
    withoutEmail: withoutEmail.map(function (o) {
      return { name: o.name, missingCount: o.items.length };
    }),
    unassigned: (audit.unassigned || []).map(function (item) {
      return {
        processId: item.processId,
        processName: item.processName,
        dueDate: item.dueDate
      };
    }),
    generatedAt: audit.generatedAt
  };
}

function getAuditReminderPreview() {
  const context = assertDashboardEmailAdmin_();
  const audit = collectAuditReminderAudit_();
  return serializeAuditReminderPreview_(audit, context.userEmail);
}

function sendAuditReminderEmailsNow(confirmed) {
  assertDashboardEmailAdmin_();
  if (confirmed !== true) {
    throw new Error('Sending was not confirmed. Preview the emails first, then confirm Send now.');
  }
  const audit = collectAuditReminderAudit_();
  const result = sendAuditReminderEmails_(audit, true);
  return {
    ok: true,
    sent: result.sent,
    skipped: result.skipped,
    noEmail: result.noEmail,
    remainingDailyQuota: MailApp.getRemainingDailyQuota(),
    message: result.sent.length
      ? 'Sent ' + result.sent.length + ' reminder email(s).'
      : 'No reminders were sent.'
  };
}

function auditReminderSentKey_(owner) {
  const safeOwner = normalizeText_(owner.name).replace(/[^a-z0-9]+/g, '_').slice(0, 70);
  const today = Utilities.formatDate(new Date(), APP.TIMEZONE, 'yyyyMMdd');
  return 'AUDIT_REMINDER_SENT_' + today + '_' + safeOwner;
}

function sendAuditReminderEmails_(audit, forceSend) {
  const properties = PropertiesService.getScriptProperties();
  const cc = (audit.ccEmails || []).filter(isValidEmail_).join(',');
  const result = { sent: [], skipped: [], noEmail: [] };

  audit.owners.forEach(function (owner) {
    if (!owner.items.length) return;
    if (!owner.email) {
      result.noEmail.push(owner.name);
      return;
    }
    const sentKey = auditReminderSentKey_(owner);
    if (!forceSend && properties.getProperty(sentKey)) {
      result.skipped.push(owner.name);
      return;
    }
    const message = {
      to: owner.email,
      subject: auditReminderSubject_(),
      body: buildAuditReminderEmailText_(audit, owner),
      htmlBody: buildAuditReminderEmailHtml_(audit, owner),
      name: AUDIT_REMINDER_CONFIG.SENDER_NAME
    };
    if (cc) message.cc = cc;
    MailApp.sendEmail(message);
    properties.setProperty(sentKey, new Date().toISOString());
    result.sent.push(owner.name);
  });
  return result;
}

function validateAuditReminderDirectory_() {
  const valid = readAuditEmailDirectory_(getOpsSpreadsheet_())
    .filter(function (e) { return e.active; })
    .map(function (e) { return e.email; })
    .filter(isValidEmail_);
  if (!valid.length) {
    throw new Error('Add and activate employee emails in Audit Email Directory before enabling reminders.');
  }
}

function validateAuditReminderChecklist_() {
  const rows = readAuditReminderChecklist_(getOpsSpreadsheet_());
  if (!rows.some(function (r) { return r.monitor; })) {
    throw new Error('No audit action is selected for monitoring. Initialize the checklist first.');
  }
}

function setAuditDailyReminderState(enabled) {
  assertDashboardEmailAdmin_();
  if (enabled) {
    validateAuditReminderDirectory_();
    validateAuditReminderChecklist_();
  }
  deleteAuditReminderTriggers_();
  if (enabled) createAuditDailyReminderTrigger_();
  return {
    dailyEnabled: !!enabled,
    triggerHour: AUDIT_REMINDER_CONFIG.TRIGGER_HOUR
  };
}

function isAuditDailyReminderEnabled_() {
  return ScriptApp.getProjectTriggers().some(function (trigger) {
    return trigger.getHandlerFunction() === AUDIT_REMINDER_CONFIG.TRIGGER_HANDLER;
  });
}

function createAuditDailyReminderTrigger_() {
  return ScriptApp.newTrigger(AUDIT_REMINDER_CONFIG.TRIGGER_HANDLER)
    .timeBased()
    .everyDays(1)
    .atHour(AUDIT_REMINDER_CONFIG.TRIGGER_HOUR)
    .inTimezone(APP.TIMEZONE)
    .create();
}

function deleteAuditReminderTriggers_() {
  let removed = 0;
  ScriptApp.getProjectTriggers().forEach(function (trigger) {
    if (trigger.getHandlerFunction() === AUDIT_REMINDER_CONFIG.TRIGGER_HANDLER) {
      ScriptApp.deleteTrigger(trigger);
      removed++;
    }
  });
  return removed;
}

function runDailyAuditReminderCheck() {
  validateAuditReminderDirectory_();
  validateAuditReminderChecklist_();
  const audit = collectAuditReminderAudit_();
  return sendAuditReminderEmails_(audit, false);
}

// ??? Focus Assistant (hub level ? no sheet writes) ???????????????????????????

function buildFocusGreeting_() {
  const now = new Date();
  const hour = parseInt(Utilities.formatDate(now, APP.TIMEZONE, 'H'), 10);
  let part = 'Good evening';
  if (hour < 12) part = 'Good morning';
  else if (hour < 17) part = 'Good afternoon';
  const name = FOCUS_CONFIG.USER_FIRST_NAME || 'there';
  return {
    greeting: part + ', ' + name,
    todayLabel: Utilities.formatDate(now, APP.TIMEZONE, 'EEEE, d MMMM yyyy')
  };
}

function classifyFocusServiceError_(errMsg) {
  const msg = String(errMsg || '');
  if (/Service invoked too many times|Quota|Rate Limit/i.test(msg)) {
    return { kind: 'quota', userMessage: 'Temporarily rate-limited — try again in a minute.' };
  }
  if (/admin|blocked|disabled by|policy|Access denied:.*Gmail|not enabled for your domain|has not been used|PERMISSION_DENIED|The caller does not have permission/i.test(msg)) {
    return {
      kind: 'admin_blocked',
      userMessage: 'Gmail scope blocked by admin — Workspace may block Apps Script Gmail access. Calendar and audit still work.'
    };
  }
  if (/permission|Authorization|auth|access|scope|denied|Login Required|not been authorized/i.test(msg)) {
    return {
      kind: 'auth',
      userMessage: 'Gmail permission unavailable for this session. Open Gmail in a new tab for mail; Focus continues without inbox scan.'
    };
  }
  return { kind: 'error', userMessage: msg || 'Gmail read failed.' };
}

function getFocusAssistantData() {
  const userEmail = String(Session.getActiveUser().getEmail() || '').trim();
  if (!userEmail) {
    return {
      ok: false,
      userEmail: '',
      needsAuth: true,
      authHint: 'Open the hub while signed in. Web app must run as "User accessing the web app".'
    };
  }

  const greet = buildFocusGreeting_();
  const result = {
    ok: true,
    userEmail: userEmail,
    greeting: greet.greeting,
    todayLabel: greet.todayLabel,
    generatedAt: Utilities.formatDate(new Date(), APP.TIMEZONE, 'yyyy-MM-dd HH:mm:ss'),
    calendarOk: false,
    gmailOk: false,
    gmailStatus: 'unknown',
    gmailHint: '',
    auditOk: false,
    needsAuth: false,
    authHint: '',
    priorities: [],
    doToday: [],
    thisWeek: [],
    suggestions: [],
    weekGlance: [],
    emails: { count: 0, items: [], totalScanned: 0 },
    audit: null,
    links: {
      calendar: 'https://calendar.google.com/calendar/u/0/r',
      gmail: 'https://mail.google.com/mail/u/0/#inbox',
      operations: 'ops-reminders'
    }
  };

  result.audit = getAuditSummaryForHub_();
  result.auditOk = !!result.audit.ok;

  try {
    const cal = readFocusCalendar_();
    result.calendarOk = true;
    result.weekGlance = cal.weekGlance;
    result.busyDays = cal.busyDays;
    result.totalMeetings = cal.totalMeetings;
    result.timedMeetings = cal.timedMeetings;
  } catch (err) {
    result.calendarError = formatError_(err);
    const calClass = classifyFocusServiceError_(result.calendarError);
    if (calClass.kind === 'admin_blocked') {
      result.authHint = 'Calendar access blocked by Workspace policy. Audit and email (if available) still show.';
    } else if (calClass.kind === 'auth') {
      result.authHint = 'Calendar permission unavailable for this session. Hard-refresh while signed in.';
    }
  }

  try {
    const mail = scanFocusGmail_();
    result.gmailOk = true;
    result.emails = mail;
    result.gmailStatus = (mail.count > 0) ? 'ok' : 'empty';
    result.gmailHint = mail.count > 0
      ? ''
      : 'No matching audit emails in the last 7 days';
  } catch (err) {
    result.gmailError = formatError_(err);
    result.gmailOk = false;
    const gClass = classifyFocusServiceError_(result.gmailError);
    result.gmailStatus = gClass.kind;
    result.gmailHint = gClass.userMessage;
    // Never treat empty-search or admin policy as "needsAuth / reconnect"
    if (gClass.kind === 'admin_blocked') {
      Logger.log('Gmail admin blocked: ' + result.gmailError);
    } else if (gClass.kind === 'auth' && !result.calendarOk) {
      result.needsAuth = true;
      result.authHint = result.authHint ||
        'Calendar and Gmail permissions unavailable. Hard-refresh while signed in with your Air Liquide account.';
    }
  }

  const built = buildFocusPriorities_(result);
  result.priorities = built.priorities;
  result.doToday = built.doToday;
  result.thisWeek = built.thisWeek;
  result.canWait = built.canWait;
  result.suggestions = built.suggestions;
  result.allClear = built.allClear;
  result.brief = buildRuleBasedBrief_(result);
  result.meetingPrep = buildMeetingPrepCards_(result);
  result.briefJson = buildFocusBriefJson_(result);
  return result;
}

function readFocusCalendar_() {
  const now = new Date();
  const end = new Date(now.getTime());
  end.setDate(end.getDate() + FOCUS_CONFIG.CALENDAR_DAYS);
  const cal = CalendarApp.getDefaultCalendar();
  if (!cal) throw new Error('No default calendar found for this account.');
  const events = cal.getEvents(now, end);

  const dayMap = {};
  const weekGlance = [];
  const today = todayDate_();
  const todayKey = Utilities.formatDate(today, APP.TIMEZONE, 'yyyy-MM-dd');

  for (let d = 0; d < FOCUS_CONFIG.WEEK_GLANCE_DAYS; d++) {
    const day = new Date(today.getFullYear(), today.getMonth(), today.getDate() + d);
    const key = Utilities.formatDate(day, APP.TIMEZONE, 'yyyy-MM-dd');
    dayMap[key] = {
      date: key,
      label: Utilities.formatDate(day, APP.TIMEZONE, 'EEE d MMM'),
      isToday: key === todayKey,
      meetings: 0,
      allDay: 0,
      hours: 0
    };
  }

  let timedMeetings = 0;
  events.forEach(function (ev) {
    const start = ev.getStartTime();
    const key = Utilities.formatDate(start, APP.TIMEZONE, 'yyyy-MM-dd');
    if (!dayMap[key]) return;
    if (ev.isAllDayEvent()) {
      dayMap[key].allDay++;
      return;
    }
    dayMap[key].meetings++;
    timedMeetings++;
    const durationH = (ev.getEndTime().getTime() - start.getTime()) / 3600000;
    dayMap[key].hours += durationH;
  });

  Object.keys(dayMap).sort().forEach(function (key) {
    const entry = dayMap[key];
    entry.busy = entry.meetings >= FOCUS_CONFIG.BUSY_DAY_MEETINGS;
    entry.hours = Math.round(entry.hours * 10) / 10;
    if (entry.meetings === 0) entry.density = 'light';
    else if (entry.meetings < FOCUS_CONFIG.BUSY_DAY_MEETINGS) entry.density = 'moderate';
    else entry.density = 'busy';
    entry.summary = entry.meetings + ' meeting' + (entry.meetings === 1 ? '' : 's') +
      (entry.hours > 0 ? ' ? ' + entry.hours + 'h timed' : '') +
      (entry.allDay > 0 ? ' ? ' + entry.allDay + ' all-day' : '');
    weekGlance.push(entry);
  });

  const busyDays = weekGlance.filter(function (d) { return d.busy; });
  return { weekGlance: weekGlance, busyDays: busyDays, totalMeetings: events.length, timedMeetings: timedMeetings };
}

function isThreadStarred_(thread) {
  try {
    const labels = thread.getLabels();
    for (let i = 0; i < labels.length; i++) {
      if (labels[i].getName() === 'STARRED') return true;
    }
  } catch (err) { /* ignore */ }
  const messages = thread.getMessages();
  for (let i = messages.length - 1; i >= 0; i--) {
    try {
      if (messages[i].isStarred()) return true;
    } catch (err2) { /* ignore */ }
  }
  return false;
}

function scanFocusGmail_() {
  const threads = GmailApp.search(FOCUS_CONFIG.GMAIL_QUERY, 0, FOCUS_CONFIG.MAX_GMAIL_THREADS);
  const seen = {};
  const items = [];
  threads.forEach(function (thread) {
    const tid = String(thread.getId() || '');
    if (!tid || seen[tid]) return;
    seen[tid] = true;
    const messages = thread.getMessages();
    const last = messages[messages.length - 1];
    const subject = String(last.getSubject() || '(no subject)');
    const unread = thread.isUnread();
    const starred = isThreadStarred_(thread);
    let score = 0;
    if (unread) score += 3;
    if (starred) score += 2;
    if (/audit|IMS|finding|corrective|action plan/i.test(subject)) score += 2;
    items.push({
      threadId: tid,
      subject: subject.slice(0, 120),
      from: String(last.getFrom() || '').slice(0, 80),
      date: Utilities.formatDate(last.getDate(), APP.TIMEZONE, 'dd MMM HH:mm'),
      unread: unread,
      starred: starred,
      score: score,
      url: 'https://mail.google.com/mail/u/0/#inbox/' + tid
    });
  });
  items.sort(function (a, b) {
    if (b.score !== a.score) return b.score - a.score;
    return String(b.date).localeCompare(String(a.date));
  });
  return {
    count: items.length,
    totalScanned: threads.length,
    items: items.slice(0, FOCUS_CONFIG.MAX_GMAIL_DISPLAY)
  };
}

function makeFocusPriority_(fields) {
  return {
    priority: fields.priority || 'P3',
    kind: fields.kind || 'general',
    title: fields.title || '',
    why: fields.why || '',
    action: fields.action || '',
    actionType: fields.actionType || 'none',
    actionUrl: fields.actionUrl || '',
    severity: fields.severity || 'medium',
    group: fields.group || 'week'
  };
}

function buildFocusPriorities_(data) {
  const doToday = [];
  const thisWeek = [];
  const suggestions = [];
  const audit = data.audit && data.audit.ok ? data.audit : null;
  const todayKey = Utilities.formatDate(todayDate_(), APP.TIMEZONE, 'yyyy-MM-dd');

  if (audit && audit.topOverdue && audit.topOverdue.length) {
    audit.topOverdue.slice(0, 3).forEach(function (item) {
      doToday.push(makeFocusPriority_({
        priority: 'P0',
        kind: 'audit-overdue',
        title: item.processId + ' ? ' + (item.processName || 'Audit action'),
        why: (item.daysOverdue || 0) + ' day(s) overdue ? Owner: ' + (item.owner || 'unassigned') +
          (item.dueDate ? ' ? Due ' + item.dueDate : ''),
        action: 'Review in Operations ? Audit reminders',
        actionType: 'ops',
        severity: 'high',
        group: 'today'
      }));
    });
  }

  if (audit && audit.topDueSoon && audit.topDueSoon.length) {
    audit.topDueSoon.slice(0, 3).forEach(function (item) {
      const dueLabel = item.daysUntilDue === 0 ? 'Due today' :
        item.daysUntilDue === 1 ? 'Due tomorrow' :
          'Due in ' + item.daysUntilDue + ' days';
      const bucket = item.daysUntilDue === 0 ? doToday : thisWeek;
      bucket.push(makeFocusPriority_({
        priority: 'P1',
        kind: 'audit-due-soon',
        title: item.processId + ' ? ' + (item.processName || 'Audit action'),
        why: dueLabel + ' ? Owner: ' + (item.owner || 'unassigned'),
        action: 'Update status in Operations before deadline',
        actionType: 'ops',
        severity: 'medium',
        group: item.daysUntilDue === 0 ? 'today' : 'week'
      }));
    });
  } else if (audit && audit.dueThisWeekCount > 0) {
    thisWeek.push(makeFocusPriority_({
      priority: 'P1',
      kind: 'audit-due-soon',
      title: audit.dueThisWeekCount + ' IMS audit action(s) due this week',
      why: 'Open actions with deadlines in the next 7 days need review.',
      action: 'Open Operations audit reminders',
      actionType: 'ops',
      severity: 'medium',
      group: 'week'
    }));
  }

  if (data.weekGlance && data.weekGlance.length) {
    const todayEntry = data.weekGlance.find(function (d) { return d.date === todayKey; });
    if (todayEntry && todayEntry.busy) {
      const nextLight = (data.weekGlance || []).find(function (d) {
        return !d.isToday && d.density === 'light';
      });
      const blockHint = nextLight
        ? 'Block ' + nextLight.label.split(' ')[0] + ' AM for audit deep work'
        : 'Review calendar and defer non-critical slots';
      doToday.push(makeFocusPriority_({
        priority: 'P2',
        kind: 'calendar',
        title: 'Busy today: ' + todayEntry.meetings + ' timed meeting' + (todayEntry.meetings === 1 ? '' : 's'),
        why: todayEntry.summary + ' ? protect focus time for audit work.',
        action: todayEntry.hours >= 4 ? blockHint : 'Review calendar and defer non-critical slots',
        actionType: 'calendar',
        actionUrl: data.links && data.links.calendar ? data.links.calendar : 'https://calendar.google.com',
        severity: 'medium',
        group: 'today'
      }));
    }

    (data.busyDays || []).forEach(function (day) {
      if (day.date === todayKey) return;
      thisWeek.push(makeFocusPriority_({
        priority: 'P2',
        kind: 'calendar',
        title: 'Busy day: ' + day.label + ' (' + day.meetings + ' meetings)',
        why: day.summary + ' ? plan audit follow-ups around this day.',
        action: 'Block time the morning before for prep',
        actionType: 'calendar',
        actionUrl: data.links && data.links.calendar ? data.links.calendar : 'https://calendar.google.com',
        severity: 'low',
        group: 'week'
      }));
    });
  }

  if (data.emails && data.emails.items && data.emails.items.length) {
    data.emails.items.slice(0, FOCUS_CONFIG.MAX_EMAIL_PRIORITIES).forEach(function (email, idx) {
      const bucket = email.unread ? doToday : thisWeek;
      bucket.push(makeFocusPriority_({
        priority: 'P3',
        kind: 'email',
        title: email.subject,
        why: 'From ' + email.from + ' ? ' + email.date + (email.starred ? ' ? Starred' : ''),
        action: 'Open Gmail thread',
        actionType: 'gmail',
        actionUrl: email.url,
        severity: email.unread ? 'medium' : 'low',
        group: email.unread ? 'today' : 'week'
      }));
    });
  }

  const canWait = [];
  if (data.emails && data.emails.items && data.emails.items.length > FOCUS_CONFIG.MAX_EMAIL_PRIORITIES) {
    data.emails.items.slice(FOCUS_CONFIG.MAX_EMAIL_PRIORITIES).forEach(function (email) {
      if (email.unread) return;
      canWait.push(makeFocusPriority_({
        priority: 'P4',
        kind: 'email',
        title: email.subject,
        why: 'From ' + email.from + ' ? ' + email.date,
        action: 'Review when time allows',
        actionType: 'gmail',
        actionUrl: email.url,
        severity: 'low',
        group: 'wait'
      }));
    });
  }
  if (audit && audit.openCount > 0 && !audit.overdueCount && !audit.dueThisWeekCount) {
    canWait.push(makeFocusPriority_({
      priority: 'P4',
      kind: 'audit-due-soon',
      title: audit.openCount + ' open audit action(s) — none urgent this week',
      why: 'Proactive follow-up when calendar is lighter.',
      action: 'Open Operations audit reminders',
      actionType: 'ops',
      severity: 'low',
      group: 'wait'
    }));
  }
  (data.weekGlance || []).forEach(function (day) {
    if (day.isToday || day.busy || day.density !== 'light') return;
    if (day.date <= todayKey) return;
    canWait.push(makeFocusPriority_({
      priority: 'P4',
      kind: 'calendar',
      title: 'Light day: ' + day.label,
      why: day.summary + ' ? good window for backlog work.',
      action: 'Block focus time on calendar',
      actionType: 'calendar',
      actionUrl: data.links && data.links.calendar ? data.links.calendar : 'https://calendar.google.com',
      severity: 'low',
      group: 'wait'
    }));
  });

  const priorities = doToday.concat(thisWeek).slice(0, FOCUS_CONFIG.MAX_PRIORITIES);
  const allClear = !priorities.length;

  if (allClear) {
    suggestions.push('No urgent audit, calendar, or email items flagged ? good window for proactive follow-ups.');
  } else {
    if (audit && audit.overdueCount > 0 && data.busyDays && data.busyDays.length) {
      const nextBusy = data.busyDays[0];
      suggestions.push(
        audit.overdueCount + ' overdue audit action(s) ? clear P0 items before ' + nextBusy.label + '.'
      );
    }
    if (audit && audit.dueThisWeekCount > 0) {
      const lightDay = (data.weekGlance || []).find(function (d) { return d.density === 'light' && !d.isToday; });
      if (lightDay) {
        suggestions.push('Lighter calendar on ' + lightDay.label + ' ? good slot for due-this-week audit updates.');
      }
    }
  }

  return {
    priorities: priorities,
    doToday: doToday,
    thisWeek: thisWeek,
    canWait: canWait.slice(0, FOCUS_CONFIG.MAX_CAN_WAIT),
    suggestions: suggestions.slice(0, 3),
    allClear: allClear
  };
}

function buildRuleBasedBrief_(data) {
  const doToday = data.doToday || [];
  const audit = data.audit && data.audit.ok ? data.audit : null;
  const bullets = [];
  let startHere = '';

  if (doToday.length) {
    const top = doToday[0];
    startHere = 'Start here: ' + top.title + (top.why ? ' — ' + top.why.split('?')[0].trim() : '') + '.';
    doToday.slice(0, 3).forEach(function (p) {
      bullets.push(p.title + (p.why ? ' (' + p.why.split('?')[0].trim() + ')' : ''));
    });
  } else if (audit && audit.overdueCount > 0) {
    startHere = 'Start here: Clear ' + audit.overdueCount + ' overdue IMS audit action(s) before meetings stack up.';
    bullets.push(audit.overdueCount + ' overdue audit action(s) need owner follow-up');
    if (audit.dueThisWeekCount > 0) bullets.push(audit.dueThisWeekCount + ' more due this week');
    if (data.busyDays && data.busyDays.length) {
      bullets.push('Next busy day: ' + data.busyDays[0].label + ' — prep audit updates beforehand');
    }
  } else if (data.busyDays && data.busyDays.length) {
    const next = data.busyDays[0];
    startHere = 'Start here: Prep for ' + next.label + ' (' + next.meetings + ' meetings) — review audit and email before it hits.';
    bullets.push(next.label + ': ' + next.summary);
    if (audit && audit.dueThisWeekCount > 0) {
      bullets.push(audit.dueThisWeekCount + ' audit action(s) due this week');
    }
    if (data.emails && data.emails.count > 0) {
      bullets.push(data.emails.count + ' audit-related email thread(s) to scan');
    }
  } else if (data.allClear) {
    startHere = 'Start here: Calendar is manageable — use the window for proactive audit follow-ups and inbox cleanup.';
    bullets.push('No overdue audits or heavy meeting days flagged');
    if (audit && audit.openCount > 0) bullets.push(audit.openCount + ' open audit action(s) for proactive review');
    bullets.push('Check Operations reminders and HSE KPI completeness');
  } else {
    startHere = 'Start here: Review this week priorities and block focus time on the lightest calendar day.';
    (data.thisWeek || []).slice(0, 3).forEach(function (p) {
      bullets.push(p.title);
    });
  }

  while (bullets.length < 3) {
    if (audit && audit.unassignedCount > 0 && bullets.length < 3) {
      bullets.push(audit.unassignedCount + ' unassigned audit action(s) — assign owners');
    } else if (data.emails && data.emails.count > 0 && bullets.length < 3) {
      bullets.push('Scan ' + data.emails.count + ' audit-related email thread(s)');
    } else {
      bullets.push('Open Operations reminders for IMS audit status');
      break;
    }
  }

  const briefText = startHere + '\n\nTop priorities:\n' +
    bullets.slice(0, 3).map(function (b, i) { return (i + 1) + '. ' + b; }).join('\n');

  return {
    startHere: startHere,
    bullets: bullets.slice(0, 3),
    briefText: briefText
  };
}

function buildFocusBriefJson_(data) {
  const audit = data.audit && data.audit.ok ? data.audit : null;
  return {
    generatedAt: data.generatedAt || '',
    todayLabel: data.todayLabel || '',
    startHere: (data.brief && data.brief.startHere) || '',
    bullets: (data.brief && data.brief.bullets) || [],
    doToday: (data.doToday || []).map(function (p) {
      return { title: p.title, why: p.why, priority: p.priority };
    }),
    thisWeek: (data.thisWeek || []).map(function (p) {
      return { title: p.title, why: p.why, priority: p.priority };
    }),
    canWait: (data.canWait || []).map(function (p) {
      return { title: p.title, why: p.why };
    }),
    audit: audit ? {
      overdueCount: audit.overdueCount || 0,
      dueThisWeekCount: audit.dueThisWeekCount || 0,
      openCount: audit.openCount || 0,
      unassignedCount: audit.unassignedCount || 0
    } : null,
    calendar: {
      busyDays: (data.busyDays || []).map(function (d) {
        return { label: d.label, meetings: d.meetings, summary: d.summary };
      }),
      weekGlance: (data.weekGlance || []).slice(0, 7).map(function (d) {
        return { label: d.label, meetings: d.meetings, density: d.density };
      })
    },
    emails: {
      count: (data.emails && data.emails.count) || 0,
      subjects: ((data.emails && data.emails.items) || []).map(function (e) {
        return { subject: e.subject, unread: e.unread, from: e.from };
      })
    },
    meetingPrep: (data.meetingPrep || []).map(function (c) {
      return { dayLabel: c.dayLabel, meetings: c.meetings, auditItems: c.auditItems, emailSubjects: c.emailSubjects };
    })
  };
}

function buildMeetingPrepCards_(data) {
  const cards = [];
  const todayKey = Utilities.formatDate(todayDate_(), APP.TIMEZONE, 'yyyy-MM-dd');
  const audit = data.audit && data.audit.ok ? data.audit : null;
  const emails = (data.emails && data.emails.items) || [];

  (data.busyDays || []).forEach(function (day) {
    if (day.date === todayKey) return;
    const auditItems = [];
    if (audit && audit.topDueSoon) {
      audit.topDueSoon.forEach(function (item) {
        if (item.daysUntilDue <= 7) {
          auditItems.push(item.processId + ' — ' + (item.processName || 'Audit action') +
            ' (due ' + (item.dueDate || 'soon') + ')');
        }
      });
    }
    if (audit && audit.topOverdue && auditItems.length < 3) {
      audit.topOverdue.slice(0, 2).forEach(function (item) {
        auditItems.push(item.processId + ' — overdue ' + (item.daysOverdue || 0) + 'd');
      });
    }
    const emailSubjects = emails.slice(0, 2).map(function (e) { return e.subject; });
    cards.push({
      dayLabel: day.label,
      date: day.date,
      meetings: day.meetings,
      summary: day.summary,
      auditItems: auditItems.slice(0, 3),
      emailSubjects: emailSubjects,
      calendarUrl: data.links && data.links.calendar ? data.links.calendar : 'https://calendar.google.com',
      opsLink: 'ops-reminders'
    });
  });

  return cards.slice(0, 3);
}

/**
 * Optional Gemini summarization — API key in Script Properties GEMINI_API_KEY only.
 * @param {Object|string} briefJson Structured brief from buildFocusBriefJson_
 * @return {{ok:boolean, source:string, startHere?:string, priorities?:string[], risk?:string, message?:string}}
 */
function getGeminiFocusSummary(briefJson) {
  const apiKey = String(PropertiesService.getScriptProperties().getProperty(FOCUS_CONFIG.GEMINI_API_PROP) || '').trim();
  if (!apiKey) {
    return {
      ok: false,
      source: 'none',
      message: 'Add GEMINI_API_KEY in Script Properties (Project Settings → Script properties).'
    };
  }

  const brief = typeof briefJson === 'string' ? JSON.parse(briefJson) : briefJson;
  const prompt =
    'You are an operations assistant for an HSE/IMS manager. Given this week brief, give: ' +
    '1) One sentence start-here, 2) Top 3 priorities, 3) One risk to watch. Be concise.\n\n' +
    'Respond as JSON only with keys: startHere (string), priorities (array of 3 strings), risk (string).\n\n' +
    'Brief:\n' + JSON.stringify(brief, null, 2);

  const url = 'https://generativelanguage.googleapis.com/v1beta/models/' +
    FOCUS_CONFIG.GEMINI_MODEL + ':generateContent?key=' + encodeURIComponent(apiKey);

  try {
    const response = UrlFetchApp.fetch(url, {
      method: 'post',
      contentType: 'application/json',
      muteHttpExceptions: true,
      payload: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 512 }
      })
    });

    const code = response.getResponseCode();
    const body = response.getContentText();
    if (code < 200 || code >= 300) {
      Logger.log('Gemini API error ' + code + ': ' + body.slice(0, 500));
      return {
        ok: false,
        source: 'gemini',
        message: code === 403 || code === 401
          ? 'Gemini API key invalid or blocked — check GEMINI_API_KEY.'
          : 'Gemini unavailable — using rule-based brief.'
      };
    }

    const parsed = JSON.parse(body);
    const text = (((parsed.candidates || [])[0] || {}).content || {}).parts;
    const raw = text && text[0] ? String(text[0].text || '').trim() : '';
    if (!raw) {
      return { ok: false, source: 'gemini', message: 'Gemini returned empty response — using rule-based brief.' };
    }

    let ai = null;
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try { ai = JSON.parse(jsonMatch[0]); } catch (parseErr) { /* fall through */ }
    }
    if (!ai) {
      return {
        ok: true,
        source: 'gemini',
        startHere: raw.split('\n')[0].slice(0, 280),
        priorities: raw.split('\n').slice(1, 4).filter(Boolean),
        risk: '',
        raw: raw
      };
    }

    return {
      ok: true,
      source: 'gemini',
      startHere: String(ai.startHere || '').trim(),
      priorities: Array.isArray(ai.priorities) ? ai.priorities.slice(0, 3).map(String) : [],
      risk: String(ai.risk || '').trim()
    };
  } catch (err) {
    Logger.log('getGeminiFocusSummary: ' + formatError_(err));
    return {
      ok: false,
      source: 'gemini',
      message: 'Gemini unavailable — using rule-based brief.'
    };
  }
}

// ??? Setup & authorization ???????????????????????????????????????????????????

function authorizeFocusAssistant() {
  const cal = CalendarApp.getDefaultCalendar();
  const calName = cal ? cal.getName() : '(none)';
  GmailApp.search('newer_than:1d', 0, 1);
  const msg = 'Focus Assistant authorized ? calendar: ' + calName + ', Gmail probe OK.';
  Logger.log(msg);
  return msg;
}

function setupAuditReminders() {
  authorizeSheets();
  const context = assertDashboardEmailAdmin_();
  ensureAuditEmailDirectorySheet_(context.spreadsheet);
  syncAuditReminderChecklist_(context.spreadsheet, null, context.userEmail);
  Logger.log('Audit reminder sheets initialized.');
  return 'Audit Email Directory and Audit Reminder Checklist are ready.';
}

function onOpen() {
  try {
    SpreadsheetApp.getUi()
      .createMenu('?? ALAR Operations Hub')
      .addItem('Initialize audit reminders', 'setupAuditReminders')
      .addItem('Refresh reminder checklist', 'initializeAuditReminderChecklist')
      .addToUi();
  } catch (err) {
    Logger.log('onOpen skipped (standalone script): ' + formatError_(err));
  }
}
