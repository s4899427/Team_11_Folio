import test from "node:test";
import assert from "node:assert/strict";
import { brisbaneToday, addDays, msUntilBrisbaneMidnight, cityToday, msUntilMidnight } from "../src/lib/time.js";
import { CITIES, CITY_LIST, detectCity, factOfTheDay } from "../src/lib/cities.js";
import { canBack, backsLeft, discoveryRate, tierFor, BACKS_PER_MONTH, MIN_RESPONSES_TO_SHOW } from "../src/lib/standing.js";
import { seedEditions } from "../src/lib/seed.js";
import { validateEdition, emptyItem, MIN_ITEMS, emergingBounds, composition } from "../src/lib/validate.js";
import { partOfDay } from "../src/lib/time.js";

test("Brisbane date rolls over at 14:00 UTC, not UTC midnight", () => {
  assert.equal(brisbaneToday(new Date("2026-10-08T13:59:59Z")), "2026-10-08");
  assert.equal(brisbaneToday(new Date("2026-10-08T14:00:00Z")), "2026-10-09");
});

test("countdown reaches zero at Brisbane midnight", () => {
  assert.equal(msUntilBrisbaneMidnight(new Date("2026-10-08T13:59:59Z")), 1000);
  assert.equal(msUntilBrisbaneMidnight(new Date("2026-10-08T14:00:00Z")), 24 * 3600 * 1000);
});

test("addDays handles month and year boundaries", () => {
  assert.equal(addDays("2026-10-31", 1), "2026-11-01");
  assert.equal(addDays("2026-12-31", 1), "2027-01-01");
  assert.equal(addDays("2026-03-01", -1), "2026-02-28");
});

test("seed Editions: founding sets of 5+ picks, one per day, today is covered", () => {
  const today = "2026-10-08";
  const eds = seedEditions(today);
  assert.equal(eds[0].date, today);
  assert.equal(new Set(eds.map((e) => e.date)).size, eds.length);
  for (const e of eds) {
    assert.ok(e.items.length >= 5, `${e.title} has ${e.items.length}`);
  }
});

test("every seed pick has a reason and a sourced liner note", () => {
  const ids = new Set();
  for (const e of seedEditions("2026-10-08")) for (const it of e.items) {
    assert.ok(!ids.has(it.id), `duplicate id ${it.id}`); ids.add(it.id);
    assert.ok(it.why.length >= 10, it.title);
    assert.ok(it.linerNote.text.length >= 20, it.title);
    assert.match(it.linerNote.sourceUrl, /^https:\/\//, it.title);
    assert.ok(it.linerNote.sourceLabel, it.title);
  }
});

const good = () => ({
  date: "2026-10-09", title: "T",
  items: Array.from({ length: 8 }, (_, i) => ({
    ...emptyItem(), title: "Song " + i, artist: "Band", why: "A good reason here.",
    linerNote: { text: "A checkable fact about the song.", sourceLabel: "Src", sourceUrl: "https://example.com/" + i },
    stage: i < 2 ? "emerging" : "established",
  })),
});
const ctx = { today: "2026-10-08", takenDates: [] };

test("a complete Edition validates", () => assert.deepEqual(validateEdition(good(), ctx), []));

test("no source link, no publish", () => {
  const ed = good(); ed.items[2].linerNote.sourceUrl = "not a url";
  assert.ok(validateEdition(ed, ctx).some((m) => m.startsWith("Pick 3") && m.includes("source link")));
});

test("rejects past days, claimed days, too few picks, duplicates", () => {
  assert.ok(validateEdition({ ...good(), date: "2026-10-07" }, ctx).some((m) => m.includes("locked")));
  assert.ok(validateEdition(good(), { ...ctx, takenDates: ["2026-10-09"] }).some((m) => m.includes("claimed")));
  assert.ok(validateEdition({ ...good(), items: good().items.slice(0, MIN_ITEMS - 1) }, ctx).some((m) => m.includes("8 to 12")));
  const dup = good(); dup.items[1].title = dup.items[0].title;
  assert.ok(validateEdition(dup, ctx).some((m) => m.includes("twice")));
});

// ── cities: location-based time, greeting, facts ──
test("each city's day rolls over at its own local midnight", () => {
  assert.equal(cityToday("Asia/Seoul", new Date("2026-10-08T14:59:59Z")), "2026-10-08");
  assert.equal(cityToday("Asia/Seoul", new Date("2026-10-08T15:00:00Z")), "2026-10-09");
  // India is UTC+5:30: midnight is 18:30 UTC, not on the hour
  assert.equal(msUntilMidnight("Asia/Kolkata", new Date("2026-10-08T18:29:59Z")), 1000);
  assert.equal(cityToday("Asia/Kolkata", new Date("2026-10-08T18:30:00Z")), "2026-10-09");
});

test("city is guessed from the device time zone, and unknown zones are not guessed", () => {
  assert.equal(detectCity("Australia/Brisbane"), "brisbane");
  assert.equal(detectCity("Asia/Seoul"), "seoul");
  assert.equal(detectCity("Asia/Kolkata"), "mumbai");
  assert.equal(detectCity("Asia/Calcutta"), "mumbai");
  assert.equal(detectCity("Europe/Paris"), null);
});

test("every city has a greeting, a time zone Intl understands, and sourced facts", () => {
  const ids = new Set();
  for (const c of CITY_LIST) {
    assert.ok(c.greeting.native && c.greeting.gloss, c.id);
    assert.doesNotThrow(() => cityToday(c.tz), c.id);
    assert.ok(c.facts.length >= 5, `${c.id} has ${c.facts.length} facts`);
    for (const f of c.facts) {
      assert.ok(!ids.has(f.id), "duplicate fact id " + f.id); ids.add(f.id);
      assert.ok(f.text.length > 40, f.id);
      assert.match(f.sourceUrl, /^https:\/\//, f.id);
      assert.ok(f.sourceLabel, f.id);
    }
  }
});

test("local touches: each city speaks its own language; Brisbane carries an Acknowledgement of Country", () => {
  assert.equal(CITIES.seoul.greeting.lang, "ko");
  assert.match(CITIES.seoul.greeting.native, /[\uAC00-\uD7AF]/);          // Hangul
  assert.equal(CITIES.mumbai.greeting.lang, "mr");
  assert.match(CITIES.mumbai.greeting.native, /[\u0900-\u097F]/);          // Devanagari
  assert.ok(CITIES.brisbane.greeting.byTime); assert.doesNotMatch(JSON.stringify(CITIES.brisbane.greeting), /G'day|Brissy/);
  assert.match(CITIES.brisbane.country_ack.text, /Traditional Custodians/);
  assert.ok(!CITIES.seoul.country_ack && !CITIES.mumbai.country_ack);
});

test("only Brisbane claims curated Editions; other cities say so", () => {
  assert.deepEqual(CITY_LIST.filter((c) => c.curated).map((c) => c.id), ["brisbane"]);
});

test("fact of the day is stable within a day, differs by city, and is always in the pool", () => {
  const a = factOfTheDay(CITIES.seoul, "2026-10-08"), b = factOfTheDay(CITIES.seoul, "2026-10-08");
  assert.equal(a.id, b.id);
  assert.ok(CITIES.seoul.facts.some((f) => f.id === a.id));
  const seen = new Set(Array.from({ length: 30 }, (_, i) => factOfTheDay(CITIES.brisbane, `2026-10-${String(i + 1).padStart(2, "0")}`).id));
  assert.ok(seen.size >= 3, "facts should rotate across days");
});

// ── curator standing: backs and discovery ──
test("backs: no self-backs, no repeats in a month, capped, resets monthly", () => {
  const m = "2026-10";
  assert.equal(canBack({ voterId: "a", curatorId: "a", month: m, backs: [] }).ok, false);
  assert.equal(canBack({ voterId: null, curatorId: "c", month: m, backs: [] }).ok, false);
  assert.equal(canBack({ voterId: "a", curatorId: "c", month: m, backs: [] }).ok, true);
  const backs = [{ voterId: "a", curatorId: "c", month: m }];
  assert.equal(canBack({ voterId: "a", curatorId: "c", month: m, backs }).ok, false);
  const full = ["c", "d", "e"].map((c) => ({ voterId: "a", curatorId: c, month: m }));
  assert.equal(full.length, BACKS_PER_MONTH);
  assert.equal(canBack({ voterId: "a", curatorId: "f", month: m, backs: full }).ok, false);
  assert.equal(canBack({ voterId: "a", curatorId: "f", month: "2026-11", backs: full }).ok, true);
  assert.equal(backsLeft({ voterId: "a", month: m, backs: full }), 0);
  assert.equal(backsLeft({ voterId: "b", month: m, backs: full }), BACKS_PER_MONTH);
});

test("discovery rate is hidden until there are enough responses to mean something", () => {
  assert.equal(discoveryRate({ responses: MIN_RESPONSES_TO_SHOW - 1, foundNew: 9 }), null);
  assert.equal(discoveryRate({ responses: 10, foundNew: 7 }), 0.7);
});

test("tiers follow Editions, then discovery AND breadth of support", () => {
  assert.equal(tierFor({ editions: 4 }).id, "apprentice");
  assert.equal(tierFor({ editions: 5 }).id, "curator");
  assert.equal(tierFor({ editions: 25, responses: 30, foundNew: 20, distinctBackers90: 6 }).id, "resident");
  // lots of Editions but nobody found anything new: no promotion
  assert.equal(tierFor({ editions: 40, responses: 30, foundNew: 3, distinctBackers90: 9 }).id, "curator");
  // few backers (could be friends): no promotion
  assert.equal(tierFor({ editions: 40, responses: 30, foundNew: 25, distinctBackers90: 2 }).id, "curator");
});

test("mix rule: at least 2, at most 4, never above 45%", () => {
  assert.deepEqual(emergingBounds(8), { min: 2, max: 3 });
  assert.deepEqual(emergingBounds(9), { min: 2, max: 4 });
  assert.deepEqual(emergingBounds(12), { min: 2, max: 4 });
});

test("an Edition with no new and upcoming artist is rejected", () => {
  const ed = good(); ed.items[0].stage = "established";
  assert.ok(validateEdition(ed, ctx).some((m) => m.includes("new and upcoming")));
});

test("too many new artists is rejected (people should also get to know the established names)", () => {
  const ed = good(); ed.items.forEach((it, i) => { if (i < 4) it.stage = "emerging"; });
  assert.ok(validateEdition(ed, ctx).some((m) => m.startsWith("At most 3")));
});

test("music picks from outside Australia are out of scope; places and stories are not marked emerging", () => {
  const ed = good(); ed.items[1].origin = "other";
  assert.ok(validateEdition(ed, ctx).some((m) => m.startsWith("Pick 2") && m.includes("Australian")));
  const ed2 = good(); ed2.items[2].kind = "place"; ed2.items[2].stage = "emerging";
  assert.ok(validateEdition(ed2, ctx).some((m) => m.startsWith("Pick 3") && m.includes("only a track")));
});

test("composition counts", () => assert.deepEqual(composition(good().items), { total: 8, emerging: 2, established: 6, outsideScope: 0 }));

test("part of day follows the city's own clock", () => {
  const t = new Date("2026-10-08T22:00:00Z"); // 08:00 Brisbane, 17:30 Kolkata -> evening, 07:00 Seoul
  assert.equal(partOfDay("Australia/Brisbane", t), "morning");
  assert.equal(partOfDay("Asia/Kolkata", t), "evening");
  assert.equal(partOfDay("Asia/Seoul", t), "morning");
  assert.equal(partOfDay("Australia/Brisbane", new Date("2026-10-08T03:00:00Z")), "afternoon");
});
