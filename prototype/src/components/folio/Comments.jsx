import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { listComments, addComment } from "@/lib/api";
import { useFolio } from "@/lib/folio-store";

export default function Comments({ editionId, locked }) {
  const { session } = useFolio();
  const qc = useQueryClient();
  const [text, setText] = useState("");
  const [err, setErr] = useState("");
  const { data = [] } = useQuery({ queryKey: ["comments", editionId], queryFn: () => listComments(editionId) });

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
      <ul className="mt-4 space-y-4">
        {data.length === 0 && <li className="text-sm text-folio-cream-dim/70">No comments yet.</li>}
        {data.map((c) => (
          <li key={c.id}>
            <span className="text-xs text-folio-saffron">{c.author}</span>
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
