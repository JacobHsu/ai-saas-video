import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { RequireAuth } from "@/components/RequireAuth";
import { supabase } from "@/integrations/supabase/client";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Landing from "@/pages/Landing";
import NotFound from "@/pages/NotFound";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "USER_UPDATED") return;
      queryClient.invalidateQueries();
    });
    return () => data.subscription.unsubscribe();
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ErrorBoundary>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/sign-in" element={<Auth mode="signin" />} />
            <Route path="/sign-up" element={<Auth mode="signup" />} />
            <Route path="/auth" element={<Navigate to="/sign-in" replace />} />
            <Route element={<RequireAuth />}>
              <Route path="/app" element={<Dashboard />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
