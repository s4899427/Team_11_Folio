import { BadgeCheck } from "lucide-react";
import CommunityBadge from "./CommunityBadge";

export default function CuratorCard({ curator, compact = false }) {
  return (
    <div className="flex items-start gap-3.5">
      <img src={curator.image} alt={curator.name} className="w-14 h-14 rounded-full object-cover flex-shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="folio-serif text-lg text-folio-cream leading-none">{curator.name}</span>
          <BadgeCheck className="w-4 h-4 text-folio-saffron flex-shrink-0" />
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <CommunityBadge communityId={curator.community} showLabel={false} />
          <span className="text-xs text-folio-cream-dim">{curator.role}</span>
        </div>
        {!compact && <p className="text-sm text-folio-cream-dim mt-2.5 leading-relaxed">{curator.bio}</p>}
      </div>
    </div>
  );
}
