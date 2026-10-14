import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { Sun, Compass, User, PenLine, ShieldCheck } from "lucide-react";
import { useFolio } from "@/lib/folio-store";
import { cn } from "@/lib/utils";

const TABS = [
  { to: "/", label: "Today", icon: Sun },
  { to: "/archive", label: "Browse", icon: Compass },
  { to: "/me", label: "Me", icon: User },
];

export default function FolioLayout() {
  const { pathname } = useLocation();
  const { seenIntro, session, isCurator, isAdmin } = useFolio();
  if (!seenIntro) return <Navigate to="/welcome" replace />;
  // Each role gets its own tab, so the work they came to do is one tap away.
  const tabs = [
    ...TABS.slice(0, 2),
    ...(isAdmin ? [{ to: "/admin", label: "Team", icon: ShieldCheck }] : []),
    ...(isCurator ? [{ to: "/studio", label: "Studio", icon: PenLine }] : []),
    TABS[2],
  ];
  void session;

  return (
    <>
      <main className="min-h-screen pb-28">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-folio-ink/95 backdrop-blur-md">
        <div className="max-w-lg mx-auto flex">
          {tabs.map(({ to, label, icon: Icon }) => {
            const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
            return (
              <Link key={to} to={to} data-testid={`tab-${label.toLowerCase()}`} className="flex-1 flex flex-col items-center gap-1 py-3 group">
                <Icon className={cn("w-5 h-5 transition-colors", active ? "text-folio-saffron" : "text-folio-cream-dim group-hover:text-folio-cream")} strokeWidth={active ? 2 : 1.5} />
                <span className={cn("folio-eyebrow transition-colors", active ? "text-folio-cream" : "text-folio-cream-dim")}>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
