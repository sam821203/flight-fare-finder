import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Navigate, Outlet, useOutletContext } from "react-router";

import { supabase } from "@/integrations/supabase/client";

type AuthState = { status: "loading" } | { status: "signed-out" } | { status: "signed-in"; user: User };

export type AuthContext = { user: User };

export function RequireAuth() {
  const [state, setState] = useState<AuthState>({ status: "loading" });

  useEffect(() => {
    let active = true;
    void supabase.auth.getUser().then(({ data, error }) => {
      if (!active) return;
      setState(error || !data.user ? { status: "signed-out" } : { status: "signed-in", user: data.user });
    });
    return () => {
      active = false;
    };
  }, []);

  if (state.status === "loading") return null;
  if (state.status === "signed-out") return <Navigate to="/sign-in" replace />;

  return <Outlet context={{ user: state.user } satisfies AuthContext} />;
}

export function useAuthUser() {
  return useOutletContext<AuthContext>().user;
}
