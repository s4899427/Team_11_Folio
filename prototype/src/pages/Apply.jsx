import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { applyToCurate } from "@/lib/api";
import { useFolio } from "@/lib/folio-store";

const field = "w-full bg-transparent border border-border p-3.5 text-sm text-folio-cream placeholder:text-folio-cream-dim/50 focus:outline-none focus:border-folio-saffron/40";

export default function Apply() {
  const { session, city } = useFolio();
  const qc = useQueryClient();
  const [f, setF] = useState({ city: city.name, why: "", link: "" });
  const [state, setState] = useState({ busy: false, error: "", done: false });

  if (!session) return <div className="max-w-lg mx-auto px-5 pt-8"><p className="text-sm text-folio-cream-dim"><Link to="/login" className="text-folio-saffron">Log in</Link> to apply to curate.</p></div>;

  const submit = async (e) => {
    e.preventDefault();
    setState({ busy: true, error: "", done: false });
    try { await applyToCurate(session, f); qc.invalidateQueries({ queryKey: ["my-application"] }); setState({ busy: false, error: "", done: true }); }
    catch (err) { setState({ busy: false, error: err.status === 401 ? "Your session expired. Log in again." : err.message, done: false }); }
  };

  return (
    <div className="max-w-lg mx-auto px-5 pt-8">
      <Link to="/me" className="flex w-fit items-center gap-1.5 text-xs text-folio-cream-dim hover:text-folio-cream mb-6"><ArrowLeft className="w-3.5 h-3.5" /> Me</Link>
      <span className="folio-eyebrow text-folio-saffron">Become a curator</span>
      <h1 className="folio-serif text-4xl text-folio-cream mt-3">Apply to curate</h1>
      <p className="text-sm text-folio-cream-dim mt-3 leading-relaxed">Curators are people who know their city's music and want to share it. The Folio team approves new curators. After that, readers back you for discovery and passion, not popularity.</p>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <input required value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} placeholder="Your city" aria-label="City" className={field} />
        <textarea required value={f.why} onChange={(e) => setF({ ...f, why: e.target.value })} rows={5} maxLength={600} placeholder="What would you bring? Name a few artists, rooms or stories you'd feature." aria-label="Why you" className={field} />
        <input type="url" value={f.link} onChange={(e) => setF({ ...f, link: e.target.value })} placeholder="A playlist, blog or page that shows your taste (optional)" aria-label="Link" className={field} />
        {state.error && <p role="alert" className="text-xs text-folio-burgundy">{state.error}</p>}
        {state.done && <p data-testid="apply-sent" className="text-sm text-folio-saffron">Thanks. We'll read this and be in touch.</p>}
        <button type="submit" disabled={state.busy} className="w-full py-3.5 bg-folio-cream text-folio-ink folio-eyebrow disabled:opacity-50">{state.busy ? "Sending…" : "Send application"}</button>
      </form>
    </div>
  );
}
