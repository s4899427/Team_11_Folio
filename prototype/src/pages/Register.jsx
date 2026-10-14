import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Wordmark from "@/components/folio/Wordmark";
import { auth, REMOTE } from "@/lib/api";
import { useFolio } from "@/lib/folio-store";
import { cn } from "@/lib/utils";

const field = "w-full bg-transparent border border-border p-3.5 text-sm text-folio-cream placeholder:text-folio-cream-dim/50 focus:outline-none focus:border-folio-saffron/40 transition-colors";

export default function Register() {
  const [f, setF] = useState({ name: "", email: "", password: "", suburb: "", role: "listener" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { setSession, setSeenIntro, city } = useFolio();
  const navigate = useNavigate();
  const set = (p) => setF((x) => ({ ...x, ...p }));

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setBusy(true);
    try {
      const s = await auth.signUp({ ...f, city: city.id });
      setSession(s);
      setSeenIntro();
      navigate(s.role === "artist" ? "/artist" : "/", { replace: true });
    } catch (err) { setError(err.message); }
    setBusy(false);
  };

  // Tradeshow path: a first name is enough. Creates a throwaway listener account so
  // several visitors can use the shared Edition at once without typing an email.
  const guest = async () => {
    setError(""); setBusy(true);
    try {
      const id = Math.random().toString(36).slice(2, 10);
      setSession(await auth.signUp({
        name: f.name.trim() || "Guest " + id.slice(0, 3).toUpperCase(),
        email: `guest-${id}@folio-guest.example.com`, password: Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2),
        suburb: "", role: "listener", city: city.id,
      }));
      setSeenIntro();
      navigate("/");
    } catch (err) { setError(err.message); }
    setBusy(false);
  };

  return (
    <div className="min-h-screen flex flex-col px-5 py-12 max-w-lg mx-auto">
      <div className="text-center mb-10"><Wordmark className="text-base justify-center" /><h1 className="folio-serif text-3xl text-folio-cream mt-8">Join Folio</h1></div>
      <form onSubmit={submit} className="space-y-4">
        <input required value={f.name} onChange={(e) => set({ name: e.target.value })} placeholder="Your name" aria-label="Your name" className={field} />
        <input type="email" required value={f.email} onChange={(e) => set({ email: e.target.value })} placeholder="Email" aria-label="Email" className={field} />
        <input type="password" required minLength={6} value={f.password} onChange={(e) => set({ password: e.target.value })} placeholder="Password (6+ characters)" aria-label="Password" className={field} />
        <input value={f.suburb} onChange={(e) => set({ suburb: e.target.value })} placeholder="Suburb (optional)" aria-label="Suburb" className={field} />
        <div>
          <p className="folio-eyebrow text-folio-cream-dim mb-2">I'm here as</p>
          <div className="grid grid-cols-3 gap-2">
            {[["listener", "A listener", "Discover and discuss"], ["artist", "An artist", "Pitch my music"]].map(([v, l, d]) => (
              <button type="button" key={v} onClick={() => set({ role: v })} aria-pressed={f.role === v} className={cn("text-left p-3 border transition-colors", f.role === v ? "border-folio-saffron bg-folio-saffron/10" : "border-border")}>
                <span className="block text-sm text-folio-cream">{l}</span><span className="block text-xs text-folio-cream-dim mt-0.5">{d}</span>
              </button>
            ))}
            <button type="button" disabled aria-disabled="true" title="Curator is applied for, not chosen" data-testid="role-curator-disabled" className="text-left p-3 border border-border opacity-40 cursor-not-allowed">
              <span className="block text-sm text-folio-cream">A curator</span><span className="block text-xs text-folio-cream-dim mt-0.5">Applied for</span>
            </button>
          </div>
          <p className="text-xs text-folio-cream-dim/70 mt-2">Curator is applied for, not chosen. The Folio team approves curators after you <Link to="/apply" className="text-folio-saffron hover:underline">apply</Link>.</p>
        </div>
        {error && <p role="alert" className="text-xs text-folio-burgundy leading-relaxed">{error}</p>}
        <button type="submit" disabled={busy} className="w-full py-3.5 bg-folio-cream text-folio-ink folio-eyebrow disabled:opacity-50">{busy ? "Creating…" : "Create account"}</button>
      </form>
      <div className="mt-6 border-t border-border pt-6 text-center">
        <button type="button" data-testid="guest-join" onClick={guest} disabled={busy} className="w-full py-3 border border-folio-saffron/50 text-folio-saffron folio-eyebrow disabled:opacity-50">Just looking? Join as a guest</button>
        <p className="text-xs text-folio-cream-dim/70 mt-2 leading-relaxed">Uses the name above if you typed one. No email needed. Guests can comment, answer the Discovery check and back curators.</p>
      </div>
      <p className="text-center text-sm text-folio-cream-dim mt-8">Have an account? <Link to="/login" className="text-folio-saffron hover:underline">Log in</Link></p>
      {!REMOTE && <p className="text-center text-xs text-folio-cream-dim/60 mt-6 leading-relaxed">Demo mode: accounts live only in this browser.</p>}
    </div>
  );
}
