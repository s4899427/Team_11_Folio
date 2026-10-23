import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { heartbeatReading, REMOTE } from "@/lib/api";
import { PRESENCE_POLL_MS, canTrackPresence, newClientId, readingLabel } from "@/lib/live";

/**
 * Anonymous "reading right now" count for today's open Edition.
 * Sends a random per-page-load id (never saved) every 10 s while the tab is visible.
 * Shows nothing if the database function is missing or unreachable.
 */
export default function ReadingNow({ editionId, locked }) {
  const [clientId] = useState(() => newClientId());
  const on = canTrackPresence({ remote: REMOTE, locked, editionId });
  const { data } = useQuery({
    queryKey: ["reading-now", editionId, clientId],
    queryFn: () => heartbeatReading(editionId, clientId),
    enabled: on,
    refetchInterval: PRESENCE_POLL_MS,
    retry: false,
  });
  const label = on ? readingLabel(data) : null;
  if (!label) return null;
  return (
    <p data-testid="reading-now" className="mt-3 text-xs text-folio-cream-dim flex items-center gap-2" role="status">
      <span aria-hidden className="inline-block w-1.5 h-1.5 rounded-full bg-folio-saffron animate-pulse" />
      {label}
    </p>
  );
}
