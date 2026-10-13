import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { supabaseConfig } from "@/lib/supabase/config";

// Refreshes the Supabase session cookie on every request so server components see a valid user.
// Next.js 16 prefers the name "proxy.ts"; "middleware.ts" still works and is migrated later.
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const { url, publishableKey, fetch } = supabaseConfig();

  const supabase = createServerClient(url, publishableKey, {
    global: { fetch },
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  await supabase.auth.getUser();
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt).*)"],
};
