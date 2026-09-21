import { cn } from "@/lib/utils";

export default function Wordmark({ className, withDot = true }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="folio-wordmark text-folio-cream">Folio</span>
      {withDot && <span className="w-1.5 h-1.5 rounded-full bg-folio-saffron" />}
    </span>
  );
}
