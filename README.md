# Video Speed Reader

Upload a video and get a clean transcript. A static Vite + React single-page app
(React Router, Tailwind, Supabase auth) deployed on Vercel.

## Development

```sh
npm i
npm run dev
```

## Environment variables

The app talks to your own Supabase project. Create a `.env` (see `.env.example`):

| Variable                        | Value                                                  |
| ------------------------------- | ------------------------------------------------------ |
| `VITE_SUPABASE_URL`             | `https://<project-ref>.supabase.co`                    |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key (`sb_publishable_...`)        |

The publishable key replaces the old "anon key": it is safe to expose in the browser and is
gated by Row Level Security.

## Deploying to Vercel

`vercel.json` builds with `vite build` into `dist/` and rewrites all paths to `index.html`, so
deep links such as `/app` resolve client-side.

Add the same two variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`) in
**Vercel → Project → Settings → Environment Variables**, then redeploy. Vite inlines them at build
time, so a redeploy is required after changing them.

In Supabase → Authentication → URL Configuration, add your Vercel URL to the Site URL / Redirect
URLs so sign-up confirmation emails return to the right place.
