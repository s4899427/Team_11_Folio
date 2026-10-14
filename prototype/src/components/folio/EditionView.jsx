import ItemCard from "./ItemCard";
import Comments from "./Comments";
import Countdown from "./Countdown";
import DiscoveryCheck from "./DiscoveryCheck";
import { formatLong } from "@/lib/time";
import { composition } from "@/lib/validate";

/**
 * One Edition. Slots let Today put the curator card above the picks and
 * Did you know between the picks and the discussion.
 */
export default function EditionView({ edition, locked, curatorCard, afterPicks, hideDiscovery }) {
  return (
    <div data-testid="edition">
      {curatorCard}
      <div id="picks" className="scroll-mt-16 mt-8">
        <span className="folio-eyebrow text-folio-saffron">{locked ? "Archived Edition" : "Today's Edition"} · {formatLong(edition.date)}</span>
        <h1 className="folio-serif text-[2.5rem] leading-[1.05] text-folio-cream mt-3" data-testid="edition-title">{edition.title}</h1>
        {edition.blurb && <p className="text-sm text-folio-cream-dim mt-3 leading-relaxed">{edition.blurb}</p>}
        {!curatorCard && <p className="text-xs text-folio-cream-dim mt-4">Curated by <span className="text-folio-cream">{edition.curatorName}</span>{edition.seed ? " · founding Edition" : ""}</p>}
      </div>

      {(() => { const c = composition(edition.items.filter((it) => ["track", "album", "artist"].includes(it.kind))); return c.emerging > 0 ? (
        <p data-testid="composition" className="mt-6 text-xs text-folio-cream-dim">In this Edition: {c.established} you may already know, <span className="text-folio-saffron">{c.emerging} new and upcoming</span>.</p>
      ) : null; })()}
      {!locked && (
        <div className="mt-8 py-5 border-y border-border folio-textile"><Countdown /></div>
      )}

      <div className="mt-10 space-y-12">
        {edition.items.map((it, i) => (<ItemCard key={it.id || i} item={it} index={i} editionDate={edition.date} />))}
      </div>

      {afterPicks}
      {!hideDiscovery && edition.id !== "preview" && <DiscoveryCheck editionId={edition.id} curatorId={edition.curatorId} />}
      <Comments editionId={edition.id} locked={locked} />
    </div>
  );
}
