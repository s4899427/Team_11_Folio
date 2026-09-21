import { useState, useEffect } from "react";

function getRemaining() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return Math.max(0, midnight - now);
}

export default function Countdown() {
  const [ms, setMs] = useState(getRemaining());
  useEffect(() => {
    const t = setInterval(() => setMs(getRemaining()), 1000);
    return () => clearInterval(t);
  }, []);

  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="folio-eyebrow text-folio-cream-dim">Thread closes in</span>
      <span className="font-mono text-xl tracking-[0.15em] text-folio-cream tabular-nums">
        {pad(h)}:{pad(m)}:{pad(s)}
      </span>
    </div>
  );
}
