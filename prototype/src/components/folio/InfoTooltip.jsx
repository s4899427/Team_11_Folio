import { useState, useRef, useEffect } from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

// A small, tap-to-open explainer — used throughout the app since Folio
// (one curated edition a day, no algorithm) is an unfamiliar concept to
// most first-time users. Deliberately click/tap-based rather than
// hover-only, since this is a mobile-first app and hover isn't reliable
// on touch devices.
export default function InfoTooltip({ children, label = "What's this?", align = "left" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <span className="relative inline-flex" ref={ref}>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        aria-label={label}
        aria-expanded={open}
        className={cn(
          "inline-flex items-center justify-center w-4 h-4 rounded-full border border-folio-cream-dim/50 text-folio-cream-dim hover:border-folio-saffron hover:text-folio-saffron transition-colors flex-shrink-0",
          open && "border-folio-saffron text-folio-saffron"
        )}
      >
        <Info className="w-2.5 h-2.5" />
      </button>
      {open && (
        <div
          className={cn(
            "absolute z-30 top-6 w-64 p-3 bg-folio-ink-card border border-border text-xs text-folio-cream-dim leading-relaxed shadow-lg animate-fade-in",
            align === "left" ? "left-0" : "right-0"
          )}
        >
          {children}
        </div>
      )}
    </span>
  );
}
