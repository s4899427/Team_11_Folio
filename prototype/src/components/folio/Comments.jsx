import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { listComments, addComment, REMOTE } from "@/lib/api";
import { pollInterval, newCommentIds } from "@/lib/live";
import { useFolio } from "@/lib/folio-store";

export default function Comments({ editionId, locked }) {
  const { session } = useFolio();
  const qc = useQueryClient();
  const [text, setText] = useState("");
  const [err, setErr] = useState("");
  const [fresh, setFresh] = useState([]);
  const seen = useRef(null);
  const live = pollInterval({ remote: REMOTE, locked }) !== false;

  // Near-live: while the Edition is open, re-check every few seconds (paused when the tab is hidden).
  // strict: a failed refresh keeps the comments already on screen instead of blanking them.
  const { data: loaded, isError, isSuccess } = useQuery({
    queryKey: ["comments", editionId],
    queryFn: () => listComments(editionId, { strict: REMOTE }),
    refetchInterval: pollInterval({ remote: REMOTE, locked }),
  });
  const data = loaded || [];

  // A different Edition starts a fresh baseline, so its existing comments are not flagged as new.
  useEffect(() => { seen.current = null; setFresh([]); }, [editionId]);

  // Highlight comments that arrive after the first load so a second person's comment is noticed.
  useEffect(() => {
    if (!isSuccess) return undefined;
    const added = newCommentIds(seen.current, data);
    seen.current = new Set(data.map((c) => c.id));
    if (!added.length) return undefined;
    setFresh((f) => [...f, ...added]);
    // No cleanup on purpose: a later batch must not cancel this batch's fade-out.
    setTimeout(() => setFresh((f) => f.filter((id) => !added.includes(id))), 6000);
    return undefined;
  }, [loaded, isSuccess]);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await addComment(session, editionId, text);
      setText("");
      qc.invalidateQueries({ queryKey: ["comments", editionId] });
    } catch (e2) {
      setErr(e2.status === 401 ? "Your session expired. Log in again to comment." : e2.message);
    }
  };

  return (
    <section id="discussion" className="mt-12 border-t border-border pt-6 scroll-mt-16" data-testid="comments">
      <span className="folio-eyebrow text-folio-cream-dim">Discussion</span>
      <p className="text-xs text-folio-cream-dim/70 mt-1">Oldest first. Comments don't change what anyone sees.</p>
      {live && <p data-testid="comments-live" className="text-[0.65rem] text-folio-cream-dim/70 mt-1">New comments appear here within a few seconds. No need to refresh.</p>}
      <ul className="mt-4 space-y-4" aria-live="polite">
        {data.length === 0 && !isError && <li className="text-sm text-folio-cream-dim/70">No comments yet.</li>}
        {data.length === 0 && isError && <li className="text-sm text-folio-cream-dim/70">Can't load comments right now. Check your connection.</li>}
        {data.map((c) => (
          <li key={c.id} data-testid="comment" className={fresh.includes(c.id) ? "border-l-2 border-folio-saffron pl-3 -ml-3 transition-colors" : undefined}>
            <span className="text-xs text-folio-saffron">{c.author}</span>
            {fresh.includes(c.id) && <span className="folio-eyebrow text-folio-saffron ml-2">New</span>}
            <p className="text-sm text-folio-cream mt-0.5 leading-relaxed">{c.body}</p>
          </li>
        ))}
      </ul>
      {locked ? (
        <p className="text-xs text-folio-cream-dim/70 mt-4">This Edition is locked. It is read-only.</p>
      ) : session ? (
        <form onSubmit={submit} className="mt-4 flex gap-2">
          <input value={text} onChange={(e) => setText(e.target.value)} maxLength={500} placeholder="Add a comment" aria-label="Add a comment" className="flex-1 bg-transparent border border-border p-3 text-sm text-folio-cream placeholder:text-folio-cream-dim/50 focus:outline-none focus:border-folio-saffron/40" />
          <button type="submit" disabled={!text.trim()} className="px-4 bg-folio-cream text-folio-ink folio-eyebrow disabled:opacity-40">Post</button>
        </form>
      ) : (
        <p className="text-sm text-folio-cream-dim mt-4"><Link to="/register" className="text-folio-saffron hover:underline">Join as a guest</Link> or <Link to="/login" className="text-folio-saffron hover:underline">log in</Link> to join the discussion.</p>
      )}
      {err && <p className="text-xs text-folio-burgundy mt-2">{err}</p>}
    </section>
  );
}
