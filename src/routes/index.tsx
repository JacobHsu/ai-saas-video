import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Reveal } from "@/components/Reveal";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Video Speed Reader — Transcripts in three minutes" },
      {
        name: "description",
        content:
          "Upload your video and get an accurate, commercial-use-ready transcript in three minutes. Built for creators, educators, and engineers.",
      },
      { property: "og:title", content: "Video Speed Reader — Transcripts in three minutes" },
      {
        property: "og:description",
        content: "Upload your video, get a clean transcript in three minutes.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  {
    title: "高準確度逐字稿",
    subtitle: "High-accuracy transcripts",
    body: "Powered by OpenAI Whisper, with solid support for both Chinese and English.",
  },
  {
    title: "三分鐘交付",
    subtitle: "Three-minute turnaround",
    body: "Processed in the background — you get an email the moment it's ready.",
  },
  {
    title: "可商用授權",
    subtitle: "Commercial-use ready",
    body: "You own the output. Publish it, sell it, or fold it into your product.",
  },
];

function Landing() {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, session) => setSignedIn(!!session));
    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <span className="text-sm font-semibold tracking-tight sm:text-base">
            Video Speed Reader
          </span>
          {signedIn ? (
            <Link
              to="/app"
              className="btn-primary rounded-full px-4 py-2 text-sm font-medium sm:px-5"
            >
              Open app
            </Link>
          ) : (
            <Link
              to="/auth"
              className="btn-primary rounded-full px-4 py-2 text-sm font-medium sm:px-5"
            >
              Sign in / 登入
            </Link>
          )}
        </div>
      </header>

      <main>
        <section className="hero-glow relative overflow-hidden">
          <div className="mx-auto max-w-4xl px-5 py-24 text-center sm:py-32">
            <Reveal>
              <span className="inline-flex rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground">
                Whisper-powered transcription
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl">
                <span className="gradient-text">Video Speed Reader</span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mx-auto mt-6 max-w-2xl text-xl font-semibold sm:text-2xl">
                上傳影片，三分鐘內拿到逐字稿。
              </p>
              <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground">
                Upload your video, get a clean transcript in three minutes.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-10 flex justify-center">
                <Link
                  to={signedIn ? "/app" : "/auth"}
                  className="btn-primary rounded-full px-7 py-3 text-base font-semibold"
                >
                  {signedIn ? "Open app" : "Sign in / 登入"}
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-28">
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, i) => (
              <Reveal key={feature.subtitle} delay={i * 120}>
                <article className="h-full rounded-2xl border border-border bg-card p-7 transition-colors hover:border-primary/50">
                  <h2 className="text-lg font-semibold">{feature.title}</h2>
                  <p className="mt-1 text-sm font-medium text-primary-glow">{feature.subtitle}</p>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {feature.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-5 py-8 text-center text-sm text-muted-foreground">
          © 2026 Video Speed Reader
        </div>
      </footer>
    </div>
  );
}
