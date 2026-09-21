import { useState } from "react";
import { Bookmark } from "lucide-react";
import ThreadCard from "@/components/folio/ThreadCard";
import PostCard from "@/components/folio/PostCard";
import InfoTooltip from "@/components/folio/InfoTooltip";
import { ARCHIVE_THREADS, ARCHIVE_POSTS } from "@/lib/folio-data";
import { useFolio } from "@/lib/folio-store";
import { cn } from "@/lib/utils";

const TABS = ["Threads", "Posts", "Saved"];
const TAB_HELP = {
  Threads: "Past daily editions — every Thread that's ever gone live, in order. Once a day locks, it moves here forever.",
  Posts: "Everything you and the community have posted, outside of the curated daily Thread.",
  Saved: "Your own unfinished drafts and anything you've bookmarked from others — merged into one place.",
};

export default function Archive() {
  const [tab, setTab] = useState("Threads");
  const [brokenIds, setBrokenIds] = useState(new Set());
  const { saved, posts } = useFolio();

  // Bug fix: this used to only ever show the hardcoded seed posts —
  // a user's own published posts (from Me → Make a Post) never appeared
  // here. Merging the user's own general-archive posts in now.
  const userArchivePosts = posts.filter((p) => p.about === "archive");
  const allPosts = [...userArchivePosts, ...ARCHIVE_POSTS].filter((p) => !brokenIds.has(p.id));

  const markBroken = (id) => setBrokenIds((s) => new Set(s).add(id));

  return (
    <div className="max-w-lg mx-auto px-5 pt-8">
      <div className="flex items-center gap-2 animate-fade-in">
        <h1 className="folio-serif text-3xl text-folio-cream">Archive</h1>
        <InfoTooltip>Nothing is ever deleted or re-ranked here — once a Thread or post lands in the Archive, it stays exactly as it was.</InfoTooltip>
      </div>
      <p className="text-sm text-folio-cream-dim mt-1.5 animate-fade-in">Every edition, kept. Read-only, permanent.</p>

      <div className="flex gap-6 mt-7 border-b border-border">
        {TABS.map((t) => (
          <div
            key={t}
            role="button"
            tabIndex={0}
            onClick={() => setTab(t)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setTab(t); }}
            className={cn("pb-3 flex items-center gap-1.5 folio-eyebrow transition-colors border-b-2 -mb-px cursor-pointer select-none", tab === t ? "text-folio-cream border-folio-saffron" : "text-folio-cream-dim border-transparent")}
          >
            {t}
            {tab === t && <InfoTooltip label={`About ${t}`}>{TAB_HELP[t]}</InfoTooltip>}
          </div>
        ))}
      </div>

      <div className="mt-2">
        {tab === "Threads" && (<div className="animate-fade-in">{ARCHIVE_THREADS.map((t) => (<ThreadCard key={t.id} thread={t} />))}</div>)}
        {tab === "Posts" && (
          <div className="animate-fade-in">
            {allPosts.length === 0 ? (
              <div className="flex flex-col items-center py-24 text-center">
                <p className="text-sm text-folio-cream-dim">No posts to show right now.</p>
              </div>
            ) : (
              allPosts.map((p) => <PostCard key={p.id} post={p} onImageError={markBroken} />)
            )}
          </div>
        )}
        {tab === "Saved" && (<div className="animate-fade-in">{saved.length === 0 ? <EmptySaved /> : saved.map((p) => <PostCard key={p.id} post={p} />)}</div>)}
      </div>
    </div>
  );
}

function EmptySaved() {
  return (
    <div className="flex flex-col items-center py-24 text-center">
      <Bookmark className="w-8 h-8 text-folio-cream-dim/40" />
      <p className="text-sm text-folio-cream-dim mt-4">Nothing saved yet.</p>
      <p className="text-xs text-folio-cream-dim/60 mt-1.5 max-w-[15rem] leading-relaxed">Your own unfinished posts and anything you bookmark from others both live here now.</p>
    </div>
  );
}
