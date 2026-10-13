import "server-only";

import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/integrations/supabase/types";

import { apiKeyFetch, supabaseConfig } from "./config";

// Secret-key client for route handlers. It BYPASSES RLS, so every query must re-impose
// per-user filters (e.g. .eq("user_id", user.id)). Never import this from a Client Component.
export function createAdminClient() {
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!secretKey) throw new Error("Missing SUPABASE_SECRET_KEY environment variable.");

  const { url } = supabaseConfig();
  return createClient<Database>(url, secretKey, {
    global: { fetch: apiKeyFetch(secretKey) },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
