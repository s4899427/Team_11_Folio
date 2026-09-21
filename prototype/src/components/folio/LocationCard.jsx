import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { NEARBY, getCommunity } from "@/lib/folio-data";
import { fetchNearbyEvents } from "@/lib/events-api";

export default function LocationCard() {
  const [events, setEvents] = useState(NEARBY.events);
  const [live, setLive] = useState(false);
  const [reason, setReason] = useState(null);

  useEffect(() => {
    fetchNearbyEvents(NEARBY.location.split(",")[0].trim()).then((res) => {
      setEvents(res.events);
      setLive(res.live);
      setReason(res.reason);
    });
  }, []);

  return (
    <section className="border border-border p-5 folio-grain">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-folio-saffron" />
          <span className="folio-eyebrow text-folio-cream-dim">{NEARBY.location}</span>
        </div>
        <span className={`text-[0.6rem] uppercase tracking-wide px-1.5 py-0.5 rounded border ${live ? "text-folio-green border-folio-green/40" : "text-folio-cream-dim border-folio-cream-dim/30"}`}>
          {live ? "live" : "placeholder"}
        </span>
      </div>
      <p className="text-sm text-folio-cream/90 mt-3 leading-relaxed">{NEARBY.intro}</p>
      <div className="mt-4 space-y-3">
        {events.map((ev) => {
          const c = getCommunity(ev.type);
          return (
            <div key={ev.id} className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: c.color }} />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-folio-cream leading-tight">{ev.title}</p>
                <p className="text-xs text-folio-cream-dim mt-0.5">{ev.venue} · {ev.time}</p>
              </div>
            </div>
          );
        })}
      </div>
      {!live && reason && (
        <p className="text-[0.65rem] text-folio-cream-dim/60 mt-3">{reason}</p>
      )}
    </section>
  );
}
