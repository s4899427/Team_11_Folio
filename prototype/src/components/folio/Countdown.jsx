import { useState, useEffect } from "react";
import { msUntilMidnight } from "@/lib/time";
import { useFolio } from "@/lib/folio-store";

export default function Countdown({ label }) {
  const { city } = useFolio();
  const [ms, setMs] = useState(msUntilMidnight(city.tz));
  useEffect(() => {
    setMs(msUntilMidnight(city.tz));
    const t = setInterval(() => setMs(msUntilMidnight(city.tz)), 1000);
    return () => clearInterval(t);
  }, [city.tz]);
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const pad = (n) => String(n).padStart(2, "0");
  return (
    <div className="flex flex-col items-center gap-1.5" data-testid="countdown">
      <span className="folio-eyebrow text-folio-cream-dim">{label || `Locks at ${city.name} midnight`}</span>
      <span className="font-mono text-xl tracking-[0.15em] text-folio-cream tabular-nums">{pad(h)}:{pad(m)}:{pad(s)}</span>
    </div>
  );
}
