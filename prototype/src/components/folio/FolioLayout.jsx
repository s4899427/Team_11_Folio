import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { Sun, Archive, User, Plus } from "lucide-react";
import { useComposer } from "@/lib/folio-composer";
import { useFolio } from "@/lib/folio-store";
import PostComposer from "./PostComposer";
import { cn } from "@/lib/utils";

const TABS = [
  { to: "/", label: "Today", icon: Sun },
  { to: "/archive", label: "Archive", icon: Archive },
  { to: "/me", label: "Me", icon: User },
];

export default function FolioLayout() {
  const { pathname } = useLocation();
  const { openComposer } = useComposer();
  const { onboarded } = useFolio();
  if (!onboarded) return <Navigate to="/onboarding" replace />;

  return (
    <>
      <main className="min-h-screen pb-36">
        <Outlet />
      </main>

      <div className="fixed bottom-0 inset-x-0 z-40">
        <div className="max-w-lg mx-auto px-5 pb-2">
          <button onClick={() => openComposer()} className="w-full flex items-center justify-center gap-2 py-3.5 bg-folio-cream text-folio-ink folio-eyebrow hover:bg-white transition-colors active:scale-[0.98] transition-transform">
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            Make a Post
          </button>
        </div>

        <nav className="border-t border-border bg-folio-ink/95 backdrop-blur-md">
          <div className="max-w-lg mx-auto flex">
            {TABS.map(({ to, label, icon: Icon }) => {
              const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
              return (
                <Link key={to} to={to} className="flex-1 flex flex-col items-center gap-1 py-3 group">
                  <Icon className={cn("w-5 h-5 transition-colors", active ? "text-folio-saffron" : "text-folio-cream-dim group-hover:text-folio-cream")} strokeWidth={active ? 2 : 1.5} />
                  <span className={cn("folio-eyebrow transition-colors", active ? "text-folio-cream" : "text-folio-cream-dim")}>{label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      <PostComposer />
    </>
  );
}
