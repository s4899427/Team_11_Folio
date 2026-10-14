import { useState } from "react";
import { MapPin, X, Navigation } from "lucide-react";
import { CITY_LIST } from "@/lib/cities";
import { useFolio } from "@/lib/folio-store";
import { cn } from "@/lib/utils";

// Approximate city centres, used only to show a map and to find the nearest city.
const CENTRE = { brisbane: [-27.4698, 153.0251], seoul: [37.5665, 126.978], mumbai: [19.076, 72.8777] };

const km = ([a, b], [c, d]) => {
  const r = Math.PI / 180, dLat = (c - a) * r, dLon = (d - b) * r;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a * r) * Math.cos(c * r) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
};

function MapFrame({ cityId, name }) {
  const c = CENTRE[cityId];
  if (!c) return null;
  const [lat, lon] = c, d = 0.12;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - d},${lat - d / 1.6},${lon + d},${lat + d / 1.6}&layer=mapnik&marker=${lat},${lon}`;
  return <iframe title={`Map of ${name}`} src={src} loading="lazy" className="w-full h-40 border border-border mt-3" />;
}

/** A small button showing the current city; opens a sheet to switch. Only live cities can be chosen. */
export default function CityPicker() {
  const { city, setCityId } = useFolio();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState(null);
  const shown = preview || city.id;

  // Location is only requested when the person taps the button. Coordinates are
  // used here to pick the nearest city and are never stored or sent anywhere.
  const locate = () => {
    setNote("");
    if (!navigator.geolocation) { setNote("This browser can't share your location. Pick a city from the list."); return; }
    setBusy(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setBusy(false);
        const here = [pos.coords.latitude, pos.coords.longitude];
        const nearest = CITY_LIST.map((c) => ({ c, d: km(here, CENTRE[c.id] || [0, 0]) })).sort((a, b) => a.d - b.d)[0];
        if (nearest && nearest.d < 150) {
          if (nearest.c.curated) { setCityId(nearest.c.id); setOpen(false); }
          else { setPreview(nearest.c.id); setNote(`You seem to be near ${nearest.c.name}, which is coming soon. Folio is live in Brisbane for now.`); }
        } else setNote("You seem to be outside our cities. Folio is live in Brisbane for now.");
      },
      () => { setBusy(false); setNote("No problem. Pick a city from the list instead."); },
      { timeout: 10000, maximumAge: 600000 }
    );
  };

  return (
    <>
      <button onClick={() => { setOpen(true); setNote(""); setPreview(null); }} data-testid="city-chip" aria-label={`City: ${city.name}. Change city`} className="inline-flex items-center gap-1.5 text-xs text-folio-cream hover:text-folio-saffron transition-colors">
        <MapPin className="w-3.5 h-3.5 text-folio-saffron" />{city.name}
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/60" onClick={() => setOpen(false)} role="dialog" aria-label="Choose your city">
          <div className="w-full max-w-lg mx-auto bg-folio-ink border-t border-border p-5 animate-slide-up max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <span className="folio-eyebrow text-folio-cream-dim">Your city</span>
              <button onClick={() => setOpen(false)} aria-label="Close" className="p-1"><X className="w-4 h-4 text-folio-cream-dim" /></button>
            </div>
            <button onClick={locate} disabled={busy} data-testid="use-location" className="mt-3 w-full inline-flex items-center justify-center gap-2 py-3 border border-folio-saffron/50 text-folio-saffron folio-eyebrow disabled:opacity-50">
              <Navigation className="w-4 h-4" />{busy ? "Finding you…" : "Use my location"}
            </button>
            <p className="text-xs text-folio-cream-dim/70 mt-2 leading-relaxed">Optional. Your browser will ask first. We use it once to pick a city and don't store it.</p>
            {note && <p role="status" data-testid="location-note" className="text-xs text-folio-saffron mt-2 leading-relaxed">{note}</p>}
            <ul className="mt-3 divide-y divide-border border-y border-border">
              {CITY_LIST.map((c) => (
                <li key={c.id}>
                  <button
                    disabled={!c.curated} aria-disabled={!c.curated}
                    onClick={() => { setCityId(c.id); setOpen(false); }}
                    onMouseEnter={() => setPreview(null)}
                    data-testid={`city-${c.id}`}
                    className={cn("w-full text-left py-3.5 flex items-baseline justify-between gap-3", c.id === city.id && "text-folio-saffron", !c.curated && "opacity-50 cursor-not-allowed")}>
                    <span><span className="block folio-serif text-xl text-folio-cream">{c.name}</span><span className="block text-xs text-folio-cream-dim">{c.country}</span></span>
                    <span className="text-xs text-folio-cream-dim">{c.curated ? "Live · daily Editions" : "Coming soon"}</span>
                  </button>
                </li>
              ))}
            </ul>
            <MapFrame cityId={shown} name={(CITY_LIST.find((c) => c.id === shown) || city).name} />
            <p className="text-[0.65rem] text-folio-cream-dim/60 mt-1">Map © OpenStreetMap contributors. Loads only while this sheet is open.</p>
          </div>
        </div>
      )}
    </>
  );
}
