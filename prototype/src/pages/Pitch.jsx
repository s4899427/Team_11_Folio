import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { listCurators, sendPitch } from "@/lib/api";
import { useFolio } from "@/lib/folio-store";

const field = "w-full bg-transparent border border-border p-3.5 text-sm text-folio-cream placeholder:text-folio-cream-dim/50 focus:outline-none focus:border-folio-saffron/40";

export default function Pitch() {
  const { session, city } = useFolio();
  const { data: curators = [] } = useQuery({ queryKey: ["curators", city.id], queryFn: () => listCurators(city.id) });
  const [f, setF] = useState({ curatorId: "", title: "", link: "", note: "" });
  const [state, setState] = useState({ busy: false, error: "", done: false });

  if (!session) return <div className="max-w-lg mx-auto px-5 pt-8"><p className="text-sm text-folio-cream-dim"><Link to="/login" className="text-folio-saffron">Log in</Link> to pitch a track.</p></div>;

  const cur = curators.find((c) => c.id === (f.curatorId || curators[0]?.id));
  if (session && curators.length === 0) return <div className="max-w-lg mx-auto px-5 pt-8"><p className="text-sm text-folio-cream-dim leading-relaxed">{city.name} has no curators yet, so there is nobody to pitch to. <Link to="/apply" className="text-folio-saffron">Apply to curate</Link> or switch city.</p></div>;
  const submit = async (e) => {
    e.preventDefault();
    setState({ busy: true, error: "", done: false });
    try {
      await sendPitch(session, { ...f, curatorId: cur.id, curatorName: cur.name });
      setState({ busy: false, error: "", done: true });
      setF({ curatorId: "", title: "", link: "", note: "" });
    } catch (err) { setState({ busy: false, error: err.status === 401 ? "Your session expired. Log in again." : err.message, done: false }); }
  };

  return (
    <div className="max-w-lg mx-auto px-5 pt-8">
      <Link to="/me" className="inline-flex items-center gap-1.5 text-xs text-folio-cream-dim hover:text-folio-cream mb-6"><ArrowLeft className="w-3.5 h-3.5" /> Me</Link>
      <span className="folio-eyebrow text-folio-saffron">For artists</span>
      <h1 className="folio-serif text-4xl text-folio-cream mt-3">Pitch a track</h1>
      <p className="text-sm text-folio-cream-dim mt-3 leading-relaxed">A curator reads every pitch and decides. Being featured is a human judgement, not a popularity score, and a pitch is never a guarantee.</p>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <select value={f.curatorId || cur?.id || ""} onChange={(e) => setF({ ...f, curatorId: e.target.value })} aria-label="Curator" className={field + " bg-folio-ink"}>
          {curators.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input required value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="Track or release name" aria-label="Track name" className={field} />
        <input required type="url" value={f.link} onChange={(e) => setF({ ...f, link: e.target.value })} placeholder="Link to listen (Bandcamp, Spotify, YouTube…)" aria-label="Listen link" className={field} />
        <textarea value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} maxLength={500} rows={4} placeholder="Why should a curator hear this? (500 characters)" aria-label="Note" className={field} />
        {state.error && <p role="alert" className="text-xs text-folio-burgundy">{state.error}</p>}
        {state.done && <p data-testid="pitch-sent" className="text-sm text-folio-saffron">Pitch sent to {cur?.name}.</p>}
        <button type="submit" disabled={state.busy} className="w-full py-3.5 bg-folio-cream text-folio-ink folio-eyebrow disabled:opacity-50">{state.busy ? "Sending…" : "Send pitch"}</button>
      </form>
    </div>
  );
}
