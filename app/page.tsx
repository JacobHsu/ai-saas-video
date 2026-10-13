import type { Metadata } from "next";

import Landing from "@/views/Landing";

const TITLE = "Video Speed Reader — Transcripts in three minutes";

export const metadata: Metadata = {
  title: TITLE,
  description:
    "Upload your video and get an accurate, commercial-use-ready transcript in three minutes. Built for creators, educators, and engineers.",
  openGraph: {
    title: TITLE,
    description: "Upload your video, get a clean transcript in three minutes.",
  },
};

export default function Page() {
  return <Landing />;
}
