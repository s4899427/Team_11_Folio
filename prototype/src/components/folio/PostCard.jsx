import { useState } from "react";
import { Bookmark } from "lucide-react";
import CommunityBadge from "./CommunityBadge";
import EngagementBar from "./EngagementBar";
import CommentSection from "./CommentSection";
import { useFolio } from "@/lib/folio-store";
import { cn } from "@/lib/utils";

// locked=true disables saving/liking/commenting — used when a post is
// shown inside an already-archived, read-only Thread.
export default function PostCard({ post, locked = false, onImageError }) {
  const { saveItem, removeSaved, isSaved } = useFolio();
  const saved = isSaved(post.id);
  const [imgFailed, setImgFailed] = useState(false);

  const handleImgError = () => {
    setImgFailed(true);
    if (onImageError) onImageError(post.id);
  };

  const toggleBookmark = () => {
    if (saved) removeSaved(post.id);
    else saveItem(post);
  };

  return (
    <article className="py-5 border-b border-border animate-fade-up">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <img src={post.authorImage} alt={post.author} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
          <span className="text-sm text-folio-cream truncate">{post.author}</span>
        </div>
      </div>

      <h3 className="folio-serif text-lg text-folio-cream mt-3 leading-tight">{post.title}</h3>
      <p className="text-sm text-folio-cream-dim mt-2 leading-relaxed line-clamp-3">{post.body}</p>

      {post.image && !imgFailed && (
        <img src={post.image} alt={post.title} onError={handleImgError} className="w-full aspect-[4/3] object-cover mt-4" />
      )}

      <div className="flex items-center justify-between mt-4">
        <CommunityBadge communityId={post.community} showLabel={false} />
        {!locked && (
          <div className="flex items-center gap-4">
            <EngagementBar targetId={post.id} baseLikes={post.likes || 0} />
            <span className="text-xs text-folio-cream-dim">{post.date}</span>
            <button onClick={toggleBookmark} className="p-1.5 -m-1.5 hover:text-folio-saffron transition-colors" aria-label={saved ? "Remove from saved" : "Save post"}>
              <Bookmark className={cn("w-4 h-4", saved ? "fill-folio-saffron text-folio-saffron" : "text-folio-cream-dim")} />
            </button>
          </div>
        )}
      </div>

      {!locked && (
        <div className="mt-3">
          <CommentSection targetId={post.id} />
        </div>
      )}
    </article>
  );
}
