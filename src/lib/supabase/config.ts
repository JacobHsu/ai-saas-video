// Shared by the browser client, the server client, and middleware.
// NEXT_PUBLIC_* values are inlined at build time, so they must be referenced literally.
export function supabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    const missing = [
      ...(!url ? ["NEXT_PUBLIC_SUPABASE_URL"] : []),
      ...(!publishableKey ? ["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"] : []),
    ];
    throw new Error(
      `Missing Supabase environment variable(s): ${missing.join(", ")}. Set them in .env (local) or in your hosting provider's environment settings.`,
    );
  }

  // Publishable keys (sb_publishable_*) are opaque strings, not JWTs, so they must not be sent
  // as a bearer token; the `apikey` header carries them instead.
  const fetchWithApiKey: typeof fetch = (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
    );
    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }
    if (headers.get("Authorization") === `Bearer ${publishableKey}`) {
      headers.delete("Authorization");
    }
    headers.set("apikey", publishableKey);
    return fetch(input, { ...init, headers });
  };

  return { url, publishableKey, fetch: fetchWithApiKey };
}
