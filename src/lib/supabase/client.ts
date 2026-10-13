import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/integrations/supabase/types";

import { supabaseConfig } from "./config";

// Browser-side client. Sessions live in cookies, so server components, route handlers, and
// middleware can read the same session. createBrowserClient returns a singleton in the browser.
export function createClient() {
  const { url, publishableKey, fetch } = supabaseConfig();
  return createBrowserClient<Database>(url, publishableKey, { global: { fetch } });
}
