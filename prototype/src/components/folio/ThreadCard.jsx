import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getCurator } from "@/lib/folio-data";

export default function ThreadCard({ thread }) {
  const curator = typeof thread.curator === "string" ? getCurator(thread.curator) : thread.curator;
  return (
    <Link to={`/thread/${thread.id}`} className="block group py-5 border-b border-border animate-fade-up">
      <div className="flex items-baseline justify-between gap-3">
        <span className="folio-eyebrow text-folio-cream-dim">{thread.dateLabel}</span>
        <span className="text-xs text-folio-cream-dim">{thread.elements.length} elements</span>
      </div>
      <h3 className="folio-serif text-xl text-folio-cream mt-2 leading-tight group-hover:text-folio-saffron transition-colors">{thread.title}</h3>
      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-folio-cream-dim">Edited by {curator.name}</span>
        <ArrowRight className="w-4 h-4 text-folio-cream-dim group-hover:text-folio-saffron transition-colors" />
      </div>
    </Link>
  );
}
