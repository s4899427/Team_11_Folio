# Capturing Feedback into Google Sheets

Folio's Feedback flow (`/feedback`) always saves every response locally
(`localStorage`, key `folio_feedback_log` — an array, so nothing is
overwritten as multiple people submit). To *also* have responses land in a
shared Google Sheet in real time (useful for the tradeshow and for writing
up evaluation findings), do this once — takes about 5 minutes:

## 1. Create the sheet

1. Go to [sheets.google.com](https://sheets.google.com) → Blank spreadsheet.
2. Rename it something like **"Folio — Feedback Responses"**.
3. In row 1, add these headers (exact order matters for the script below):

   ```
   timestamp | q1_understanding | q1_feedback | q2_discovery_score | q2_feedback | q3_trust_score | q3_feedback | q4_return | q4_feedback | q5_one_change
   ```

## 2. Add the Apps Script

1. In the sheet: **Extensions → Apps Script**.
2. Delete the placeholder code and paste this:

   ```javascript
   function doPost(e) {
     var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
     var data = JSON.parse(e.postData.contents);
     sheet.appendRow([
       data.timestamp || new Date().toISOString(),
       data.q1_understanding || "",
       data.q1_feedback || "",
       data.q2_discovery_score || "",
       data.q2_feedback || "",
       data.q3_trust_score || "",
       data.q3_feedback || "",
       data.q4_return || "",
       data.q4_feedback || "",
       data.q5_one_change || "",
     ]);
     return ContentService.createTextOutput(
       JSON.stringify({ status: "ok" })
     ).setMimeType(ContentService.MimeType.JSON);
   }
   ```

3. Click **Save** (name the project e.g. "Folio Feedback Intake").

## 3. Deploy as a Web App

1. Click **Deploy → New deployment**.
2. Type: **Web app**.
3. Execute as: **Me**.
4. Who has access: **Anyone**.
5. Click **Deploy**, authorize when prompted.
6. Copy the **Web app URL** it gives you (ends in `/exec`).

## 4. Wire it into Folio

1. In the project root, create a file named `.env.local` containing:

   ```
   VITE_FEEDBACK_SHEET_URL=<paste the Web app URL here>
   ```

2. Restart `npm run dev` (or rebuild). No code changes needed — `src/lib/feedback-capture.js` picks this up automatically.

## Notes

- Without step 4, Folio still works exactly as before — every response is
  just kept in the browser's local log instead. Nothing breaks or errors
  either way, matching the same graceful-fallback pattern used for the
  Ticketmaster events integration (`src/lib/events-api.js`).
- Because the request is sent `no-cors` (Apps Script Web Apps don't return
  readable CORS headers to third-party origins), Folio can't confirm the
  row was written — it fires the request and moves on. Check the sheet
  directly to confirm rows are arriving before you rely on it for the demo.
- If you want to redeploy the script after editing it, use **Deploy →
  Manage deployments → Edit → New version**, not a brand-new deployment —
  a new deployment gets a new URL and breaks the existing `.env.local`.
