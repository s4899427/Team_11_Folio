// Live check of a real Supabase project: node supabase/smoke_test.mjs
//   VITE_SUPABASE_URL=https://xxxx.supabase.co VITE_SUPABASE_ANON_KEY=eyJ... \
//   CURATOR_EMAIL=you@x.com CURATOR_PASSWORD=... node supabase/smoke_test.mjs
// CURATOR_* is an account you already promoted with: update public.profiles set role='curator' where id='...';
// The anon key is public by design. NEVER pass the service_role key here.
// It creates throwaway guest accounts and one test comment/back; use a test project, not a project with real data.
const URL_ = (process.env.VITE_SUPABASE_URL || "").replace(/\/$/, "");
const KEY = process.env.VITE_SUPABASE_ANON_KEY || "";
if (!URL_ || !KEY) { console.error("Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."); process.exit(2); }
if (/service_role/.test(Buffer.from(KEY.split(".")[1] || "", "base64").toString())) { console.error("That is a service_role key. Use the anon key."); process.exit(2); }

let failed = 0;
const check = (name, ok, extra = "") => { console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok ? "" : "  " + extra}`); if (!ok) failed++; };
const rid = () => Math.random().toString(36).slice(2, 8);

async function req(path, { method = "GET", body, token, prefer } = {}) {
  const r = await fetch(`${URL_}${path}`, {
    method,
    headers: { apikey: KEY, Authorization: `Bearer ${token || KEY}`, "Content-Type": "application/json", ...(prefer ? { Prefer: prefer } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await r.text(); let json; try { json = JSON.parse(text); } catch { json = text; }
  return { status: r.status, ok: r.ok, json };
}
async function signUp(name, role) {
  const email = `smoke-${rid()}@folio-guest.example.com`, password = "Smoke-" + rid() + rid();
  const r = await req("/auth/v1/signup", { method: "POST", body: { email, password, data: { name, city: "brisbane", suburb: "", role } } });
  return { email, password, token: r.json.access_token, id: r.json.user?.id, name, status: r.status, raw: r.json };
}
const login = async (email, password) => { const r = await req("/auth/v1/token?grant_type=password", { method: "POST", body: { email, password } }); return { token: r.json.access_token, id: r.json.user?.id }; };

const A = await signUp("Smoke A", "listener");
const B = await signUp("Smoke B", "listener");
check("sign up returns a session (Confirm email must be OFF)", !!A.token && !!B.token, JSON.stringify(A.raw).slice(0, 160));
if (!A.token || !B.token) { console.log("Turn off Authentication > Providers > Email > Confirm email, then rerun."); process.exit(1); }

const cities = await req("/rest/v1/cities?select=id", { token: A.token });
check("cities readable (brisbane, seoul, mumbai)", cities.ok && cities.json.length >= 3, JSON.stringify(cities.json).slice(0, 120));

// Row-level security
const promote = await req(`/rest/v1/profiles?id=eq.${A.id}`, { method: "PATCH", token: A.token, body: { role: "curator" }, prefer: "return=representation" });
const prof = await req(`/rest/v1/profiles?id=eq.${A.id}&select=role`, { token: A.token });
check("a listener cannot promote themselves to curator", prof.json?.[0]?.role === "listener", `${promote.status} ${JSON.stringify(promote.json).slice(0, 100)}`);
const bad = await req("/rest/v1/editions", { method: "POST", token: A.token, body: { city: "brisbane", edition_date: "2099-01-01", title: "x", items: [1, 2, 3, 4, 5], curator_id: A.id, curator_name: "x" } });
check("a listener cannot publish an Edition", !bad.ok, `${bad.status}`);
const anonPitches = await req("/rest/v1/pitches?select=*");
check("pitches are not readable without signing in", !anonPitches.ok || (Array.isArray(anonPitches.json) && anonPitches.json.length === 0));

// Needs a curator
const CE = process.env.CURATOR_EMAIL, CP = process.env.CURATOR_PASSWORD;
if (!CE || !CP) {
  console.log("\nSKIP  curator checks: set CURATOR_EMAIL and CURATOR_PASSWORD (a promoted account) to test publish, comments, discovery and backs.");
} else {
  const C = await login(CE, CP);
  const me = await req(`/rest/v1/profiles?id=eq.${C.id}&select=role,name,city`, { token: C.token });
  check("curator account is really a curator", me.json?.[0]?.role === "curator", JSON.stringify(me.json));
  const cname = me.json?.[0]?.name || "Curator";
  const today = (await req("/rest/v1/rpc/city_today", { method: "POST", token: C.token, body: { p_city: "brisbane" } })).json;
  const items = Array.from({ length: 5 }, (_, i) => ({
    id: "s" + i, kind: "track", title: "Smoke " + i, artist: "Smoke Band", year: 2020, why: "Smoke test.", stage: i === 0 ? "emerging" : "established", origin: "local",
    linerNote: { text: "A smoke-test fact for the check.", sourceLabel: "Example", sourceUrl: "https://example.com/" },
  }));
  // Use a unique far-future date so we do not collide with a real Edition; today's Edition is tested only if free.
  const day = typeof today === "string" ? today : new Date().toISOString().slice(0, 10);
  const ed = await req("/rest/v1/editions", { method: "POST", token: C.token, prefer: "return=representation", body: { city: "brisbane", edition_date: day, title: "Smoke test " + rid(), items, curator_id: C.id, curator_name: cname } });
  const claimed = ed.status === 409;
  check("curator can publish today's Edition (or today is already claimed)", ed.ok || claimed, `${ed.status} ${JSON.stringify(ed.json).slice(0, 140)}`);
  let editionId = ed.ok ? ed.json[0].id : null;
  if (!editionId) { const ex = await req(`/rest/v1/editions?edition_date=eq.${day}&city=eq.brisbane&select=id,curator_id`, { token: A.token }); editionId = ex.json?.[0]?.id; }
  if (editionId) {
    const dup = await req("/rest/v1/editions", { method: "POST", token: C.token, body: { city: "brisbane", edition_date: day, title: "Dup", items, curator_id: C.id, curator_name: cname } });
    check("a second Edition for the same city and day is refused", dup.status === 409, `${dup.status}`);
    const seen = await req(`/rest/v1/editions?id=eq.${editionId}&select=id`, { token: B.token });
    check("phone B can read the Edition", seen.ok && seen.json.length === 1);
    const text = "Smoke comment " + rid();
    const cm = await req("/rest/v1/comments", { method: "POST", token: A.token, body: { edition_id: editionId, author_id: A.id, author_name: A.name, body: text } });
    check("phone A can comment on today's Edition", cm.ok, `${cm.status} ${JSON.stringify(cm.json).slice(0, 100)}`);
    const list = await req(`/rest/v1/comments?edition_id=eq.${editionId}&select=body&order=created_at.asc`, { token: B.token });
    check("phone B sees A's comment", list.ok && list.json.some((c) => c.body === text));
    const spoof = await req("/rest/v1/comments", { method: "POST", token: A.token, body: { edition_id: editionId, author_id: B.id, author_name: "Smoke B", body: "spoof" } });
    check("cannot comment as someone else", !spoof.ok, `${spoof.status}`);
    const d1 = await req("/rest/v1/discovery", { method: "POST", token: A.token, body: { edition_id: editionId, voter_id: A.id, found_new: true } });
    check("reader can answer the Discovery check once", d1.ok, `${d1.status} ${JSON.stringify(d1.json).slice(0, 100)}`);
    const d2 = await req("/rest/v1/discovery", { method: "POST", token: A.token, body: { edition_id: editionId, voter_id: A.id, found_new: false } });
    check("a second Discovery answer is refused", !d2.ok, `${d2.status}`);
    const own = await req("/rest/v1/discovery", { method: "POST", token: C.token, body: { edition_id: editionId, voter_id: C.id, found_new: true } });
    check("a curator cannot answer their own Edition", !own.ok, `${own.status}`);
    const month = new Date().toISOString().slice(0, 7);
    const b1 = await req("/rest/v1/backs", { method: "POST", token: B.token, body: { voter_id: B.id, curator_id: C.id, month } });
    check("reader can back a curator", b1.ok, `${b1.status} ${JSON.stringify(b1.json).slice(0, 100)}`);
    const b2 = await req("/rest/v1/backs", { method: "POST", token: B.token, body: { voter_id: B.id, curator_id: C.id, month } });
    check("same curator twice in a month is refused", !b2.ok, `${b2.status}`);
    const self = await req("/rest/v1/backs", { method: "POST", token: C.token, body: { voter_id: C.id, curator_id: C.id, month } });
    check("cannot back yourself", !self.ok, `${self.status}`);
    const st = await req("/rest/v1/rpc/curator_stats", { method: "POST", token: C.token, body: { p_curator: C.id } });
    check("curator_stats returns numbers", st.ok && typeof st.json === "object", `${st.status} ${JSON.stringify(st.json).slice(0, 100)}`);
  }
  // Pitch flow
  const P = await signUp("Smoke Artist", "artist");
  const pt = await req("/rest/v1/pitches", { method: "POST", token: P.token, body: { artist_id: P.id, artist_name: P.name, curator_id: C.id, title: "Smoke track", link: "https://example.com/t", note: "x" } });
  check("an artist can send a pitch", pt.ok, `${pt.status} ${JSON.stringify(pt.json).slice(0, 100)}`);
  const inbox = await req(`/rest/v1/pitches?curator_id=eq.${C.id}&select=title`, { token: C.token });
  check("the curator sees the pitch", inbox.ok && inbox.json.some((p) => p.title === "Smoke track"));
  // Artist and fan connection
  const F = await signUp("Smoke Fan", "listener");
  const notArtist = await req("/rest/v1/connections", { method: "POST", token: F.token, body: { fan_id: F.id, artist_id: C.id } });
  check("cannot connect to a non-artist", !notArtist.ok, `${notArtist.status}`);
  const dp = await req("/rest/v1/dispatches", { method: "POST", token: P.token, body: { artist_id: P.id, artist_name: P.name, body: "Smoke update" } });
  check("an artist can post an update", dp.ok, `${dp.status} ${JSON.stringify(dp.json).slice(0, 100)}`);
  const before = await req("/rest/v1/dispatches?select=body", { token: F.token });
  check("an unconnected fan cannot see updates", before.ok && before.json.length === 0, JSON.stringify(before.json).slice(0, 80));
  const cn = await req("/rest/v1/connections", { method: "POST", token: F.token, body: { fan_id: F.id, artist_id: P.id } });
  check("a fan can connect to an artist", cn.ok, `${cn.status} ${JSON.stringify(cn.json).slice(0, 100)}`);
  const after = await req("/rest/v1/dispatches?select=body", { token: F.token });
  check("a connected fan sees the update", after.ok && after.json.some((d) => d.body === "Smoke update"));
  const seeFan = await req(`/rest/v1/connections?artist_id=eq.${P.id}&select=fan_id`, { token: P.token });
  check("the artist sees who connected", seeFan.ok && seeFan.json.some((r) => r.fan_id === F.id));
  const q1 = await req("/rest/v1/questions", { method: "POST", token: F.token, body: { fan_id: F.id, fan_name: F.name, artist_id: P.id, body: "Smoke question?" }, prefer: "return=representation" });
  check("a connected fan can ask a question", q1.ok, `${q1.status} ${JSON.stringify(q1.json).slice(0, 100)}`);
  const q2 = await req("/rest/v1/questions", { method: "POST", token: F.token, body: { fan_id: F.id, fan_name: F.name, artist_id: P.id, body: "Another?" } });
  check("a second question the same day is refused", !q2.ok, `${q2.status}`);
  const qid = q1.ok ? q1.json[0]?.id : null;
  if (qid) {
    const fanAns = await req(`/rest/v1/questions?id=eq.${qid}`, { method: "PATCH", token: F.token, body: { answer: "self" }, prefer: "return=representation" });
    check("a fan cannot answer their own question", !fanAns.ok || (Array.isArray(fanAns.json) && fanAns.json.length === 0), `${fanAns.status}`);
    const ans = await req(`/rest/v1/questions?id=eq.${qid}`, { method: "PATCH", token: P.token, body: { answer: "Smoke reply", answered_at: new Date().toISOString() }, prefer: "return=representation" });
    check("the artist can answer", ans.ok && ans.json.length === 1, `${ans.status} ${JSON.stringify(ans.json).slice(0, 100)}`);
    const seeReply = await req(`/rest/v1/questions?id=eq.${qid}&select=answer`, { token: F.token });
    check("the asker sees the reply", seeReply.ok && seeReply.json[0]?.answer === "Smoke reply");
    const other = await req(`/rest/v1/questions?id=eq.${qid}&select=answer`, { token: B.token });
    check("another user cannot see the question", other.ok && other.json.length === 0);
  }
  const peek = await req(`/rest/v1/pitches?select=title`, { token: B.token });
  check("a listener cannot read pitches", peek.ok && peek.json.length === 0, JSON.stringify(peek.json).slice(0, 80));
}

console.log(failed ? `\n${failed} check(s) FAILED` : "\nAll checks passed");
process.exit(failed ? 1 : 0);
