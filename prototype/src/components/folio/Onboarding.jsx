import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { COMMUNITY_GROUPS } from "@/lib/folio-data";
import { useFolio } from "@/lib/folio-store";
import Wordmark from "./Wordmark";
import { cn } from "@/lib/utils";

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [nameError, setNameError] = useState("");
  const [selected, setSelected] = useState(null);
  const [why, setWhy] = useState("");
  const { setCommunities, updateProfile, profile } = useFolio();
  const navigate = useNavigate();

  const continueFromName = () => {
    if (!name.trim() || !username.trim()) {
      setNameError("Both a name and a unique username are needed.");
      return;
    }
    updateProfile({ name: name.trim(), username: username.trim().replace(/\s+/g, "").toLowerCase() });
    setNameError("");
    setStep(1);
  };

  const finish = () => {
    setCommunities(selected ? [selected] : []);
    if (why.trim()) updateProfile({ onboardingWhy: why.trim() });
    navigate("/");
  };

  if (step === 0) {
    return (
      <div className="min-h-screen flex flex-col px-5 py-10 max-w-lg mx-auto">
        <div className="text-center mb-10 animate-fade-in">
          <Wordmark className="text-base justify-center" />
          <h1 className="folio-serif text-3xl text-folio-cream mt-8 leading-tight">Who should<br />we call you?</h1>
          <p className="text-sm text-folio-cream-dim mt-4 leading-relaxed">Your own name, or an artist name — either works. A username just needs to be unique to you.</p>
        </div>

        <div className="space-y-4 animate-fade-up">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Display name" className="w-full bg-transparent border border-border p-3.5 text-sm text-folio-cream placeholder:text-folio-cream-dim/50 focus:outline-none focus:border-folio-saffron/40 transition-colors" />
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username (e.g. @yourname)" className="w-full bg-transparent border border-border p-3.5 text-sm text-folio-cream placeholder:text-folio-cream-dim/50 focus:outline-none focus:border-folio-saffron/40 transition-colors" />
          {nameError && <p className="text-xs text-folio-burgundy">{nameError}</p>}
        </div>

        <div className="mt-auto pt-8">
          <button onClick={continueFromName} className="w-full py-4 bg-folio-cream text-folio-ink folio-eyebrow hover:bg-white transition-colors">Continue</button>
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="min-h-screen flex flex-col px-5 py-10 max-w-lg mx-auto">
        <div className="text-center mb-10 animate-fade-in">
          <Wordmark className="text-base" />
          <h1 className="folio-serif text-3xl text-folio-cream mt-8 leading-tight">Choose the one thing<br />that shapes how<br />you see the world.</h1>
          <p className="text-sm text-folio-cream-dim mt-4 leading-relaxed">Not a feed — a lens. Everyone still sees the same daily edition.</p>
        </div>

        <div className="grid grid-cols-1 gap-2.5 animate-fade-up">
          {COMMUNITY_GROUPS.map((g) => {
            const active = selected === g.id;
            return (
              <button key={g.id} onClick={() => setSelected(g.id)} className={cn("relative flex items-center gap-2.5 p-4 border text-left transition-all", active ? "border-folio-saffron/60 bg-folio-saffron/5" : "border-border")}>
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: g.color }} />
                <span className={cn("text-sm leading-tight", active ? "text-folio-cream" : "text-folio-cream-dim")}>{g.name}</span>
                {active && <Check className="w-4 h-4 text-folio-saffron absolute top-3 right-3" />}
              </button>
            );
          })}
        </div>

        <div className="mt-auto pt-8">
          <button onClick={() => setStep(2)} disabled={!selected} className="w-full py-4 bg-folio-cream text-folio-ink folio-eyebrow hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed">Continue</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col px-5 py-10 max-w-lg mx-auto">
      <div className="text-center mb-10 animate-fade-in">
        <Wordmark className="text-base" />
        <h1 className="folio-serif text-3xl text-folio-cream mt-8 leading-tight">What draws you<br />to this?</h1>
        <p className="text-sm text-folio-cream-dim mt-4 leading-relaxed">Optional — helps curators find what's genuinely relevant to you.</p>
      </div>

      <textarea
        value={why}
        onChange={(e) => setWhy(e.target.value)}
        rows={5}
        autoFocus
        placeholder="A sentence or two…"
        className="w-full bg-transparent border border-border p-4 text-sm text-folio-cream placeholder:text-folio-cream-dim/50 focus:outline-none focus:border-folio-saffron/40 transition-colors resize-none leading-relaxed animate-fade-up"
      />

      <div className="mt-auto pt-8 space-y-3">
        <button onClick={finish} className="w-full py-4 bg-folio-cream text-folio-ink folio-eyebrow hover:bg-white transition-colors">Enter FOLIO</button>
        <button onClick={finish} className="w-full py-2 text-folio-cream-dim text-xs folio-eyebrow hover:text-folio-cream transition-colors">Skip this step</button>
      </div>
    </div>
  );
}
