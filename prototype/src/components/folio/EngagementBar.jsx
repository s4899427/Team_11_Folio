import { Heart } from "lucide-react";
import { useFolio } from "@/lib/folio-store";
import { cn } from "@/lib/utils";

// Plain visible count only — never used for sorting or ranking anywhere.
export default function EngagementBar({ targetId, baseLikes = 0 }) {
  const { getInteractions, toggleLike } = useFolio();
  const { likes, likedByMe } = getInteractions(targetId, baseLikes);

  return (
    <button
      onClick={() => toggleLike(targetId, baseLikes)}
      className="flex items-center gap-1.5 text-xs transition-colors"
      aria-label={likedByMe ? "Unlike" : "Like"}
    >
      <Heart className={cn("w-4 h-4 transition-colors", likedByMe ? "fill-folio-burgundy text-folio-burgundy" : "text-folio-cream-dim")} />
      <span className={likedByMe ? "text-folio-burgundy" : "text-folio-cream-dim"}>{likes}</span>
    </button>
  );
}
