import { formatDistanceToNow } from "date-fns";
import { Download } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import UploadForm from "@/views/UploadForm";

export const metadata: Metadata = {
  title: "Upload — Video Speed Reader",
  description: "Submit a video URL and get a transcript.",
  robots: { index: false },
};

const STATUS_STYLES: Record<string, string> = {
  pending: "border-border bg-muted text-muted-foreground",
  downloading: "border-border bg-muted text-muted-foreground",
  transcribe: "border-sky-500/30 bg-sky-500/15 text-sky-300",
  done: "border-emerald-500/30 bg-emerald-500/15 text-emerald-300",
};

function truncate(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  // RLS limits this to the signed-in user's rows; the user_id filter keeps the intent explicit.
  const { data: jobs } = await supabase
    .from("jobs")
    .select("id, created_at, video_source_url, status")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link href="/app" className="text-sm font-semibold tracking-tight">
            Video Speed Reader
          </Link>
          <Link
            href="/app"
            className="rounded-full border border-input px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            Dashboard
          </Link>
        </div>
      </header>

      <main className="hero-glow">
        <div className="mx-auto max-w-5xl space-y-10 px-5 py-16">
          <section>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Transcriptions</h1>
            <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card">
              {!jobs || jobs.length === 0 ? (
                <p className="p-8 text-sm text-muted-foreground">
                  No transcriptions yet. Submit your first video below.
                </p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                      <th className="px-5 py-3 font-medium">Created</th>
                      <th className="px-5 py-3 font-medium">URL</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 font-medium">Transcript</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job) => (
                      <tr key={job.id} className="border-b border-border/60 last:border-0">
                        <td className="whitespace-nowrap px-5 py-3 text-muted-foreground">
                          {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                        </td>
                        <td className="px-5 py-3" title={job.video_source_url}>
                          {truncate(job.video_source_url, 50)}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                              STATUS_STYLES[job.status] ?? STATUS_STYLES["pending"]
                            }`}
                          >
                            {job.status}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          {job.status === "done" ? (
                            <a
                              href={`/api/jobs/${job.id}/transcript`}
                              download={`transcript-${job.id.slice(0, 8)}.txt`}
                              className="inline-flex items-center gap-1.5 font-medium text-primary-glow hover:underline"
                            >
                              <Download className="size-4" aria-hidden />
                              .txt
                            </a>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-tight">New transcription</h2>
            <div className="mt-6 rounded-2xl border border-border bg-card p-8">
              <UploadForm />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
