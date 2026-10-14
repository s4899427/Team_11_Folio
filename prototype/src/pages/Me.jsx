import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Trash2, ChevronRight, ShieldCheck, Mic2, PenLine, Clock } from "lucide-react";
import Wordmark from "@/components/folio/Wordmark";
import ThemeToggle from "@/components/folio/ThemeToggle";
import CityPicker from "@/components/folio/CityPicker";
import { useFolio } from "@/lib/folio-store";
import { REMOTE, IN_SANDBOX, setSandbox, saveProfile, fileToAvatar, getLocalProfile, refreshProfile, getMyApplication, listApplications, deleteAccount, BIO_MAX, NAME_MAX } from "@/lib/api";
import { formatShort } from "@/lib/time";
import { cn } from "@/lib/utils";

const isGuestAccount = (s) => /^guest-.*@folio-guest\.example\.com$/.test(s?.email || "");
const field = "w-full bg-transparent border border-border p-3 text-sm text-folio-cream placeholder:text-folio-cream-dim/50 focus:outline-none focus:border-folio-saffron/40 transition-colors";
const btn = "px-3.5 py-2.5 border border-border text-xs text-folio-cream hover:border-folio-saffron/50 transition-colors disabled:opacity-40";

function Avatar({ src, name, size = "w-20 h-20", text = "text-3xl" }) {
  return src
    ? <img src={src} alt="Your profile picture" className={cn(size, "rounded-full object-cover border border-border")} data-testid="avatar-img" />
    : <div aria-hidden="true" className={cn(size, "rounded-full border border-border flex items-center justify-center folio-serif text-folio-cream-dim", text)}>{(name || "?").slice(0, 1).toUpperCase()}</div>;
}

function Section({ title, children, hint }) {
  return (
    <section className="mt-6 border border-border p-4">
      <h2 className="folio-eyebrow text-folio-cream-dim">{title}</h2>
      {hint && <p className="text-xs text-folio-cream-dim/70 mt-1 leading-relaxed">{hint}</p>}
      <div className="mt-3">{children}</div>
    </section>
  );
}

/** Name and suburb. */
function AccountEditor({ session, setSession, locked }) {
  const [name, setName] = useState(session.name || "");
  const [suburb, setSuburb] = useState(session.suburb || "");
  const [msg, setMsg] = useState("");
  const dirty = name.trim() !== (session.name || "") || suburb.trim() !== (session.suburb || "");
  const save = async () => {
    setMsg("");
    try { const p = await saveProfile(session, { name, suburb }); setSession({ ...session, ...p }); setMsg("Saved."); }
    catch (e) { setMsg(e.message); }
  };
  return (
    <Section title="Account">
      <label className="block"><span className="text-xs text-folio-cream-dim">Name</span>
        <input value={name} maxLength={NAME_MAX} onChange={(e) => setName(e.target.value)} disabled={locked} data-testid="name-input" className={cn(field, "mt-1")} /></label>
      <label className="block mt-3"><span className="text-xs text-folio-cream-dim">Suburb (optional)</span>
        <input value={suburb} maxLength={60} onChange={(e) => setSuburb(e.target.value)} disabled={locked} data-testid="suburb-input" className={cn(field, "mt-1")} /></label>
      <p className="text-xs text-folio-cream-dim/70 mt-3">{locked ? "Guest accounts use the first name you gave. Create a full account to edit details." : `Signed in as ${session.email}`}</p>
      {!locked && <div className="flex items-center gap-3 mt-3"><button type="button" data-testid="account-save" onClick={save} disabled={!dirty} className={btn}>Save changes</button>{msg && <span role="status" className="text-xs text-folio-saffron">{msg}</span>}</div>}
    </Section>
  );
}

/** Picture (JPG or PNG, max 2 MB) and a short bio. Not offered to guests. */
function ProfileEditor({ session, setSession }) {
  const stored = getLocalProfile(session);
  const [bio, setBio] = useState(stored.bio);
  const [avatar, setAvatar] = useState(stored.avatar);
  const [msg, setMsg] = useState("");
  const file = useRef(null);
  const save = async (patch, ok) => {
    setMsg("");
    try { await saveProfile(session, patch); setSession({ ...session, ...patch }); setMsg(ok); }
    catch (e) { setMsg(e.message); }
  };
  const pick = async (e) => {
    const f = e.target.files?.[0]; e.target.value = "";
    if (!f) return;
    try { const a = await fileToAvatar(f); setAvatar(a); await save({ avatar: a }, "Picture saved."); }
    catch (err) { setMsg(err.message); }
  };
  return (
    <Section title="Picture and bio" hint="JPG or PNG, up to 2 MB. Shown next to your name where people see it." >
      <div data-testid="profile-editor" className="flex items-center gap-4">
        <Avatar src={avatar} name={session.name} size="w-16 h-16" text="text-2xl" />
        <div className="flex flex-wrap gap-2">
          <input ref={file} type="file" accept="image/jpeg,image/png" onChange={pick} className="sr-only" aria-label="Upload a profile picture" data-testid="avatar-input" />
          <button type="button" onClick={() => file.current?.click()} className={btn}>{avatar ? "Change picture" : "Add picture"}</button>
          {avatar && <button type="button" data-testid="avatar-remove" onClick={() => { setAvatar(""); save({ avatar: "" }, "Picture removed."); }} className={cn(btn, "text-folio-cream-dim")}>Remove</button>}
        </div>
      </div>
      <label className="block mt-4"><span className="text-xs text-folio-cream-dim">Bio</span>
        <textarea value={bio} maxLength={BIO_MAX} rows={3} onChange={(e) => setBio(e.target.value)} data-testid="bio-input" className={cn(field, "mt-1")} /></label>
      <div className="flex items-center justify-between mt-1">
        <span className="text-xs text-folio-cream-dim/70">{bio.length}/{BIO_MAX}</span>
        <button type="button" data-testid="bio-save" onClick={() => save({ bio }, "Bio saved.")} className={btn}>Save bio</button>
      </div>
      {msg && <p role="status" className="text-xs text-folio-saffron mt-2">{msg}</p>}
    </Section>
  );
}

function DeleteAccount({ session, onDone }) {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const go = async () => {
    setErr(""); setBusy(true);
    try { await deleteAccount(session); onDone(); } catch (e) { setErr(e.message); }
    setBusy(false);
  };
  return (
    <Section title="Delete my account" hint="Removes your account, comments, pitches, votes and connections. It can't be undone.">
      {!open
        ? <button type="button" data-testid="delete-open" onClick={() => setOpen(true)} className={cn(btn, "text-folio-burgundy border-folio-burgundy/50")}>Delete my account…</button>
        : (
          <div data-testid="delete-confirm">
            <label className="block"><span className="text-xs text-folio-cream-dim">Type DELETE to confirm</span>
              <input value={typed} onChange={(e) => setTyped(e.target.value)} data-testid="delete-input" className={cn(field, "mt-1")} /></label>
            <div className="flex gap-2 mt-3">
              <button type="button" data-testid="delete-go" disabled={typed !== "DELETE" || busy} onClick={go} className={cn(btn, "bg-folio-burgundy text-folio-cream border-folio-burgundy")}>{busy ? "Deleting…" : "Permanently delete"}</button>
              <button type="button" onClick={() => { setOpen(false); setTyped(""); setErr(""); }} className={btn}>Cancel</button>
            </div>
            {err && <p role="alert" className="text-xs text-folio-burgundy mt-2 leading-relaxed">{err}</p>}
          </div>
        )}
    </Section>
  );
}

const ROLE = { listener: "Member", artist: "Artist", curator: "Curator" };

function ActionCard({ to, icon: Icon, title, text, testid, tone }) {
  const inner = (
    <>
      <Icon className="w-5 h-5 shrink-0 text-folio-saffron" strokeWidth={1.5} />
      <span className="min-w-0 flex-1"><span className="folio-eyebrow block">{title}</span><span className="block text-xs text-folio-cream-dim mt-1 leading-relaxed">{text}</span></span>
      {to && <ChevronRight className="w-4 h-4 text-folio-cream-dim shrink-0" />}
    </>
  );
  const cls = cn("flex items-center gap-3 px-4 py-3.5 border text-folio-cream transition-colors", tone === "strong" ? "border-folio-burgundy hover:bg-folio-burgundy/10" : "border-border hover:border-folio-saffron/50", !to && "opacity-80");
  return to ? <Link to={to} data-testid={testid} className={cls}>{inner}</Link> : <div data-testid={testid} className={cls}>{inner}</div>;
}

export default function Me() {
  const { session, setSession, saved, toggleSaved, signOut, isCurator, isAdmin, demoCurator, setDemoCurator, demoAdmin, setDemoAdmin, city } = useFolio();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") === "settings" ? "settings" : "you";
  const setTab = (t) => setParams(t === "settings" ? { tab: "settings" } : {}, { replace: true });

  // Pick up a role granted since login (curator approved, team member) without logging out.
  useEffect(() => {
    if (!session || session.local) return;
    refreshProfile(session).then((s) => {
      if (s && (s.role !== session.role || s.isAdmin !== session.isAdmin || s.avatar !== session.avatar || s.name !== session.name)) setSession(s);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.id]);

  const { data: myApp } = useQuery({ queryKey: ["my-application", session?.id], queryFn: () => getMyApplication(session), enabled: !!session && !isCurator && !isAdmin, refetchOnMount: "always" });
  const { data: apps } = useQuery({ queryKey: ["applications", session?.id], queryFn: () => listApplications(session), enabled: !!session && isAdmin, refetchInterval: 20000, refetchOnMount: "always" });
  const pending = (apps || []).filter((a) => a.status === "pending").length;

  if (!session) {
    return (
      <div className="max-w-lg mx-auto px-5 pt-8">
        <Wordmark to="/welcome" />
        <h1 className="folio-serif text-4xl text-folio-cream mt-8">You're browsing as a guest.</h1>
        <p className="text-sm text-folio-cream-dim mt-3 leading-relaxed">Reading is open to everyone. An account lets you comment, save picks privately, and (if you make music) pitch to curators.</p>
        <div className="mt-8 space-y-3">
          <Link to="/register" className="block text-center w-full py-3.5 bg-folio-cream text-folio-ink folio-eyebrow">Create account</Link>
          <Link to="/login" className="block text-center w-full py-3.5 border border-border text-folio-cream folio-eyebrow">Log in</Link>
        </div>
        <div className="mt-10 space-y-4"><div className="flex items-center gap-3"><CityPicker /></div><ThemeToggle /></div>
      </div>
    );
  }

  const guest = isGuestAccount(session);
  const stored = getLocalProfile(session);
  const roleLabel = isAdmin ? "Folio team" : ROLE[isCurator ? "curator" : session.role] || "Member";

  return (
    <div className="max-w-lg mx-auto px-5 pt-8">
      <div className="flex items-center gap-4 animate-fade-in">
        <Avatar src={stored.avatar} name={session.name} />
        <div className="min-w-0">
          <span className="folio-eyebrow text-folio-saffron" data-testid="me-role">{roleLabel}</span>
          <h1 className="folio-serif text-3xl text-folio-cream mt-1 truncate" data-testid="me-name">{session.name}</h1>
          <p className="text-xs text-folio-cream-dim mt-0.5 truncate">{[session.suburb, city.name].filter(Boolean).join(" · ")}</p>
        </div>
      </div>
      {stored.bio && <p className="text-sm text-folio-cream-dim mt-4 leading-relaxed">{stored.bio}</p>}

      <div role="tablist" className="mt-6 grid grid-cols-2 border border-border">
        {[["you", "You"], ["settings", "Settings"]].map(([id, label]) => (
          <button key={id} role="tab" aria-selected={tab === id} data-testid={`me-tab-${id}`} onClick={() => setTab(id)}
            className={cn("py-2.5 folio-eyebrow transition-colors", tab === id ? "bg-folio-cream text-folio-ink" : "text-folio-cream-dim hover:text-folio-cream")}>{label}</button>
        ))}
      </div>

      {tab === "you" && (
        <div className="animate-fade-in">
          <div className="mt-6 space-y-3">
            {isAdmin && <ActionCard to="/admin" icon={ShieldCheck} title="Curator applications" testid="admin-link" tone="strong" text={apps ? (pending ? `${pending} waiting for your decision` : "Nothing waiting") : "Review who has applied to curate"} />}
            {isCurator && <ActionCard to="/studio" icon={PenLine} title="Curator Studio" testid="studio-link" tone="strong" text="Build and publish an Edition, read pitches, add gig tips" />}
            {session.role === "artist" && <ActionCard to="/artist" icon={Mic2} title="Your artist space" testid="artist-link" tone="strong" text="Post updates, answer fans, see who connected" />}
            {session.role === "artist" && <ActionCard to="/pitch" icon={PenLine} title="Pitch to a curator" text="Send a track you made for a future Edition" />}
            {!isCurator && !isAdmin && (
              myApp?.status === "pending"
                ? <ActionCard icon={Clock} title="Curator application sent" testid="apply-pending" text={`The Folio team is reading it (${myApp.city}). You'll see the Studio here once approved.`} />
                : <ActionCard to="/apply" icon={PenLine} title={myApp?.status === "declined" ? "Apply to curate again" : "Apply to curate"} testid="apply-link" text={myApp?.status === "declined" ? "Your last application wasn't approved. You can send a new one." : "Know your city's music? Curate it."} />
            )}
          </div>

          <section className="mt-10">
            <h2 className="folio-eyebrow text-folio-cream-dim">Saved (only you can see these)</h2>
            <ul className="mt-3 divide-y divide-border border-y border-border" data-testid="saved-list">
              {saved.length === 0 && <li className="py-4 text-sm text-folio-cream-dim/70">Nothing saved. Tap the bookmark on any pick.</li>}
              {saved.map((s) => (
                <li key={s.id} className="py-3 flex items-center justify-between gap-3">
                  <span className="min-w-0"><span className="block text-folio-cream truncate">{s.title}</span><span className="block text-xs text-folio-cream-dim">{s.artist}{s.editionDate ? ` · ${formatShort(s.editionDate)}` : ""}</span></span>
                  <button onClick={() => toggleSaved(s)} aria-label={`Remove ${s.title}`} className="p-1"><Trash2 className="w-4 h-4 text-folio-cream-dim" /></button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}

      {tab === "settings" && (
        <div className="animate-fade-in" data-testid="settings-panel">
          <AccountEditor session={session} setSession={setSession} locked={guest} />
          {!guest && <ProfileEditor session={session} setSession={setSession} />}
          {guest && <Section title="Picture and bio"><p className="text-sm text-folio-cream-dim leading-relaxed">Guests can read, comment and answer the Discovery check. <Link to="/register" className="text-folio-saffron">Create a full account</Link> to add a picture and bio.</p></Section>}

          <Section title="City and look" hint="Only Brisbane is live. Other cities show Coming soon. 'Use my location' is optional and is never stored.">
            <div className="flex items-center gap-3"><CityPicker /><span className="text-xs text-folio-cream-dim">{city.curated ? "Daily Editions" : "City notes, no curator yet"}</span></div>
            <div className="mt-4"><ThemeToggle /></div>
          </Section>

          {!REMOTE && session.local && (
            <Section title="Demo switches" hint={IN_SANDBOX ? "You are in the sandbox: nothing here is shared. On the live app the Folio team approves curators and sets team members." : "Only in demo mode. With the shared database, the Folio team approves curators and sets team members."}>
              <div className="space-y-2">
                <button onClick={() => setDemoCurator(!demoCurator)} className={cn(btn, "w-full text-left")}>{demoCurator ? "Turn curator access off" : "Try the Curator Studio"}</button>
                <button onClick={() => setDemoAdmin(!demoAdmin)} data-testid="demo-admin" className={cn(btn, "w-full text-left")}>{demoAdmin ? "Turn Folio team access off" : "Try the Folio team screen"}</button>
                {IN_SANDBOX && <button data-testid="leave-sandbox" onClick={() => { setSandbox(false); window.location.replace(window.location.pathname + "#/welcome"); window.location.reload(); }} className={cn(btn, "w-full text-left text-folio-cream-dim")}>Leave the sandbox (use the live app)</button>}
              </div>
            </Section>
          )}

          <Section title="Help us improve">
            <Link to="/feedback" className="block text-sm text-folio-cream-dim hover:text-folio-cream">Give feedback on Folio (2 minutes) →</Link>
          </Section>

          <div className="mt-6"><button data-testid="signout" onClick={() => { signOut(); navigate("/"); }} className="w-full px-4 py-3.5 border border-border text-sm text-folio-cream hover:border-folio-saffron/50 transition-colors text-left">Sign out</button></div>

          <DeleteAccount session={session} onDone={() => { signOut(); navigate("/"); }} />
        </div>
      )}
    </div>
  );
}
