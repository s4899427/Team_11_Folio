import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { listEditions, listCurators, listArtists, listMyConnections } from "@/lib/api";
import { cityToday, formatShort, monthKey } from "@/lib/time";
import { useFolio } from "@/lib/folio-store";
import CityPicker from "@/components/folio/CityPicker";
import Nearby from "@/components/folio/Nearby";
import ArtistCard from "@/components/folio/ArtistCard";
import { cn } from "@/lib/utils";

/** Browse: the curators behind the Editions, the artists you can connect to, and the archive. */
export default function Browse() {
  const { session, city } = useFolio();
  const [who, setWho] = useState("all");
  const { data } = useQuery({ queryKey: ["editions", session?.id ?? "guest", city.id], queryFn: () => listEditions(session, city.id) });
  const { data: curators = [] } = useQuery({ queryKey: ["curators", city.id], queryFn: () => listCurators(city.id) });
  const { data: artists = [] } = useQuery({ queryKey: ["artists", city.id], queryFn: () => listArtists(city.id), refetchOnMount: "always" });
  const { data: conns = [] } = useQuery({ queryKey: ["connections", session?.id], queryFn: () => listMyConnections(session), enabled: !!session, refetchOnMount: "always" });
  const today = cityToday(city.tz);
  const all = (data?.editions || []).filter((e) => e.date < today);
  const past = who === "all" ? all : all.filter((e) => e.curatorId === who);
  const oldest = all[all.length - 1], newest = all[0];
  const countOf = (id) => all.filter((e) => e.curatorId === id).length;

  const groups = [];
  for (const e of past) {
    const k = monthKey(e.date);
    const g = groups.find((x) => x.k === k);
    if (g) g.items.push(e); else groups.push({ k, items: [e] });
  }
  const chip = (id, label) => (
    <button key={id} onClick={() => setWho(id)} aria-pressed={who === id} data-testid={`curator-chip-${id}`}
      className={cn("px-3 py-1.5 border text-sm", who === id ? "border-folio-saffron text-folio-saffron bg-folio-saffron/10" : "border-border text-folio-cream-dim")}>{label}</button>
  );

  return (
    <div className="max-w-lg mx-auto px-5 pt-8">
      <div className="flex items-center justify-between"><span className="folio-eyebrow text-folio-saffron">Browse</span><CityPicker /></div>
      <h1 className="folio-serif text-4xl text-folio-cream mt-3">The people behind {city.name}'s music</h1>

      <section className="mt-8" data-testid="curators-section">
        <h2 className="folio-eyebrow text-folio-cream-dim">Curators</h2>
        {curators.length === 0
          ? <p className="text-sm text-folio-cream-dim mt-3 leading-relaxed">{city.name} has no curators yet. <Link to="/apply" className="text-folio-saffron hover:underline">Apply to be the first.</Link></p>
          : <div className="flex flex-wrap gap-2 mt-3">{chip("all", `All Editions (${all.length})`)}{curators.map((c) => chip(c.id, `${c.name} (${countOf(c.id)})`))}</div>}
        {who !== "all" && curators.find((c) => c.id === who)?.bio && <p className="text-sm text-folio-cream-dim mt-3 leading-relaxed">{curators.find((c) => c.id === who).bio}</p>}
      </section>

      <Nearby />

      <section className="mt-10" data-testid="artists-section">
        <h2 className="folio-eyebrow text-folio-cream-dim">Artists</h2>
        <p className="text-xs text-folio-cream-dim/80 mt-2 leading-relaxed">Connect with an artist to see their updates and ask a question. No follower counts.</p>
        <div className="mt-3 space-y-3">
          {artists.length === 0 && <p className="text-sm text-folio-cream-dim">No artists have joined {city.name} yet. Make music? Join as an artist.</p>}
          {artists.map((a) => <ArtistCard key={a.id} artist={a} connected={conns.includes(a.id)} />)}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="folio-eyebrow text-folio-cream-dim">Archive</h2>
        <p className="text-sm text-folio-cream-dim mt-2 leading-relaxed" data-testid="archive-range">
          {all.length > 0
            ? <>Editions archived from <span className="text-folio-cream">{formatShort(oldest.date)}</span> to <span className="text-folio-cream">{formatShort(newest.date)}</span> · {all.length} in all. Locked at midnight and never edited again.</>
            : <>Locked at midnight and never edited again.</>}
        </p>
        <div className="mt-6 space-y-8">
          {all.length === 0 && <p className="text-sm text-folio-cream-dim leading-relaxed">{city.curated ? "Nothing archived yet. Today's Edition will land here at midnight." : `${city.name} has no Editions yet. The first curator's Editions will be kept here.`}</p>}
          {groups.map((g) => (
            <div key={g.k}>
              <h3 className="folio-eyebrow text-folio-cream-dim">{g.k}</h3>
              <ul className="mt-3 divide-y divide-border border-y border-border">
                {g.items.map((e) => (
                  <li key={e.id}>
                    <Link to={`/edition/${e.date}`} data-testid="archive-row" className="flex items-baseline gap-4 py-4 group">
                      <span className="font-mono text-xs text-folio-cream-dim w-14 shrink-0">{formatShort(e.date)}</span>
                      <span className="min-w-0">
                        <span className="block folio-serif text-xl text-folio-cream group-hover:text-folio-saffron transition-colors">{e.title}</span>
                        <span className="block text-xs text-folio-cream-dim mt-0.5">{e.items.length} picks · {e.curatorName}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
