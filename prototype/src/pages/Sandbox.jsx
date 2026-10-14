import { Link } from "react-router-dom";
import Wordmark from "@/components/folio/Wordmark";
import { IN_SANDBOX, SANDBOX_POSSIBLE, setSandbox } from "@/lib/api";

/** For markers and tutors: try every role (member, artist, curator, Folio team) with no account and no passwords. */
export default function Sandbox() {
  const go = (on) => { setSandbox(on); window.location.replace(window.location.pathname + "#/welcome"); window.location.reload(); };
  return (
    <div className="min-h-screen flex flex-col px-5 py-12 max-w-lg mx-auto" data-testid="sandbox">
      <Wordmark className="text-base" />
      <span className="folio-eyebrow text-folio-saffron mt-10">Sandbox</span>
      <h1 className="folio-serif text-4xl leading-tight text-folio-cream mt-3">Try every role, no account needed.</h1>
      <p className="text-sm text-folio-cream-dim mt-4 leading-relaxed">The sandbox runs Folio inside your own browser. You can join as a guest or member, sign up as an artist, then open <span className="text-folio-cream">Me, Settings, Demo switches</span> to try the Curator Studio and the Folio team screen. Everything you do stays on this device. Nothing is sent to the shared database and nothing is visible to anyone else.</p>
      {!SANDBOX_POSSIBLE && <p className="text-xs text-folio-cream-dim/80 mt-4 border border-border p-3">This copy has no shared database, so it already runs as a sandbox.</p>}
      <div className="mt-8 space-y-3">
        {!IN_SANDBOX
          ? <button data-testid="sandbox-start" onClick={() => go(true)} className="w-full py-3.5 bg-folio-cream text-folio-ink folio-eyebrow">Start the sandbox</button>
          : <button data-testid="sandbox-leave" onClick={() => go(false)} className="w-full py-3.5 border border-border text-folio-cream folio-eyebrow">Leave the sandbox (use the live app)</button>}
        <Link to="/welcome" className="block text-center text-xs text-folio-cream-dim hover:text-folio-cream">Back to Folio</Link>
      </div>
    </div>
  );
}
