import { useState } from "react";
import { ChevronDown } from "lucide-react";
import CommunityBadge from "./CommunityBadge";
import { getCommunity } from "@/lib/folio-data";
import { cn } from "@/lib/utils";

export default function ThreadElement({ element, index = 0 }) {
  const [why, setWhy] = useState(false);
  const [explore, setExplore] = useState(false);
  const c = getCommunity(element.community);

  return (
    <article className="animate-fade-up" style={{ animationDelay: `${index * 0.08}s` }}>
      <div className="border-l-2 pl-4" style={{ borderColor: c.color }}>
        <CommunityBadge communityId={element.community} />
        <h3 className="folio-serif text-2xl text-folio-cream mt-2 leading-tight">{element.title}</h3>
        <p className="text-sm text-folio-cream-dim mt-1 italic">{element.subtitle}</p>
      </div>

      {element.image && (
        <img src={element.image} alt={element.title} className="w-full aspect-[4/5] object-cover mt-4" />
      )}

      {(element.what || element.why || element.explore) && (
        <div className="mt-5 space-y-5">
          {element.what && (
            <section>
              <p className="folio-eyebrow text-folio-saffron">What is it?</p>
              <p className="text-[0.95rem] text-folio-cream/90 mt-2 leading-relaxed">{element.what}</p>
            </section>
          )}
          {element.why && (
            <Disclosure label="Why does it matter?" open={why} onToggle={() => setWhy(!why)}>
              <p className="text-[0.95rem] text-folio-cream/80 leading-relaxed">{element.why}</p>
            </Disclosure>
          )}
          {element.explore && (
            <Disclosure label="Explore" open={explore} onToggle={() => setExplore(!explore)}>
              <p className="text-[0.95rem] text-folio-cream/80 leading-relaxed italic">{element.explore}</p>
            </Disclosure>
          )}
        </div>
      )}
    </article>
  );
}

function Disclosure({ label, open, onToggle, children }) {
  return (
    <section>
      <button onClick={onToggle} className="flex items-center gap-2 group" aria-expanded={open}>
        <span className="folio-eyebrow text-folio-cream-dim group-hover:text-folio-cream transition-colors">{label}</span>
        <ChevronDown className={cn("w-3.5 h-3.5 text-folio-cream-dim transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="mt-2 animate-fade-up">{children}</div>}
    </section>
  );
}
