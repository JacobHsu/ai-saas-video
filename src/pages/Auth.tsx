import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { supabase } from "@/integrations/supabase/client";
import { usePageMeta } from "@/lib/page-meta";

export default function AuthPage({ mode }: { mode: "signin" | "signup" }) {
  usePageMeta({
    title: "Sign in — Video Speed Reader",
    description: "Sign in or create an account to turn your videos into transcripts.",
    ogTitle: "Sign in — Video Speed Reader",
    ogDescription: "Sign in or create an account to turn your videos into transcripts.",
  });
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setError(null);
    setNotice(null);
  }, [mode]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/app", { replace: true });
    });
  }, [navigate]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);

    if (mode === "signup") {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      setLoading(false);
      if (signUpError) return setError(signUpError.message);
      if (!data.session) return setNotice("Check your email to confirm your account.");
      navigate("/app", { replace: true });
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) return setError(signInError.message);
    navigate("/app", { replace: true });
  }

  return (
    <div className="hero-glow flex min-h-screen flex-col items-center justify-center bg-background px-5 py-16">
      <Link to="/" className="text-sm font-semibold tracking-tight">
        Video Speed Reader
      </Link>

      <div className="mt-8 w-full max-w-md rounded-2xl border border-border bg-card p-8">
        <h1 className="text-2xl font-bold tracking-tight">
          {mode === "signin" ? "Sign in / 登入" : "Create account / 註冊"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "signin"
            ? "Welcome back. Pick up where you left off."
            : "Start turning videos into transcripts in three minutes."}
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/40"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/40"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {notice && <p className="text-sm text-primary-glow">{notice}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full rounded-lg px-4 py-2.5 text-sm font-semibold disabled:opacity-60"
          >
            {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Sign up"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            navigate(mode === "signin" ? "/sign-up" : "/sign-in");
          }}
          className="mt-6 w-full text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {mode === "signin" ? "No account yet? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
