import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { BellRing, LogOut, Plane, Route as RouteIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/app")({
  head: () => ({
    meta: [
      { title: "Dashboard | Flight Price Notifier" },
      {
        name: "description",
        content: "Your Flight Price Notifier dashboard for future route tracking and fare alerts.",
      },
      { property: "og:title", content: "Dashboard | Flight Price Notifier" },
      {
        property: "og:description",
        content: "Your Flight Price Notifier dashboard for future route tracking and fare alerts.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AppDashboard,
});

function AppDashboard() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);
    await supabase.auth.signOut();
    await navigate({ to: "/auth", replace: true });
  }

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <header className="border-b border-border/70 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link to="/" className="flex items-center gap-3 font-semibold text-foreground">
            <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-glow">
              <Plane className="size-4.5" aria-hidden="true" />
            </span>
            <span className="hidden sm:inline">Flight Price Notifier</span>
          </Link>
          <Button variant="outline" onClick={handleSignOut} disabled={isSigningOut}>
            <LogOut aria-hidden="true" />
            {isSigningOut ? "Signing out…" : "Sign Out"}
          </Button>
        </div>
      </header>

      <section className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center px-5 py-16 sm:px-8">
        <div className="dashboard-grid absolute inset-0 -z-0 opacity-40" aria-hidden="true" />
        <div className="relative z-10 w-full max-w-3xl animate-rise-in">
          <div className="mb-8 flex size-14 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
            <BellRing className="size-6" aria-hidden="true" />
          </div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">Dashboard</p>
          <h1 className="font-display text-3xl font-semibold leading-tight sm:text-5xl">
            Hi {user.email}
          </h1>
          <div className="mt-9 border-l-2 border-primary pl-6 sm:pl-8">
            <p className="max-w-2xl text-xl font-medium leading-relaxed text-foreground sm:text-2xl">
              你的航線追蹤儀表板即將上線 — 下一個里程碑會加上訂閱航線的功能。
            </p>
            <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
              Your dashboard is coming soon. Route-subscription will be added in the next milestone.
            </p>
          </div>
          <div className="mt-12 flex items-center gap-3 text-sm text-muted-foreground">
            <RouteIcon className="size-4 text-primary" aria-hidden="true" />
            <span>Taipei → your next affordable escape</span>
          </div>
        </div>
      </section>
    </main>
  );
}