import { useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useFolio } from "@/lib/folio-store";

export default function ThemeToggle() {
  const { theme, setTheme } = useFolio();
  const [overlay, setOverlay] = useState(null);

  const handleToggle = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const nextTheme = theme === "dark" ? "light" : "dark";
    const color = nextTheme === "light" ? "#F7F1E4" : "#0C0A09";

    setOverlay({ x, y, color, expanded: false });
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setOverlay((o) => (o ? { ...o, expanded: true } : o));
      });
    });
    setTimeout(() => setTheme(nextTheme), 500);
    setTimeout(() => setOverlay(null), 900);
  };

  return (
    <>
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between px-4 py-3.5 border border-border hover:border-folio-saffron/50 hover:bg-folio-saffron/5 transition-all text-left"
      >
        <div className="flex items-center gap-3">
          {theme === "dark" ? (
            <Moon className="w-4 h-4 text-folio-saffron" />
          ) : (
            <Sun className="w-4 h-4 text-folio-saffron" />
          )}
          <span className="text-sm text-folio-cream">Theme</span>
        </div>
        <span className="text-xs text-folio-cream-dim">
          {theme === "dark" ? "Dark" : "Light"} — tap to flip
        </span>
      </button>

      {overlay && (
        <div
          className="fixed inset-0 z-[9999] pointer-events-none"
          style={{
            backgroundColor: overlay.color,
            clipPath: `circle(${overlay.expanded ? "150%" : "0px"} at ${overlay.x}px ${overlay.y}px)`,
            transition: "clip-path 0.65s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
      )}
    </>
  );
}
