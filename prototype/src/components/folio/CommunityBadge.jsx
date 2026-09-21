import { getCommunity } from "@/lib/folio-data";
import { cn } from "@/lib/utils";

export default function CommunityBadge({ communityId, size = "sm", showLabel = true, className }) {
  const c = getCommunity(communityId);
  const dot = size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2";
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span className={cn("rounded-full", dot)} style={{ backgroundColor: c.color }} />
      {showLabel && <span className="folio-eyebrow text-folio-cream-dim">{c.name}</span>}
    </span>
  );
}
