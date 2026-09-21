import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BadgeCheck, FileText, PenLine, Bookmark, ChevronRight, Pencil, Trash2, Plus, Sparkles, ShieldCheck, Camera } from "lucide-react";
import CommunityBadge from "@/components/folio/CommunityBadge";
import ThemeToggle from "@/components/folio/ThemeToggle";
import InfoTooltip from "@/components/folio/InfoTooltip";
import { useFolio } from "@/lib/folio-store";
import { useComposer } from "@/lib/folio-composer";
import { COMMUNITY_GROUPS, getCommunity } from "@/lib/folio-data";

export default function Me() {
  const { profile, communities, saved, posts, feedbackGiven, updateProfile, removeSaved, setCommunities } = useFolio();
  const { openComposer } = useComposer();
  const navigate = useNavigate();
  const avatarInputRef = useRef(null);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(profile.bio);
  const [applyingCurator, setApplyingCurator] = useState(false);
  const [extraCommunities, setExtraCommunities] = useState([]);

  const displayName = profile.name;
  const veriLabel = profile.verification === "verified" ? "Verified" : profile.verification === "curator" ? "Curator" : "Not verified";
  const veriColor = profile.verification === "verified" ? "text-folio-saffron" : profile.verification === "curator" ? "text-folio-green" : "text-folio-cream-dim";

  const saveBio = () => { updateProfile({ bio }); setEditing(false); };

  const handleAvatarPick = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => updateProfile({ avatar: ev.target.result });
    reader.readAsDataURL(file);
  };

  const applyVerification = () => updateProfile({ verification: "verified" });

  const toggleExtraCommunity = (id) => {
    setExtraCommunities((s) => {
      if (s.includes(id)) return s.filter((x) => x !== id);
      const total = new Set([...communities, ...s, id]);
      if (total.size > 3) return s;
      return [...s, id];
    });
  };

  const confirmCurator = () => {
    const finalCommunities = Array.from(new Set([...communities, ...extraCommunities])).slice(0, 3);
    setCommunities(finalCommunities);
    updateProfile({ verification: "curator" });
    setApplyingCurator(false);
    setExtraCommunities([]);
  };

  const myCommunityId = communities[0];
  const myCommunityPosts = myCommunityId ? posts.filter((p) => p.community === myCommunityId) : [];

  return (
    <div className="max-w-lg mx-auto px-5 pt-8">
      <div className="flex items-start gap-4 animate-fade-in">
        <div className="relative flex-shrink-0">
          <img src={profile.avatar} alt={displayName} className="w-20 h-20 rounded-full object-cover" />
          <input ref={avatarInputRef} type="file" accept="image/*" onChange={handleAvatarPick} className="hidden" id="avatar-input" />
          <label htmlFor="avatar-input" className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-folio-saffron flex items-center justify-center cursor-pointer border-2 border-folio-ink">
            <Camera className="w-3.5 h-3.5 text-folio-ink" />
          </label>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h1 className="folio-serif text-2xl text-folio-cream leading-none">{displayName}</h1>
            {profile.verification !== "not_verified" && (
              <BadgeCheck className={profile.verification === "curator" ? "w-5 h-5 text-folio-green" : "w-5 h-5 text-folio-saffron"} />
            )}
          </div>
          {profile.username && <p className="text-xs text-folio-cream-dim mt-0.5">@{profile.username}</p>}
          <span className={`folio-eyebrow mt-1.5 block ${veriColor}`}>{veriLabel}</span>
          {editing ? (
            <div className="mt-2">
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} autoFocus placeholder="Introduce yourself…" className="w-full bg-transparent border border-border p-2.5 text-sm text-folio-cream placeholder:text-folio-cream-dim/50 focus:outline-none focus:border-folio-saffron/40 resize-none leading-relaxed" />
              <div className="flex gap-2 mt-2">
                <button onClick={saveBio} className="px-4 py-1.5 bg-folio-cream text-folio-ink text-xs folio-eyebrow hover:bg-white">Save</button>
                <button onClick={() => { setBio(profile.bio); setEditing(false); }} className="px-4 py-1.5 border border-border text-folio-cream-dim text-xs folio-eyebrow">Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm text-folio-cream-dim mt-2 leading-relaxed">{profile.bio || "No bio yet. Tap edit to introduce yourself."}</p>
              <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 mt-2 text-xs text-folio-cream-dim hover:text-folio-cream transition-colors"><Pencil className="w-3 h-3" /> Edit bio</button>
            </>
          )}
        </div>
      </div>

      <div className="mt-8">
        <span className="folio-eyebrow text-folio-cream-dim">Communities</span>
        <div className="flex flex-wrap gap-2.5 mt-3">
          {communities.length > 0 ? communities.map((id) => <CommunityBadge key={id} communityId={id} size="md" />) : <Link to="/onboarding" className="text-sm text-folio-cream-dim hover:text-folio-cream">Select a community →</Link>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-8">
        <Stat icon={PenLine} label="Posted" count={posts.length} />
        <Stat icon={Bookmark} label="Saved" count={saved.length} />
      </div>

      <button onClick={() => openComposer()} className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 border border-border text-folio-cream folio-eyebrow hover:border-folio-saffron/50 hover:bg-folio-saffron/5 transition-all">
        <Plus className="w-4 h-4" /> Make a Post
      </button>

      <div className="mt-10">
        <div className="flex items-center gap-2">
          <span className="folio-eyebrow text-folio-cream-dim">Account</span>
          <InfoTooltip>Three tiers: Not verified (default) → Verified (identity confirmed) → Curator (can propose and stage a daily Thread). Each step unlocks the next — this is simulated for the prototype, no real ID check happens.</InfoTooltip>
        </div>
        <div className="mt-3 space-y-2.5">
          <ThemeToggle />

          {profile.verification === "not_verified" && (
            <button onClick={applyVerification} className="w-full flex items-center justify-between px-4 py-3.5 border border-border hover:border-folio-saffron/50 hover:bg-folio-saffron/5 transition-all text-left">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-folio-saffron" />
                <div>
                  <span className="text-sm text-folio-cream block">Apply for verification</span>
                  <span className="text-xs text-folio-cream-dim">Confirms it's really you — a step toward becoming a curator</span>
                </div>
              </div>
            </button>
          )}

          {profile.verification === "verified" && !applyingCurator && (
            <button onClick={() => setApplyingCurator(true)} className="w-full flex items-center justify-between px-4 py-3.5 border border-border hover:border-folio-green/50 hover:bg-folio-green/5 transition-all text-left">
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-folio-green" />
                <div>
                  <span className="text-sm text-folio-cream block">Apply to become a Curator</span>
                  <span className="text-xs text-folio-cream-dim">Curators propose the theme and pick the posts for a day's edition</span>
                </div>
              </div>
            </button>
          )}

          {applyingCurator && (
            <div className="border border-border p-4 animate-fade-in">
              <p className="text-sm text-folio-cream">Pick up to 2 more communities (3 total) to curate for:</p>
              <div className="grid grid-cols-1 gap-2 mt-3">
                {COMMUNITY_GROUPS.filter((g) => !communities.includes(g.id)).map((g) => {
                  const checked = extraCommunities.includes(g.id);
                  return (
                    <button key={g.id} onClick={() => toggleExtraCommunity(g.id)} className={`flex items-center gap-2.5 p-3 border text-left transition-all ${checked ? "border-folio-green/60 bg-folio-green/10" : "border-border"}`}>
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: g.color }} />
                      <span className="text-sm text-folio-cream">{g.name}</span>
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={confirmCurator} className="flex-1 py-2.5 bg-folio-cream text-folio-ink text-xs folio-eyebrow hover:bg-white transition-colors">Confirm</button>
                <button onClick={() => { setApplyingCurator(false); setExtraCommunities([]); }} className="flex-1 py-2.5 border border-border text-folio-cream-dim text-xs folio-eyebrow">Cancel</button>
              </div>
            </div>
          )}

          {profile.verification === "curator" && (
            <button onClick={() => navigate("/curator")} className="w-full flex items-center justify-between px-4 py-3.5 border border-folio-burgundy/40 hover:bg-folio-burgundy/5 transition-all text-left">
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-folio-burgundy" />
                <span className="text-sm text-folio-cream">Curator Studio</span>
              </div>
              <ChevronRight className="w-4 h-4 text-folio-cream-dim" />
            </button>
          )}
        </div>
      </div>

      {myCommunityId && (
        <div className="mt-10">
          <span className="folio-eyebrow text-folio-cream-dim">Your posts in {getCommunity(myCommunityId).name}</span>
          <div className="mt-3 space-y-3">
            {myCommunityPosts.length > 0 ? myCommunityPosts.map((p) => (
              <div key={p.id} className="py-3 border-b border-border">
                <p className="folio-serif text-base text-folio-cream">{p.title}</p>
                <p className="text-sm text-folio-cream-dim mt-1 line-clamp-2">{p.body}</p>
              </div>
            )) : <p className="text-xs text-folio-cream-dim">Nothing here yet — tag a post with this community to see it show up.</p>}
          </div>
        </div>
      )}

      {saved.length > 0 && (
        <div className="mt-10">
          <span className="folio-eyebrow text-folio-cream-dim">Saved</span>
          <p className="text-xs text-folio-cream-dim/60 mt-1">Private. Your own unfinished posts and anything bookmarked from others.</p>
          <div className="mt-3 space-y-3">
            {saved.map((d) => (
              <div key={d.id} className="flex items-start justify-between gap-3 py-3 border-b border-border">
                <div className="min-w-0">
                  <p className="text-sm text-folio-cream mt-1 truncate">{d.title || "Untitled"}</p>
                  {d.date && <p className="text-xs text-folio-cream-dim mt-0.5">{d.date}</p>}
                </div>
                <button onClick={() => removeSaved(d.id)} className="p-1.5 -m-1.5 text-folio-cream-dim hover:text-folio-burgundy transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {posts.length > 0 && (
        <div className="mt-10">
          <span className="folio-eyebrow text-folio-cream-dim">Your posts</span>
          <div className="mt-3 space-y-4">
            {posts.map((p) => (
              <div key={p.id} className="py-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-folio-cream-dim">{p.date}</span>
                </div>
                <p className="folio-serif text-base text-folio-cream mt-1.5">{p.title}</p>
                <p className="text-sm text-folio-cream-dim mt-1 line-clamp-2">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 border-t border-border pt-6 mb-4">
        <Link to="/feedback" className="flex items-center justify-between group">
          <div>
            <span className="folio-eyebrow text-folio-cream">Give feedback</span>
            <p className="text-xs text-folio-cream-dim mt-1">{feedbackGiven ? "You've shared your reflection. Thank you." : "Help shape FOLIO. Takes 1–2 minutes."}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-folio-cream-dim group-hover:text-folio-saffron transition-colors" />
        </Link>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, count }) {
  return (
    <div className="border border-border p-4 text-center">
      <Icon className="w-4 h-4 text-folio-cream-dim mx-auto" />
      <p className="folio-serif text-2xl text-folio-cream mt-2 leading-none">{count}</p>
      <p className="folio-eyebrow text-folio-cream-dim mt-1.5">{label}</p>
    </div>
  );
}
