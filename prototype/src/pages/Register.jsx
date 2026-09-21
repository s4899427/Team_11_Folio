import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Wordmark from "@/components/folio/Wordmark";
import { useFolio } from "@/lib/folio-store";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { updateProfile } = useFolio();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim() || password.length < 4) {
      setError("Fill in a name, email, and a password of at least 4 characters.");
      return;
    }
    try {
      localStorage.setItem("folio_account", JSON.stringify({ name: name.trim(), email: email.trim(), password }));
    } catch (e) {}
    updateProfile({ name: name.trim() });
    navigate("/onboarding");
  };

  return (
    <div className="min-h-screen flex flex-col px-5 py-16 max-w-lg mx-auto">
      <div className="text-center mb-12 animate-fade-in">
        <Wordmark className="text-base justify-center" />
        <h1 className="folio-serif text-3xl text-folio-cream mt-8">Create your account</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 animate-fade-up">
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full bg-transparent border border-border p-3.5 text-sm text-folio-cream placeholder:text-folio-cream-dim/50 focus:outline-none focus:border-folio-saffron/40 transition-colors" />
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full bg-transparent border border-border p-3.5 text-sm text-folio-cream placeholder:text-folio-cream-dim/50 focus:outline-none focus:border-folio-saffron/40 transition-colors" />
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full bg-transparent border border-border p-3.5 text-sm text-folio-cream placeholder:text-folio-cream-dim/50 focus:outline-none focus:border-folio-saffron/40 transition-colors" />
        {error && <p className="text-xs text-folio-burgundy leading-relaxed">{error}</p>}
        <button type="submit" className="w-full py-3.5 bg-folio-cream text-folio-ink folio-eyebrow hover:bg-white transition-colors">Create Account</button>
      </form>

      <p className="text-center text-sm text-folio-cream-dim mt-8">
        Already have one? <Link to="/login" className="text-folio-saffron hover:underline">Log in</Link>
      </p>
      <p className="text-center text-xs text-folio-cream-dim/60 mt-4 leading-relaxed">
        Simulated sign-up for this prototype — stored only in this browser, not a real backend.
      </p>
    </div>
  );
}
