import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Eye, EyeOff, LoaderCircle, LockKeyhole, Mail, Plane } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

type AuthMode = "signin" | "signup";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign In | Flight Price Notifier" },
      {
        name: "description",
        content: "Sign in or create your Flight Price Notifier account.",
      },
      { property: "og:title", content: "Sign In | Flight Price Notifier" },
      {
        property: "og:description",
        content: "Sign in or create your Flight Price Notifier account.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    void supabase.auth.getUser().then(({ data }) => {
      if (active && data.user) void navigate({ to: "/app", replace: true });
    });
    return () => {
      active = false;
    };
  }, [navigate]);

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: window.location.origin },
          });

    if (result.error) {
      setError(result.error.message);
      setIsSubmitting(false);
      return;
    }

    await router.invalidate();
    await navigate({ to: "/app", replace: true });
  }

  const isSignIn = mode === "signin";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-5 py-12 text-foreground">
      <div className="flight-path absolute inset-0 opacity-50" aria-hidden="true" />
      <Link
        to="/"
        className="absolute left-5 top-6 z-10 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground sm:left-8 sm:top-8"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back home
      </Link>

      <section className="relative z-10 w-full max-w-md animate-rise-in">
        <div className="mb-8 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-glow">
            <Plane className="size-5" aria-hidden="true" />
          </span>
          <h1 className="mt-5 font-display text-3xl font-semibold">
            {isSignIn ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isSignIn ? "登入並準備追蹤下一張便宜機票" : "加入，讓理想票價主動來找你"}
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card/90 p-6 shadow-panel backdrop-blur-xl sm:p-8">
          <div className="mb-7 grid grid-cols-2 rounded-md bg-muted p-1" aria-label="Authentication mode">
            <Button
              type="button"
              variant={isSignIn ? "secondary" : "ghost"}
              className="shadow-none"
              onClick={() => switchMode("signin")}
            >
              Sign In
            </Button>
            <Button
              type="button"
              variant={!isSignIn ? "secondary" : "ghost"}
              className="shadow-none"
              onClick={() => switchMode("signup")}
            >
              Sign Up
            </Button>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="h-11 pl-10"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={isSignIn ? "current-password" : "new-password"}
                  placeholder="At least 6 characters"
                  minLength={6}
                  className="h-11 px-10"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </Button>
              </div>
            </div>

            {error ? (
              <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}

            <Button type="submit" size="lg" className="h-11 w-full" disabled={isSubmitting}>
              {isSubmitting ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : null}
              {isSubmitting ? "Please wait…" : isSignIn ? "Sign In / 登入" : "Create Account / 註冊"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isSignIn ? "New here?" : "Already have an account?"}{" "}
            <button
              type="button"
              className="font-medium text-primary transition-colors hover:text-primary/80"
              onClick={() => switchMode(isSignIn ? "signup" : "signin")}
            >
              {isSignIn ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}