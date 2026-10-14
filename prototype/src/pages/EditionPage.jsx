import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import EditionView from "@/components/folio/EditionView";
import { listEditions } from "@/lib/api";
import { cityToday } from "@/lib/time";
import { useFolio } from "@/lib/folio-store";

export default function EditionPage() {
  const { date } = useParams();
  const { session, city } = useFolio();
  const { data, isLoading } = useQuery({ queryKey: ["editions", session?.id ?? "guest", city.id], queryFn: () => listEditions(session, city.id) });
  const edition = data?.editions.find((e) => e.date === date);
  const locked = date < cityToday(city.tz);

  return (
    <div className="max-w-lg mx-auto px-5 pt-8">
      <Link to="/archive" className="inline-flex items-center gap-1.5 text-xs text-folio-cream-dim hover:text-folio-cream mb-6"><ArrowLeft className="w-3.5 h-3.5" /> Archive</Link>
      {isLoading && <p className="text-sm text-folio-cream-dim">Loading…</p>}
      {edition && <EditionView edition={edition} locked={locked} />}
      {data && !edition && <p className="text-sm text-folio-cream-dim">No Edition was published on that day.</p>}
    </div>
  );
}
