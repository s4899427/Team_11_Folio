import { useState, useRef } from "react";
import { X, Check, Loader2, Camera, ChevronRight, ImagePlus } from "lucide-react";
import { useComposer } from "@/lib/folio-composer";
import { useFolio } from "@/lib/folio-store";
import { TODAY_THREAD, COMMUNITIES } from "@/lib/folio-data";
import { cn } from "@/lib/utils";

export default function PostComposer() {
  const { open, closeComposer, prefill } = useComposer();
  const { saveItem, publishPost } = useFolio();
  const fileInputRef = useRef(null);

  const [step, setStep] = useState(0);
  const [about, setAbout] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [community, setCommunity] = useState("");
  const [status, setStatus] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [image, setImage] = useState(null);
  const [imageCaption, setImageCaption] = useState("");

  if (!open) return null;

  const reset = () => { setStep(0); setAbout(""); setTitle(""); setBody(""); setCommunity(""); setStatus(""); setRejectReason(""); setImage(null); setImageCaption(""); };
  const close = () => { reset(); closeComposer(); };

  const aboutOptions = [
    { label: `Today's Thread — ${TODAY_THREAD.title}`, value: `thread:${TODAY_THREAD.id}` },
    { label: "An Archive Post (general)", value: "archive" },
  ];

  const handleImagePick = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target.result);
    reader.readAsDataURL(file);
  };
  const removeImage = () => { setImage(null); setImageCaption(""); if (fileInputRef.current) fileInputRef.current.value = ""; };

  const handlePost = () => {
    setStatus("checking");
    setTimeout(() => {
      const len = body.trim().length + title.trim().length;
      if (len < 8) { setStatus("rejected"); setRejectReason("This feels too short to post. Add a little more so others can engage with your perspective."); return; }
      const banned = /\b(spam|buy now|click here|http:\/\/|casino|crypto)\b/i.test(body);
      if (banned) { setStatus("rejected"); setRejectReason("This post was flagged as promotional. FOLIO is for cultural reflection, not solicitation."); return; }
      setStatus("posted");
      publishPost({
        about, title, body, community: community || "photography",
        author: "You", authorImage: "https://i.pravatar.cc/300?img=68", image: image || null, imageCaption: image ? imageCaption : "",
      });
    }, 1400);
  };

  const handleSave = () => {
    saveItem({
      id: "saved" + Date.now(), about, title, body, community, image, imageCaption: image ? imageCaption : "",
      author: "You", authorImage: "https://i.pravatar.cc/300?img=68",
      date: new Date().toISOString().slice(5, 10).replace("-", "/").toUpperCase(),
    });
    close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/75 animate-fade-in" onClick={close} />
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto bg-folio-ink-soft rounded-t-3xl animate-slide-up scrollbar-hide">
        <div className="sticky top-0 bg-folio-ink-soft/95 backdrop-blur px-5 pt-3 pb-3 border-b border-border z-10">
          <div className="w-10 h-1 rounded-full bg-folio-cream-dim/30 mx-auto mb-3" />
          <div className="flex items-center justify-between">
            <span className="folio-eyebrow text-folio-cream-dim">
              {status === "posted" ? "Posted" : status === "rejected" ? "Not posted" : step === 0 ? "Step 1 of 2" : "Step 2 of 2"}
            </span>
            <button onClick={close} aria-label="Close" className="p-1 -m-1 text-folio-cream-dim hover:text-folio-cream"><X className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="px-5 pb-8 pt-4">
          {status === "posted" && (
            <div className="flex flex-col items-center py-16 animate-scale-in">
              <div className="w-16 h-16 rounded-full bg-folio-saffron/15 flex items-center justify-center"><Check className="w-8 h-8 text-folio-saffron" strokeWidth={2.5} /></div>
              <h3 className="folio-serif text-2xl text-folio-cream mt-5">Posted</h3>
              <p className="text-sm text-folio-cream-dim mt-2 text-center leading-relaxed">Your post is live.</p>
              <button onClick={close} className="mt-8 px-8 py-3 bg-folio-cream text-folio-ink folio-eyebrow hover:bg-white transition-colors">Done</button>
            </div>
          )}

          {status === "rejected" && (
            <div className="flex flex-col items-center py-12 animate-fade-in text-center">
              <div className="w-14 h-14 rounded-full bg-folio-burgundy/20 flex items-center justify-center"><X className="w-7 h-7 text-folio-burgundy" strokeWidth={2.5} /></div>
              <h3 className="folio-serif text-xl text-folio-cream mt-4">Not posted</h3>
              <p className="text-sm text-folio-cream-dim mt-2 leading-relaxed max-w-xs">{rejectReason}</p>
              <button onClick={() => setStatus("")} className="mt-6 px-6 py-2.5 border border-border text-folio-cream text-sm hover:border-folio-cream-dim transition-colors">Revise and try again</button>
            </div>
          )}

          {status === "checking" && (
            <div className="flex flex-col items-center py-20 animate-fade-in">
              <Loader2 className="w-8 h-8 text-folio-saffron animate-spin" />
              <p className="text-sm text-folio-cream-dim mt-4">Reviewing your post…</p>
            </div>
          )}

          {status === "" && (
            <>
              {step === 0 && (
                <div className="animate-fade-in">
                  <h3 className="folio-serif text-xl text-folio-cream">What's this about?</h3>
                  <p className="text-sm text-folio-cream-dim mt-1.5">Choose where this post belongs.</p>
                  <div className="mt-5 space-y-2">
                    {aboutOptions.map((opt) => (
                      <button key={opt.value} onClick={() => { setAbout(opt.value); setStep(1); }} className="w-full flex items-center justify-between px-4 py-3.5 border border-border hover:border-folio-saffron/50 hover:bg-folio-saffron/5 transition-all text-left">
                        <span className="text-sm text-folio-cream">{opt.label}</span>
                        <ChevronRight className="w-4 h-4 text-folio-cream-dim" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="animate-fade-in space-y-4">
                  <h3 className="folio-serif text-xl text-folio-cream">Your post</h3>
                  <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="A title" className="w-full bg-transparent border-b border-border py-2.5 text-folio-cream folio-serif text-lg placeholder:text-folio-cream-dim/50 focus:outline-none focus:border-folio-saffron/50 transition-colors" />
                  <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write your reflection…" rows={5} className="w-full bg-transparent border border-border p-3.5 text-sm text-folio-cream placeholder:text-folio-cream-dim/50 focus:outline-none focus:border-folio-saffron/40 transition-colors resize-none leading-relaxed" />
                  <div>
                    <p className="folio-eyebrow text-folio-cream-dim mb-2">Community</p>
                    <div className="flex flex-wrap gap-2">
                      {COMMUNITIES.slice(0, 6).map((c) => (
                        <button key={c.id} onClick={() => setCommunity(c.id)} className={cn("flex items-center gap-1.5 px-3 py-1.5 border text-xs transition-all", community === c.id ? "border-folio-saffron/60 bg-folio-saffron/5" : "border-border")}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.color }} />
                          <span className="text-folio-cream-dim">{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImagePick} className="hidden" id="composer-photo-input" />

                  {!image ? (
                    <label htmlFor="composer-photo-input" className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-border text-folio-cream-dim text-sm hover:border-folio-cream-dim/50 transition-colors cursor-pointer">
                      <Camera className="w-4 h-4" /> Attach a photo (optional)
                    </label>
                  ) : (
                    <div className="space-y-2">
                      <div className="relative">
                        <img src={image} alt={imageCaption || "Attached"} className="w-full aspect-[4/3] object-cover" />
                        <button onClick={removeImage} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-folio-ink/80 flex items-center justify-center text-folio-cream hover:bg-folio-ink transition-colors" aria-label="Remove photo">
                          <X className="w-4 h-4" />
                        </button>
                        <label htmlFor="composer-photo-input" className="absolute bottom-2 right-2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-folio-ink/80 text-folio-cream text-xs cursor-pointer hover:bg-folio-ink transition-colors">
                          <ImagePlus className="w-3.5 h-3.5" /> Change
                        </label>
                      </div>
                      <input
                        value={imageCaption}
                        onChange={(e) => setImageCaption(e.target.value)}
                        placeholder="Describe this photo (caption / alt text)"
                        className="w-full bg-transparent border border-border px-3.5 py-2.5 text-sm text-folio-cream placeholder:text-folio-cream-dim/50 focus:outline-none focus:border-folio-saffron/40 transition-colors"
                      />
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button onClick={handleSave} className="flex-1 py-3.5 border border-border text-folio-cream folio-eyebrow hover:border-folio-cream-dim/50 transition-colors">Save</button>
                    <button onClick={handlePost} disabled={!title.trim() || !body.trim()} className="flex-1 py-3.5 bg-folio-cream text-folio-ink folio-eyebrow hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed">Post Now</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
