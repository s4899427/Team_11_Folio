import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Wordmark from "@/components/folio/Wordmark";
import LocalGreeting, { CountryAck } from "@/components/folio/LocalGreeting";
import { FactSource } from "@/components/folio/DidYouKnow";
import { useFolio } from "@/lib/folio-store";
import { CITY_LIST, CITIES, detectCity, factOfTheDay } from "@/lib/cities";
import { cityToday } from "@/lib/time";
import { cn } from "@/lib/utils";

const stories = (city) => [
  {
    id: "reader", tag: "The reader", who: "Example: Mei, new to " + city.name,
    line: "Just moved here. Loves music, knows none of the local names.",
    steps: [
      ["Morning", `Opens Folio. ${city.name}'s Edition is waiting, with the curator's name on top.`],
      ["Picks", "Eight to twelve picks. Each says why it is here, and the liner note says why locals know it."],
      ["Out", "Browse shows a gig this week. A \"Did you know?\" gives her something to say at the venue."],
      ["Back", "She answers one question: did this show you something new? If yes, she can back the curator."],
    ],
  },
  {
    id: "path", tag: "The way to curating", who: "Example: Sam, a regular reader",
    line: "Knows the scene better than the Edition did. Wants a turn.",
    steps: [
      ["Notice", "Sam has been backing curators and answering the Discovery check for a few weeks."],
      ["Apply", "Sam applies from Me, with a short pitch and links to music they would feature."],
      ["Apprentice", "The Folio team approves. First Editions are marked Apprentice."],
      ["Earn it", "Curator at 5 Editions. Resident when readers keep finding something new and enough different people back them."],
    ],
  },
  {
    id: "curator", tag: "The curator's journey", who: "Example: Jo, a curator",
    line: "One day each. Eight to twelve picks. Every fact has a source.",
    steps: [
      ["Claim a day", `One Edition per city per day. It locks at midnight ${city.name} time.`],
      ["Mix it", "Mostly artists people already know, plus one or two new and upcoming local artists. Say if you know them."],
      ["Source it", "Each liner note needs a checkable fact and a link. No source, no publish."],
      ["Learn", "Jo sees how many readers found something new, and who backed the Edition, never a ranking of songs."],
    ],
  },
];

function StoryCards({ city }) {
  const [n, setN] = useState(0);
  const list = stories(city);
  const onScroll = (e) => { const el = e.currentTarget; setN(Math.round(el.scrollLeft / (el.clientWidth * 0.86))); };
  return (
    <div className="mt-6" data-testid="story-cards">
      <div onScroll={onScroll} className="flex gap-3 overflow-x-auto snap-x snap-mandatory -mx-5 px-5 pb-2" style={{ scrollbarWidth: "none" }}>
        {list.map((c) => (
          <article key={c.id} data-testid={`story-${c.id}`} className="snap-center shrink-0 w-[86%] border border-border p-4 bg-folio-ink">
            <span className="folio-eyebrow text-folio-saffron">{c.tag}</span>
            <p className="folio-serif text-xl text-folio-cream leading-snug mt-2">{c.line}</p>
            <p className="text-xs text-folio-cream-dim/80 mt-1">{c.who} (made-up scenario, not a real user)</p>
            <ol className="mt-4 space-y-3">
              {c.steps.map(([h, t]) => (
                <li key={h} className="grid grid-cols-[4.5rem_1fr] gap-3">
                  <span className="folio-eyebrow text-folio-cream-dim pt-0.5">{h}</span>
                  <span className="text-sm text-folio-cream leading-relaxed">{t}</span>
                </li>
              ))}
            </ol>
          </article>
        ))}
      </div>
      <div className="flex gap-1.5 mt-2" aria-hidden>{list.map((c, k) => <span key={c.id} className={`h-1 w-4 ${k === n ? "bg-folio-saffron" : "bg-border"}`} />)}</div>
    </div>
  );
}

export default function Welcome() {
  const { setSeenIntro, setCityId } = useFolio();
  const navigate = useNavigate();
  const guess = useMemo(() => detectCity(), []);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(guess);          // null until chosen when we couldn't guess
  const city = picked ? CITIES[picked] : null;
  const fact = city ? factOfTheDay(city, cityToday(city.tz)) : null;

  const next = () => {
    if (i === 1 && picked) setCityId(picked);
    if (i < 2) return setI(i + 1);
    setSeenIntro();
    navigate("/", { replace: true });
  };
  const disabled = i === 1 && !picked;

  return (
    <div className="min-h-screen flex flex-col px-5 py-10 max-w-lg mx-auto" data-testid={`welcome-${i}`}>
      <Wordmark className="text-base" />

      <div key={i} className="flex-1 flex flex-col justify-center py-8 animate-fade-up">
        {i === 0 && (
          <>
            <span className="folio-eyebrow text-folio-saffron">Welcome to Folio</span>
            <h1 className="folio-serif text-5xl leading-[1.05] text-folio-cream mt-4">One music Edition a day, for your city.</h1>
            <p className="text-folio-cream-dim mt-5 leading-relaxed">A named local curator picks 8 to 12 tracks and says why each one is there. It is a short read, then you are done. A new Edition arrives at midnight.</p>
            <ul className="mt-6 space-y-3" data-testid="why-today">
              {[
                ["Something new", "Two to four of today's picks are new local artists, next to ones you may know."],
                ["Someone accountable", "A person with a name chose it. No algorithm, no likes, no ranking."],
                ["Something to do", "Gigs nearby, and a fact to bring up when you get there."],
              ].map(([h, t]) => (
                <li key={h} className="grid grid-cols-[7.5rem_1fr] gap-3"><span className="folio-eyebrow text-folio-saffron pt-0.5">{h}</span><span className="text-sm text-folio-cream leading-relaxed">{t}</span></li>
              ))}
            </ul>
          </>
        )}

        {i === 1 && (
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
            {city && <div className="mt-6"><CountryAck city={city} /></div>}
          </>
        )}

        {i === 2 && (
          <>
            <span className="folio-eyebrow text-folio-saffron">Three ways in</span>
            <h1 className="folio-serif text-4xl leading-tight text-folio-cream mt-4">One Edition. No algorithm.</h1>
            <p className="text-sm text-folio-cream-dim mt-3 leading-relaxed">A person picks. Nothing is ranked. It locks at {(city || CITIES.brisbane).name} midnight. Swipe through three example stories.</p>
            <StoryCards city={city || CITIES.brisbane} />
          </>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">{[0, 1, 2].map((n) => <span key={n} className={`h-1 w-6 ${n === i ? "bg-folio-saffron" : "bg-border"}`} />)}</div>
        <button onClick={next} disabled={disabled} data-testid="welcome-next" className="px-6 py-3 bg-folio-cream text-folio-ink folio-eyebrow disabled:opacity-40">
          {i === 2 ? `Read ${city ? city.name + "'s" : "today's"} Edition` : "Next"}
        </button>
      </div>
    </div>
  );
}
