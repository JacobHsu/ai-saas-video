import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Navigate, Outlet, useOutletContext } from "react-router-dom";

import { supabase } from "@/integrations/supabase/client";

export function useAuthUser() {
  return useOutletContext<User>();
}

export function RequireAuth() {
  // undefined = still checking, null = signed out
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data, error }) => {
      if (active) setUser(error || !data.user ? null : data.user);
    });
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") setUser(null);
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  if (user === undefined) return null;
  if (user === null) return <Navigate to="/sign-in" replace />;
  return <Outlet context={user} />;
}
