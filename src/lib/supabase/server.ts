import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { Database } from "@/integrations/supabase/types";

import { supabaseConfig } from "./config";

// Server-side client for Server Components and route handlers.
// cookies() is async since Next.js 15, so it must be awaited.
export async function createClient() {
  const cookieStore = await cookies();
  const { url, publishableKey, fetch } = supabaseConfig();

  return createServerClient<Database>(url, publishableKey, {
    global: { fetch },
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component, where cookies are read-only.
          // middleware.ts refreshes the session cookie instead.
        }
      },
    },
  });
}
