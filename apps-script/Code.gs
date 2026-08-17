/**
 * Backend anonim untuk form Natal → Google Sheets.
 *
 * Deploy → Manage deployments → Edit:
 *   Execute as: Me
 *   Who has access: Anyone
 *     (bukan "Anyone with a Google account" — itu yang bikin 401)
 * Lalu New version → Deploy.
 */

var SHEET_NAME = "Jawaban";

/**
 * Jalankan sekali dari editor: pilih fungsi setup, klik Run.
 * Ini membuat tab "Jawaban" sekarang, tanpa menunggu form.
 */
function setup() {
  var sheet = getOrCreateSheet_();
  Logger.log('Tab "' + sheet.getName() + '" siap.');
  Logger.log(sheet.getParent().getUrl());
}

function doGet() {
  return json_({ ok: true, message: "Web app aktif. Siap menerima jawaban." });
}

function doPost(e) {
  try {
    if (new Date() >= new Date("2026-08-17T23:59:00+07:00")) {
      return json_({ ok: false, error: "Form sudah ditutup." });
    }

    var data = parsePayload_(e);
    var q1 = sanitize_(data.q1);
    var q2 = sanitize_(data.q2);
    var question1 = sanitize_(data.question1);
    var question2 = sanitize_(data.question2);

    if (!q1 || !q2) {
      return json_({ ok: false, error: "Jawaban kosong." });
    }

    var sheet = getOrCreateSheet_();
    sheet.appendRow([new Date(), question1, q1, question2, q2]);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function parsePayload_(e) {
  if (e && e.postData && e.postData.contents) {
    try {
      return JSON.parse(e.postData.contents);
    } catch (err) {
      // Form-urlencoded, bukan JSON.
    }
  }
  return (e && e.parameter) || {};
}

function getOrCreateSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    throw new Error(
      "Script ini tidak terhubung ke spreadsheet. Buka Sheet-nya, lalu Extensions → Apps Script, tempel kode di sana."
    );
  }
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      "Timestamp",
      "Pertanyaan 1",
      "Jawaban 1",
      "Pertanyaan 2",
      "Jawaban 2",
    ]);
    sheet.getRange(1, 1, 1, 5).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function sanitize_(value) {
  var text = String(value == null ? "" : value).trim();
  if (!text) return "";
  if (/^[=+\-@]/.test(text)) {
    text = "'" + text;
  }
  return text.slice(0, 1000);
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
