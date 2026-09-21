import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Wordmark from "@/components/folio/Wordmark";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    let account;
    try {
      account = JSON.parse(localStorage.getItem("folio_account") || "null");
    } catch (e) {}
    if (!account || account.email !== email || account.password !== password) {
      setError("Email or password doesn't match. This is a simulated login, stored locally on this device only.");
      return;
    }
    navigate("/onboarding");
  };

  return (
    <div className="min-h-screen flex flex-col px-5 py-16 max-w-lg mx-auto">
      <div className="text-center mb-12 animate-fade-in">
        <Wordmark className="text-base justify-center" />
        <h1 className="folio-serif text-3xl text-folio-cream mt-8">Welcome back</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 animate-fade-up">
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full bg-transparent border border-border p-3.5 text-sm text-folio-cream placeholder:text-folio-cream-dim/50 focus:outline-none focus:border-folio-saffron/40 transition-colors" />
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full bg-transparent border border-border p-3.5 text-sm text-folio-cream placeholder:text-folio-cream-dim/50 focus:outline-none focus:border-folio-saffron/40 transition-colors" />
        {error && <p className="text-xs text-folio-burgundy leading-relaxed">{error}</p>}
        <button type="submit" className="w-full py-3.5 bg-folio-cream text-folio-ink folio-eyebrow hover:bg-white transition-colors">Log In</button>
      </form>

      <p className="text-center text-sm text-folio-cream-dim mt-8">
        No account? <Link to="/register" className="text-folio-saffron hover:underline">Create one</Link>
      </p>
      <p className="text-center text-xs text-folio-cream-dim/60 mt-4 leading-relaxed">
        Simulated login for this prototype — stored only in this browser, not a real backend.
      </p>
    </div>
  );
}
