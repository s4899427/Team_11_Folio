import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Wordmark from "@/components/folio/Wordmark";
import { auth, REMOTE, homeFor } from "@/lib/api";
import { useFolio } from "@/lib/folio-store";

const field = "w-full bg-transparent border border-border p-3.5 text-sm text-folio-cream placeholder:text-folio-cream-dim/50 focus:outline-none focus:border-folio-saffron/40 transition-colors";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { setSession, setSeenIntro, demoCurator, demoAdmin } = useFolio();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setBusy(true);
    try {
      const s = await auth.signIn({ email, password });
      setSession(s);
      setSeenIntro();
      // Members go to Today, curators to the Studio, the Folio team to the applications screen.
      navigate(homeFor(s, { demoCurator, demoAdmin }), { replace: true });
    } catch (err) { setError(err.message); }
    setBusy(false);
  };

  return (
    <div className="min-h-screen flex flex-col px-5 py-16 max-w-lg mx-auto">
      <div className="text-center mb-12"><Wordmark className="text-base justify-center" /><h1 className="folio-serif text-3xl text-folio-cream mt-8">Welcome back</h1></div>
      <form onSubmit={submit} className="space-y-4">
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" aria-label="Email" className={field} />
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" aria-label="Password" className={field} />
        {error && <p role="alert" className="text-xs text-folio-burgundy leading-relaxed">{error}</p>}
        <button type="submit" disabled={busy} className="w-full py-3.5 bg-folio-cream text-folio-ink folio-eyebrow disabled:opacity-50">{busy ? "Logging in…" : "Log in"}</button>
      </form>
      <p className="text-center text-sm text-folio-cream-dim mt-8">No account? <Link to="/register" className="text-folio-saffron hover:underline">Create one</Link></p>
      <p className="text-center text-sm text-folio-cream-dim mt-3"><Link to="/" className="hover:text-folio-cream">Keep browsing without one</Link></p>
      {!REMOTE && <p className="text-center text-xs text-folio-cream-dim/60 mt-6 leading-relaxed">Demo mode: accounts live only in this browser.</p>}
    </div>
  );
}
