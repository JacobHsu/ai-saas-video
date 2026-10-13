"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

const inputClass =
  "mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/40";

export default function UploadForm() {
  const router = useRouter();
  const [videoUrl, setVideoUrl] = useState("");
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState("zh");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ video_source_url: videoUrl, topic: topic || null, language }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.error ?? `Request failed (${res.status})`);
        return;
      }
      setVideoUrl("");
      setTopic("");
      router.refresh();
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="video_source_url" className="text-sm font-medium">
          Video URL
        </label>
        <input
          id="video_source_url"
          type="text"
          required
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Direct mp4 / mp3 URL (e.g. CloudFront, Vimeo, Internet Archive)"
          className={inputClass}
        />
        <p className="mt-1.5 text-xs text-muted-foreground">
          YouTube links aren't supported yet.
        </p>
      </div>

      <div>
        <label htmlFor="topic" className="text-sm font-medium">
          Topic <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <input
          id="topic"
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. Tech podcast — useful context for the model"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="language" className="text-sm font-medium">
          Language
        </label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className={inputClass}
        >
          <option value="zh">zh</option>
          <option value="en">en</option>
          <option value="ja">ja</option>
        </select>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary rounded-lg px-6 py-2.5 text-sm font-semibold disabled:opacity-60"
      >
        {loading ? "Submitting…" : "Transcribe"}
      </button>
    </form>
  );
}
