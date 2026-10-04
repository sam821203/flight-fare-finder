import { BellRing, Check, LogOut, Plane, Route as RouteIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";

import { useAuthUser } from "@/components/RequireAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import {
  cancelSubscription,
  fetchSubscriptions,
  saveSubscription,
  type PlanName,
  type Subscription,
  type SubscriptionStatus,
} from "@/lib/flight-api";
import { usePageMeta } from "@/lib/use-page-meta";

const PLANS: { name: PlanName; label: string; route: string; hint: number }[] = [
  { name: "tokyo", label: "台北 ✈ 東京", route: "TPE-TYO", hint: 9325 },
  { name: "seoul", label: "台北 ✈ 首爾", route: "TPE-SEL", hint: 5989 },
  { name: "london", label: "台北 ✈ 倫敦", route: "TPE-LON", hint: 22583 },
];

const MONTHLY_FEE = 300;

const STATUS_BADGE: Record<SubscriptionStatus, { label: string; className: string }> = {
  active: { label: "已訂閱（有效）", className: "bg-secondary text-secondary-foreground" },
  pending_payment: { label: "未完成付款", className: "bg-amber-50 text-amber-700" },
  cancelled: { label: "已取消", className: "bg-muted text-muted-foreground" },
  expired: { label: "已結束", className: "bg-muted text-muted-foreground" },
};

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
  const status = subscription ? (subscription.subscription_status ?? "pending_payment") : undefined;
  const isPaid = status === "active" || status === "cancelled";
  const [target, setTarget] = useState(subscription ? String(subscription.target_price) : "");
  const [editing, setEditing] = useState(!subscription);
  const [saving, setSaving] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (subscription) {
      setTarget(String(subscription.target_price));
      setEditing(false);
    }
  }, [subscription]);

  async function submitTarget(value: number) {
    setSaving(true);
    setError("");
    try {
      const saved = await saveSubscription(email, plan.name, Math.round(value));
      if (!saved) return;
      onSaved({
        ...subscription,
        route: saved.route,
        plan_name: plan.name,
        target_price: saved.target_price,
        currency: "TWD",
        subscription_status: saved.subscription_status ?? subscription?.subscription_status,
        current_period_end_date:
          saved.current_period_end_date ?? subscription?.current_period_end_date,
      });
      setEditing(false);
      setSaving(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "訂閱失敗，請稍後再試");
      setSaving(false);
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const value = Number(target);
    if (!Number.isFinite(value) || value <= 0) {
      setError("請輸入大於 0 的目標價");
      return;
    }
    void submitTarget(value);
  }

  async function handleCancel() {
    if (!subscription) return;
    if (!window.confirm("確定要取消訂閱嗎？已付費的這一期結束前仍會收到通知，之後不再扣款。"))
      return;
    setCancelling(true);
    setError("");
    try {
      const result = await cancelSubscription(email, subscription.route);
      onSaved({
        ...subscription,
        subscription_status: result.subscription_status,
        current_period_end_date:
          result.current_period_end_date ?? subscription.current_period_end_date,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "取消失敗，請稍後再試");
    } finally {
      setCancelling(false);
    }
  }

  const badge = status ? STATUS_BADGE[status] : undefined;
  const submitLabel = saving
    ? isPaid
      ? "儲存中…"
      : "前往付款…"
    : isPaid
      ? "儲存"
      : `訂閱 NT$${MONTHLY_FEE}/月`;

  return (
    <div className="brush-edge flex flex-col border border-border bg-card p-6 text-card-foreground shadow-sm transition-shadow hover:shadow-panel">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-xl font-bold tracking-tight">{plan.label}</h2>
        {badge && (
          <span
            className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${badge.className}`}
          >
            {status === "active" && <Check className="size-3" aria-hidden="true" />}
            {badge.label}
          </span>
        )}
      </div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        近期最低價約 NT${plan.hint.toLocaleString()}，票價低於你的目標價時會寄 email 通知你。月費
        NT${MONTHLY_FEE}，可隨時取消。
      </p>
      {status === "cancelled" && subscription?.current_period_end_date && (
        <p className="mt-3 text-sm text-foreground">
          有效至 {subscription.current_period_end_date}，在這之前仍會通知你。
        </p>
      )}
      {status === "pending_payment" && (
        <p className="mt-3 text-sm text-foreground">完成付款後才會開始寄降價通知。</p>
      )}
      {status === "expired" && (
        <p className="mt-3 text-sm text-foreground">訂閱已結束，重新訂閱即可恢復通知。</p>
      )}

      {subscription && !editing ? (
        <div className="mt-6 flex flex-col gap-4">
          <div className="rounded-xl bg-accent px-4 py-4">
            <p className="text-xs font-medium text-muted-foreground">目前目標價</p>
            <p className="mt-1 font-display text-3xl font-extrabold">
              NT${subscription.target_price.toLocaleString()}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {status === "pending_payment" && (
              <Button
                onClick={() => void submitTarget(subscription.target_price)}
                disabled={saving}
              >
                {saving ? "前往付款…" : "完成付款"}
              </Button>
            )}
            {status === "expired" ? (
              <Button onClick={() => setEditing(true)}>重新訂閱</Button>
            ) : (
              <Button variant="outline" onClick={() => setEditing(true)}>
                更新目標價
              </Button>
            )}
            {status === "active" && (
              <Button variant="ghost" onClick={handleCancel} disabled={cancelling}>
                {cancelling ? "取消中…" : "取消訂閱"}
              </Button>
            )}
          </div>
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
              className="h-11 rounded-lg bg-card pl-11"
            />
          </div>
          <Button type="submit" disabled={saving} className="h-11 rounded-lg px-5 font-semibold">
            {submitLabel}
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
  const [searchParams] = useSearchParams();
  const purchase = searchParams.get("purchase");
  const email = user.email ?? "";

  useEffect(() => {
    if (!email) return;
    const load = () =>
      fetchSubscriptions(email)
        .then(setSubscriptions)
        .catch(() => setLoadError("無法載入你的訂閱，請重新整理再試一次。"));
    void load();
    if (purchase !== "success") return;
    const timer = window.setTimeout(load, 4000);
    return () => window.clearTimeout(timer);
  }, [email, purchase]);

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
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link to="/" className="flex items-center gap-3 font-semibold text-foreground">
            <span className="flex size-9 items-center justify-center rounded-full border-2 border-primary text-primary">
              <Plane className="size-4" aria-hidden="true" />
            </span>
            <span className="hidden font-bold tracking-tight sm:inline">Flight Price Notifier</span>
          </Link>
          <Button variant="outline" className="rounded-lg" onClick={handleSignOut} disabled={isSigningOut}>
            <LogOut aria-hidden="true" />
            {isSigningOut ? "Signing out…" : "Sign Out"}
          </Button>
        </div>
      </header>

      <section className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-start px-5 py-12 sm:px-8">
        <div className="dashboard-grid absolute inset-0 -z-0 opacity-70" aria-hidden="true" />
        <div className="relative z-10 w-full animate-rise-in">
          <div className="mb-6 flex size-12 items-center justify-center rounded-full bg-secondary text-primary">
            <BellRing className="size-6" aria-hidden="true" />
          </div>
          <p className="mb-2 text-sm font-semibold text-primary">
            Dashboard
          </p>
          <h1 className="font-display break-all text-3xl font-bold leading-tight sm:text-4xl">
            Hi {user.email}
          </h1>
          <div className="mt-7 rounded-2xl border border-border bg-card px-6 py-5 sm:px-7">
            <p className="max-w-2xl text-lg font-semibold leading-relaxed text-foreground sm:text-xl">
              選一條航線、設定你的目標價，降到目標時我們會寄 email 給你。
            </p>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              每 30 分鐘檢查一次下個月出發的最低票價。
            </p>
          </div>
          {purchase === "success" && (
            <p className="mt-6 rounded-xl border border-primary/30 bg-accent px-4 py-3 text-sm font-medium text-secondary-foreground">
              付款完成！綠界確認後訂閱會在幾秒內生效，並寄一封歡迎信給你。
            </p>
          )}
          {purchase === "failed" && (
            <p className="mt-6 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              付款沒有成功，請再試一次。
            </p>
          )}
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
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
          <div className="mt-10 flex items-center gap-3 text-sm text-muted-foreground">
            <RouteIcon className="size-4 text-primary" aria-hidden="true" />
            <span>Taipei → your next affordable escape</span>
          </div>
        </div>
      </section>
    </main>
  );
}
