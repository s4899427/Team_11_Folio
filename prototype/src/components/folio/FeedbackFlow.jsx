import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";
import { useFolio } from "@/lib/folio-store";
import { cn } from "@/lib/utils";
import { submitFeedback } from "@/lib/feedback-capture";

const TOTAL = 5;

const Q1_OPTIONS = [
  { value: "immediately_understood", label: "I immediately understood it" },
  { value: "mostly_understood", label: "I mostly understood it" },
  { value: "unsure", label: "I was unsure what to do" },
  { value: "confusing", label: "I found it confusing" },
];

const Q4_OPTIONS = [
  { value: "definitely", label: "Definitely" },
  { value: "probably", label: "Probably" },
  { value: "maybe", label: "Maybe" },
  { value: "probably_not", label: "Probably not" },
  { value: "definitely_not", label: "Definitely not" },
];

export default function FeedbackFlow() {
  const navigate = useNavigate();
  const { setFeedbackGiven } = useFolio();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    q1_understanding: "", q1_feedback: "", q2_discovery_score: 0, q2_feedback: "",
    q3_trust_score: 0, q3_feedback: "", q4_return: "", q4_feedback: "", q5_one_change: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const set = (patch) => setData((d) => ({ ...d, ...patch }));

  const canProceed = () => {
    if (step === 0) return !!data.q1_understanding;
    if (step === 1) return data.q2_discovery_score > 0;
    if (step === 2) return data.q3_trust_score > 0;
    if (step === 3) return !!data.q4_return;
    if (step === 4) return data.q5_one_change.trim().length > 0;
    return false;
  };

  const submit = async () => {
    setSubmitting(true);
    await submitFeedback(data);
    setFeedbackGiven();
    setSubmitting(false);
    setDone(true);
  };

  const next = () => { if (step < TOTAL - 1) setStep(step + 1); else submit(); };

  if (done) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-5 max-w-lg mx-auto text-center">
        <div className="animate-scale-in">
          <div className="w-20 h-20 rounded-full bg-folio-saffron/15 flex items-center justify-center mx-auto"><Check className="w-10 h-10 text-folio-saffron" strokeWidth={2.5} /></div>
          <h2 className="folio-serif text-3xl text-folio-cream mt-6">Thank you</h2>
          <p className="text-sm text-folio-cream-dim mt-3 leading-relaxed max-w-sm">Your reflection helps FOLIO understand what meaningful discovery feels like — and where it falls short.</p>
          <button onClick={() => navigate("/")} className="mt-10 px-10 py-3.5 bg-folio-cream text-folio-ink folio-eyebrow hover:bg-white transition-colors">Back to Today</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col px-5 py-8 max-w-lg mx-auto">
      <div className="flex items-center gap-1.5 mb-10">
        {Array.from({ length: TOTAL }).map((_, i) => (
          <div key={i} className={cn("h-0.5 flex-1 transition-colors", i <= step ? "bg-folio-saffron" : "bg-border")} />
        ))}
      </div>

      <span className="folio-eyebrow text-folio-cream-dim">Question {step + 1} of {TOTAL}</span>

      <div className="flex-1 mt-6">
        {step === 0 && (
          <div className="animate-fade-in">
            <h2 className="folio-serif text-2xl text-folio-cream leading-tight">After using FOLIO, what best describes how it felt?</h2>
            <div className="mt-6 space-y-2.5">
              {Q1_OPTIONS.map((o) => (
                <Option key={o.value} active={data.q1_understanding === o.value} onClick={() => set({ q1_understanding: o.value })}>{o.label}</Option>
              ))}
            </div>
            <OptionalText value={data.q1_feedback} onChange={(v) => set({ q1_feedback: v })} placeholder="What made you feel that way?" />
          </div>
        )}
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="folio-serif text-2xl text-folio-cream leading-tight">Did FOLIO help you discover something you probably wouldn't have found yourself?</h2>
            <Scale value={data.q2_discovery_score} onChange={(v) => set({ q2_discovery_score: v })} leftLabel="Not at all" rightLabel="Absolutely" />
            <OptionalText value={data.q2_feedback} onChange={(v) => set({ q2_feedback: v })} placeholder="What did you discover?" />
          </div>
        )}
        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="folio-serif text-2xl text-folio-cream leading-tight">How much did you trust the content and curation in FOLIO?</h2>
            <Scale value={data.q3_trust_score} onChange={(v) => set({ q3_trust_score: v })} leftLabel="Not at all" rightLabel="Completely" />
            <OptionalText value={data.q3_feedback} onChange={(v) => set({ q3_feedback: v })} placeholder="What would make you trust it more?" />
          </div>
        )}
        {step === 3 && (
          <div className="animate-fade-in">
            <h2 className="folio-serif text-2xl text-folio-cream leading-tight">Would you come back to FOLIO?</h2>
            <div className="mt-6 space-y-2.5">
              {Q4_OPTIONS.map((o) => (
                <Option key={o.value} active={data.q4_return === o.value} onClick={() => set({ q4_return: o.value })}>{o.label}</Option>
              ))}
            </div>
            <OptionalText value={data.q4_feedback} onChange={(v) => set({ q4_feedback: v })} placeholder="What would make you want to come back?" />
          </div>
        )}
        {step === 4 && (
          <div className="animate-fade-in">
            <h2 className="folio-serif text-2xl text-folio-cream leading-tight">If you could change one thing about FOLIO, what would it be?</h2>
            <textarea value={data.q5_one_change} onChange={(e) => set({ q5_one_change: e.target.value })} rows={5} autoFocus placeholder="One thing…" className="w-full mt-6 bg-transparent border border-border p-4 text-sm text-folio-cream placeholder:text-folio-cream-dim/50 focus:outline-none focus:border-folio-saffron/40 transition-colors resize-none leading-relaxed" />
          </div>
        )}
      </div>

      <button onClick={next} disabled={!canProceed() || submitting} className="w-full mt-8 flex items-center justify-center gap-2 py-4 bg-folio-cream text-folio-ink folio-eyebrow hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
        {submitting ? "Submitting…" : step === TOTAL - 1 ? "Submit Feedback" : "Continue"}
        {!submitting && <ArrowRight className="w-4 h-4" />}
      </button>
    </div>
  );
}

function Option({ active, onClick, children }) {
  return (
    <button onClick={onClick} className={cn("w-full text-left px-4 py-3.5 border text-sm transition-all", active ? "border-folio-saffron/60 bg-folio-saffron/5 text-folio-cream" : "border-border text-folio-cream-dim hover:border-folio-cream-dim/40")}>{children}</button>
  );
}

function Scale({ value, onChange, leftLabel, rightLabel }) {
  return (
    <div className="mt-8">
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} onClick={() => onChange(n)} className={cn("flex-1 aspect-square border flex items-center justify-center folio-serif text-lg transition-all", value >= n ? "border-folio-saffron/60 bg-folio-saffron/10 text-folio-cream" : "border-border text-folio-cream-dim")}>{n}</button>
        ))}
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-xs text-folio-cream-dim">{leftLabel}</span>
        <span className="text-xs text-folio-cream-dim">{rightLabel}</span>
      </div>
    </div>
  );
}

function OptionalText({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  if (!show) return <button onClick={() => setShow(true)} className="mt-4 text-xs text-folio-saffron hover:underline">+ Add a note (optional)</button>;
  return (
    <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={2} className="w-full mt-4 bg-transparent border border-border p-3 text-sm text-folio-cream placeholder:text-folio-cream-dim/50 focus:outline-none focus:border-folio-saffron/40 resize-none leading-relaxed" />
  );
}
