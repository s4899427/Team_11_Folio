import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Sparkles, Loader2, Clock } from "lucide-react";
import { useFolio } from "@/lib/folio-store";
import { ARCHIVE_POSTS, getCommunity } from "@/lib/folio-data";
import { cn } from "@/lib/utils";
import PostCard from "@/components/folio/PostCard";
import InfoTooltip from "@/components/folio/InfoTooltip";

// ── REAL Wikipedia "On This Day" integration, filtered to culture ──
// Wikipedia's general "events" feed skews toward political/military
// history. We filter for art/fashion/food/design/culture keywords
// specifically, and fall back to a small curated list of known
// art/culture anniversaries on days where nothing matches — so this
// never surfaces "sad news" as a daily theme.
const CULTURE_KEYWORDS = [
  "art", "artist", "paint", "sculpt", "museum", "gallery",
  "fashion", "design", "textile", "fabric", "couture",
  "music", "song", "album", "composer", "opera", "dance",
  "food", "cuisine", "restaurant", "chef", "culinary",
  "film", "cinema", "photograph", "architecture", "festival", "poet", "literature",
];
const CURATED_FALLBACK_THEMES = [
  { title: "The Bauhaus Turns Another Year", reason: "A recurring design-history anniversary — curated fallback, not live." },
  { title: "First Fashion Week, Reconsidered", reason: "A recurring fashion-history anniversary — curated fallback, not live." },
  { title: "A Century of Street Photography", reason: "A recurring photography-history anniversary — curated fallback, not live." },
];

async function fetchOnThisDayCandidates() {
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const url = `https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${mm}/${dd}`;

  try {
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`Wikipedia API responded ${res.status}`);
    const data = await res.json();
    const dateLabel = now.toLocaleDateString("en-US", { month: "long", day: "numeric" });

    const cultural = (data.events || []).filter((e) => {
      if (!e.text || e.text.length >= 140) return false;
      const lower = e.text.toLowerCase();
      return CULTURE_KEYWORDS.some((k) => lower.includes(k));
    });

    if (cultural.length === 0) {
      // No culture-relevant live events today — use the curated fallback
      // rather than surfacing an unrelated (possibly grim) headline.
      return CURATED_FALLBACK_THEMES.slice(0, 2).map((c) => ({ ...c, source: "fallback" }));
    }

    const picks = cultural.slice(0, 2);
    return picks.map((e) => ({
      title: e.text.split(/[,.;]/)[0].slice(0, 60),
      reason: `${dateLabel}, ${e.year} — from Wikipedia's On This Day (live, filtered to art/culture).`,
      source: "wikipedia",
    }));
  } catch (err) {
    return CURATED_FALLBACK_THEMES.slice(0, 2).map((c) => ({ ...c, source: "fallback" }));
  }
}

const COMMUNITY_ACTIVITY_CANDIDATE = {
  title: "Hands That Made It",
  reason: "Proposed from recent community posting activity (simulated — needs a live user base to be real).",
  source: "simulated",
};

function matchRelevantPosts(themeTitle) {
  const stopwords = new Set(["the", "and", "for", "with", "that", "this", "from", "was", "were"]);
  const keywords = themeTitle.toLowerCase().split(/\s+/).filter((w) => w.length > 3 && !stopwords.has(w));
  return ARCHIVE_POSTS.map((p) => {
    const text = (p.title + " " + p.body).toLowerCase();
    let score = 0;
    keywords.forEach((k) => {
      if (text.includes(k)) score += 1;
      else if (text.split(/\s+/).some((w) => w.startsWith(k.slice(0, 4)))) score += 0.3;
    });
    return { ...p, _relevance: Math.round(score * 10) / 10 };
  }).sort((a, b) => b._relevance - a._relevance);
}

const MOCK_CURATOR_POOL = [
  { name: "Amara Okafor", lastCurated: daysAgo(9) },
  { name: "Kenji Watanabe", lastCurated: daysAgo(2) },
  { name: "Sofia Marchetti", lastCurated: daysAgo(14) },
  { name: "Daniel Oduya", lastCurated: daysAgo(5) },
];
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}
function buildRotationQueue(youLastCurated) {
  const pool = [...MOCK_CURATOR_POOL, { name: "You", lastCurated: youLastCurated }];
  return pool
    .map((c) => ({ ...c, daysSince: Math.floor((Date.now() - c.lastCurated.getTime()) / 86400000) }))
    .sort((a, b) => b.daysSince - a.daysSince);
}

// Staging window copy: editable until 11:30pm, goes live 30 minutes later.
function getStagingCopy() {
  return "Editable until 11:30pm tonight. Goes live 30 minutes later, as tomorrow's edition.";
}

export default function CuratorStudio() {
  const { profile, communities, pendingThread, setPendingThread, clearPendingThread } = useFolio();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [chosenTheme, setChosenTheme] = useState(pendingThread?.theme || null);
  const [customTheme, setCustomTheme] = useState("");
  const [selectedPosts, setSelectedPosts] = useState(pendingThread?.postIds || []);
  const [candidates, setCandidates] = useState(null);
  const [loadingCandidates, setLoadingCandidates] = useState(false);

  const rotationQueue = useMemo(() => buildRotationQueue(daysAgo(20)), []);
  const yourPosition = rotationQueue.findIndex((c) => c.name === "You") + 1;

  useEffect(() => {
    if (step === 1 && !candidates && !loadingCandidates) {
      setLoadingCandidates(true);
      fetchOnThisDayCandidates().then((live) => {
        setCandidates([...live, COMMUNITY_ACTIVITY_CANDIDATE]);
        setLoadingCandidates(false);
      });
    }
  }, [step, candidates, loadingCandidates]);

  const shortlist = useMemo(() => (chosenTheme ? matchRelevantPosts(chosenTheme) : []), [chosenTheme]);

  if (profile.verification !== "curator") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-5 max-w-lg mx-auto text-center">
        <p className="folio-serif text-xl text-folio-cream">Curator Studio is for curators only.</p>
        <p className="text-sm text-folio-cream-dim mt-2">Apply from your profile to unlock this.</p>
        <button onClick={() => navigate("/me")} className="mt-6 px-6 py-2.5 border border-border text-folio-cream text-sm hover:border-folio-cream-dim transition-colors">Back to Me</button>
      </div>
    );
  }

  const togglePost = (id) => {
    setSelectedPosts((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  const goToPreview = () => setStep(3);

  const publish = () => {
    setPendingThread({ theme: chosenTheme, postIds: selectedPosts, stagedAt: Date.now() });
    setStep(4);
  };

  const editPending = () => {
    setChosenTheme(pendingThread.theme);
    // Prefill the free-text box too, so an edit of a custom (non-Wikipedia)
    // theme doesn't land back on an empty-looking input.
    setCustomTheme(pendingThread.theme);
    setSelectedPosts(pendingThread.postIds);
    setStep(1);
    setCandidates(null);
  };

  // View the already-staged thread exactly as it will render tomorrow,
  // without re-entering edit mode.
  const previewPending = () => {
    setChosenTheme(pendingThread.theme);
    setSelectedPosts(pendingThread.postIds);
    setStep(3);
  };

  const previewPosts = ARCHIVE_POSTS.filter((p) => selectedPosts.includes(p.id));

  return (
    <div className="min-h-screen bg-folio-ink">
      <div className="max-w-lg mx-auto px-5 pt-8 pb-16">
        <button onClick={() => navigate("/me")} className="inline-flex items-center gap-1.5 text-xs text-folio-cream-dim hover:text-folio-cream transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Me
        </button>

        <div className="flex items-center gap-2 mt-6">
          <Sparkles className="w-4 h-4 text-folio-burgundy" />
          <span className="folio-eyebrow text-folio-burgundy">Curator Studio</span>
        </div>

        {step === 0 && (
          <div className="animate-fade-in mt-4">
            <h1 className="folio-serif text-3xl text-folio-cream">Curator Home</h1>
            <p className="text-sm text-folio-cream-dim mt-2 leading-relaxed">
              Eligible communities: {communities.map((id) => getCommunity(id).name).join(", ") || "none yet"}.
            </p>

            {pendingThread && (
              <div className="mt-6 border border-folio-saffron/40 bg-folio-saffron/5 p-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-folio-saffron" />
                  <p className="folio-eyebrow text-folio-saffron">Staged for tomorrow</p>
                </div>
                <p className="folio-serif text-lg text-folio-cream mt-2">{pendingThread.theme}</p>
                <p className="text-xs text-folio-cream-dim mt-1">{pendingThread.postIds.length} featured post{pendingThread.postIds.length === 1 ? "" : "s"}</p>
                <p className="text-xs text-folio-cream-dim/70 mt-2">{getStagingCopy()}</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={previewPending} className="flex-1 py-2 border border-border text-xs folio-eyebrow text-folio-cream">Preview</button>
                  <button onClick={editPending} className="flex-1 py-2 border border-border text-xs folio-eyebrow text-folio-cream">Edit</button>
                  <button onClick={clearPendingThread} className="flex-1 py-2 border border-border text-xs folio-eyebrow text-folio-burgundy">Discard</button>
                </div>
              </div>
            )}

            <div className="mt-6 border border-border p-4">
              <div className="flex items-center gap-2 mb-3">
                <p className="folio-eyebrow text-folio-cream-dim">Rotation queue — days since last turn</p>
                <InfoTooltip>Whoever's gone longest since their last turn is next in line — a fairness queue, not a popularity contest. (Seeded with a few mock curators here since a real rotation needs multiple live accounts.)</InfoTooltip>
              </div>
              <div className="space-y-2">
                {rotationQueue.map((c, i) => (
                  <div key={c.name} className={cn("flex items-center justify-between text-sm py-1.5", c.name === "You" && "text-folio-saffron font-semibold")}>
                    <span>{i + 1}. {c.name}</span>
                    <span className="text-xs text-folio-cream-dim">{c.daysSince} days</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-folio-cream-dim/70 mt-4 leading-relaxed">
                You're #{yourPosition} in the queue — real recency-based sorting, seeded with mock
                other curators since real rotation needs multiple live accounts.
              </p>
            </div>

            {!pendingThread && (
              <button onClick={() => setStep(1)} className="w-full mt-8 py-3.5 bg-folio-cream text-folio-ink folio-eyebrow hover:bg-white transition-colors">Start Today's Thread</button>
            )}
          </div>
        )}

        {step === 1 && (
          <div className="animate-fade-in mt-4">
            <h1 className="folio-serif text-2xl text-folio-cream">Propose a theme</h1>
            <p className="text-sm text-folio-cream-dim mt-2 leading-relaxed">Filtered to art, fashion, food, and culture — never general news.</p>

            {loadingCandidates && (
              <div className="flex items-center gap-3 mt-6 text-folio-cream-dim text-sm">
                <Loader2 className="w-4 h-4 animate-spin" /> Checking Wikipedia's On This Day…
              </div>
            )}

            {candidates && (
              <div className="mt-5 space-y-2.5">
                {candidates.map((c) => (
                  <button key={c.title} onClick={() => { setChosenTheme(c.title); setCustomTheme(""); }} className={cn("w-full text-left px-4 py-3.5 border transition-all", chosenTheme === c.title ? "border-folio-burgundy/60 bg-folio-burgundy/10" : "border-border hover:border-folio-cream-dim/40")}>
                    <div className="flex items-center gap-2">
                      <p className="folio-serif text-lg text-folio-cream">{c.title}</p>
                      {c.source === "wikipedia" && <span className="text-[0.6rem] uppercase tracking-wide text-folio-green border border-folio-green/40 px-1.5 py-0.5 rounded">live</span>}
                      {c.source === "fallback" && <span className="text-[0.6rem] uppercase tracking-wide text-folio-terracotta border border-folio-terracotta/40 px-1.5 py-0.5 rounded">fallback</span>}
                      {c.source === "simulated" && <span className="text-[0.6rem] uppercase tracking-wide text-folio-cream-dim border border-folio-cream-dim/40 px-1.5 py-0.5 rounded">simulated</span>}
                    </div>
                    <p className="text-xs text-folio-cream-dim mt-1">{c.reason}</p>
                  </button>
                ))}
              </div>
            )}

            <p className="folio-eyebrow text-folio-cream-dim mt-6 mb-2">Or write your own</p>
            <input
              value={customTheme}
              onChange={(e) => { setCustomTheme(e.target.value); setChosenTheme(e.target.value || null); }}
              placeholder="A theme of your own"
              className="w-full bg-transparent border-b border-border py-2.5 text-folio-cream folio-serif text-lg placeholder:text-folio-cream-dim/50 focus:outline-none focus:border-folio-burgundy/50 transition-colors"
            />
            <button onClick={() => setStep(2)} disabled={!chosenTheme} className="w-full mt-8 py-3.5 bg-folio-cream text-folio-ink folio-eyebrow hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed">Find Related Posts</button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in mt-4">
            <h1 className="folio-serif text-2xl text-folio-cream">Review shortlist</h1>
            <p className="text-xs text-folio-cream-dim mt-1.5 italic">Theme: {chosenTheme}</p>
            <p className="text-sm text-folio-cream-dim mt-2 leading-relaxed">
              Ordered by keyword relevance to your theme — never by likes or engagement. Check what to feature.
            </p>
            <div className="mt-5 space-y-3">
              {shortlist.map((p) => {
                const checked = selectedPosts.includes(p.id);
                return (
                  <button key={p.id} onClick={() => togglePost(p.id)} className={cn("w-full flex items-start gap-3 text-left p-3.5 border transition-all", checked ? "border-folio-burgundy/60 bg-folio-burgundy/10" : "border-border")}>
                    <span className={cn("w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5", checked ? "bg-folio-burgundy border-folio-burgundy" : "border-folio-cream-dim")}>
                      {checked && <Check className="w-3 h-3 text-folio-cream" />}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm text-folio-cream">{p.title}</p>
                      <p className="text-xs text-folio-cream-dim mt-1 line-clamp-2">{p.body}</p>
                      <p className="text-[0.65rem] text-folio-cream-dim/60 mt-1">relevance score: {p._relevance}</p>
                    </div>
                  </button>
                );
              })}
            </div>
            <button onClick={goToPreview} disabled={selectedPosts.length === 0} className="w-full mt-8 py-3.5 bg-folio-cream text-folio-ink folio-eyebrow hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed">Preview Thread</button>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in mt-4">
            <h1 className="folio-serif text-2xl text-folio-cream">Preview</h1>
            <p className="text-sm text-folio-cream-dim mt-2 leading-relaxed">
              This is exactly how tomorrow's edition will look to readers — not a summary, the real layout.
            </p>

            <div className="mt-6 border border-border p-4">
              <span className="folio-eyebrow text-folio-cream-dim">{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase()}</span>
              <h2 className="folio-serif text-2xl text-folio-cream mt-2 leading-tight">{chosenTheme}</h2>
              <p className="text-xs text-folio-cream-dim mt-2">Edited by {profile.name} · {previewPosts.length} featured post{previewPosts.length === 1 ? "" : "s"}</p>
            </div>

            <div className="mt-2">
              {previewPosts.length === 0 && (
                <p className="text-sm text-folio-cream-dim mt-6">No posts selected — go back and choose at least one from the shortlist.</p>
              )}
              {previewPosts.map((p) => (
                <PostCard key={p.id} post={p} locked />
              ))}
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={() => setStep(2)} className="flex-1 py-3.5 border border-border text-folio-cream folio-eyebrow hover:border-folio-cream-dim transition-colors">Back to Shortlist</button>
              <button onClick={publish} disabled={previewPosts.length === 0} className="flex-1 py-3.5 bg-folio-cream text-folio-ink folio-eyebrow hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed">{pendingThread ? "Update Staged Edition" : "Confirm & Stage"}</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-fade-in mt-4 flex flex-col items-center text-center py-10">
            <div className="w-16 h-16 rounded-full bg-folio-burgundy/15 flex items-center justify-center">
              <Check className="w-8 h-8 text-folio-burgundy" strokeWidth={2.5} />
            </div>
            <h2 className="folio-serif text-2xl text-folio-cream mt-5">Staged, not live yet</h2>
            <p className="text-sm text-folio-cream-dim mt-2 leading-relaxed max-w-xs">
              "{chosenTheme}" with {selectedPosts.length} featured post{selectedPosts.length === 1 ? "" : "s"}.
            </p>
            <p className="text-xs text-folio-cream-dim/70 mt-3 max-w-xs">{getStagingCopy()}</p>
            <div className="flex gap-3 mt-8">
              <button onClick={previewPending} className="px-6 py-3 border border-border text-folio-cream folio-eyebrow hover:border-folio-cream-dim transition-colors">View Again</button>
              <button onClick={() => navigate("/me")} className="px-8 py-3 bg-folio-cream text-folio-ink folio-eyebrow hover:bg-white transition-colors">Done</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
