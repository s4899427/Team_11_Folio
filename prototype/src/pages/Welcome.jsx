import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ExternalLink, X } from "lucide-react";
import Wordmark from "@/components/folio/Wordmark";
import LocalGreeting, { CountryAck } from "@/components/folio/LocalGreeting";
import { FactSource } from "@/components/folio/DidYouKnow";
import { useFolio } from "@/lib/folio-store";
import { CITY_LIST, CITIES, detectCity, factOfTheDay } from "@/lib/cities";
import { cityToday, formatLong } from "@/lib/time";
import { cn } from "@/lib/utils";

/**
 * The introduction: a short, front-page style story told one part at a time.
 * Tap the right side (or Next) to go forward, the left side to go back, or swipe.
 * It ends on Today. It is also the replay: tapping the Folio logo anywhere opens it again.
 * Copy is written like a newspaper kicker and headline, not a settings screen.
 */
const slidesFor = (city) => [
  { id: "cover", kicker: `The ${city.name} Edition`, head: "Your city's front page, in music.", body: "One Edition a day. Picked by a named local. Gone at midnight." },
  { id: "name", kicker: "No. 1 · Someone accountable", head: "A name stands behind every song.", body: "A local curator picks 8 to 12 tracks and prints the reason next to each one. No algorithm. No likes. No ranking." },
  { id: "new", kicker: "No. 2 · Something new", head: "Meet the artists you haven't heard yet.", body: "Two to four picks are new local acts, set beside names you may already know. The curator backs each newcomer with two sources." },
  { id: "go", kicker: "No. 3 · Something to do", head: "Then take it out.", body: "Gigs near you, and one fact worth saying out loud when you get there." },
  ...(city.country_ack ? [{ id: "country", kicker: "On Country" }] : []),
  { id: "city", kicker: "Last thing" },
];

export default function Welcome() {
  const { setSeenIntro, setCityId } = useFolio();
  const navigate = useNavigate();
  const guess = useMemo(() => detectCity(), []);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(guess);          // null until chosen when we couldn't guess
  const city = picked ? CITIES[picked] : null;
  const ctx = city || CITIES.brisbane;                  // story context while no city is chosen
  const slides = slidesFor(ctx);
  const idx = Math.min(i, slides.length - 1);          // the story can shrink when the chosen city has no Country slide
  const last = idx === slides.length - 1;
  const slide = slides[idx];
  const fact = city ? factOfTheDay(city, cityToday(city.tz)) : null;
  const touch = useRef(null);

  const finish = () => {
    if (picked) setCityId(picked);
    setSeenIntro();
    navigate("/", { replace: true });
  };
  const blocked = last && !picked;
  const next = () => { if (blocked) return; if (last) return finish(); setI(Math.min(idx + 1, slides.length - 1)); };
  const prev = () => setI(Math.max(idx - 1, 0));

  useEffect(() => {
    const onKey = (e) => { if (e.key === "ArrowRight") next(); if (e.key === "ArrowLeft") prev(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const onTouchStart = (e) => { const t = e.touches[0]; touch.current = { x: t.clientX, y: t.clientY }; };
  const onTouchEnd = (e) => {
    if (!touch.current) return;
    const t = e.changedTouches[0]; const dx = t.clientX - touch.current.x; const dy = t.clientY - touch.current.y;
    touch.current = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) (dx < 0 ? next : prev)();
  };
  const interactive = slide.id === "city";               // the city step has buttons, so no tap zones there

  return (
    <div className="min-h-screen flex flex-col px-5 pt-5 pb-8 max-w-lg mx-auto relative select-none" data-testid={`welcome-${idx}`} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="flex gap-1.5" role="progressbar" aria-valuemin={1} aria-valuemax={slides.length} aria-valuenow={idx + 1} aria-label="Introduction progress">
        {slides.map((s, k) => <span key={s.id} className={cn("h-0.5 flex-1 transition-colors", k <= idx ? "bg-folio-saffron" : "bg-border")} />)}
      </div>
      <div className="flex items-center justify-between mt-4">
        <Wordmark className="text-base" />
        <button onClick={finish} disabled={!picked} data-testid="welcome-skip" aria-label="Skip the introduction" className="p-2 -m-2 text-folio-cream-dim hover:text-folio-cream disabled:opacity-30">
          <X className="w-5 h-5" strokeWidth={1.5} />
        </button>
      </div>

      {!interactive && (
        <>
          <button onClick={prev} aria-label="Previous" tabIndex={-1} className="absolute left-0 top-28 bottom-28 w-1/3 z-10 cursor-w-resize" />
          <button onClick={next} aria-label="Next" tabIndex={-1} className="absolute right-0 top-28 bottom-28 w-2/3 z-10 cursor-e-resize" />
        </>
      )}

      <div key={slide.id} className="flex-1 flex flex-col justify-center py-8 animate-fade-up">
        {slide.id !== "city" && slide.id !== "country" && (
          <>
            {slide.id === "cover" && <p className="folio-eyebrow text-folio-cream-dim border-t border-b border-border py-2 mb-6 text-center">{formatLong(cityToday(ctx.tz))}</p>}
            <span className="folio-eyebrow text-folio-saffron">{slide.kicker}</span>
            <h1 className="folio-serif text-5xl leading-[1.04] text-folio-cream mt-4">{slide.head}</h1>
            <p data-testid={slide.id === "cover" ? "why-today" : undefined} className="text-lg text-folio-cream-dim mt-6 leading-relaxed">{slide.body}</p>
          </>
        )}

        {slide.id === "country" && (
          <div data-testid="welcome-country">
            <span className="folio-eyebrow text-folio-saffron">{slide.kicker}</span>
            <h1 className="folio-serif text-5xl leading-[1.04] text-folio-cream mt-4">You're on {ctx.country_ack.placeName}.</h1>
            <p className="text-lg text-folio-cream-dim mt-6 leading-relaxed">
              {ctx.country_ack.placeName} is said to mean “{ctx.country_ack.meaning}”. It is a Traditional Place name from Turrbal and Yuggera Country, and music has been made here for far longer than there has been a city.
            </p>
            {ctx.country_ack.meaningSource && (
              <a href={ctx.country_ack.meaningSource.url} target="_blank" rel="noreferrer" className="relative z-20 inline-flex items-center gap-1 text-xs text-folio-saffron mt-3 hover:underline">
                Source: {ctx.country_ack.meaningSource.label} <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <div className="mt-6"><CountryAck city={ctx} /></div>
          </div>
        )}

        {slide.id === "city" && (
          <>
            {city ? (
              <>
                <LocalGreeting city={city} large />
                <p className="text-folio-cream-dim mt-5 leading-relaxed">Check out the {city.name} music scene: curated Editions, gigs nearby and the odd surprising fact. {city.curated ? "" : `${city.name} doesn't have a curator yet, so you'll get sourced city notes and a way to become one.`}</p>
                {fact && (
                  <div className="mt-6 border border-border p-4" data-testid="welcome-fact">
                    <span className="folio-eyebrow text-folio-saffron">Did you know?</span>
                    <p className="folio-serif text-lg leading-snug text-folio-cream mt-2">{fact.text}</p>
                    <FactSource fact={fact} />
                  </div>
                )}
              </>
            ) : (
              <>
                <h1 className="folio-serif text-4xl leading-tight text-folio-cream">Where are you?</h1>
                <p className="text-folio-cream-dim mt-4 leading-relaxed">We couldn't tell from your device. Pick the nearest city we cover.</p>
              </>
            )}
            <div className="mt-6">
              <p className="folio-eyebrow text-folio-cream-dim">{guess && picked === guess ? "We guessed from your device's time zone. Not right?" : "Your city"}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {CITY_LIST.map((c) => (
                  <button key={c.id} onClick={() => setPicked(c.id)} aria-pressed={picked === c.id} data-testid={`pick-${c.id}`}
                    className={cn("px-4 py-2 border text-sm transition-colors", picked === c.id ? "border-folio-saffron text-folio-saffron bg-folio-saffron/10" : "border-border text-folio-cream-dim hover:text-folio-cream")}>
                    {c.name}
                  </button>
                ))}
              </div>
              <p className="text-xs text-folio-cream-dim/70 mt-3">This guess uses only your device's time zone. Nothing about your location is sent anywhere.</p>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center justify-between relative z-20">
        <button onClick={prev} disabled={idx === 0} data-testid="welcome-back" className="folio-eyebrow text-folio-cream-dim disabled:opacity-0 px-2 py-3 -ml-2">Back</button>
        <button onClick={next} disabled={blocked} data-testid="welcome-next" className="px-6 py-3 bg-folio-cream text-folio-ink folio-eyebrow disabled:opacity-40">
          {last ? `Read ${city ? city.name + "'s" : "today's"} Edition` : "Next"}
        </button>
      </div>
    </div>
  );
}
