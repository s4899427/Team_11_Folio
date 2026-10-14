import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyDiscovery, sendDiscovery } from "@/lib/api";
import { useFolio } from "@/lib/folio-store";

/** Reader signal for curator standing: did this Edition show you something new? Rewards discovery, not popularity. */
export default function DiscoveryCheck({ editionId, curatorId }) {
  const { session } = useFolio();
  const qc = useQueryClient();
  const [err, setErr] = useState("");
  const { data: mine } = useQuery({ queryKey: ["discovery", editionId, session?.id], queryFn: () => getMyDiscovery(session, editionId), enabled: !!session });

  const answer = async (v) => {
    setErr("");
    try { await sendDiscovery(session, editionId, v); qc.invalidateQueries({ queryKey: ["discovery"] }); qc.invalidateQueries({ queryKey: ["curator-stats"] }); }
    catch (e) { setErr(e.status === 401 ? "Your session expired. Log in again." : e.message); }
  };

  return (
    <section className="mt-12 border-t border-border pt-6" data-testid="discovery">
      <span className="folio-eyebrow text-folio-cream-dim">Your verdict</span>
      <p className="folio-serif text-xl text-folio-cream mt-2">Did this Edition show you something new?</p>
      {session && session.id === curatorId ? (
        <p className="text-sm text-folio-cream-dim mt-3">This is your own Edition, so you can't answer for it.</p>
      ) : !session ? (
        <p className="text-sm text-folio-cream-dim mt-3"><Link to="/login" className="text-folio-saffron hover:underline">Log in</Link> to tell the curator.</p>
      ) : typeof mine === "boolean" ? (
        <p className="text-sm text-folio-saffron mt-3" data-testid="discovery-thanks">Thanks. Only the curator sees the totals, never who answered what.</p>
      ) : (
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button onClick={() => answer(true)} data-testid="discovery-yes" className="py-3 border border-folio-saffron text-folio-cream text-sm hover:bg-folio-saffron/10 transition-colors">Yes, something new</button>
          <button onClick={() => answer(false)} data-testid="discovery-no" className="py-3 border border-border text-folio-cream-dim text-sm hover:text-folio-cream transition-colors">Not this time</button>
        </div>
      )}
      {err && <p role="alert" className="text-xs text-folio-burgundy mt-2">{err}</p>}
      <p className="text-xs text-folio-cream-dim/70 mt-3 leading-relaxed">This is how curators earn standing for finding things people didn't already know, instead of being rewarded for being popular.</p>
    </section>
  );
}
