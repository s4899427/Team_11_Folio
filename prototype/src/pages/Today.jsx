import { useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Wordmark from "@/components/folio/Wordmark";
import EditionView from "@/components/folio/EditionView";
import Countdown from "@/components/folio/Countdown";
import CuratorCard from "@/components/folio/CuratorCard";
import DidYouKnow from "@/components/folio/DidYouKnow";
import JumpBar from "@/components/folio/JumpBar";
import CityPicker from "@/components/folio/CityPicker";
import LocalGreeting, { CountryAck } from "@/components/folio/LocalGreeting";
import { listEditions, REMOTE } from "@/lib/api";
import { cityToday, formatLong } from "@/lib/time";
import { useFolio } from "@/lib/folio-store";

export function SourceBanner({ source }) {
  if (source === "remote") return null;
  const msg = {
    local: "Demo mode: Editions are stored on this device only. Connect the shared database to publish to everyone.",
    cache: "Offline: showing the last Edition this device synced.",
    fallback: "Can't reach the shared database right now: showing built-in founding Editions.",
  }[source];
  return <p data-testid="source-banner" className="mt-3 text-[0.65rem] leading-relaxed text-folio-cream-dim border border-border px-3 py-2">{msg}</p>;
}


const PITCH_KEY = "folio_why_today_dismissed";
const pitchHidden = () => { try { return localStorage.getItem(PITCH_KEY) === "1"; } catch { return false; } };

/** First visits only: what Folio is and what today's Edition holds, in three lines. */
function WhyToday({ edition, city }) {
  const [hidden, setHidden] = useState(pitchHidden);
  if (hidden || !edition) return null;
  const n = edition.items.length;
  const fresh = edition.items.filter((it) => it.stage === "emerging").length;
  const close = () => { try { localStorage.setItem(PITCH_KEY, "1"); } catch {} setHidden(true); };
  return (
    <section data-testid="why-today-card" className="relative mt-5 border border-folio-saffron/40 p-4 animate-fade-in">
      <button type="button" onClick={close} aria-label="Hide this intro" className="absolute top-2 right-2 p-1 text-folio-cream-dim hover:text-folio-cream"><X className="w-4 h-4" /></button>
      <span className="folio-eyebrow text-folio-saffron">New here?</span>
      <p className="folio-serif text-xl text-folio-cream leading-snug mt-2">Folio is one music Edition a day for {city.name}, picked by {edition.curatorName}.</p>
      <p className="text-sm text-folio-cream-dim mt-2 leading-relaxed">Today: {n} picks{fresh ? `, ${fresh} of them new local artists` : ""}. Each has a reason and a source. Read it, then you're done until midnight.</p>
    </section>
  );
}

export default function Today() {
  const { session, city } = useFolio();
  const { data, isLoading } = useQuery({
    queryKey: ["editions", session?.id ?? "guest", city.id],
    queryFn: () => listEditions(session, city.id),
    refetchInterval: REMOTE ? 30000 : false,
  });
  const today = cityToday(city.tz);
  const edition = data?.editions.find((e) => e.date === today);
  const latest = data?.editions.find((e) => e.date < today);
  const editionCount = edition ? (data?.editions || []).filter((e) => e.curatorId === edition.curatorId && e.date <= today).length : 0;
  const uncurated = data && !edition && !city.curated;

  const jumps = [
    ...(edition ? [{ id: "curator", label: "Curator" }, { id: "picks", label: "Picks" }] : []),
    { id: "dyk", label: "Did you know?" },
  ];

  return (
    <div className="max-w-lg mx-auto px-5 pt-8">
      <div className="flex items-center justify-between animate-fade-in">
        <Wordmark />
        <div className="flex items-center gap-4">
          <CityPicker />
          <span className="text-xs text-folio-cream-dim hidden min-[380px]:inline">{formatLong(today)}</span>
        </div>
      </div>

      <div className="mt-6 animate-fade-in"><LocalGreeting city={city} /></div>
      <p className="text-xs text-folio-cream-dim/80 mt-4 leading-relaxed max-w-sm">
        {city.tagline} One human-picked Edition a day. No algorithm: likes don't exist and comments don't rank anything. It locks at {city.name} midnight.
      </p>
      {data && <SourceBanner source={data.source} />}
      <WhyToday edition={edition} city={city} />

      <JumpBar items={jumps} />

      <div className="mt-2">
        {isLoading && <p className="text-sm text-folio-cream-dim mt-6">Loading…</p>}

        {edition && (
          <EditionView
            edition={edition}
            locked={false}
            curatorCard={<CuratorCard edition={edition} editionCount={editionCount} />}
            afterPicks={<DidYouKnow />}
          />
        )}

        {data && !edition && city.curated && (
          <>
            <div className="border border-border p-5 mt-6" data-testid="no-edition">
              <p className="folio-serif text-2xl text-folio-cream">Today's Edition isn't published yet.</p>
              <p className="text-sm text-folio-cream-dim mt-2 leading-relaxed">A curator is still picking. Until then, here is the last one.</p>
              <div className="mt-4"><Countdown label="Today ends in" /></div>
              {latest && <Link to={`/edition/${latest.date}`} className="inline-block mt-4 text-sm text-folio-saffron hover:underline">Read “{latest.title}”</Link>}
            </div>
            <DidYouKnow />
          </>
        )}

        {uncurated && (
          <>
            <div className="border border-folio-saffron/60 p-5 mt-6" data-testid="no-curator">
              <span className="folio-eyebrow text-folio-saffron">{city.name} has no curator yet</span>
              <p className="folio-serif text-2xl text-folio-cream mt-2 leading-snug">{city.scene}</p>
              <p className="text-sm text-folio-cream-dim mt-3 leading-relaxed">Folio doesn't invent local content. Until someone who knows {city.name}'s music takes the first Edition, here are sourced notes on the scene. Want to be that person?</p>
              <Link to="/apply" data-testid="apply-cta" className="inline-block mt-4 px-5 py-3 bg-folio-cream text-folio-ink folio-eyebrow">Apply to curate {city.name}</Link>
            </div>
            <DidYouKnow />
          </>
        )}
      </div>

      <div className="mt-14 pt-6 border-t border-border space-y-4">
        <CountryAck city={city} />
        <Link to="/feedback" className="block text-xs text-folio-cream-dim hover:text-folio-cream">Tried Folio? Tell us what you think (2 minutes) →</Link>
      </div>
    </div>
  );
}
