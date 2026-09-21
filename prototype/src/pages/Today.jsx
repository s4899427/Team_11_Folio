import Wordmark from "@/components/folio/Wordmark";
import Countdown from "@/components/folio/Countdown";
import AmbientPresence from "@/components/folio/AmbientPresence";
import CuratorCard from "@/components/folio/CuratorCard";
import ThreadElement from "@/components/folio/ThreadElement";
import LocationCard from "@/components/folio/LocationCard";
import GoingOutCard from "@/components/folio/GoingOutCard";
import EngagementBar from "@/components/folio/EngagementBar";
import CommentSection from "@/components/folio/CommentSection";
import InfoTooltip from "@/components/folio/InfoTooltip";
import { TODAY_THREAD } from "@/lib/folio-data";

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

export default function Today() {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="max-w-lg mx-auto px-5 pt-8">
      <div className="flex items-center justify-between animate-fade-in">
        <Wordmark />
        <span className="text-xs text-folio-cream-dim">{dateStr}</span>
      </div>

      <p className="text-xs text-folio-cream-dim/80 mt-3 leading-relaxed animate-fade-in max-w-sm">
        One curated edition a day, chosen by a human curator — no algorithm, nothing re-ranked. It locks tonight and moves to the Archive forever.
      </p>

      {/* 3 main anchors for Today */}
      <div className="flex gap-2 mt-5 animate-fade-in">
        <button onClick={() => scrollTo("thread-top")} className="flex-1 py-2 border border-border text-[0.65rem] folio-eyebrow text-folio-cream-dim hover:border-folio-saffron/50 hover:text-folio-cream transition-all">Thread</button>
        <button onClick={() => scrollTo("whats-happening")} className="flex-1 py-2 border border-border text-[0.65rem] folio-eyebrow text-folio-cream-dim hover:border-folio-saffron/50 hover:text-folio-cream transition-all">Today</button>
        <button onClick={() => scrollTo("friends-more")} className="flex-1 py-2 border border-border text-[0.65rem] folio-eyebrow text-folio-cream-dim hover:border-folio-saffron/50 hover:text-folio-cream transition-all">Friends</button>
      </div>

      <div id="thread-top" className="mt-10 animate-fade-up scroll-mt-6">
        <div className="flex items-center gap-2">
          <span className="folio-eyebrow text-folio-saffron">Today's Edition</span>
          <InfoTooltip>A Thread is today's single curated storyline — a small set of hand-picked pieces across music, art, food, fashion and more, chosen by today's curator. Tomorrow brings a new one.</InfoTooltip>
        </div>
        <h1 className="folio-serif text-[2.75rem] leading-[1.02] text-folio-cream mt-3">{TODAY_THREAD.title}</h1>
        <div className="mt-6"><CuratorCard curator={TODAY_THREAD.curator} compact /></div>
        <div className="mt-5"><AmbientPresence count={TODAY_THREAD.presence} /></div>
      </div>

      <div className="mt-8 py-5 border-y border-border folio-textile flex flex-col items-center gap-1.5">
        <Countdown />
        <span className="text-[0.65rem] text-folio-cream-dim/60">Until today's edition locks and archives</span>
      </div>

      <div className="mt-10 space-y-14">
        {TODAY_THREAD.elements.map((el, i) => (<ThreadElement key={i} element={el} index={i} />))}
      </div>

      {/* Thread-level discussion — same shared engine as individual posts */}
      <div className="mt-12 border-t border-border pt-6">
        <span className="folio-eyebrow text-folio-cream-dim">Discuss today's Thread</span>
        <div className="flex items-center gap-4 mt-3">
          <EngagementBar targetId={TODAY_THREAD.id} baseLikes={0} />
        </div>
        <div className="mt-3">
          <CommentSection targetId={TODAY_THREAD.id} />
        </div>
      </div>

      <div id="whats-happening" className="mt-14 scroll-mt-6">
        <div className="flex items-center gap-2">
          <span className="folio-eyebrow text-folio-saffron">What's happening today</span>
          <InfoTooltip>Nearby cultural events, pulled live where possible — not part of the curated Thread, just useful context for tonight.</InfoTooltip>
        </div>
        <div className="mt-4"><LocationCard /></div>
      </div>

      <div id="friends-more" className="mt-8 mb-4 scroll-mt-6">
        <div className="flex items-center gap-2">
          <span className="folio-eyebrow text-folio-saffron">Friends & More</span>
          <InfoTooltip>A quiet glimpse of what your community is into tonight — no following, no messaging, no algorithm deciding who you see.</InfoTooltip>
        </div>
        <div className="mt-4"><GoingOutCard /></div>
      </div>
    </div>
  );
}
