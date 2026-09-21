import { useState } from "react";
import { Moon, ExternalLink, Sparkles } from "lucide-react";
import { TONIGHT_THEME, ARCHIVE_POSTS } from "@/lib/folio-data";

const PAGE_SIZE = 5;

// "Friends & More" — merged replacement for the earlier three separate
// half-built features. Community posts are paginated on demand, never
// auto-refreshed — a user-initiated "Load more" instead of a 15-second
// polling loop, which would have been exactly the auto-refresh pattern
// this product is built to avoid.
export default function GoingOutCard() {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visiblePosts = ARCHIVE_POSTS.slice(0, visibleCount);
  const hasMore = visibleCount < ARCHIVE_POSTS.length;

  return (
    <section className="border border-border p-5 space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <Moon className="w-3.5 h-3.5 text-folio-saffron" />
          <span className="folio-eyebrow text-folio-cream-dim">Tonight's theme</span>
        </div>
        <h3 className="folio-serif text-2xl text-folio-cream mt-2">{TONIGHT_THEME.theme}</h3>
        <p className="text-sm text-folio-cream-dim mt-1.5 leading-relaxed italic">{TONIGHT_THEME.prompt}</p>
      </div>

      <a
        href="https://open.spotify.com"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center gap-3 px-4 py-3 border border-border hover:border-folio-saffron/50 hover:bg-folio-saffron/5 transition-all text-left"
      >
        <ExternalLink className="w-4 h-4 text-folio-terracotta flex-shrink-0" />
        <div className="min-w-0">
          <span className="text-sm text-folio-cream block">Listen together on Spotify</span>
          <span className="text-xs text-folio-cream-dim">Opens externally — no playback in FOLIO</span>
        </div>
      </a>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-folio-saffron" />
          <span className="folio-eyebrow text-folio-cream-dim">From your community</span>
        </div>
        <div className="space-y-2.5">
          {visiblePosts.map((p) => (
            <div key={p.id} className="flex items-center gap-2.5">
              <img src={p.authorImage} alt={p.author} className="w-6 h-6 rounded-full object-cover flex-shrink-0" />
              <p className="text-xs text-folio-cream-dim truncate">
                <span className="text-folio-cream">{p.author}</span> — {p.title}
              </p>
            </div>
          ))}
        </div>
        {hasMore ? (
          <button onClick={() => setVisibleCount((c) => c + PAGE_SIZE)} className="w-full mt-4 py-2 border border-dashed border-border text-xs text-folio-cream-dim hover:border-folio-saffron/40 hover:text-folio-cream transition-colors">
            Load 5 more
          </button>
        ) : (
          <p className="text-[0.65rem] text-folio-cream-dim/60 mt-3">That's it for now — not an endless list.</p>
        )}
      </div>
    </section>
  );
}
