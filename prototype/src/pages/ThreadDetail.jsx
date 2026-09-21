import { useParams, Link } from "react-router-dom";
import { Lock, ArrowLeft } from "lucide-react";
import CuratorCard from "@/components/folio/CuratorCard";
import ThreadElement from "@/components/folio/ThreadElement";
import AmbientPresence from "@/components/folio/AmbientPresence";
import PostCard from "@/components/folio/PostCard";
import { TODAY_THREAD, ARCHIVE_THREADS, FEATURED_POSTS, getCurator } from "@/lib/folio-data";

export default function ThreadDetail() {
  const { id } = useParams();
  const thread = id === TODAY_THREAD.id ? TODAY_THREAD : ARCHIVE_THREADS.find((t) => t.id === id);

  if (!thread) {
    return (
      <div className="max-w-lg mx-auto px-5 pt-20 text-center">
        <p className="folio-serif text-xl text-folio-cream">Thread not found.</p>
        <Link to="/archive" className="text-sm text-folio-saffron mt-4 inline-block hover:underline">Back to Archive</Link>
      </div>
    );
  }

  const isToday = thread.id === TODAY_THREAD.id;
  const curator = typeof thread.curator === "string" ? getCurator(thread.curator) : thread.curator;
  const back = isToday ? "/" : "/archive";

  return (
    <div className="max-w-lg mx-auto px-5 pt-8">
      <Link to={back} className="inline-flex items-center gap-1.5 text-xs text-folio-cream-dim hover:text-folio-cream transition-colors animate-fade-in">
        <ArrowLeft className="w-3.5 h-3.5" /> {isToday ? "Today" : "Archive"}
      </Link>

      <div className="mt-6 animate-fade-up">
        <span className="folio-eyebrow text-folio-cream-dim">{thread.dateLabel}</span>
        <h1 className="folio-serif text-[2.75rem] leading-[1.02] text-folio-cream mt-2">{thread.title}</h1>
        <div className="mt-6"><CuratorCard curator={curator} /></div>
        <div className="mt-4"><AmbientPresence count={thread.presence} /></div>
      </div>

      {!isToday && (
        <div className="mt-6 flex items-center gap-2.5 py-3.5 px-4 border border-border bg-folio-ink-card animate-fade-in">
          <Lock className="w-3.5 h-3.5 text-folio-cream-dim flex-shrink-0" />
          <span className="text-xs text-folio-cream-dim leading-relaxed">This thread is archived. Read-only — no posting or commenting.</span>
        </div>
      )}

      <div className="mt-10 space-y-14">
        {thread.elements.map((el, i) => (<ThreadElement key={i} element={el} index={i} />))}
      </div>

      <div className="mt-16">
        <span className="folio-eyebrow text-folio-saffron">Curator's selection</span>
        <p className="text-xs text-folio-cream-dim mt-1.5">{curator.name.split(" ")[0]} personally chose these from the community.</p>
        <div className="mt-4">{FEATURED_POSTS.map((p) => (<PostCard key={p.id} post={p} locked={!isToday} />))}</div>
      </div>

      <div className="h-4" />
    </div>
  );
}
