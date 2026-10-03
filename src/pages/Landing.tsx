import { Link } from "react-router";
import { ArrowRight, BellRing, Eye, Plane, Route as RouteIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/lib/use-page-meta";

const features = [
  {
    icon: Eye,
    number: "01",
    title: "盯緊熱門航線",
    english: "Always-on route watching",
    description: "持續監控台北出發的熱門航線（東京、首爾），自動抓最低票價。",
  },
  {
    icon: BellRing,
    number: "02",
    title: "達標自動通知",
    english: "Target-price email alerts",
    description: "低於你設定的目標價，就寄 email 提醒你，附上立即訂購連結。",
  },
  {
    icon: X,
    number: "03",
    title: "隨時取消",
    english: "Cancel anytime",
    description: "月訂閱制，不想用隨時停，沒有綁約。",
  },
];

export function Landing() {
  usePageMeta({
    title: "Flight Price Notifier | 機票降價通知",
    description: "Set a route and a target price — we email you when the fare drops.",
    twitterCard: "summary_large_image",
  });

  return (
    <main className="overflow-hidden bg-background text-foreground">
      <section className="relative min-h-[92vh] border-b border-border">
        <div className="flight-path absolute inset-0 opacity-90" aria-hidden="true" />
        <header className="relative z-20 mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link to="/" className="flex items-center gap-3 font-semibold text-foreground">
            <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-glow">
              <Plane className="size-4.5" aria-hidden="true" />
            </span>
            <span className="text-sm sm:text-base">Flight Price Notifier</span>
          </Link>
          <Button asChild variant="outline">
            <Link to="/sign-in">Sign in / 登入</Link>
          </Button>
        </header>

        <div className="relative z-10 mx-auto flex min-h-[calc(92vh-5rem)] max-w-7xl items-center px-5 pb-20 pt-10 sm:px-8">
          <div className="grid w-full items-center gap-14 lg:grid-cols-[1fr_0.78fr] lg:gap-20">
            <div className="max-w-4xl animate-rise-in">
              <div className="mb-7 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
                <span className="size-1.5 rounded-full bg-primary shadow-glow" />
                Taipei departures · Price-first travel
              </div>
              <h1 className="font-display text-5xl font-semibold leading-[0.96] sm:text-7xl lg:text-8xl">
                Flight Price
                <span className="mt-1 block text-primary">Notifier</span>
              </h1>
              <p className="mt-8 max-w-2xl text-2xl font-medium leading-snug sm:text-3xl">
                設定航線與目標價，機票降價就通知你
              </p>
              <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                Set a route and a target price — we email you when the fare drops.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Button asChild size="lg" className="h-12 px-6">
                  <Link to="/sign-in">
                    Start watching fares
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
                <a href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                  See how it works
                </a>
              </div>
            </div>

            <div className="relative hidden min-h-[430px] lg:block" aria-hidden="true">
              <div className="radar absolute left-1/2 top-1/2 size-80 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/20">
                <span className="absolute inset-[22%] rounded-full border border-primary/20" />
                <span className="absolute inset-[44%] rounded-full bg-primary shadow-glow" />
              </div>
              <div className="absolute left-[8%] top-[18%] border-l border-primary pl-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Origin</p>
                <p className="mt-1 font-display text-2xl font-semibold">TPE</p>
              </div>
              <Plane className="plane-float absolute right-[8%] top-[18%] size-10 rotate-45 text-primary" />
              <div className="crayon-edge absolute bottom-[16%] right-[2%] w-52 border-2 border-border bg-card/85 p-4 shadow-panel backdrop-blur-md">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>TPE → NRT</span>
                  <span>Watching</span>
                </div>
                <p className="mt-3 font-display text-3xl font-semibold">NT$ 6,800</p>
                <p className="mt-1 text-xs text-primary">Target fare</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="bg-surface py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-12 max-w-2xl reveal-on-scroll">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Built for flexible travelers</p>
            <h2 className="mt-4 font-display text-3xl font-semibold sm:text-5xl">
              你決定預算，我們負責盯價格。
            </h2>
          </div>
          <div className="crayon-edge grid gap-0.5 overflow-hidden border-2 border-border bg-border lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article key={feature.number} className="group relative min-h-80 bg-card p-7 transition-colors hover:bg-accent sm:p-9">
                  <div className="flex items-start justify-between">
                    <span className="flex size-11 items-center justify-center rounded-md border border-primary/25 bg-primary/10 text-primary">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">{feature.number}</span>
                  </div>
                  <div className="mt-16">
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="mt-1 text-sm font-medium text-primary">{feature.english}</p>
                    <p className="mt-5 leading-7 text-muted-foreground">{feature.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="crayon-grass border-t-2 border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm font-semibold text-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© 2026 Flight Price Notifier</p>
          <div className="flex items-center gap-2">
            <RouteIcon className="size-4 text-primary" aria-hidden="true" />
            <span>From Taipei, under budget.</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
