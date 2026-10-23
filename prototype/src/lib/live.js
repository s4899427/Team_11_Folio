// Small pure helpers for near-live comments and sharing.
// No React, no network: everything here is unit-tested in test/live-share.test.mjs.

/** How often an open Edition re-checks for new comments (ms). Polling, not websockets. */
export const COMMENT_POLL_MS = 5000;

/**
 * Poll only when the data is shared (remote) and the Edition can still change.
 * A locked (past) Edition is read-only, so there is nothing new to fetch.
 * react-query also pauses polling while the tab is hidden.
 */
export function pollInterval({ remote, locked }) {
  return remote && !locked ? COMMENT_POLL_MS : false;
}

/**
 * Ids in `list` that were not in `prevIds`. The first load (prevIds === null)
 * returns [] so existing comments are not all flagged as new.
 */
export function newCommentIds(prevIds, list) {
  if (!prevIds) return [];
  return list.filter((c) => !prevIds.has(c.id)).map((c) => c.id);
}

/**
 * Deep link to an Edition. The app uses HashRouter, so the route lives after '#'.
 * `loc` is window.location (or any object with origin and pathname).
 */
export function editionUrl(loc, date) {
  return `${loc.origin}${loc.pathname}#/edition/${date}`;
}

const clip = (s, n) => (s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s);

/** Text sent with a shared pick. Contains no personal data. */
export function pickShareText({ title, artist }) {
  return clip(`“${title}” by ${artist}, from Folio.`, 140);
}

/** Text sent with a shared Edition. */
export function editionShareText({ title, curatorName }) {
  return clip(`“${title}” – a Folio Edition picked by ${curatorName}.`, 140);
}

// ── "Reading now" presence (needs supabase/migrations/004_presence.sql) ──
/** How often an open Edition tells the database "still here" and asks how many readers there are (ms). */
export const PRESENCE_POLL_MS = 10000;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Track presence only for a real, shared, still-open Edition (not demo/seed/preview, not a locked day). */
export function canTrackPresence({ remote, locked, editionId }) {
  return Boolean(remote && !locked && typeof editionId === "string" && UUID.test(editionId));
}

/**
 * Random id for one page load. Never saved anywhere, so it cannot be used to follow a person
 * across visits. Matches the database check ^[A-Za-z0-9_-]{8,40}$.
 */
export function newClientId(cryptoObj = globalThis.crypto) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";
  const bytes = new Uint8Array(22);
  if (cryptoObj && cryptoObj.getRandomValues) cryptoObj.getRandomValues(bytes);
  else for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  return Array.from(bytes, (b) => chars[b % 64]).join("");
}

/** Text for the count. Null means show nothing (no data, or the database call failed). */
export function readingLabel(n) {
  if (!Number.isFinite(n) || n < 1) return null;
  return n === 1 ? "Just you here right now" : `${n} people reading right now`;
}
