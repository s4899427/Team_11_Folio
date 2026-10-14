import { addDays } from "./time.js";

export const MIN_ITEMS = 8;
export const MAX_ITEMS = 12;
export const MAX_DAYS_AHEAD = 14;

export const emptyEvidence = () => ({
  artistType: "soundcloud", artistUrl: "",          // artist-owned page (their own profile)
  thirdLabel: "", thirdUrl: "",                    // independent source (radio, venue, press, QMusic...)
  localNote: "",                                   // how the curator knows they are local
  attested: false,                                 // curator signs: human-made, local and new
});

export const ARTIST_PAGE_TYPES = [
  { id: "soundcloud", label: "SoundCloud", hosts: ["soundcloud.com", "on.soundcloud.com"] },
  { id: "bandcamp", label: "Bandcamp", hosts: ["bandcamp.com"] },
  { id: "other", label: "Other artist-owned page", hosts: null },
];

const hostOf = (s) => { try { return new URL(s).hostname.replace(/^www\./, "").toLowerCase(); } catch { return ""; } };
/** true when the URL is on the type's domain (or a subdomain, e.g. name.bandcamp.com). "other" accepts any host. */
export function artistUrlMatchesType(type, url) {
  const t = ARTIST_PAGE_TYPES.find((x) => x.id === type);
  if (!t || !t.hosts) return !!hostOf(url);
  const h = hostOf(url);
  return t.hosts.some((d) => h === d || h.endsWith("." + d));
}

export const emptyItem = () => ({
  id: "i-" + Math.random().toString(36).slice(2, 9),
  kind: "track", title: "", artist: "", year: "", why: "",
  stage: "established", origin: "local", knowsArtist: false,
  evidence: emptyEvidence(),
  linerNote: { text: "", sourceLabel: "", sourceUrl: "" },
});

export const MUSIC_KINDS = ["track", "album", "artist"];
export const isMusic = (it) => MUSIC_KINDS.includes(it.kind);

/**
 * The mix rule. Most picks are artists people already know (established or
 * underrated); a minority are new and upcoming. At least 2 and at most 4 per
 * Edition (8-12 picks): at least 2, at most 4, and never above 45% of the picks:
 * 8 picks allow 2-3, 9-12 picks allow 2-4. Whole numbers rule out a literal ratio.
 */
export function emergingBounds(n) {
  const min = 2;
  return { min, max: Math.min(4, Math.max(min, Math.floor(n * 0.45))) };
}

export function composition(items = []) {
  const music = items.filter(isMusic);
  return {
    total: items.length,
    emerging: items.filter((it) => it.stage === "emerging").length,
    established: items.filter((it) => it.stage !== "emerging").length,
    outsideScope: music.filter((it) => it.origin === "other").length,
  };
}

const isHttpUrl = (s) => { try { const u = new URL(s); return u.protocol === "http:" || u.protocol === "https:"; } catch { return false; } };

/**
 * Rules a curator must satisfy before an Edition can go out.
 * The key rule is the sourced Liner Note: no source, no publish.
 * Returns an array of human-readable problems (empty = valid).
 */
export function validateEdition(ed, { today, takenDates = [] }) {
  const errs = [];
  if (!ed.title?.trim()) errs.push("Give the Edition a title.");
  if (!ed.date) errs.push("Choose a day.");
  else {
    if (ed.date < today) errs.push("That day has already locked.");
    if (ed.date > addDays(today, MAX_DAYS_AHEAD)) errs.push(`You can stage at most ${MAX_DAYS_AHEAD} days ahead.`);
    if (takenDates.includes(ed.date)) errs.push("Another curator has already claimed that day.");
  }
  const n = ed.items?.length || 0;
  if (n < MIN_ITEMS || n > MAX_ITEMS) errs.push(`An Edition has ${MIN_ITEMS} to ${MAX_ITEMS} picks (you have ${n}).`);
  if (n >= MIN_ITEMS && n <= MAX_ITEMS) {
    const { emerging } = composition(ed.items);
    const { min, max } = emergingBounds(n);
    if (emerging < min) errs.push(`Include at least ${min} new and upcoming local artists (${emerging} marked). Most picks can be artists people already know.`);
    if (emerging > max) errs.push(`At most ${max} of ${n} picks can be new and upcoming, so the Edition still helps people get to know the established names.`);
  }
  (ed.items || []).forEach((it, i) => {
    const p = `Pick ${i + 1}`;
    if (!it.title?.trim()) errs.push(`${p}: add a title.`);
    if (!it.artist?.trim()) errs.push(`${p}: add an artist or place.`);
    if ((it.why || "").trim().length < 10) errs.push(`${p}: say why it's here (at least a sentence).`);
    if (it.year && !/^\d{4}$/.test(String(it.year))) errs.push(`${p}: year should be four digits.`);
    if (isMusic(it) && it.origin === "other") errs.push(`${p}: Folio is scoped to Australian artists for now. Mark where they are from, or pick someone from here.`);
    if (it.stage === "emerging" && !isMusic(it)) errs.push(`${p}: only a track, album or artist can be marked new and upcoming.`);
    if (it.stage === "emerging" && isMusic(it)) {
      const ev = it.evidence || {};
      if (!isHttpUrl(ev.artistUrl || "")) errs.push(`${p}: add the artist's own page (SoundCloud, Bandcamp or other) as a link.`);
      else if (!artistUrlMatchesType(ev.artistType, ev.artistUrl)) errs.push(`${p}: that link is not on ${ARTIST_PAGE_TYPES.find((x) => x.id === ev.artistType)?.label || "the chosen site"}. Change the page type or the link.`);
      if (!isHttpUrl(ev.thirdUrl || "") || !(ev.thirdLabel || "").trim()) errs.push(`${p}: add an independent source (radio, venue, press or QMusic) with a name and link.`);
      else if (hostOf(ev.thirdUrl) === hostOf(ev.artistUrl)) errs.push(`${p}: the independent source must be on a different site from the artist's own page.`);
      if ((ev.localNote || "").trim().length < 20) errs.push(`${p}: say how you know the artist is local (profile location, a gig, a venue).`);
      if (it.origin !== "local") errs.push(`${p}: a new and upcoming pick must be based in the city.`);
      if (!ev.attested) errs.push(`${p}: tick the box to confirm this is human-made, local and new.`);
    }
    const ln = it.linerNote || {};
    if ((ln.text || "").trim().length < 20) errs.push(`${p}: the liner note needs a real fact.`);
    if (!isHttpUrl(ln.sourceUrl || "")) errs.push(`${p}: the liner note needs a source link (http or https).`);
    if (!(ln.sourceLabel || "").trim()) errs.push(`${p}: name the source.`);
  });
  const keys = (ed.items || []).map((it) => `${(it.title || "").trim().toLowerCase()}|${(it.artist || "").trim().toLowerCase()}`);
  if (new Set(keys).size !== keys.length) errs.push("The same pick appears twice.");
  return errs;
}
