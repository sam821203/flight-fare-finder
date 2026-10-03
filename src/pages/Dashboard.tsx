import { BellRing, Check, LogOut, Plane, Route as RouteIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

import { useAuthUser } from "@/components/RequireAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import {
  fetchSubscriptions,
  saveSubscription,
  type PlanName,
  type Subscription,
} from "@/lib/flight-api";
import { usePageMeta } from "@/lib/use-page-meta";

const PLANS: { name: PlanName; label: string; route: string; hint: number }[] = [
  { name: "tokyo", label: "台北 ✈ 東京", route: "TPE-TYO", hint: 9325 },
  { name: "seoul", label: "台北 ✈ 首爾", route: "TPE-SEL", hint: 5989 },
];

function PlanCard({
  plan,
  email,
  subscription,
  onSaved,
}: {
  plan: (typeof PLANS)[number];
  email: string;
  subscription: Subscription | undefined;
  onSaved: (sub: Subscription) => void;
}) {
  const [target, setTarget] = useState(subscription ? String(subscription.target_price) : "");
  const [editing, setEditing] = useState(!subscription);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (subscription) {
      setTarget(String(subscription.target_price));
      setEditing(false);
    }
  }, [subscription]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const value = Number(target);
    if (!Number.isFinite(value) || value <= 0) {
      setError("請輸入大於 0 的目標價");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const saved = await saveSubscription(email, plan.name, Math.round(value));
      onSaved({
        route: saved.route,
        plan_name: plan.name,
        target_price: saved.target_price,
        currency: "TWD",
      });
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "訂閱失敗，請稍後再試");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="brush-edge flex flex-col border border-border bg-card p-6 text-card-foreground">
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-display text-2xl font-semibold">{plan.label}</h2>
        {subscription && (
          <span className="inline-flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
            <Check className="size-3" aria-hidden="true" />
            已訂閱
          </span>
        )}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        近期最低價約 NT${plan.hint.toLocaleString()}，票價低於你的目標價時會寄 email 通知你。
      </p>

      {subscription && !editing ? (
        <div className="mt-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">目前目標價</p>
            <p className="mt-1 text-2xl font-semibold">
              NT${subscription.target_price.toLocaleString()}
            </p>
          </div>
          <Button variant="outline" onClick={() => setEditing(true)}>
            更新目標價
          </Button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <label className="sr-only" htmlFor={`target-${plan.name}`}>
            目標價（TWD）
          </label>
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              NT$
            </span>
            <Input
              id={`target-${plan.name}`}
              type="number"
              inputMode="numeric"
              min={1}
              placeholder="10000"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="pl-11"
            />
          </div>
          <Button type="submit" disabled={saving}>
            {saving ? "儲存中…" : subscription ? "儲存" : "開始追蹤"}
          </Button>
        </form>
      )}
      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
    </div>
  );
}

export function Dashboard() {
  usePageMeta({
    title: "Dashboard | Flight Price Notifier",
    description: "Subscribe to flight routes and get an email when fares drop below your target.",
  });
  const user = useAuthUser();
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loadError, setLoadError] = useState("");
  const email = user.email ?? "";

  useEffect(() => {
    if (!email) return;
    fetchSubscriptions(email)
      .then(setSubscriptions)
      .catch(() => setLoadError("無法載入你的訂閱，請重新整理再試一次。"));
  }, [email]);

  function handleSaved(sub: Subscription) {
    setSubscriptions((prev) => [...prev.filter((s) => s.route !== sub.route), sub]);
  }

  async function handleSignOut() {
    setIsSigningOut(true);
    await supabase.auth.signOut();
    await navigate("/sign-in", { replace: true });
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
        <div className="relative z-10 w-full max-w-4xl animate-rise-in">
          <div className="brush-edge mb-8 flex size-14 items-center justify-center border border-secondary/30 bg-accent text-primary">
            <BellRing className="size-6" aria-hidden="true" />
          </div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            Dashboard
          </p>
          <h1 className="font-display text-3xl font-semibold leading-tight sm:text-5xl">
            Hi {user.email}
          </h1>
          <div className="mt-9 border-l-2 border-primary pl-6 sm:pl-8">
            <p className="max-w-2xl text-xl font-medium leading-relaxed text-foreground sm:text-2xl">
              選一條航線、設定你的目標價，降到目標時我們會寄 email 給你。
            </p>
            <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
              每 30 分鐘檢查一次下個月出發的最低票價。
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {PLANS.map((plan) => (
              <PlanCard
                key={plan.name}
                plan={plan}
                email={email}
                subscription={subscriptions.find((s) => s.route === plan.route)}
                onSaved={handleSaved}
              />
            ))}
          </div>
          {loadError && <p className="mt-4 text-sm text-destructive">{loadError}</p>}
          <div className="mt-12 flex items-center gap-3 text-sm text-muted-foreground">
            <RouteIcon className="size-4 text-primary" aria-hidden="true" />
            <span>Taipei → your next affordable escape</span>
          </div>
        </div>
      </section>
    </main>
  );
}
