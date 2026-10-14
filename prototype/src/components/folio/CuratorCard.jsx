import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { listCurators, getCuratorStats, listMyBacks, backCurator } from "@/lib/api";
import { canBack, backsLeft, discoveryRate, tierFor, monthOf, BACKS_PER_MONTH } from "@/lib/standing";
import { cityToday } from "@/lib/time";
import { useFolio } from "@/lib/folio-store";

/**
 * Today's curator, up front. Shows who they are, their standing (components,
 * not one opaque score) and lets a reader back them. Backing never changes
 * what anyone sees in an Edition.
 */
export default function CuratorCard({ edition, editionCount }) {
  const { session, city } = useFolio();
  const qc = useQueryClient();
  const today = cityToday(city.tz);
  const [err, setErr] = useState("");
  const { data: curators = [] } = useQuery({ queryKey: ["curators", city.id], queryFn: () => listCurators(city.id) });
  const { data: stats } = useQuery({ queryKey: ["curator-stats", edition.curatorId, editionCount], queryFn: () => getCuratorStats(session, edition.curatorId, editionCount) });
  const { data: backs = [] } = useQuery({ queryKey: ["my-backs", session?.id], queryFn: () => listMyBacks(session), enabled: !!session });

  const curator = curators.find((c) => c.id === edition.curatorId);
  const month = monthOf(today);
  const check = canBack({ voterId: session?.id, curatorId: edition.curatorId, month, backs });
  const already = backs.some((b) => b.curatorId === edition.curatorId && b.month === month);
  const left = session ? backsLeft({ voterId: session.id, month, backs }) : BACKS_PER_MONTH;
  const tier = tierFor(stats || { editions: editionCount });
  const rate = stats ? discoveryRate(stats) : null;

  const back = async () => {
    setErr("");
    try { await backCurator(session, edition.curatorId, today); qc.invalidateQueries({ queryKey: ["my-backs"] }); qc.invalidateQueries({ queryKey: ["curator-stats"] }); }
    catch (e) { setErr(e.status === 401 ? "Your session expired. Log in again." : e.message); }
  };

  return (
    <section id="curator" className="scroll-mt-16 border border-border p-4 mt-6" data-testid="curator-card">
      <span className="folio-eyebrow text-folio-cream-dim">Today's curator</span>
      <div className="flex items-baseline justify-between gap-3 mt-2">
        <h2 className="folio-serif text-2xl text-folio-cream" data-testid="curator-name">{edition.curatorName}</h2>
        <span className="folio-eyebrow text-folio-saffron shrink-0" data-testid="curator-tier">{tier.label}</span>
      </div>
      {curator?.bio && <p className="text-sm text-folio-cream-dim mt-2 leading-relaxed">{curator.bio}</p>}

      <dl className="grid grid-cols-2 gap-3 mt-4 text-xs">
        <div><dt className="text-folio-cream-dim">Editions published</dt><dd className="text-folio-cream text-sm mt-0.5" data-testid="curator-editions">{editionCount}</dd></div>
        <div><dt className="text-folio-cream-dim">Readers who found something new</dt>
          <dd className="text-folio-cream text-sm mt-0.5" data-testid="curator-rate">{rate === null ? "Not enough responses yet" : `${Math.round(rate * 100)}% (${stats.responses} readers)`}</dd></div>
      </dl>

      <div className="mt-4 pt-4 border-t border-border">
        {!session ? (
          <p className="text-xs text-folio-cream-dim"><Link to="/login" className="text-folio-saffron hover:underline">Log in</Link> to back curators you want to keep hearing from.</p>
        ) : already ? (
          <p className="text-sm text-folio-saffron" data-testid="backed">You've backed {edition.curatorName} this month. {left} of {BACKS_PER_MONTH} backs left.</p>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-folio-cream-dim leading-relaxed">{check.ok ? `${left} of ${BACKS_PER_MONTH} backs left this month. Back someone for craft and passion, not fame.` : check.reason}</p>
            <button onClick={back} disabled={!check.ok} data-testid="back-btn" className="shrink-0 px-4 py-2 border border-folio-saffron text-folio-saffron folio-eyebrow disabled:opacity-40 hover:bg-folio-saffron/10 transition-colors">Back</button>
          </div>
        )}
        {err && <p role="alert" className="text-xs text-folio-burgundy mt-2">{err}</p>}
        <p className="text-[0.65rem] text-folio-cream-dim/60 mt-3 leading-relaxed">Backs decide who curates. They never change what you see inside an Edition.</p>
      </div>
    </section>
  );
}
