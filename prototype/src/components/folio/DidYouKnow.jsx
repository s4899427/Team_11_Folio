import { useState } from "react";
import { ExternalLink, Lightbulb } from "lucide-react";
import { factOfTheDay } from "@/lib/cities";
import { cityToday } from "@/lib/time";
import { useFolio } from "@/lib/folio-store";

export function FactSource({ fact }) {
  return (
    <>
      {fact.note && <p className="text-xs text-folio-cream-dim/80 mt-2">{fact.note}</p>}
      <a href={fact.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-folio-saffron mt-2 hover:underline">
        Source: {fact.sourceLabel} <ExternalLink className="w-3 h-3" />
      </a>
    </>
  );
}

/** One surprising, sourced fact about the city's music, rotating daily. */
export default function DidYouKnow() {
  const { city } = useFolio();
  const [more, setMore] = useState(false);
  const fact = factOfTheDay(city, cityToday(city.tz));
  if (!fact) return null;
  const others = city.facts.filter((f) => f.id !== fact.id);
  return (
    <section id="dyk" className="mt-14 scroll-mt-16" data-testid="dyk">
      <div className="flex items-center gap-2"><Lightbulb className="w-4 h-4 text-folio-saffron" /><span className="folio-eyebrow text-folio-saffron">Did you know?</span></div>
      <p className="folio-serif text-xl leading-snug text-folio-cream mt-3" data-testid="dyk-text">{fact.text}</p>
      <FactSource fact={fact} />
      {others.length > 0 && (
        <>
          <button onClick={() => setMore((m) => !m)} aria-expanded={more} data-testid="dyk-more" className="block mt-4 text-xs text-folio-cream-dim hover:text-folio-cream">
            {more ? "Hide" : `More from ${city.name} (${others.length})`}
          </button>
          {more && (
            <ul className="mt-3 space-y-5 border-t border-border pt-4 animate-fade-in">
              {others.map((f) => (<li key={f.id}><p className="text-sm text-folio-cream leading-relaxed">{f.text}</p><FactSource fact={f} /></li>))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}
