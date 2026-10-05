import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { useAuthUser } from "@/components/RequireAuth";
import { supabase } from "@/integrations/supabase/client";
import { usePageMeta } from "@/lib/page-meta";

export default function AppShell() {
  usePageMeta({
    title: "Dashboard — Video Speed Reader",
    description: "Your Video Speed Reader dashboard.",
    ogTitle: "Dashboard — Video Speed Reader",
    ogDescription: "Your Video Speed Reader dashboard.",
    robots: "noindex",
  });
  const user = useAuthUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate("/sign-in", { replace: true });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <span className="text-sm font-semibold tracking-tight">Video Speed Reader</span>
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-full border border-input px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="hero-glow">
        <div className="mx-auto max-w-5xl px-5 py-24">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Hi {user.email}</h1>
          <div className="mt-8 rounded-2xl border border-border bg-card p-8">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Your dashboard is coming soon. Upload functionality will be added in the next
              milestone.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
