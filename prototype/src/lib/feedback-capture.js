// ── Feedback capture: local log + optional Google Sheets sync ──────
// Every submission is always appended to a local log (an array, not a
// single overwritten key — multiple tradeshow visitors can submit
// without erasing each other's responses) AND, if a Sheets endpoint
// is configured, forwarded there in the background.
//
// TO GO LIVE (send responses straight into a Google Sheet):
//   1. Open Google Sheets, create a new spreadsheet named e.g.
//      "Folio — Feedback Responses" and add a header row:
//        timestamp | q1_understanding | q1_feedback | q2_discovery_score |
//        q2_feedback | q3_trust_score | q3_feedback | q4_return |
//        q4_feedback | q5_one_change
//   2. In that sheet: Extensions → Apps Script, paste the contents of
//      GOOGLE_SHEETS_SETUP.md's script block, save.
//   3. Deploy → New deployment → type "Web app" → Execute as "Me" →
//      Who has access "Anyone" → Deploy. Copy the Web App URL it gives you.
//   4. Create a file named .env.local in the project root containing:
//        VITE_FEEDBACK_SHEET_URL=your_web_app_url_here
//   5. Restart `npm run dev`. That's it — no further code changes needed.
//
// Without a URL set, this safely just keeps the local log — nothing
// fails or shows an error to the person filling out the form.

const LOG_KEY = "folio_feedback_log";

export function getFeedbackLog() {
  try {
    return JSON.parse(localStorage.getItem(LOG_KEY) || "[]");
  } catch (e) {
    return [];
  }
}

export async function submitFeedback(data) {
  const entry = { ...data, timestamp: new Date().toISOString() };

  // 1. Always keep a local, append-only backup (never overwrites prior entries).
  try {
    const log = getFeedbackLog();
    log.push(entry);
    localStorage.setItem(LOG_KEY, JSON.stringify(log));
  } catch (e) {}

  // 2. Best-effort forward to Google Sheets, if configured.
  const sheetUrl = import.meta.env.VITE_FEEDBACK_SHEET_URL;
  if (sheetUrl) {
    try {
      await fetch(sheetUrl, {
        method: "POST",
        mode: "no-cors", // Apps Script Web Apps don't return readable CORS headers; fire-and-forget is fine here.
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(entry),
      });
      return { synced: true };
    } catch (err) {
      return { synced: false, reason: `Sheets sync failed (${err.message}) — response is still saved locally.` };
    }
  }
  return { synced: false, reason: "No VITE_FEEDBACK_SHEET_URL set — response saved locally only." };
}
