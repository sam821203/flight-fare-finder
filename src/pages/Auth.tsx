import { ArrowLeft, Eye, EyeOff, LoaderCircle, LockKeyhole, Mail, Plane } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { usePageMeta } from "@/lib/use-page-meta";

type AuthMode = "signin" | "signup";

export function Auth({ mode }: { mode: AuthMode }) {
  usePageMeta(
    mode === "signin"
      ? {
          title: "Sign In | Flight Price Notifier",
          description: "Sign in or create your Flight Price Notifier account.",
        }
      : {
          title: "Sign Up | Flight Price Notifier",
          description: "Create your Flight Price Notifier account.",
        },
  );
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    void supabase.auth.getUser().then(({ data }) => {
      if (active && data.user) void navigate("/app", { replace: true });
    });
    return () => {
      active = false;
    };
  }, [navigate]);

  function switchMode(nextMode: AuthMode) {
    setError("");
    if (nextMode !== mode) void navigate(nextMode === "signin" ? "/sign-in" : "/sign-up");
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

    window.location.assign("/app");
  }

  const isSignIn = mode === "signin";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-5 py-12 text-foreground">
      <div className="flight-path absolute inset-0" aria-hidden="true" />
      <Link
        to="/"
        className="absolute left-5 top-6 z-10 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground sm:left-8 sm:top-8"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back home
      </Link>

      <section className="relative z-10 w-full max-w-md animate-rise-in">
        <div className="mb-8 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full border-2 border-primary bg-card text-primary">
            <Plane className="size-5" aria-hidden="true" />
          </span>
          <h1 className="mt-5 font-display text-3xl font-bold">
            {isSignIn ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isSignIn ? "登入並準備追蹤下一張便宜機票" : "加入，讓理想票價主動來找你"}
          </p>
        </div>

        <div className="brush-edge border border-border bg-card p-6 shadow-panel sm:p-8">
          <div className="mb-7 grid grid-cols-2 gap-1 rounded-xl border border-border bg-card p-1" aria-label="Authentication mode">
            <Button
              type="button"
              variant={isSignIn ? "secondary" : "ghost"}
              className="h-10 rounded-lg font-semibold shadow-none"
              onClick={() => switchMode("signin")}
            >
              Sign In
            </Button>
            <Button
              type="button"
              variant={!isSignIn ? "secondary" : "ghost"}
              className="h-10 rounded-lg font-semibold shadow-none"
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
                  className="h-11 rounded-lg pl-10"
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
                  className="h-11 rounded-lg px-10"
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

            <Button type="submit" size="lg" className="h-12 w-full rounded-lg text-base font-semibold" disabled={isSubmitting}>
              {isSubmitting ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : null}
              {isSubmitting ? "Please wait…" : isSignIn ? "Sign In / 登入" : "Create Account / 註冊"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isSignIn ? "New here?" : "Already have an account?"}{" "}
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 font-medium"
              onClick={() => switchMode(isSignIn ? "signup" : "signin")}
            >
              {isSignIn ? "Create an account" : "Sign in"}
            </Button>
          </p>
        </div>
      </section>
    </main>
  );
}