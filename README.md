# Video Speed Reader

Upload a video and get a clean transcript. A Next.js 16 (App Router) app with Tailwind and
Supabase auth (`@supabase/ssr`, cookie-based sessions), deployed on Vercel.

## Development

```sh
bun install
bun run dev
```

## Environment variables

The app talks to your own Supabase project. Create a `.env` (see `.env.example`):

| Variable                               | Value                                           |
| -------------------------------------- | ----------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`             | `https://<project-ref>.supabase.co`             |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key (`sb_publishable_...`) |

The publishable key replaces the old "anon key": it is safe to expose in the browser and is
gated by Row Level Security.

## Deploying to Vercel

`vercel.json` pins the framework preset to Next.js. `middleware.ts` refreshes the Supabase session
cookie on each request so server components (e.g. `/app`) can read the signed-in user.

Add the same two variables in **Vercel → Project → Settings → Environment Variables**, then
redeploy. `NEXT_PUBLIC_*` values are inlined at build time, so a redeploy is required after
changing them.

In Supabase → Authentication → URL Configuration, add your Vercel URL to the Site URL / Redirect
URLs so sign-up confirmation emails return to the right place.
