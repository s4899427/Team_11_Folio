const DOTS = ["#7C1F3A", "#D4A24E", "#2F5447", "#C25B3F"];

export default function AmbientPresence({ count }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex items-center gap-1">
        {DOTS.map((c, i) => (
          <span key={i} className="w-1.5 h-1.5 rounded-full animate-pulse-soft" style={{ backgroundColor: c, animationDelay: `${i * 0.35}s` }} />
        ))}
      </div>
      <span className="text-xs text-folio-cream-dim">{count} in the room now</span>
    </div>
  );
}
