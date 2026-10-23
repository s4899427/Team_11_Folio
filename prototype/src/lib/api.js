// ─────────────────────────────────────────────────────────────────
// Data layer. Two interchangeable backends behind one interface:
//
//   REMOTE  (Supabase, when VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY are set)
//           Editions, comments, pitches and gig tips are shared by every
//           device. Row-level security in supabase/schema.sql enforces who
//           may write and locks an Edition at Brisbane midnight.
//
//   LOCAL   (default; nothing to configure)
//           Seed Editions + whatever this browser has published. Used for
//           development and as the last-resort fallback so the demo can
//           never show an empty screen.
//
// No Supabase client library: plain fetch against the REST/Auth endpoints,
// so there is nothing extra to install or bundle.
// ─────────────────────────────────────────────────────────────────
import { seedEditions, DESK } from "./seed.js";
import { cityToday } from "./time.js";
import { getCity } from "./cities.js";
import { canBack, monthOf } from "./standing.js";

const URL_ = import.meta.env?.VITE_SUPABASE_URL;
const KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY;
// Sandbox: a visitor can force demo mode on the live site (#/demo) to try every role without an account.
// Data then stays in that browser only and nothing touches the shared database.
const SANDBOX_FLAG = "folio_force_demo";
const sandboxOn = () => { try { return localStorage.getItem(SANDBOX_FLAG) === "1"; } catch { return false; } };
export const SANDBOX_POSSIBLE = Boolean(URL_ && KEY);
export const IN_SANDBOX = SANDBOX_POSSIBLE && sandboxOn();
export const REMOTE = Boolean(URL_ && KEY) && !IN_SANDBOX;
/** Switch sandbox on or off. Clears the saved device state (session, saves) so a remote session is never mixed with a demo one. */
export function setSandbox(on) {
  try {
    if (on) localStorage.setItem(SANDBOX_FLAG, "1"); else localStorage.removeItem(SANDBOX_FLAG);
    localStorage.removeItem("folio_state_v2");
  } catch {}
}

export class ApiError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

// ── tiny storage helpers (never throw) ──
const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

// ── REMOTE plumbing ──
async function rest(path, { method = "GET", body, token, prefer } = {}) {
  const res = await fetch(`${URL_}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${token || KEY}`,
      "Content-Type": "application/json",
      ...(prefer ? { Prefer: prefer } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new ApiError(res.status, await res.text());
  return res.status === 204 ? null : res.json();
}

async function authCall(path, body) {
  const res = await fetch(`${URL_}/auth/v1/${path}`, {
    method: "POST",
    headers: { apikey: KEY, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, data.msg || data.error_description || data.message || "Request failed");
  return data;
}

// ── row <-> app mapping ──
const fromEditionRow = (r) => ({
  id: r.id, city: r.city, date: r.edition_date, title: r.title, blurb: r.blurb || "",
  items: r.items || [], curatorId: r.curator_id, curatorName: r.curator_name,
  status: r.status,
});
const toEditionRow = (e) => ({
  city: e.city, edition_date: e.date, title: e.title, blurb: e.blurb || "",
  items: e.items, curator_id: e.curatorId, curator_name: e.curatorName,
  status: "published",
});

// ─────────────────────────────── AUTH ───────────────────────────────
const LOCAL_ACCOUNTS = "folio_v2_accounts";
const tzOf = (cityId) => (getCity(cityId) || getCity("brisbane")).tz;

export const auth = {
  async signUp({ email, password, name, role, suburb, city }) {
    if (REMOTE) {
      const d = await authCall("signup", {
        email, password,
        data: { name, suburb: suburb || "", city: city || "brisbane", role: role === "artist" ? "artist" : "listener" },
      });
      if (!d.access_token) {
        // Email confirmation is on in the Supabase project: sign-in will fail until confirmed.
        throw new ApiError(400, "Account created. Check your email to confirm it, then log in.");
      }
      return sessionFromAuth(d);
    }
    const accounts = read(LOCAL_ACCOUNTS, {});
    if (accounts[email]) throw new ApiError(409, "That email already has an account on this device.");
    const id = "local-" + Math.random().toString(36).slice(2, 10);
    accounts[email] = { id, email, password, name, suburb: suburb || "", city: city || "brisbane", role: role === "artist" ? "artist" : "listener" };
    write(LOCAL_ACCOUNTS, accounts);
    return { id, email, name, suburb: suburb || "", city: city || "brisbane", role: accounts[email].role, token: null, local: true };
  },

  async signIn({ email, password }) {
    if (REMOTE) {
      return sessionFromAuth(await authCall("token?grant_type=password", { email, password }));
    }
    const a = read(LOCAL_ACCOUNTS, {})[email];
    if (!a || a.password !== password) throw new ApiError(401, "Email or password doesn't match this device's demo account.");
    return { id: a.id, email, name: a.name, suburb: a.suburb, city: a.city || "brisbane", role: a.role, token: null, local: true };
  },
};

async function sessionFromAuth(d) {
  const token = d.access_token;
  const uid = d.user.id;
  let profile = null;
  try {
    const rows = await rest(`profiles?id=eq.${uid}&select=*`, { token });
    profile = rows[0];
  } catch {}
  const meta = d.user.user_metadata || {};
  return {
    id: uid, email: d.user.email, token,
    refreshToken: d.refresh_token,
    name: profile?.name || meta.name || d.user.email.split("@")[0],
    suburb: profile?.suburb || meta.suburb || "",
    city: profile?.city || meta.city || "brisbane",
    bio: profile?.bio || "",
    avatar: profile?.avatar || "",
    role: profile?.role || "listener",
    isAdmin: Boolean(profile?.is_admin),
    local: false,
  };
}

/** Re-read the signed-in profile so a role granted since login (curator, team) shows up without logging out. */
export async function refreshProfile(session) {
  if (!session || session.local || !REMOTE || !session.token) return session;
  try {
    const rows = await rest(`profiles?id=eq.${session.id}&select=*`, { token: session.token });
    const p = rows[0];
    if (!p) return session;
    return { ...session, name: p.name || session.name, suburb: p.suburb ?? session.suburb, bio: p.bio || "", avatar: p.avatar || "", role: p.role || session.role, isAdmin: Boolean(p.is_admin) };
  } catch { return session; }
}

/** Where a person lands after logging in: the team to Admin, curators to the Studio, everyone else to Today. */
export function homeFor(session, { demoCurator = false, demoAdmin = false } = {}) {
  if (!session) return "/";
  if (session.isAdmin || (session.local && demoAdmin)) return "/admin";
  if (session.role === "curator" || (session.local && (demoCurator || isLocalApproved(session.id)))) return "/studio";
  return "/";
}

// ───────────────────────────── EDITIONS ─────────────────────────────
const LOCAL_EDITIONS = "folio_v2_local_editions";
const CACHE = "folio_v2_cache_editions";

/**
 * Editions the viewer may see for a city: published, dated today or earlier
 * in that city's time zone, plus the viewer's own staged future Editions.
 * Returns { editions, source } where source is 'remote' | 'cache' | 'local' | 'fallback'.
 * Only Brisbane has built-in founding Editions; other cities start empty.
 */
export async function listEditions(session, cityId = "brisbane") {
  const today = cityToday(tzOf(cityId));
  if (REMOTE) {
    try {
      const rows = await rest(`editions?city=eq.${cityId}&select=*&order=edition_date.desc&limit=90`, { token: session?.token });
      const editions = rows.map(fromEditionRow);
      const all = read(CACHE, {}); all[cityId] = editions; write(CACHE, all);
      return { editions, source: "remote" };
    } catch (e) {
      const cached = read(CACHE, {})[cityId];
      if (cached?.length) return { editions: cached.filter((x) => x.date <= today || x.curatorId === session?.id), source: "cache" };
    }
  }
  const mine = read(LOCAL_EDITIONS, []).filter((e) => (e.city || "brisbane") === cityId);
  const byDate = new Map();
  if (cityId === "brisbane") for (const e of seedEditions(today)) byDate.set(e.date, { ...e, city: "brisbane" });
  for (const e of mine) byDate.set(e.date, e); // a locally published Edition replaces seed for that day
  const editions = [...byDate.values()]
    .filter((e) => e.date <= today || e.curatorId === session?.id)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  return { editions, source: REMOTE ? "fallback" : "local" };
}

/**
 * Publish an Edition for a city and date. One Edition per city per day: if the
 * day is already claimed by someone else the call fails with a readable message.
 * Editions of past days cannot be changed (the midnight lock, in the city's time zone).
 */
export async function saveEdition(session, edition) {
  const city = edition.city || "brisbane";
  const today = cityToday(tzOf(city));
  if (edition.date < today) throw new ApiError(403, "That day has already locked.");
  const full = { ...edition, city, curatorId: session.id, curatorName: session.name, status: "published" };

  if (REMOTE) {
    try {
      if (edition.id && !String(edition.id).startsWith("local-ed")) {
        const r = await rest(`editions?id=eq.${edition.id}`, { method: "PATCH", token: session.token, body: toEditionRow(full), prefer: "return=representation" });
        return fromEditionRow(r[0]);
      }
      const r = await rest("editions", { method: "POST", token: session.token, body: toEditionRow(full), prefer: "return=representation" });
      return fromEditionRow(r[0]);
    } catch (e) {
      if (e.status === 409) throw new ApiError(409, "Another curator has already claimed that day.");
      if (e.status === 401 || e.status === 403) throw new ApiError(403, "Only approved curators can publish Editions for their own city.");
      throw e;
    }
  }

  const mine = read(LOCAL_EDITIONS, []);
  const clash = mine.find((e) => (e.city || "brisbane") === city && e.date === edition.date && e.curatorId !== session.id);
  if (clash) throw new ApiError(409, "Another curator has already claimed that day (on this device).");
  const idx = mine.findIndex((e) => (e.city || "brisbane") === city && e.date === edition.date);
  const saved = { ...full, id: idx >= 0 ? mine[idx].id : "local-ed-" + Date.now(), seed: false };
  if (idx >= 0) mine[idx] = saved; else mine.push(saved);
  write(LOCAL_EDITIONS, mine);
  return saved;
}

// ───────────────────────────── COMMENTS ─────────────────────────────
// Comments are chronological. They carry no ranking weight and there are no likes.
const LOCAL_COMMENTS = "folio_v2_local_comments";

/** strict: on a failed shared read, throw instead of falling back to this device's local list.
 *  The open page polls with strict on, so a network blip keeps the comments already on screen. */
export async function listComments(editionId, { strict = false } = {}) {
  if (REMOTE && !String(editionId).startsWith("seed-")) {
    try {
      const rows = await rest(`comments?edition_id=eq.${editionId}&select=*&order=created_at.asc`);
      return rows.map((r) => ({ id: r.id, author: r.author_name, body: r.body, at: r.created_at }));
    } catch (e) { if (strict) throw e; /* otherwise fall back to local */ }
  }
  return read(LOCAL_COMMENTS, {})[editionId] || [];
}

export async function addComment(session, editionId, body) {
  const text = body.trim().slice(0, 500);
  if (!text) throw new ApiError(400, "Write something first.");
  if (REMOTE && !String(editionId).startsWith("seed-")) {
    const r = await rest("comments", {
      method: "POST", token: session.token, prefer: "return=representation",
      body: { edition_id: editionId, author_id: session.id, author_name: session.name, body: text },
    });
    return { id: r[0].id, author: r[0].author_name, body: r[0].body, at: r[0].created_at };
  }
  const all = read(LOCAL_COMMENTS, {});
  const c = { id: "c" + Date.now(), author: session.name, body: text, at: new Date().toISOString() };
  all[editionId] = [...(all[editionId] || []), c];
  write(LOCAL_COMMENTS, all);
  return c;
}

// ───────────────────────────── CURATORS ─────────────────────────────
const LOCAL_BIO = "folio_v2_local_bio";

export async function listCurators(cityId = "brisbane") {
  if (REMOTE) {
    try {
      const rows = await rest(`profiles?role=eq.curator&city=eq.${cityId}&select=id,name,bio&order=name.asc`);
      if (rows.length) return rows;
    } catch {}
  }
  const bios = read(LOCAL_BIO, {});
  const list = cityId === "brisbane" ? [{ id: DESK.id, name: DESK.name, bio: DESK.blurb }] : [];
  return list.map((c) => ({ ...c, bio: bios[c.id] || c.bio }));
}

export async function saveBio(session, bio) {
  const text = bio.trim().slice(0, 280);
  if (REMOTE && !session.local) {
    await rest(`profiles?id=eq.${session.id}`, { method: "PATCH", token: session.token, body: { bio: text } });
  } else {
    const all = read(LOCAL_BIO, {}); all[session.id] = text; write(LOCAL_BIO, all);
  }
  return text;
}

const LOCAL_AVATAR = "folio_v2_local_avatar";
export const BIO_MAX = 280;
export const AVATAR_MAX_BYTES = 2 * 1024 * 1024;

/** Validate a JPG or PNG (max 2 MB) and shrink it to a 256px square JPEG data URL. */
export function fileToAvatar(file) {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new ApiError(400, "Choose a picture."));
    if (!["image/jpeg", "image/png"].includes(file.type)) return reject(new ApiError(400, "Use a JPG or PNG picture."));
    if (file.size > AVATAR_MAX_BYTES) return reject(new ApiError(400, "Pictures can be up to 2 MB."));
    const url = URL.createObjectURL(file), img = new Image();
    img.onload = () => {
      const s = 256, c = document.createElement("canvas"); c.width = c.height = s;
      const m = Math.min(img.width, img.height);
      c.getContext("2d").drawImage(img, (img.width - m) / 2, (img.height - m) / 2, m, m, 0, 0, s, s);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new ApiError(400, "That file didn't open as a picture.")); };
    img.src = url;
  });
}

/** Name, suburb, picture and short bio for any signed-in, non-guest account. avatar: dataURL, "" to remove; undefined fields are kept. */
export const NAME_MAX = 40;
export async function saveProfile(session, { bio, avatar, name, suburb }) {
  const patch = {};
  if (bio !== undefined) patch.bio = bio.trim().slice(0, BIO_MAX);
  if (avatar !== undefined) patch.avatar = avatar;
  if (name !== undefined) {
    patch.name = name.trim().slice(0, NAME_MAX);
    if (!patch.name) throw new ApiError(400, "Your name can't be empty.");
  }
  if (suburb !== undefined) patch.suburb = suburb.trim().slice(0, 60);
  if (REMOTE && !session.local) {
    await rest(`profiles?id=eq.${session.id}`, { method: "PATCH", token: session.token, body: patch });
  } else {
    if (patch.bio !== undefined) { const all = read(LOCAL_BIO, {}); all[session.id] = patch.bio; write(LOCAL_BIO, all); }
    if (patch.avatar !== undefined) { const all = read(LOCAL_AVATAR, {}); all[session.id] = patch.avatar; write(LOCAL_AVATAR, all); }
    if (patch.name !== undefined || patch.suburb !== undefined) {
      const accounts = read(LOCAL_ACCOUNTS, {});
      const key = Object.keys(accounts).find((k) => accounts[k].id === session.id);
      if (key) { accounts[key] = { ...accounts[key], ...(patch.name !== undefined ? { name: patch.name } : {}), ...(patch.suburb !== undefined ? { suburb: patch.suburb } : {}) }; write(LOCAL_ACCOUNTS, accounts); }
    }
  }
  return patch;
}

export function getLocalProfile(session) {
  return { bio: read(LOCAL_BIO, {})[session.id] || session.bio || "", avatar: read(LOCAL_AVATAR, {})[session.id] || session.avatar || "" };
}

// ───────────────── DISCOVERY CHECK and BACKS (curator standing) ─────────────────
// Votes decide who curates. They never rank or reorder anything inside an Edition.
const LOCAL_DISC = "folio_v2_local_discovery";   // { [editionId]: { [voterId]: bool } }
const LOCAL_BACKS = "folio_v2_local_backs";       // [{ voterId, curatorId, month, at }]
const isRemoteId = (id) => REMOTE && !String(id).startsWith("seed-") && !String(id).startsWith("local-") && id !== DESK.id;

export async function getMyDiscovery(session, editionId) {
  if (!session) return null;
  const v = read(LOCAL_DISC, {})[editionId]?.[session.id];
  if (typeof v === "boolean") return v;
  if (isRemoteId(editionId)) {
    try {
      const rows = await rest(`discovery?edition_id=eq.${editionId}&voter_id=eq.${session.id}&select=found_new`, { token: session.token });
      return rows[0] ? rows[0].found_new : null;
    } catch { return null; }
  }
  return null;
}

export async function sendDiscovery(session, editionId, foundNew) {
  if (isRemoteId(editionId)) {
    try {
      await rest("discovery", { method: "POST", token: session.token, body: { edition_id: editionId, voter_id: session.id, found_new: foundNew } });
    } catch (e) {
      if (e.status === 409) throw new ApiError(409, "You've already answered for this Edition.");
      throw e;
    }
    return;
  }
  const all = read(LOCAL_DISC, {});
  if (typeof all[editionId]?.[session.id] === "boolean") throw new ApiError(409, "You've already answered for this Edition.");
  all[editionId] = { ...(all[editionId] || {}), [session.id]: foundNew };
  write(LOCAL_DISC, all);
}

export async function listMyBacks(session) {
  if (!session) return [];
  const local = read(LOCAL_BACKS, []);
  let remote = [];
  if (REMOTE && !session.local) {
    try {
      const rows = await rest(`backs?voter_id=eq.${session.id}&select=voter_id,curator_id,month`, { token: session.token });
      remote = rows.map((r) => ({ voterId: r.voter_id, curatorId: r.curator_id, month: r.month }));
    } catch {}
  }
  return [...remote, ...local.filter((b) => b.voterId === session.id)];
}

export async function backCurator(session, curatorId, today) {
  const month = monthOf(today);
  const mine = await listMyBacks(session);
  const check = canBack({ voterId: session?.id, curatorId, month, backs: mine });
  if (!check.ok) throw new ApiError(400, check.reason);
  if (isRemoteId(curatorId)) {
    try {
      await rest("backs", { method: "POST", token: session.token, body: { voter_id: session.id, curator_id: curatorId, month } });
    } catch (e) { throw new ApiError(400, "That back was refused (limit reached or already backed)."); }
    return;
  }
  const all = read(LOCAL_BACKS, []);
  all.push({ voterId: session.id, curatorId, month, at: new Date().toISOString() });
  write(LOCAL_BACKS, all);
}

/**
 * What a curator's card shows. Public: Edition count, discovery rate (only once
 * there are enough responses to mean anything). Private to the curator: backs.
 * In demo mode these come from this device only.
 */
export async function getCuratorStats(session, curatorId, editionCount) {
  if (isRemoteId(curatorId)) {
    try {
      const r = await rest("rpc/curator_stats", { method: "POST", token: session?.token, body: { p_curator: curatorId } });
      return { editions: r.editions ?? editionCount, responses: r.responses ?? 0, foundNew: r.found_new ?? 0, distinctBackers90: r.distinct_backers_90 ?? null, local: false };
    } catch {}
  }
  const disc = read(LOCAL_DISC, {});
  let responses = 0, foundNew = 0;
  for (const per of Object.values(disc)) for (const v of Object.values(per)) { responses++; if (v) foundNew++; }
  const backs = read(LOCAL_BACKS, []).filter((b) => b.curatorId === curatorId);
  return { editions: editionCount, responses, foundNew, distinctBackers90: new Set(backs.map((b) => b.voterId)).size, local: true };
}

// ───────────────────────────── PITCHES ──────────────────────────────
// Artists pitch a track to a curator; curators read their inbox in the Studio.
const LOCAL_PITCHES = "folio_v2_local_pitches";

export async function sendPitch(session, { curatorId, curatorName, title, link, note }) {
  const row = { title: title.trim(), link: link.trim(), note: note.trim().slice(0, 500) };
  if (!row.title || !row.link) throw new ApiError(400, "A track name and a link are required.");
  if (REMOTE) {
    await rest("pitches", {
      method: "POST", token: session.token,
      body: { artist_id: session.id, artist_name: session.name, curator_id: curatorId === DESK.id ? null : curatorId, ...row },
    });
    return;
  }
  const all = read(LOCAL_PITCHES, []);
  all.unshift({ id: "p" + Date.now(), artistName: session.name, curatorId, curatorName, ...row, at: new Date().toISOString() });
  write(LOCAL_PITCHES, all);
}

export async function listPitches(session) {
  if (REMOTE) {
    try {
      const rows = await rest("pitches?select=*&order=created_at.desc&limit=50", { token: session.token });
      return rows.map((r) => ({ id: r.id, artistName: r.artist_name, title: r.title, link: r.link, note: r.note, at: r.created_at }));
    } catch { return []; }
  }
  return read(LOCAL_PITCHES, []);
}

// ───────────────────────────── GIG TIPS ─────────────────────────────
// "Nearby": curator-posted tips for tonight. Folio does not scrape listings.
const LOCAL_TIPS = "folio_v2_local_tips";

export async function listGigTips(cityId = "brisbane") {
  const today = cityToday(tzOf(cityId));
  if (REMOTE) {
    try {
      const rows = await rest(`gig_tips?city=eq.${cityId}&select=*&starts_on=gte.${today}&order=starts_on.asc&limit=20`);
      return rows.map((r) => ({ id: r.id, act: r.act, venue: r.venue, date: r.starts_on, time: r.time, link: r.link, curatorName: r.curator_name }));
    } catch { /* fall back */ }
  }
  return read(LOCAL_TIPS, []).filter((t) => (t.city || "brisbane") === cityId && t.date >= today).sort((a, b) => (a.date < b.date ? -1 : 1));
}

export async function addGigTip(session, { city, act, venue, date, time, link }) {
  if (!act.trim() || !venue.trim() || !date) throw new ApiError(400, "Act, venue and date are required.");
  if (REMOTE) {
    await rest("gig_tips", {
      method: "POST", token: session.token,
      body: { city, curator_id: session.id, curator_name: session.name, act: act.trim(), venue: venue.trim(), starts_on: date, time: time.trim(), link: link.trim() },
    });
    return;
  }
  const all = read(LOCAL_TIPS, []);
  all.push({ id: "t" + Date.now(), city, act: act.trim(), venue: venue.trim(), date, time: time.trim(), link: link.trim(), curatorName: session.name });
  write(LOCAL_TIPS, all);
}

// ─────────────────────── APPLY TO CURATE ───────────────────────
// Anyone can apply; the Folio team approves in the database. This is how a new
// city gets its first curator, and how Brisbane's roster grows.
const LOCAL_APPS = "folio_v2_local_applications";
const LOCAL_APPROVED = "folio_v2_local_approved";
export const isLocalApproved = (id) => read(LOCAL_APPROVED, []).includes(id);

export async function applyToCurate(session, { city, why, link }) {
  const row = { city: city.trim(), why: why.trim().slice(0, 600), link: link.trim() };
  if (!row.city || row.why.length < 20) throw new ApiError(400, "Tell us your city and why you'd curate it (a couple of sentences).");
  const existing = await getMyApplication(session);
  if (existing?.status === "pending") throw new ApiError(409, "You already have an application waiting. The Folio team will reply.");
  if (REMOTE && !session.local) {
    await rest("applications", { method: "POST", token: session.token, body: { applicant_id: session.id, applicant_name: session.name, ...row } });
    return;
  }
  const all = read(LOCAL_APPS, []);
  all.push({ id: "a" + Date.now(), applicantId: session.id, applicantName: session.name, status: "pending", ...row, at: new Date().toISOString() });
  write(LOCAL_APPS, all);
}

/** The signed-in person's latest application, or null. */
export async function getMyApplication(session) {
  if (!session) return null;
  if (REMOTE && !session.local) {
    try {
      const rows = await rest(`applications?applicant_id=eq.${session.id}&select=*&order=created_at.desc&limit=1`, { token: session.token });
      return rows[0] ? { id: rows[0].id, city: rows[0].city, status: rows[0].status || "pending", at: rows[0].created_at } : null;
    } catch { return null; }
  }
  const mine = read(LOCAL_APPS, []).filter((a) => a.applicantId === session.id);
  const last = mine[mine.length - 1];
  return last ? { id: last.id, city: last.city, status: last.status || "pending", at: last.at } : null;
}

const fromAppRow = (r) => ({ id: r.id, applicantId: r.applicant_id, applicantName: r.applicant_name, city: r.city, why: r.why, link: r.link, status: r.status || "pending", at: r.created_at, decidedAt: r.decided_at });

/** Folio team: every application, pending first. RLS returns nothing to anyone else. */
export async function listApplications(session) {
  let rows;
  if (REMOTE && !session.local) {
    rows = (await rest("applications?select=*&order=created_at.desc&limit=200", { token: session.token })).map(fromAppRow);
  } else {
    rows = read(LOCAL_APPS, []).map((a) => ({ ...a, status: a.status || "pending" })).reverse();
  }
  const rank = { pending: 0, approved: 1, declined: 1 };
  return rows.sort((a, b) => rank[a.status] - rank[b.status] || (a.at < b.at ? 1 : -1));
}

/** Folio team: approve or decline. Approving turns the applicant into a curator (server-side function; the browser cannot grant roles). */
export async function decideApplication(session, id, approve) {
  if (REMOTE && !session.local) {
    try { await rest("rpc/decide_application", { method: "POST", token: session.token, body: { p_id: id, p_approve: approve } }); }
    catch (e) {
      const m = /Already decided/.test(e.message) ? "Someone on the team has already decided this one." : /cannot decide your own/.test(e.message) ? "You can't decide your own application." : /Only the Folio team/.test(e.message) ? "Only the Folio team can decide applications." : e.message;
      throw new ApiError(e.status, m);
    }
    return;
  }
  const all = read(LOCAL_APPS, []);
  const a = all.find((x) => x.id === id);
  if (!a) throw new ApiError(404, "Application not found.");
  if ((a.status || "pending") !== "pending") throw new ApiError(409, "Already decided.");
  a.status = approve ? "approved" : "declined";
  write(LOCAL_APPS, all);
  if (approve && a.applicantId) write(LOCAL_APPROVED, [...new Set([...read(LOCAL_APPROVED, []), a.applicantId])]);
}

/** Delete the signed-in account and the data tied to it. Curators and the team are asked to contact the team (published Editions stay in the archive). */
export async function deleteAccount(session) {
  if (REMOTE && !session.local) {
    try { await rest("rpc/delete_my_account", { method: "POST", token: session.token, body: {} }); }
    catch (e) { throw new ApiError(e.status, /Curators and the Folio team/.test(e.message) ? "Curators and the Folio team: ask the team to remove your account, so published Editions stay intact." : "Couldn't delete the account. Try again, or ask the team."); }
    return;
  }
  if (session.role === "curator" || isLocalApproved(session.id)) throw new ApiError(403, "Curators: ask the team to remove your account, so published Editions stay intact.");
  const accounts = read(LOCAL_ACCOUNTS, {});
  for (const k of Object.keys(accounts)) if (accounts[k].id === session.id) delete accounts[k];
  write(LOCAL_ACCOUNTS, accounts);
  for (const [key, field] of [[LOCAL_BIO, null], [LOCAL_AVATAR, null]]) { const all = read(key, {}); delete all[session.id]; write(key, all); }
  write(LOCAL_CONN, read(LOCAL_CONN, []).filter((c) => c.fanId !== session.id && c.artistId !== session.id));
  write(LOCAL_APPS, read(LOCAL_APPS, []).filter((a) => a.applicantId !== session.id));
}

// ───────────────────── ARTISTS and FANS (connection) ─────────────────────
// A fan connects to an artist. The artist can see who connected (the fan chooses this),
// and connected fans see the artist's short dispatches and may ask one question a day.
// There are no public follower counts and no open messaging.
const LOCAL_CONN = "folio_v2_local_connections";   // [{ fanId, artistId, at }]
const LOCAL_DISP = "folio_v2_local_dispatches";
const LOCAL_Q = "folio_v2_local_questions";
export const DEMO_ARTIST = { id: "demo-artist", name: "Demo Artist (example)", suburb: "", bio: "An example artist so the demo has someone to connect to. Not a real person." };
const isRealId = (id) => REMOTE && !String(id).startsWith("local-") && id !== DEMO_ARTIST.id;
const DEMO_DISPATCH = { id: "demo-d1", artistId: DEMO_ARTIST.id, artistName: DEMO_ARTIST.name, body: "Example dispatch: rehearsing a new song tonight. Real artists post here.", link: "", at: "2026-01-01T00:00:00Z", example: true };

export async function listArtists(cityId = "brisbane") {
  let real = [];
  if (REMOTE) {
    try { real = await rest(`profiles?role=eq.artist&city=eq.${cityId}&select=id,name,suburb,bio&order=name.asc`); } catch {}
  }
  const local = Object.values(read("folio_v2_accounts", {})).filter((a) => a.role === "artist" && (a.city || "brisbane") === cityId)
    .map((a) => ({ id: a.id, name: a.name, suburb: a.suburb || "", bio: read(LOCAL_BIO, {})[a.id] || "" }));
  return [...real, ...local, ...(REMOTE ? [] : [DEMO_ARTIST])];
}

export async function listMyConnections(session) {
  if (!session) return [];
  if (isRealId(session.id) && !session.local) {
    try { return (await rest(`connections?fan_id=eq.${session.id}&select=artist_id`, { token: session.token })).map((r) => r.artist_id); } catch { return []; }
  }
  return read(LOCAL_CONN, []).filter((c) => c.fanId === session.id).map((c) => c.artistId);
}

export async function connectArtist(session, artistId) {
  if (!session) throw new ApiError(401, "Join Folio to connect with an artist.");
  if (REMOTE && !session.local && isRealId(artistId)) {
    await rest("connections", { method: "POST", token: session.token, body: { fan_id: session.id, artist_id: artistId }, prefer: "resolution=ignore-duplicates" });
    return;
  }
  const all = read(LOCAL_CONN, []);
  if (!all.some((c) => c.fanId === session.id && c.artistId === artistId)) all.push({ fanId: session.id, fanName: session.name, artistId, at: new Date().toISOString() });
  write(LOCAL_CONN, all);
}

export async function disconnectArtist(session, artistId) {
  if (REMOTE && !session.local && isRealId(artistId)) {
    await rest(`connections?fan_id=eq.${session.id}&artist_id=eq.${artistId}`, { method: "DELETE", token: session.token });
    return;
  }
  write(LOCAL_CONN, read(LOCAL_CONN, []).filter((c) => !(c.fanId === session.id && c.artistId === artistId)));
}

/** Dispatches from artists the viewer is connected to (and the artist's own). Newest first. */
export async function listDispatches(session) {
  if (!session) return [];
  let rows = [];
  if (REMOTE && !session.local) {
    try {
      rows = (await rest("dispatches?select=*&order=created_at.desc&limit=50", { token: session.token }))
        .map((r) => ({ id: r.id, artistId: r.artist_id, artistName: r.artist_name, body: r.body, link: r.link, at: r.created_at }));
    } catch {}
  }
  const mine = new Set(read(LOCAL_CONN, []).filter((c) => c.fanId === session.id).map((c) => c.artistId));
  const local = read(LOCAL_DISP, []).filter((d) => mine.has(d.artistId) || d.artistId === session.id);
  const demo = mine.has(DEMO_ARTIST.id) ? [DEMO_DISPATCH] : [];
  return [...rows, ...local, ...demo].sort((a, b) => (a.at < b.at ? 1 : -1));
}

export async function postDispatch(session, { body, link }) {
  const text = (body || "").trim().slice(0, 280);
  if (!text) throw new ApiError(400, "Write a short update first.");
  if (link && !/^https?:\/\//i.test(link.trim())) throw new ApiError(400, "A link must start with http:// or https://");
  if (REMOTE && !session.local) {
    await rest("dispatches", { method: "POST", token: session.token, body: { artist_id: session.id, artist_name: session.name, body: text, link: (link || "").trim() } });
    return;
  }
  const all = read(LOCAL_DISP, []);
  all.unshift({ id: "d" + Date.now(), artistId: session.id, artistName: session.name, body: text, link: (link || "").trim(), at: new Date().toISOString() });
  write(LOCAL_DISP, all);
}

/** Artist: who has connected. Names only, no counts shown in the UI. */
export async function listFans(session) {
  if (REMOTE && !session.local) {
    try { return (await rest(`connections?artist_id=eq.${session.id}&select=fan_id,created_at,fan:profiles!fan_id(name)&order=created_at.desc`, { token: session.token })).map((r) => ({ id: r.fan_id, name: r.fan?.name || "A fan", at: r.created_at })); } catch { return []; }
  }
  return read(LOCAL_CONN, []).filter((c) => c.artistId === session.id).map((c) => ({ id: c.fanId, name: c.fanName || "A fan", at: c.at }));
}

const sameDay = (a, b) => Date.now() - new Date(a).getTime() < 24 * 3600 * 1000 && b;
export async function askQuestion(session, artistId, body) {
  const text = (body || "").trim().slice(0, 200);
  if (!text) throw new ApiError(400, "Write your question first.");
  if (REMOTE && !session.local && isRealId(artistId)) {
    try { await rest("questions", { method: "POST", token: session.token, body: { fan_id: session.id, fan_name: session.name, artist_id: artistId, body: text } }); }
    catch (e) { throw new ApiError(e.status, e.status === 403 || e.status === 401 || /row-level/.test(e.message) ? "One question a day per artist, and you need to be connected first." : e.message); }
    return;
  }
  const all = read(LOCAL_Q, []);
  if (all.some((q) => q.fanId === session.id && q.artistId === artistId && sameDay(q.at, true))) throw new ApiError(429, "One question a day per artist.");
  all.unshift({ id: "q" + Date.now(), fanId: session.id, fanName: session.name, artistId, body: text, answer: null, at: new Date().toISOString() });
  write(LOCAL_Q, all);
}

/** Fan: my questions and any replies. Artist: questions sent to me. */
export async function listQuestions(session, as = "fan") {
  if (REMOTE && !session.local) {
    try {
      const col = as === "artist" ? "artist_id" : "fan_id";
      return (await rest(`questions?${col}=eq.${session.id}&select=*&order=created_at.desc&limit=50`, { token: session.token }))
        .map((r) => ({ id: r.id, fanName: r.fan_name, artistId: r.artist_id, body: r.body, answer: r.answer, at: r.created_at }));
    } catch { return []; }
  }
  const all = read(LOCAL_Q, []);
  return as === "artist" ? all.filter((q) => q.artistId === session.id) : all.filter((q) => q.fanId === session.id);
}

export async function answerQuestion(session, id, answer) {
  const text = (answer || "").trim().slice(0, 300);
  if (!text) throw new ApiError(400, "Write a reply first.");
  if (REMOTE && !session.local) {
    await rest(`questions?id=eq.${id}`, { method: "PATCH", token: session.token, body: { answer: text, answered_at: new Date().toISOString() } });
    return;
  }
  write(LOCAL_Q, read(LOCAL_Q, []).map((q) => (q.id === id ? { ...q, answer: text } : q)));
}

// ───────────────────── PRESENCE ("reading now") ─────────────────────
// Needs supabase/migrations/004_presence.sql. Anonymous: a random per-page-load id and an Edition id go in, a number comes out.
export async function heartbeatReading(editionId, clientId) {
  if (!REMOTE) return 0;
  const n = await rest("rpc/heartbeat_reading", { method: "POST", body: { p_edition: editionId, p_client: clientId } });
  return Number(n) || 0;
}
