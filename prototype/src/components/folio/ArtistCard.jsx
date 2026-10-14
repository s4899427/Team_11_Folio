import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { connectArtist, disconnectArtist, askQuestion, listQuestions, listDispatches } from "@/lib/api";
import { useFolio } from "@/lib/folio-store";
import { cn } from "@/lib/utils";

/** An artist you can connect to. Connecting is a private, opt-in link: the artist sees your name, nobody sees a count. */
export default function ArtistCard({ artist, connected }) {
  const { session } = useFolio();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const isMe = session?.id === artist.id;

  const { data: dispatches = [] } = useQuery({ queryKey: ["dispatches", session?.id], queryFn: () => listDispatches(session), enabled: !!session && connected, refetchOnMount: "always" });
  const { data: questions = [] } = useQuery({ queryKey: ["myq", session?.id], queryFn: () => listQuestions(session, "fan"), enabled: !!session && connected, refetchOnMount: "always" });
  const mine = dispatches.filter((d) => d.artistId === artist.id).slice(0, 3);
  const myQs = questions.filter((x) => x.artistId === artist.id).slice(0, 3);
  const refresh = () => { qc.invalidateQueries({ queryKey: ["connections"] }); qc.invalidateQueries({ queryKey: ["dispatches"] }); qc.invalidateQueries({ queryKey: ["myq"] }); };

  const toggle = async () => {
    setBusy(true); setMsg("");
    try { connected ? await disconnectArtist(session, artist.id) : await connectArtist(session, artist.id); refresh(); }
    catch (e) { setMsg(e.message); }
    setBusy(false);
  };
  const ask = async () => {
    setMsg(""); setBusy(true);
    try { await askQuestion(session, artist.id, q); setQ(""); setMsg("Sent. Only they will see it, and only you will see the reply."); refresh(); }
    catch (e) { setMsg(e.message); }
    setBusy(false);
  };

  return (
    <article className="border border-border p-4" data-testid="artist-card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="folio-serif text-xl text-folio-cream">{artist.name}</h3>
          {(artist.suburb || artist.bio) && <p className="text-xs text-folio-cream-dim mt-1 leading-relaxed">{[artist.suburb, artist.bio].filter(Boolean).join(" · ")}</p>}
        </div>
        {!isMe && (session
          ? <button onClick={toggle} disabled={busy} aria-pressed={connected} data-testid="connect-btn" className={cn("shrink-0 px-3 py-1.5 border folio-eyebrow", connected ? "border-folio-saffron text-folio-saffron" : "border-border text-folio-cream")}>{connected ? "Connected" : "Connect"}</button>
          : <Link to="/register" className="shrink-0 px-3 py-1.5 border border-border folio-eyebrow text-folio-cream">Join to connect</Link>)}
      </div>
      {!connected && !isMe && <p className="text-xs text-folio-cream-dim/70 mt-2">Connecting shows your name to the artist. It unlocks their updates and one question a day.</p>}
      {connected && (
        <div className="mt-4 space-y-3">
          {mine.length === 0 && <p className="text-xs text-folio-cream-dim">No updates yet.</p>}
          {mine.map((d) => (
            <p key={d.id} className="text-sm text-folio-cream leading-relaxed" data-testid="dispatch">
              {d.body}{d.example && <span className="text-xs text-folio-cream-dim"> (example)</span>}
              {d.link && <> <a href={d.link} target="_blank" rel="noreferrer" className="text-folio-saffron hover:underline">Listen</a></>}
            </p>
          ))}
          <button onClick={() => setOpen((o) => !o)} aria-expanded={open} className="folio-eyebrow text-folio-cream-dim">{open ? "Hide" : "Ask a question"}</button>
          {open && (
            <div className="space-y-2">
              <textarea value={q} onChange={(e) => setQ(e.target.value)} rows={2} maxLength={200} aria-label={`Question for ${artist.name}`} placeholder="One question a day. Be kind." className="w-full bg-transparent border border-border p-3 text-sm text-folio-cream focus:outline-none focus:border-folio-saffron/40" />
              <button onClick={ask} disabled={busy || !q.trim()} data-testid="ask-btn" className="px-4 py-2 bg-folio-cream text-folio-ink folio-eyebrow disabled:opacity-40">Send</button>
              {myQs.map((x) => (<p key={x.id} className="text-xs text-folio-cream-dim leading-relaxed" data-testid="my-question">You asked: {x.body}{x.answer ? <span className="block text-folio-cream mt-0.5" data-testid="reply">{artist.name.split(" ")[0]}: {x.answer}</span> : <span className="block">Waiting for a reply.</span>}</p>))}
            </div>
          )}
          {msg && <p role="status" className="text-xs text-folio-cream-dim">{msg}</p>}
        </div>
      )}
      {!connected && msg && <p role="status" className="text-xs text-folio-burgundy mt-2">{msg}</p>}
    </article>
  );
}
