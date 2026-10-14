const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

/** Sticky shortcuts so Nearby and the curator are one tap away from the top of Today. */
export default function JumpBar({ items }) {
  return (
    <nav aria-label="Jump to a section" className="sticky top-0 z-30 -mx-5 px-5 py-2.5 bg-folio-ink/95 backdrop-blur-md border-b border-border flex gap-2 overflow-x-auto scrollbar-hide" data-testid="jumpbar">
      {items.map((it) => (
        <button key={it.id} onClick={() => go(it.id)} data-testid={`jump-${it.id}`}
          className={`shrink-0 px-3 py-1.5 border text-[0.65rem] folio-eyebrow transition-colors ${it.strong ? "border-folio-saffron text-folio-saffron" : "border-border text-folio-cream-dim hover:text-folio-cream"}`}>
          {it.label}
        </button>
      ))}
    </nav>
  );
}
