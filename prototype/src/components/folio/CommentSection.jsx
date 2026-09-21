import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { useFolio } from "@/lib/folio-store";

export default function CommentSection({ targetId }) {
  const { getInteractions, addComment } = useFolio();
  const { comments } = getInteractions(targetId);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  const submit = () => {
    if (!text.trim()) return;
    addComment(targetId, text.trim());
    setText("");
  };

  return (
    <div>
      <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-1.5 text-xs text-folio-cream-dim hover:text-folio-cream transition-colors">
        <MessageCircle className="w-4 h-4" />
        <span>{comments.length}</span>
      </button>

      {open && (
        <div className="mt-3 space-y-3 animate-fade-in">
          {comments.map((c) => (
            <div key={c.id} className="text-xs">
              <span className="text-folio-cream font-semibold">{c.author}</span>
              <span className="text-folio-cream-dim"> · {c.date}</span>
              <p className="text-folio-cream-dim mt-0.5">{c.text}</p>
            </div>
          ))}
          <div className="flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="Add a comment…"
              className="flex-1 bg-transparent border border-border px-3 py-2 text-xs text-folio-cream placeholder:text-folio-cream-dim/50 focus:outline-none focus:border-folio-saffron/40"
            />
            <button onClick={submit} className="px-3 py-2 bg-folio-cream text-folio-ink text-xs folio-eyebrow hover:bg-white transition-colors">Post</button>
          </div>
        </div>
      )}
    </div>
  );
}
