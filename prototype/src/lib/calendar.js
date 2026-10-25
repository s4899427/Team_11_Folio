// Pure helpers for the archive calendar (Monday-first month grid, ISO dates, no time-zone maths).
export const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];

/** "YYYY-MM" of an ISO date. */
export const monthOf = (iso) => iso.slice(0, 7);

/** Shift a "YYYY-MM" key by n months (n may be negative). */
export function shiftMonth(key, n) {
  const [y, m] = key.split("-").map(Number);
  const t = y * 12 + (m - 1) + n;
  return `${Math.floor(t / 12)}-${String((t % 12) + 1).padStart(2, "0")}`;
}

/** Rows of 7 cells for a month. A cell is null (padding) or { day, iso }. */
export function monthGrid(key) {
  const [y, m] = key.split("-").map(Number);
  const first = new Date(Date.UTC(y, m - 1, 1)).getUTCDay(); // 0 = Sunday
  const lead = (first + 6) % 7; // Monday-first
  const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const cells = Array(lead).fill(null);
  for (let d = 1; d <= days; d++) cells.push({ day: d, iso: `${key}-${String(d).padStart(2, "0")}` });
  while (cells.length % 7) cells.push(null);
  const rows = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  return rows;
}

/** Distinct months ("YYYY-MM") that have at least one Edition, newest first. */
export function monthsWithEditions(editions) {
  return [...new Set(editions.map((e) => monthOf(e.date)))].sort().reverse();
}
