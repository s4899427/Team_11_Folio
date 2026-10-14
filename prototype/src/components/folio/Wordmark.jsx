import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Wordmark({ className, withDot = true, to }) {
  const Body = (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="folio-wordmark text-folio-cream">Folio</span>
      {withDot && <span className="w-1.5 h-1.5 rounded-full bg-folio-saffron" />}
    </span>
  );
  return to ? <Link to={to} aria-label="Folio: replay the introduction" data-testid="wordmark-replay">{Body}</Link> : Body;
}
