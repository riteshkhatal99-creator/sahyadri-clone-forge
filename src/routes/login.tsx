import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Chrome, KeyRound, Mail } from "lucide-react";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/use-auth";

const description = "Sign in to save homes, contact owners and manage your listings.";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [
    { title: "Sign In | ZameenDhan" },
    { name: "description", content: description },
    { property: "og:title", content: "Sign In | ZameenDhan" },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  if (!loading && user) { navigate({ to: "/dashboard" }); }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(""); setNotice(""); setBusy(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    try {
      if (mode === "signup") {
        const fullName = String(form.get("name") ?? "");
        const { data, error: err } = await supabase.auth.signUp({
          email, password,
          options: { data: { full_name: fullName }, emailRedirectTo: window.location.origin },
        });
        if (err) throw err;
        if (data.session) { navigate({ to: "/dashboard" }); return; }
        setNotice("Account created! Check your inbox to confirm your email, then sign in.");
        setMode("signin");
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        navigate({ to: "/dashboard" });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setError("");
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) setError("Google sign-in failed. Please try again.");
  };

  return <section className="auth-page">
    <div className="auth-card">
      <p className="eyebrow">{mode === "signin" ? "WELCOME BACK" : "JOIN ZAMEENDHAN"}</p>
      <h1>{mode === "signin" ? "Sign in to your account" : "Create your free account"}</h1>
      <p className="auth-sub">Save homes, contact owners and manage your listings.</p>

      <Button type="button" variant="outline" size="lg" className="auth-google" onClick={google}>
        <Chrome size={18}/> Continue with Google
      </Button>
      <div className="auth-divider"><span>or with email</span></div>

      <form onSubmit={submit} className="auth-form">
        {mode === "signup" && <label>Full name<input name="name" required placeholder="Your full name" autoComplete="name"/></label>}
        <label>Email<input name="email" type="email" required placeholder="you@example.com" autoComplete="email"/></label>
        <label>Password<input name="password" type="password" required minLength={6} placeholder="At least 6 characters" autoComplete={mode === "signin" ? "current-password" : "new-password"}/></label>
        {error && <p className="auth-error" role="alert">{error}</p>}
        {notice && <p className="auth-notice">{notice}</p>}
        <Button type="submit" size="lg" disabled={busy}>
          {mode === "signin" ? <><KeyRound size={17}/> Sign in</> : <><Mail size={17}/> Create account</>}
        </Button>
      </form>

      <p className="auth-switch">
        {mode === "signin" ? "New to ZameenDhan?" : "Already have an account?"}{" "}
        <button type="button" onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); setNotice(""); }}>
          {mode === "signin" ? "Create an account" : "Sign in"}
        </button>
      </p>
    </div>
  </section>;
}
