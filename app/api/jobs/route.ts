import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const LANGUAGES = new Set(["zh", "en", "ja"]);

export async function POST(req: Request) {
  // 1. Authenticate the caller via the cookie session.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const videoSourceUrl = typeof body.video_source_url === "string" ? body.video_source_url.trim() : "";
  if (!videoSourceUrl) {
    return NextResponse.json({ error: "video_source_url required" }, { status: 400 });
  }
  const topic = typeof body.topic === "string" && body.topic.trim() ? body.topic.trim() : null;
  const language = LANGUAGES.has(body.language) ? body.language : "zh";

  // 2. Insert the job + session rows with the Secret key. The user is already authenticated
  // above; the Secret key bypasses RLS so both inserts and the back-link happen server-side.
  const admin = createAdminClient();

  const { data: job, error: jobErr } = await admin
    .from("jobs")
    .insert({
      user_id: user.id,
      video_source_url: videoSourceUrl,
      topic,
      language,
      status: "pending",
    })
    .select()
    .single();
  if (jobErr) {
    return NextResponse.json({ error: jobErr.message }, { status: 500 });
  }

  const { data: session, error: sessErr } = await admin
    .from("job_sessions")
    .insert({ job_id: job.id, session_number: 1 })
    .select()
    .single();
  if (sessErr) {
    return NextResponse.json({ error: sessErr.message }, { status: 500 });
  }

  const { error: linkErr } = await admin
    .from("jobs")
    .update({ current_session_id: session.id })
    .eq("id", job.id);
  if (linkErr) {
    return NextResponse.json({ error: linkErr.message }, { status: 500 });
  }

  return NextResponse.json({ job_id: job.id });
}
