import test from "node:test";
import assert from "node:assert/strict";
import { COMMENT_POLL_MS, pollInterval, newCommentIds, editionUrl, pickShareText, editionShareText, PRESENCE_POLL_MS, canTrackPresence, newClientId, readingLabel } from "../src/lib/live.js";

test("comments poll only when data is shared and the Edition is still open", () => {
  assert.equal(pollInterval({ remote: true, locked: false }), COMMENT_POLL_MS);
  assert.equal(pollInterval({ remote: true, locked: true }), false);   // past Editions are read-only
  assert.equal(pollInterval({ remote: false, locked: false }), false); // demo mode: nothing shared to fetch
  assert.ok(COMMENT_POLL_MS >= 3000 && COMMENT_POLL_MS <= 10000);
});

test("first load flags nothing; later arrivals are flagged once", () => {
  const a = { id: "1" }, b = { id: "2" }, c = { id: "3" };
  assert.deepEqual(newCommentIds(null, [a, b]), []);
  assert.deepEqual(newCommentIds(new Set(["1", "2"]), [a, b]), []);
  assert.deepEqual(newCommentIds(new Set(["1", "2"]), [a, b, c]), ["3"]);
  assert.deepEqual(newCommentIds(new Set(["1"]), []), []);
});

test("share link uses the hash route and survives the GitHub Pages sub-path", () => {
  assert.equal(
    editionUrl({ origin: "https://s4899427.github.io", pathname: "/Team_11_Folio/" }, "2026-10-22"),
    "https://s4899427.github.io/Team_11_Folio/#/edition/2026-10-22",
  );
  assert.equal(editionUrl({ origin: "http://localhost:5173", pathname: "/" }, "2026-10-22"), "http://localhost:5173/#/edition/2026-10-22");
});

test("share text is short, names the work, and carries no personal data", () => {
  const t = pickShareText({ title: "Geronimo", artist: "Sheppard" });
  assert.match(t, /Geronimo/);
  assert.match(t, /Sheppard/);
  assert.ok(t.length <= 140);
  const long = pickShareText({ title: "x".repeat(300), artist: "y" });
  assert.ok(long.length <= 140);
  const e = editionShareText({ title: "Near and Far", curatorName: "Dylan" });
  assert.match(e, /Near and Far/);
  assert.ok(e.length <= 140);
});

const UUID_OK = "b90e9da8-3b09-4575-bbb2-dc4501ac3ca5";

test("presence is tracked only for a real, shared, open Edition", () => {
  assert.equal(canTrackPresence({ remote: true, locked: false, editionId: UUID_OK }), true);
  assert.equal(canTrackPresence({ remote: true, locked: true, editionId: UUID_OK }), false);   // locked day
  assert.equal(canTrackPresence({ remote: false, locked: false, editionId: UUID_OK }), false); // demo mode
  assert.equal(canTrackPresence({ remote: true, locked: false, editionId: "seed-2026-10-22" }), false);
  assert.equal(canTrackPresence({ remote: true, locked: false, editionId: "preview" }), false);
  assert.equal(canTrackPresence({ remote: true, locked: false, editionId: undefined }), false);
  assert.ok(PRESENCE_POLL_MS < 30000, "heartbeat must be more frequent than the database's 30 s window");
});

test("client id fits the database rule, is random per call, and works without crypto", () => {
  const rule = /^[A-Za-z0-9_-]{8,40}$/;
  const a = newClientId(), b = newClientId();
  assert.match(a, rule);
  assert.notEqual(a, b);
  assert.match(newClientId(null), rule); // fallback path
  assert.match(newClientId({ getRandomValues: (arr) => { arr.fill(255); return arr; } }), rule);
});

test("reading label: nothing for no data, singular for you alone, count otherwise", () => {
  assert.equal(readingLabel(undefined), null);
  assert.equal(readingLabel(NaN), null);
  assert.equal(readingLabel(0), null);
  assert.equal(readingLabel(1), "Just you here right now");
  assert.equal(readingLabel(3), "3 people reading right now");
});
