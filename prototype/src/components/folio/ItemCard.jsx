import { useState } from "react";
import { Bookmark, ChevronDown, ExternalLink } from "lucide-react";
import { listenLinks, findUrl } from "@/lib/seed";
import { useFolio } from "@/lib/folio-store";
import { cn } from "@/lib/utils";

const KIND_LABEL = { track: "Track", album: "Album", artist: "Artist", place: "Place", story: "Story" };
const SLEEVES = ["#7C1F3A", "#C25B3F", "#D4A24E", "#2F5447", "#8B5A3C", "#6B7F6E", "#9B7B8E", "#A04555"];
const sleeveColor = (s) => SLEEVES[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % SLEEVES.length];

const ORIGIN_LABEL = { local: "Brisbane-based", national: "Australia", other: "Elsewhere" };
const music_or_artist = (it) => ["track", "album", "artist"].includes(it.kind) && it.stage;

export default function ItemCard({ item, index, editionDate }) {
  const [open, setOpen] = useState(false);
  const { toggleSaved, isSaved } = useFolio();
  const saved = isSaved(item.id);
  const music = item.kind === "track" || item.kind === "album";
  const links = listenLinks(item);

  return (
    <article className="animate-fade-up" data-testid="item-card" style={{ animationDelay: `${index * 60}ms` }}>
      <div className="flex gap-4">
        <div className="shrink-0 w-14 h-14 flex items-end justify-start p-1.5" style={{ background: sleeveColor(item.title + item.artist) }} aria-hidden>
          <span className="folio-serif text-folio-cream/90 text-xl leading-none">{String(index + 1).padStart(2, "0")}</span>
        </div>
        <div className="min-w-0 flex-1">
          <span className="folio-eyebrow text-folio-cream-dim">{KIND_LABEL[item.kind] || item.kind}{item.year ? ` · ${item.year}` : ""}</span>
          <h3 className="folio-serif text-2xl leading-tight text-folio-cream mt-1">{item.title}</h3>
          <p className="text-sm text-folio-cream-dim mt-0.5">{item.artist}</p>
          {music_or_artist(item) && (
            <p className="mt-2 flex flex-wrap gap-1.5" data-testid="item-tags">
              <span data-testid="tag-stage" className={cn("folio-eyebrow px-1.5 py-0.5 border", item.stage === "emerging" ? "border-folio-saffron text-folio-saffron" : "border-border text-folio-cream-dim")}>{item.stage === "emerging" ? "New & upcoming" : "Established"}</span>
              {item.origin && <span className="folio-eyebrow px-1.5 py-0.5 border border-border text-folio-cream-dim">{ORIGIN_LABEL[item.origin]}</span>}
              {item.stage === "emerging" && item.knowsArtist && <span className="folio-eyebrow px-1.5 py-0.5 border border-border text-folio-cream-dim">Curator knows them</span>}
            </p>
          )}
          {item.stage === "emerging" && item.evidence?.localNote && (
            <p className="mt-2 text-xs text-folio-cream-dim" data-testid="item-evidence">
              <span className="folio-eyebrow text-folio-saffron mr-1.5">Local</span>{item.evidence.localNote}{" "}
              {item.evidence.artistUrl && <a href={item.evidence.artistUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-folio-cream">Artist's page</a>}
              {item.evidence.thirdUrl && <> · <a href={item.evidence.thirdUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-folio-cream">{item.evidence.thirdLabel || "Second source"}</a></>}
            </p>
          )}
        </div>
        <button
          onClick={() => toggleSaved({ id: item.id, title: item.title, artist: item.artist, editionDate })}
          aria-label={saved ? "Remove from saved" : "Save privately"}
          className="self-start p-1.5 -m-1.5"
        >
          <Bookmark className={cn("w-5 h-5", saved ? "fill-folio-saffron text-folio-saffron" : "text-folio-cream-dim")} strokeWidth={1.5} />
        </button>
      </div>

      <p className="text-sm text-folio-cream leading-relaxed mt-4"><span className="folio-eyebrow text-folio-saffron mr-2">Why it's here</span>{item.why}</p>

      <div className="flex flex-wrap gap-2 mt-4">
        {music ? (
          <>
            <LinkChip href={links.spotify}>Spotify</LinkChip>
            <LinkChip href={links.youtube}>YouTube</LinkChip>
            <LinkChip href={links.bandcamp}>Bandcamp</LinkChip>
          </>
        ) : (
          <LinkChip href={findUrl(item)}>Find out more</LinkChip>
        )}
      </div>

      {item.linerNote && (
        <div className="mt-4 border-t border-border pt-3">
          <button onClick={() => setOpen((o) => !o)} aria-expanded={open} data-testid="liner-toggle" className="w-full flex items-center justify-between text-left">
            <span className="folio-eyebrow text-folio-cream">Liner note</span>
            <ChevronDown className={cn("w-4 h-4 text-folio-cream-dim transition-transform", open && "rotate-180")} />
          </button>
          {open && (
            <div className="mt-2 animate-fade-in" data-testid="liner-body">
              <p className="text-sm text-folio-cream-dim leading-relaxed">{item.linerNote.text}</p>
              {item.linerNote.sourceUrl && (
                <a href={item.linerNote.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-folio-saffron mt-2 hover:underline">
                  Source: {item.linerNote.sourceLabel || "link"} <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function LinkChip({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="px-3 py-1.5 border border-border text-xs text-folio-cream-dim hover:border-folio-saffron/50 hover:text-folio-cream transition-colors">
      {children}
    </a>
  );
}
