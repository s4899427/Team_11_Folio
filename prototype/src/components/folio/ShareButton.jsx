import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { editionUrl } from "@/lib/live";
import { cn } from "@/lib/utils";

/**
 * Share a pick or an Edition. Uses the phone's share sheet where there is one,
 * otherwise copies the link, otherwise shows the link to copy by hand.
 * Shares only a link and a line of text: no account data.
 */
export default function ShareButton({ title, text, date, label = "Share", className }) {
  const [state, setState] = useState("idle"); // idle | copied | manual
  const url = () => editionUrl(window.location, date);

  const go = async () => {
    const link = url();
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title, text, url: link });
        return;
      }
    } catch (e) {
      if (e && e.name === "AbortError") return; // person closed the share sheet
    }
    try {
      await navigator.clipboard.writeText(`${text} ${link}`);
      setState("copied");
      setTimeout(() => setState("idle"), 2500);
      return;
    } catch {}
    setState("manual");
  };

  return (
    <span className="inline-flex flex-col">
      <button
        type="button"
        onClick={go}
        data-testid="share-button"
        className={cn("inline-flex items-center gap-1.5 px-3 min-h-[44px] border border-border text-xs text-folio-cream-dim hover:border-folio-saffron/50 hover:text-folio-cream transition-colors", className)}
      >
        {state === "copied" ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
        {state === "copied" ? "Link copied" : label}
      </button>
      <span role="status" aria-live="polite" className="sr-only">{state === "copied" ? "Link copied" : ""}</span>
      {state === "manual" && (
        <input
          readOnly
          value={url()}
          aria-label="Link to copy"
          onFocus={(e) => e.target.select()}
          className="mt-2 bg-transparent border border-border p-2 text-xs text-folio-cream w-64 max-w-full"
        />
      )}
    </span>
  );
}
