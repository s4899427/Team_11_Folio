import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { listFans, postDispatch, listDispatches, listQuestions, answerQuestion, saveBio } from "@/lib/api";
import { useFolio } from "@/lib/folio-store";
import { formatShort } from "@/lib/time";

const field = "w-full bg-transparent border border-border p-3 text-sm text-folio-cream placeholder:text-folio-cream-dim/50 focus:outline-none focus:border-folio-saffron/40";

/** The artist's home: post short updates, see who connected, answer questions. */
export default function ArtistSpace() {
  const { session } = useFolio();
  const qc = useQueryClient();
  const [body, setBody] = useState(""); const [link, setLink] = useState("");
  const [bio, setBio] = useState(session?.bio || "");
  const [replies, setReplies] = useState({}); const [msg, setMsg] = useState("");
  const enabled = !!session && session.role === "artist";
  const { data: fans = [] } = useQuery({ queryKey: ["fans", session?.id], queryFn: () => listFans(session), enabled, refetchOnMount: "always" });
  const { data: qs = [] } = useQuery({ queryKey: ["aq", session?.id], queryFn: () => listQuestions(session, "artist"), enabled, refetchOnMount: "always", refetchInterval: 20000 });
  const { data: ds = [] } = useQuery({ queryKey: ["dispatches", session?.id], queryFn: () => listDispatches(session), enabled });
  if (!enabled) return <Navigate to="/me" replace />;
  const mineDs = ds.filter((d) => d.artistId === session.id);

  const run = async (fn, ok) => { setMsg(""); try { await fn(); setMsg(ok); } catch (e) { setMsg(e.message); } };
  const post = () => run(async () => { await postDispatch(session, { body, link }); setBody(""); setLink(""); qc.invalidateQueries({ queryKey: ["dispatches"] }); }, "Posted to your connected fans.");

  return (
    <div className="max-w-lg mx-auto px-5 pt-8 pb-10" data-testid="artist-space">
      <Link to="/me" className="folio-eyebrow text-folio-cream-dim">← Me</Link>
      <h1 className="folio-serif text-4xl text-folio-cream mt-4">Your space</h1>
      <p className="text-sm text-folio-cream-dim mt-2 leading-relaxed">Only fans who connected to you see your updates. There are no public counts, and no one can message you freely.</p>

      <section className="mt-8">
        <h2 className="folio-eyebrow text-folio-cream-dim">About you</h2>
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={2} maxLength={280} aria-label="Your bio" placeholder="A line about your music" className={field + " mt-3"} />
        <button onClick={() => run(() => saveBio(session, bio), "Saved.")} className="mt-2 px-4 py-2 border border-border folio-eyebrow text-folio-cream">Save bio</button>
      </section>

      <section className="mt-8">
        <h2 className="folio-eyebrow text-folio-cream-dim">Post an update</h2>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} maxLength={280} aria-label="Update" placeholder="Rehearsing tonight. New track Friday." className={field + " mt-3"} />
        <input value={link} onChange={(e) => setLink(e.target.value)} aria-label="Update link" placeholder="Link (optional)" className={field + " mt-2"} />
        <button onClick={post} disabled={!body.trim()} data-testid="post-dispatch" className="mt-2 px-4 py-2 bg-folio-cream text-folio-ink folio-eyebrow disabled:opacity-40">Post</button>
        <ul className="mt-4 space-y-2">{mineDs.slice(0, 5).map((d) => <li key={d.id} className="text-sm text-folio-cream-dim">{d.body}</li>)}</ul>
      </section>

      <section className="mt-8">
        <h2 className="folio-eyebrow text-folio-cream-dim">Questions from fans</h2>
        <div className="mt-3 space-y-4" data-testid="artist-questions">
          {qs.length === 0 && <p className="text-sm text-folio-cream-dim/70">No questions yet.</p>}
          {qs.map((q) => (
            <div key={q.id} className="border border-border p-3">
              <p className="text-sm text-folio-cream"><span className="text-folio-cream-dim">{q.fanName} asked:</span> {q.body}</p>
              {q.answer ? <p className="text-sm text-folio-cream-dim mt-2">You replied: {q.answer}</p> : (
                <>
                  <textarea value={replies[q.id] || ""} onChange={(e) => setReplies({ ...replies, [q.id]: e.target.value })} rows={2} maxLength={300} aria-label={`Reply to ${q.fanName}`} className={field + " mt-2"} />
                  <button onClick={() => run(async () => { await answerQuestion(session, q.id, replies[q.id]); qc.invalidateQueries({ queryKey: ["aq"] }); }, "Reply sent. Only they will see it.")} data-testid="reply-btn" className="mt-2 px-4 py-2 border border-border folio-eyebrow text-folio-cream">Reply privately</button>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="folio-eyebrow text-folio-cream-dim">Fans who connected</h2>
        <p className="text-xs text-folio-cream-dim/70 mt-1">They chose to share their name with you.</p>
        <ul className="mt-3 divide-y divide-border border-y border-border" data-testid="fan-list">
          {fans.length === 0 && <li className="py-3 text-sm text-folio-cream-dim/70">Nobody yet.</li>}
          {fans.map((f) => <li key={f.id} className="py-3 text-sm text-folio-cream">{f.name}<span className="text-xs text-folio-cream-dim"> · {formatShort(String(f.at).slice(0, 10))}</span></li>)}
        </ul>
      </section>

      <Link to="/pitch" className="block mt-8 px-4 py-3.5 border border-border text-folio-cream"><span className="folio-eyebrow">Pitch to a curator</span><span className="block text-xs text-folio-cream-dim mt-1">Send a track for a future Edition</span></Link>
      {msg && <p role="status" data-testid="artist-msg" className="mt-4 text-xs text-folio-cream-dim">{msg}</p>}
    </div>
  );
}
