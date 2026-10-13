import type { Metadata } from "next";

import AuthForm from "@/views/AuthForm";

export const metadata: Metadata = {
  title: "Sign in — Video Speed Reader",
  description: "Sign in or create an account to turn your videos into transcripts.",
  openGraph: {
    title: "Sign in — Video Speed Reader",
    description: "Sign in or create an account to turn your videos into transcripts.",
  },
};

export default function Page() {
  return <AuthForm mode="signup" />;
}
