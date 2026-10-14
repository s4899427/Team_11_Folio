import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, X, ExternalLink } from "lucide-react";
import { listEditions, saveEdition, listPitches, addGigTip, getCuratorStats, saveBio, listCurators } from "@/lib/api";
import { CITIES } from "@/lib/cities";
import { tierFor, discoveryRate, TIERS, MIN_RESPONSES_TO_SHOW } from "@/lib/standing";
import { cityToday, addDays, formatLong, formatShort } from "@/lib/time";
import { validateEdition, emptyItem, emptyEvidence, ARTIST_PAGE_TYPES, MAX_ITEMS, MAX_DAYS_AHEAD } from "@/lib/validate";
import { useFolio } from "@/lib/folio-store";
import EditionView from "@/components/folio/EditionView";

const field = "w-full bg-transparent border border-border p-3 text-sm text-folio-cream placeholder:text-folio-cream-dim/50 focus:outline-none focus:border-folio-saffron/40";

export default function Studio() {
  const { session, isCurator, city } = useFolio();
  const qc = useQueryClient();
  // Approved curators publish for their own city (the database enforces it); in demo mode, the city you chose.
  const pubCity = session && !session.local ? (CITIES[session.city] || city) : city;
  const today = cityToday(pubCity.tz);
  const { data } = useQuery({ queryKey: ["editions", session?.id ?? "guest", pubCity.id], queryFn: () => listEditions(session, pubCity.id) });
  const { data: pitches = [] } = useQuery({ queryKey: ["pitches", session?.id], queryFn: () => listPitches(session), enabled: !!session && isCurator, refetchOnMount: "always", refetchInterval: 20000 });

  const [ed, setEd] = useState({ id: null, date: addDays(today, 1), title: "", blurb: "", items: Array.from({ length: 8 }, emptyItem) });
  const [errors, setErrors] = useState([]);
  const [preview, setPreview] = useState(false);
  const [status, setStatus] = useState("");

  if (!session || !isCurator) {
    return <div className="max-w-lg mx-auto px-5 pt-8"><p className="text-sm text-folio-cream-dim">The Curator Studio is for approved curators. <Link to="/me" className="text-folio-saffron">Back to Me</Link></p></div>;
  }

  const editions = data?.editions || [];
  // Built-in founding Editions are placeholders, not claims: only real curators' Editions block a day.
  const takenDates = editions.filter((e) => e.curatorId !== session.id && !e.seed).map((e) => e.date);
  const mineUpcoming = editions.filter((e) => e.curatorId === session.id && e.date >= today && !e.seed);
  const dateOptions = Array.from({ length: MAX_DAYS_AHEAD + 1 }, (_, i) => addDays(today, i));

  const setItem = (i, patch) => setEd((x) => ({ ...x, items: x.items.map((it, n) => (n === i ? { ...it, ...patch } : it)) }));
  const setEv = (i, patch) => setEd((x) => ({ ...x, items: x.items.map((it, n) => (n === i ? { ...it, evidence: { ...emptyEvidence(), ...it.evidence, ...patch } } : it)) }));
  const setLiner = (i, patch) => setEd((x) => ({ ...x, items: x.items.map((it, n) => (n === i ? { ...it, linerNote: { ...it.linerNote, ...patch } } : it)) }));

  const publish = async () => {
    setStatus("");
    const errs = validateEdition(ed, { today, takenDates });
    setErrors(errs);
    if (errs.length) return;
    try {
      const items = ed.items.map((it) => ({ ...it, year: it.year ? Number(it.year) : null }));
      const saved = await saveEdition(session, { ...ed, city: pubCity.id, items });
      qc.invalidateQueries({ queryKey: ["editions"] });
      setEd((x) => ({ ...x, id: saved.id }));
      setStatus(`Published for ${formatLong(saved.date)}.${saved.date === today ? " It is live on Today now." : ` It will go live at midnight ${pubCity.name} time.`}`);
    } catch (e) {
      setErrors([e.status === 401 ? "Your session expired. Log in again to publish." : e.message]);
    }
  };

  const loadMine = (e) => setEd({ id: e.id, date: e.date, title: e.title, blurb: e.blurb || "", items: e.items.map((it) => ({ ...it, year: it.year ?? "" })) });

  return (
    <div className="max-w-lg mx-auto px-5 pt-8" data-testid="studio">
      <Link to="/me" className="inline-flex items-center gap-1.5 text-xs text-folio-cream-dim hover:text-folio-cream mb-6"><ArrowLeft className="w-3.5 h-3.5" /> Me</Link>
      <span className="folio-eyebrow text-folio-burgundy">Curator Studio</span>
      <h1 className="folio-serif text-4xl text-folio-cream mt-3">Build an Edition</h1>
      <p className="text-xs text-folio-saffron mt-2" data-testid="studio-city">Curating {pubCity.name}</p>
      <p className="text-sm text-folio-cream-dim mt-3 leading-relaxed">One Edition per day, 8 to 12 picks. Every pick needs a reason and a liner note with a source. No source, no publish.</p>

      {mineUpcoming.length > 0 && (
        <div className="mt-6 border border-border p-3">
          <p className="folio-eyebrow text-folio-cream-dim">Your upcoming Editions</p>
          {mineUpcoming.map((e) => <button key={e.id} onClick={() => loadMine(e)} className="block text-left text-sm text-folio-saffron mt-2 hover:underline">{formatShort(e.date)} · {e.title} (edit)</button>)}
        </div>
      )}

      <div className="mt-8 space-y-4">
        <label className="block"><span className="folio-eyebrow text-folio-cream-dim">Day</span>
          <select value={ed.date} onChange={(e) => setEd({ ...ed, date: e.target.value })} className={field + " mt-2 bg-folio-ink"} aria-label="Day">
            {dateOptions.map((d) => <option key={d} value={d} disabled={takenDates.includes(d)}>{formatLong(d)}{d === today ? " (today)" : ""}{takenDates.includes(d) ? " · claimed" : ""}</option>)}
          </select>
        </label>
        <input value={ed.title} onChange={(e) => setEd({ ...ed, title: e.target.value })} placeholder="Edition title" aria-label="Edition title" className={field} maxLength={80} />
        <input value={ed.blurb} onChange={(e) => setEd({ ...ed, blurb: e.target.value })} placeholder="One line on the theme (optional)" aria-label="Theme" className={field} maxLength={160} />
      </div>

      <div className="mt-8 space-y-8">
        {ed.items.map((it, i) => (
          <fieldset key={it.id} className="border border-border p-4 space-y-3" data-testid="pick-form">
            <legend className="px-2 folio-eyebrow text-folio-saffron">Pick {i + 1}</legend>
            {ed.items.length > 5 && <button type="button" aria-label={`Remove pick ${i + 1}`} onClick={() => setEd({ ...ed, items: ed.items.filter((_, n) => n !== i) })} className="float-right -mt-8 bg-folio-ink p-1"><X className="w-4 h-4 text-folio-cream-dim" /></button>}
            <div className="grid grid-cols-3 gap-2">
              <select value={it.kind} onChange={(e) => setItem(i, { kind: e.target.value })} aria-label={`Pick ${i + 1} type`} className={field + " bg-folio-ink col-span-1"}>
                {["track", "album", "artist", "place", "story"].map((k) => <option key={k}>{k}</option>)}
              </select>
              <input value={it.year} onChange={(e) => setItem(i, { year: e.target.value })} placeholder="Year" aria-label={`Pick ${i + 1} year`} inputMode="numeric" maxLength={4} className={field} />
            </div>
            {["track", "album", "artist"].includes(it.kind) && (
              <div className="grid grid-cols-2 gap-2">
                <select value={it.stage || "established"} onChange={(e) => setItem(i, { stage: e.target.value })} aria-label={`Pick ${i + 1} stage`} className={field + " bg-folio-ink"}>
                  <option value="established">Established or underrated</option>
                  <option value="emerging">New and upcoming</option>
                </select>
                <select value={it.origin || "local"} onChange={(e) => setItem(i, { origin: e.target.value })} aria-label={`Pick ${i + 1} origin`} className={field + " bg-folio-ink"}>
                  <option value="local">Based in {pubCity.name}</option>
                  <option value="national">Elsewhere in {pubCity.country}</option>
                  <option value="other">Outside {pubCity.country}</option>
                </select>
                {it.stage === "emerging" && (
                  <div className="col-span-2 space-y-2 border border-folio-saffron/40 bg-folio-saffron/5 p-3" data-testid={`evidence-${i}`}>
                    <p className="folio-eyebrow text-folio-saffron">Two sources for a new artist</p>
                    <div className="grid grid-cols-3 gap-2">
                      <select value={(it.evidence || {}).artistType || "soundcloud"} onChange={(e) => setEv(i, { artistType: e.target.value })} aria-label={`Pick ${i + 1} artist page type`} className={field + " bg-folio-ink"}>
                        {ARTIST_PAGE_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
                      </select>
                      <input value={(it.evidence || {}).artistUrl || ""} onChange={(e) => setEv(i, { artistUrl: e.target.value })} placeholder="1. Artist's own page link" aria-label={`Pick ${i + 1} artist page link`} className={field + " col-span-2"} />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <input value={(it.evidence || {}).thirdLabel || ""} onChange={(e) => setEv(i, { thirdLabel: e.target.value })} placeholder="2. Independent source name" aria-label={`Pick ${i + 1} independent source name`} className={field} />
                      <input value={(it.evidence || {}).thirdUrl || ""} onChange={(e) => setEv(i, { thirdUrl: e.target.value })} placeholder="Radio, venue, press or QMusic link" aria-label={`Pick ${i + 1} independent source link`} className={field + " col-span-2"} />
                    </div>
                    <input value={(it.evidence || {}).localNote || ""} onChange={(e) => setEv(i, { localNote: e.target.value })} maxLength={160} placeholder={`How do you know they're based in ${pubCity.name}?`} aria-label={`Pick ${i + 1} local note`} className={field} />
                    <label className="flex items-start gap-2 text-xs text-folio-cream-dim">
                      <input type="checkbox" className="mt-0.5" checked={!!(it.evidence || {}).attested} onChange={(e) => setEv(i, { attested: e.target.checked })} aria-label={`Pick ${i + 1} attestation`} /> I confirm this is human-made, local and new. I am accountable for this pick.
                    </label>
                    <label className="flex items-center gap-2 text-xs text-folio-cream-dim">
                      <input type="checkbox" checked={!!it.knowsArtist} onChange={(e) => setItem(i, { knowsArtist: e.target.checked })} /> I know this artist personally (shown to readers)
                    </label>
                  </div>
                )}
              </div>
            )}
            <input value={it.title} onChange={(e) => setItem(i, { title: e.target.value })} placeholder="Title" aria-label={`Pick ${i + 1} title`} className={field} />
            <input value={it.artist} onChange={(e) => setItem(i, { artist: e.target.value })} placeholder="Artist or place" aria-label={`Pick ${i + 1} artist`} className={field} />
            <textarea value={it.why} onChange={(e) => setItem(i, { why: e.target.value })} rows={2} maxLength={240} placeholder="Why it's here (your reason, in your words)" aria-label={`Pick ${i + 1} why`} className={field} />
            <textarea value={it.linerNote.text} onChange={(e) => setLiner(i, { text: e.target.value })} rows={2} maxLength={320} placeholder="Liner note: one checkable fact" aria-label={`Pick ${i + 1} liner note`} className={field} />
            <div className="grid grid-cols-2 gap-2">
              <input value={it.linerNote.sourceLabel} onChange={(e) => setLiner(i, { sourceLabel: e.target.value })} placeholder="Source name" aria-label={`Pick ${i + 1} source name`} className={field} />
              <input value={it.linerNote.sourceUrl} onChange={(e) => setLiner(i, { sourceUrl: e.target.value })} placeholder="Source link" aria-label={`Pick ${i + 1} source link`} className={field} />
            </div>
          </fieldset>
        ))}
        {ed.items.length < MAX_ITEMS && (
          <button type="button" onClick={() => setEd({ ...ed, items: [...ed.items, emptyItem()] })} className="w-full py-3 border border-dashed border-border text-sm text-folio-cream-dim inline-flex items-center justify-center gap-2"><Plus className="w-4 h-4" /> Add a pick</button>
        )}
      </div>

      {errors.length > 0 && (
        <ul role="alert" data-testid="studio-errors" className="mt-6 border border-folio-burgundy p-3 space-y-1">
          {errors.map((e, i) => <li key={i} className="text-xs text-folio-burgundy">{e}</li>)}
        </ul>
      )}
      {status && <p data-testid="studio-status" className="mt-6 text-sm text-folio-saffron">{status}</p>}

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button onClick={() => setPreview((p) => !p)} className="py-3.5 border border-border text-folio-cream folio-eyebrow">{preview ? "Hide preview" : "Preview"}</button>
        <button onClick={publish} data-testid="publish" className="py-3.5 bg-folio-cream text-folio-ink folio-eyebrow">Publish</button>
      </div>

      {preview && (
        <div className="mt-8 border-t border-border pt-8">
          <p className="folio-eyebrow text-folio-cream-dim mb-4">Preview</p>
          <EditionView edition={{ ...ed, id: "preview", curatorName: session.name, items: ed.items.map((it) => ({ ...it, year: it.year ? Number(it.year) : null })) }} locked />
        </div>
      )}

      <section className="mt-14 border-t border-border pt-8">
        <h2 className="folio-eyebrow text-folio-cream-dim">Pitches from artists</h2>
        <ul className="mt-3 space-y-3" data-testid="pitch-inbox">
          {pitches.length === 0 && <li className="text-sm text-folio-cream-dim/70">No pitches yet.</li>}
          {pitches.map((p) => (
            <li key={p.id} className="border border-border p-3">
              <p className="text-folio-cream">{p.title} <span className="text-xs text-folio-cream-dim">· {p.artistName}</span></p>
              {p.note && <p className="text-sm text-folio-cream-dim mt-1">{p.note}</p>}
              <a href={p.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-folio-saffron mt-2 hover:underline">Listen <ExternalLink className="w-3 h-3" /></a>
            </li>
          ))}
        </ul>
      </section>

      <StandingPanel session={session} city={pubCity} myCount={editions.filter((e) => e.curatorId === session.id && !e.seed).length} />
      <GigTipForm session={session} city={pubCity} />
    </div>
  );
}

function GigTipForm({ session, city }) {
  const qc = useQueryClient();
  const today = cityToday(city.tz);
  const [f, setF] = useState({ act: "", venue: "", date: today, time: "", link: "" });
  const [msg, setMsg] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await addGigTip(session, { ...f, city: city.id });
      setF({ act: "", venue: "", date: today, time: "", link: "" });
      setMsg("Tip added to Nearby.");
      qc.invalidateQueries({ queryKey: ["gig-tips"] });
    } catch (err) { setMsg(err.message); }
  };
  return (
    <section className="mt-12 border-t border-border pt-8 mb-6">
      <h2 className="folio-eyebrow text-folio-cream-dim">Add a gig tip to Nearby</h2>
      <p className="text-xs text-folio-cream-dim/70 mt-1">Only add gigs you have checked with the venue or promoter.</p>
      <form onSubmit={submit} className="mt-4 space-y-3">
        <input required value={f.act} onChange={(e) => setF({ ...f, act: e.target.value })} placeholder="Act" aria-label="Gig act" className={field} />
        <input required value={f.venue} onChange={(e) => setF({ ...f, venue: e.target.value })} placeholder="Venue" aria-label="Gig venue" className={field} />
        <div className="grid grid-cols-2 gap-2">
          <input required type="date" min={today} value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} aria-label="Gig date" className={field} />
          <input value={f.time} onChange={(e) => setF({ ...f, time: e.target.value })} placeholder="Time, e.g. 8pm" aria-label="Gig time" className={field} />
        </div>
        <input type="url" value={f.link} onChange={(e) => setF({ ...f, link: e.target.value })} placeholder="Link (venue or ticket page)" aria-label="Gig link" className={field} />
        <button type="submit" className="w-full py-3 border border-border text-folio-cream folio-eyebrow">Add tip</button>
        {msg && <p data-testid="tip-status" className="text-xs text-folio-saffron">{msg}</p>}
      </form>
    </section>
  );
}

function StandingPanel({ session, city, myCount }) {
  const qc = useQueryClient();
  const { data: stats } = useQuery({ queryKey: ["curator-stats", session.id, myCount], queryFn: () => getCuratorStats(session, session.id, myCount) });
  const { data: curators = [] } = useQuery({ queryKey: ["curators", city.id], queryFn: () => listCurators(city.id) });
  const mine = curators.find((c) => c.id === session.id);
  const [bio, setBio] = useState("");
  const [msg, setMsg] = useState("");
  const tier = tierFor({ ...(stats || {}), editions: myCount });
  const rate = stats ? discoveryRate(stats) : null;
  const next = TIERS[TIERS.findIndex((t) => t.id === tier.id) + 1];

  const save = async (e) => {
    e.preventDefault(); setMsg("");
    try { await saveBio(session, bio); qc.invalidateQueries({ queryKey: ["curators"] }); setMsg("Saved. It shows on your curator card."); }
    catch (err) { setMsg(err.message); }
  };

  return (
    <section className="mt-14 border-t border-border pt-8" data-testid="standing">
      <h2 className="folio-eyebrow text-folio-cream-dim">Your standing</h2>
      <p className="text-xs text-folio-cream-dim/70 mt-1 leading-relaxed">Shown as separate signals, not one score. Readers back curators and say whether an Edition showed them something new. Popularity isn't counted.</p>
      <dl className="grid grid-cols-2 gap-3 mt-4 text-xs">
        <div className="border border-border p-3"><dt className="text-folio-cream-dim">Tier</dt><dd className="text-folio-cream text-sm mt-0.5">{tier.label}</dd></div>
        <div className="border border-border p-3"><dt className="text-folio-cream-dim">Editions published</dt><dd className="text-folio-cream text-sm mt-0.5">{myCount}</dd></div>
        <div className="border border-border p-3"><dt className="text-folio-cream-dim">Found something new</dt><dd className="text-folio-cream text-sm mt-0.5">{rate === null ? `Needs ${MIN_RESPONSES_TO_SHOW}+ responses (${stats?.responses ?? 0} so far)` : `${Math.round(rate * 100)}% of ${stats.responses}`}</dd></div>
        <div className="border border-border p-3"><dt className="text-folio-cream-dim">People who back you</dt><dd className="text-folio-cream text-sm mt-0.5">{stats?.distinctBackers90 ?? "n/a"} (last 90 days, only you see this)</dd></div>
      </dl>
      {stats?.local && <p className="text-[0.65rem] text-folio-cream-dim/60 mt-2">Demo mode: these numbers come from this device only.</p>}
      {next && <p className="text-xs text-folio-cream-dim mt-3">Next tier, {next.label}: {next.rule}.</p>}
      <form onSubmit={save} className="mt-6 space-y-3">
        <textarea value={bio || mine?.bio || ""} onChange={(e) => setBio(e.target.value)} rows={3} maxLength={280} placeholder="Your curator bio (280 characters), shown on today's curator card" aria-label="Curator bio" className={field} />
        <button type="submit" className="w-full py-3 border border-border text-folio-cream folio-eyebrow">Save bio</button>
        {msg && <p data-testid="bio-status" className="text-xs text-folio-saffron">{msg}</p>}
      </form>
    </section>
  );
}
