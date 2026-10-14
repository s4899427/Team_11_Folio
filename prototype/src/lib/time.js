// Folio runs on city time. "Today's Edition" and the midnight lock follow the
// time zone of the city the Edition belongs to (Brisbane, Seoul, Mumbai...),
// regardless of where the viewer's device thinks it is.
// Brisbane is UTC+10 with no daylight saving; the helpers below also work for
// zones with an offset that is not a whole hour (India, UTC+5:30).

const BRISBANE = "Australia/Brisbane";

/** YYYY-MM-DD for the given instant in the given IANA time zone. */
export function cityToday(tz, now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit",
  }).format(now);
}

function offsetMs(tz, now) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: tz, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    }).formatToParts(now).map((p) => [p.type, p.value]),
  );
  const asUTC = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second);
  return asUTC - Math.floor(now.getTime() / 1000) * 1000;
}

/** Milliseconds until the next midnight in the given time zone. */
export function msUntilMidnight(tz, now = new Date()) {
  const local = new Date(now.getTime() + offsetMs(tz, now));
  const next = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate() + 1);
  return next - local.getTime();
}

export const brisbaneToday = (now = new Date()) => cityToday(BRISBANE, now);
export const msUntilBrisbaneMidnight = (now = new Date()) => msUntilMidnight(BRISBANE, now);

/** Add n days to a YYYY-MM-DD string (pure calendar arithmetic). */
export function addDays(iso, n) {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function formatLong(iso) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-AU", {
    weekday: "long", day: "numeric", month: "long", timeZone: "UTC",
  });
}

export function formatShort(iso) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-AU", {
    day: "numeric", month: "short", timeZone: "UTC",
  });
}

export function monthKey(iso) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-AU", {
    month: "long", year: "numeric", timeZone: "UTC",
  });
}

/** "morning" | "afternoon" | "evening" for the hour in the city's own time zone. */
export function partOfDay(tz, now = new Date()) {
  const h = Number(new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", hourCycle: "h23" }).format(now));
  return h >= 4 && h < 12 ? "morning" : h >= 12 && h < 17 ? "afternoon" : "evening";
}
