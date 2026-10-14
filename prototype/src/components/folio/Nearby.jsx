import { useQuery } from "@tanstack/react-query";
import { MapPin, ExternalLink, ArrowDown } from "lucide-react";
import { listGigTips } from "@/lib/api";
import { whatsOnUrl } from "@/lib/cities";
import { formatShort } from "@/lib/time";
import { useFolio } from "@/lib/folio-store";

const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

/** Prominent strip near the top of Today. Tapping it jumps to the full Nearby section. */
export function NearbyTeaser() {
  const { city } = useFolio();
  const { data: tips = [] } = useQuery({ queryKey: ["gig-tips", city.id], queryFn: () => listGigTips(city.id) });
  return (
    <button onClick={() => go("nearby")} data-testid="nearby-teaser" className="mt-4 w-full flex items-center justify-between gap-3 border border-folio-saffron/60 bg-folio-saffron/10 px-4 py-3 text-left hover:bg-folio-saffron/15 transition-colors">
      <span className="flex items-center gap-3 min-w-0">
        <MapPin className="w-5 h-5 shrink-0 text-folio-saffron" />
        <span className="min-w-0">
          <span className="block folio-eyebrow text-folio-saffron">Nearby in {city.name}</span>
          <span className="block text-xs text-folio-cream-dim mt-0.5">{tips.length ? `${tips.length} curator tip${tips.length === 1 ? "" : "s"} · venues and what's on` : "Venues and what's on this week"}</span>
        </span>
      </span>
      <ArrowDown className="w-4 h-4 shrink-0 text-folio-saffron" />
    </button>
  );
}

export default function Nearby() {
  const { city } = useFolio();
  const { data: tips = [] } = useQuery({ queryKey: ["gig-tips", city.id], queryFn: () => listGigTips(city.id) });
  return (
    <section id="nearby" className="mt-10 scroll-mt-16" data-testid="nearby">
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-folio-saffron" />
        <span className="folio-eyebrow text-folio-saffron">Nearby events · {city.name}</span>
      </div>
      <p className="text-xs text-folio-cream-dim/70 mt-2 max-w-sm">Tips from our curators. Folio doesn't scrape listings, so check with the venue before you go.</p>

      <ul className="mt-4 space-y-3">
        {tips.length === 0 && <li className="text-sm text-folio-cream-dim/70">No curator tips for the coming days yet.</li>}
        {tips.map((t) => (
          <li key={t.id} className="border border-border p-3" data-testid="gig-tip">
            <p className="folio-serif text-lg text-folio-cream">{t.act}</p>
            <p className="text-xs text-folio-cream-dim mt-0.5">{t.venue} · {formatShort(t.date)}{t.time ? ` · ${t.time}` : ""} · tip from {t.curatorName}</p>
            {t.link && <a href={t.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-folio-saffron mt-2 hover:underline">Details <ExternalLink className="w-3 h-3" /></a>}
          </li>
        ))}
      </ul>

      <p className="folio-eyebrow text-folio-cream-dim mt-6">Where to look</p>
      <div className="flex flex-wrap gap-2 mt-2">
        <a href={whatsOnUrl(city.name)} target="_blank" rel="noreferrer" className="px-3 py-1.5 border border-folio-saffron/50 text-xs text-folio-cream hover:bg-folio-saffron/10 transition-colors">Live music in {city.name} this week</a>
        {city.venues.map((v) => (
          <a key={v.name} href={whatsOnUrl(city.name, v.name)} target="_blank" rel="noreferrer" className="px-3 py-1.5 border border-border text-xs text-folio-cream-dim hover:border-folio-saffron/50 hover:text-folio-cream transition-colors">
            {v.name} <span className="text-folio-cream-dim/60">· {v.suburb}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
