import { partOfDay } from "@/lib/time";

/** The city's own welcome. Brisbane follows its own clock ("Morning, Brisbane."); Seoul and Mumbai use their local language. */
export default function LocalGreeting({ city, large }) {
  const g = city.greeting;
  const pod = partOfDay(city.tz);
  const text = g.byTime ? `${pod[0].toUpperCase()}${pod.slice(1)}, ${city.name}.` : g.native;
  return (
    <div data-testid="local-greeting">
      <p lang={g.lang} className={large ? "folio-serif text-5xl text-folio-cream leading-tight" : "folio-serif text-lg text-folio-cream"}>{text}</p>
      {g.line && <p lang={g.lang} className={large ? "text-lg text-folio-cream mt-2" : "text-sm text-folio-cream-dim mt-0.5"}>{g.line}</p>}
      <p className={large ? "folio-eyebrow text-folio-saffron mt-3" : "text-xs text-folio-cream-dim/80 mt-0.5"}>{g.gloss}</p>
    </div>
  );
}

export function CountryAck({ city }) {
  if (!city.country_ack) return null;
  return (
    <p data-testid="country-ack" className="text-xs text-folio-cream-dim/80 leading-relaxed border-l-2 border-folio-saffron/60 pl-3">
      {city.country_ack.text}
    </p>
  );
}
