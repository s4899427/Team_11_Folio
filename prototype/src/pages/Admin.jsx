import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Check, X, ExternalLink } from "lucide-react";
import { listApplications, decideApplication } from "@/lib/api";
import { useFolio } from "@/lib/folio-store";
import { formatShort } from "@/lib/time";
import { cn } from "@/lib/utils";

function AppCard({ a, session, onDone }) {
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState("");
  const own = a.applicantId && a.applicantId === session.id;
  const decide = async (approve) => {
    setErr(""); setBusy(approve ? "approve" : "decline");
    try { await decideApplication(session, a.id, approve); onDone(); } catch (e) { setErr(e.message); }
    setBusy("");
  };
  const done = a.status !== "pending";
  return (
    <li data-testid={`app-${a.status}`} className={cn("border p-4", done ? "border-border opacity-80" : "border-folio-saffron/50")}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="folio-serif text-xl text-folio-cream truncate">{a.applicantName}</p>
          <p className="text-xs text-folio-cream-dim mt-0.5">{a.city} · {a.at ? formatShort(String(a.at).slice(0, 10)) : ""}</p>
        </div>
        {done && <span className={cn("folio-eyebrow shrink-0", a.status === "approved" ? "text-folio-saffron" : "text-folio-cream-dim")}>{a.status}</span>}
      </div>
      <p className="text-sm text-folio-cream mt-3 leading-relaxed whitespace-pre-wrap">{a.why}</p>
      {a.link && /^https?:\/\//i.test(a.link) && <a href={a.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-folio-saffron mt-2 hover:underline">Their taste in music <ExternalLink className="w-3 h-3" /></a>}
      {!done && (
        <div className="mt-4">
          {own && <p className="text-xs text-folio-cream-dim mb-2">This is your own application. Another team member needs to decide it.</p>}
          <div className="flex gap-2">
            <button type="button" data-testid="approve" disabled={!!busy || own} onClick={() => decide(true)} className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 bg-folio-cream text-folio-ink folio-eyebrow disabled:opacity-40"><Check className="w-3.5 h-3.5" />{busy === "approve" ? "Approving…" : "Approve"}</button>
            <button type="button" data-testid="decline" disabled={!!busy || own} onClick={() => decide(false)} className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 border border-border text-folio-cream folio-eyebrow disabled:opacity-40"><X className="w-3.5 h-3.5" />{busy === "decline" ? "Declining…" : "Decline"}</button>
          </div>
        </div>
      )}
      {err && <p role="alert" className="text-xs text-folio-burgundy mt-2">{err}</p>}
    </li>
  );
}

export default function Admin() {
  const { session, isAdmin } = useFolio();
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ["applications", session?.id], queryFn: () => listApplications(session), enabled: !!session && isAdmin, refetchInterval: 20000, refetchOnMount: "always" });

  if (!session || !isAdmin) {
    return <div className="max-w-lg mx-auto px-5 pt-8"><p className="text-sm text-folio-cream-dim">This screen is for the Folio team. <Link to="/me" className="text-folio-saffron">Back to Me</Link></p></div>;
  }
  const pending = (data || []).filter((a) => a.status === "pending");
  const decided = (data || []).filter((a) => a.status !== "pending");
  const refresh = () => { qc.invalidateQueries({ queryKey: ["applications"] }); qc.invalidateQueries({ queryKey: ["listCurators"] }); };

  return (
    <div className="max-w-lg mx-auto px-5 pt-8" data-testid="admin-page">
      <Link to="/me" className="flex w-fit items-center gap-1.5 text-xs text-folio-cream-dim hover:text-folio-cream mb-6"><ArrowLeft className="w-3.5 h-3.5" /> Me</Link>
      <span className="folio-eyebrow text-folio-saffron">Folio team</span>
      <h1 className="folio-serif text-4xl text-folio-cream mt-3">Curator applications</h1>
      <p className="text-sm text-folio-cream-dim mt-3 leading-relaxed">Approving makes the applicant a curator of their city and opens the Studio the next time they open Folio. Read the reason and the link first. You can't decide your own application.</p>

      {isLoading && <p className="text-sm text-folio-cream-dim mt-8">Loading…</p>}
      {error && <p role="alert" className="text-xs text-folio-burgundy mt-6">Couldn't load applications. Your account may not be on the team yet (see docs/SUPABASE_SETUP.md).</p>}

      {data && (
        <>
          <h2 className="folio-eyebrow text-folio-cream-dim mt-8">Waiting ({pending.length})</h2>
          <ul className="mt-3 space-y-3" data-testid="pending-list">
            {pending.length === 0 && <li className="text-sm text-folio-cream-dim/70 border border-border p-4">Nothing waiting.</li>}
            {pending.map((a) => <AppCard key={a.id} a={a} session={session} onDone={refresh} />)}
          </ul>
          {decided.length > 0 && (
            <>
              <h2 className="folio-eyebrow text-folio-cream-dim mt-10">Decided ({decided.length})</h2>
              <ul className="mt-3 space-y-3">{decided.map((a) => <AppCard key={a.id} a={a} session={session} onDone={refresh} />)}</ul>
            </>
          )}
        </>
      )}
      <div className="mt-10"><Link to="/studio" className="text-xs text-folio-cream-dim hover:text-folio-cream">Also a curator? Open the Studio →</Link></div>
    </div>
  );
}
