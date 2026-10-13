import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import Dashboard from "@/views/Dashboard";

export const metadata: Metadata = {
  title: "Dashboard — Video Speed Reader",
  description: "Your Video Speed Reader dashboard.",
  openGraph: {
    title: "Dashboard — Video Speed Reader",
    description: "Your Video Speed Reader dashboard.",
  },
  robots: { index: false },
};

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  return <Dashboard email={user.email ?? ""} />;
}
