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
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link to="/" className="flex items-center gap-2.5 font-semibold text-foreground">
            <span className="flex size-9 items-center justify-center rounded-full border-2 border-primary text-primary">
              <Plane className="size-4" aria-hidden="true" />
            </span>
            <span className="text-sm font-bold tracking-tight sm:text-base">Flight Price Notifier</span>
          </Link>
          <Button asChild variant="outline" className="rounded-lg">
            <Link to="/sign-in">Sign in / 登入</Link>
          </Button>
        </div>
      </header>

      <section className="relative border-b border-border">
        <div className="flight-path absolute inset-0" aria-hidden="true" />
        <div className="relative z-10 mx-auto flex min-h-[calc(88vh-4rem)] max-w-7xl items-center px-5 pb-20 pt-14 sm:px-8">
          <div className="grid w-full items-center gap-14 lg:grid-cols-[1fr_0.95fr] lg:gap-16">
            <div className="max-w-3xl animate-rise-in">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full bg-secondary px-3.5 py-1.5 text-xs font-semibold text-secondary-foreground">
                <span className="size-1.5 rounded-full bg-primary" />
                Taipei departures · Price-first travel
              </div>
              <h1 className="font-display text-5xl font-extrabold leading-[1.02] sm:text-7xl">
                Flight Price
                <span className="mt-1 block text-primary">Notifier</span>
              </h1>
              <p className="mt-7 max-w-2xl text-2xl font-semibold leading-snug sm:text-3xl">
                設定航線與目標價，機票降價就通知你
              </p>
              <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                Set a route and a target price — we email you when the fare drops.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-5">
                <Button asChild size="lg" className="h-12 rounded-lg px-7 text-base font-semibold">
                  <Link to="/sign-in">
                    Start watching fares
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
                <a href="#features" className="text-sm font-semibold text-primary transition-colors hover:text-primary/80">
                  See how it works
                </a>
              </div>
            </div>

            <div className="relative hidden lg:block" aria-hidden="true">
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-panel">
                <div className="grid grid-cols-[1fr_0.72fr]">
                  <div className="p-7">
                    <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.14em]">
                      <Plane className="plane-float size-4.5 rotate-45 text-foreground" />
                      Outbound
                    </div>
                    <div className="mt-7 flex items-end justify-between gap-3">
                      <div>
                        <p className="text-2xl font-bold">TPE</p>
                        <p className="mt-1 text-xs text-muted-foreground">Origin · Taipei</p>
                      </div>
                      <div className="mb-3 flex flex-1 flex-col items-center gap-1.5 text-muted-foreground">
                        <span className="text-xs">Watching</span>
                        <div className="flex w-full items-center gap-2">
                          <span className="dotted-line flex-1" />
                          <span className="text-xs font-semibold uppercase tracking-wide text-foreground">Direct</span>
                          <span className="dotted-line flex-1" />
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">NRT</p>
                        <p className="mt-1 text-xs text-muted-foreground">Tokyo</p>
                      </div>
                    </div>
                    <div className="radar relative mx-auto mt-10 size-28 rounded-full border border-primary/20">
                      <span className="absolute inset-[22%] rounded-full border border-primary/20" />
                      <span className="absolute inset-[44%] rounded-full bg-primary shadow-glow" />
                    </div>
                  </div>
                  <div className="flex flex-col justify-between bg-accent p-6">
                    <div className="rounded-lg bg-secondary px-3 py-2.5 text-center text-sm font-semibold text-secondary-foreground">
                      TPE → NRT
                    </div>
                    <div className="mt-8">
                      <p className="font-display text-4xl font-extrabold">NT$ 6,800</p>
                      <p className="mt-2 text-xs text-muted-foreground">per person</p>
                      <p className="mt-5 text-lg font-semibold">Target fare</p>
                    </div>
                    <div className="mt-6 rounded-lg bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground">
                      Watching
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="bg-surface py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-12 max-w-2xl reveal-on-scroll">
            <p className="text-sm font-semibold text-primary">Built for flexible travelers</p>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-5xl">
              你決定預算，我們負責盯價格。
            </h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.number}
                  className="group relative min-h-72 rounded-2xl border border-border bg-card p-7 transition-all hover:border-primary/40 hover:shadow-panel sm:p-8"
                >
                  <div className="flex items-start justify-between">
                    <span className="flex size-11 items-center justify-center rounded-full bg-secondary text-primary">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">{feature.number}</span>
                  </div>
                  <div className="mt-14">
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                    <p className="mt-1 text-sm font-semibold text-primary">{feature.english}</p>
                    <p className="mt-4 leading-7 text-muted-foreground">{feature.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="autumn-leaves border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© 2026 Flight Price Notifier</p>
          <div className="flex items-center gap-2 font-medium text-foreground">
            <RouteIcon className="size-4 text-primary" aria-hidden="true" />
            <span>From Taipei, under budget.</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
