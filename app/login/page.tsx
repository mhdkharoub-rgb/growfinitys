"use client";

import { useCallback, useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

const ADMIN_EMAIL =
  process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_EMAIL || "";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const router = useRouter();
  const supabase = supabaseBrowser();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState<string>(ADMIN_EMAIL);

  const redirectByRole = useCallback(
    async (userId: string, userEmail?: string | null) => {
      try {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", userId)
          .maybeSingle();

        if (!error) {
          const role = profile?.role;
          if (role === "admin") {
            router.replace("/admin");
            return;
          }
          router.replace("/dashboard");
          return;
        }

        if (
          userEmail &&
          ADMIN_EMAIL &&
          userEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase()
        ) {
          router.replace("/admin");
          return;
        }

        router.replace("/dashboard");
      } catch {
        router.replace("/dashboard");
      }
    },
    [router, supabase]
  );

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await redirectByRole(session.user.id, session.user.email);
      }
    });

    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        await redirectByRole(session.user.id, session.user.email);
      }
    })();

    return () => {
      subscription?.unsubscribe?.();
    };
  }, [redirectByRole, supabase]);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const targetEmail = email || ADMIN_EMAIL;
      if (!targetEmail) {
        alert("Please enter your email.");
        return;
      }
      const { error } = await supabase.auth.signInWithOtp({
        email: targetEmail,

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL as string | undefined;

export default function Login() {
  const router = useRouter();
  const qs = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [emailInput, setEmailInput] = useState(ADMIN_EMAIL ?? "");

  useEffect(() => {
    const error = qs.get("error_description") || qs.get("error");
    if (error) alert("Auth Notice: " + error.replace(/\+/g, " "));
  }, [qs]);

  async function redirectByRole(userId: string, email: string | null) {
    if (email && ADMIN_EMAIL && email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      router.replace("/admin");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle();

    if (profile?.role === "admin") router.replace("/admin");
    else router.replace("/dashboard");
  }

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await redirectByRole(session.user.id, session.user.email ?? null);
      }
    });
    return () => {
      subscription?.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMagicLink = async () => {
    try {
      setLoading(true);
      const email = emailInput || ADMIN_EMAIL;
      if (!email) {
        alert("Please enter your email first.");
        return;
      }
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        alert(`❌ ${error.message}`);
      } else {
        alert("✅ Magic link sent. Please check your email.");
        alert("❌ " + error.message);
      } else {
        alert("✅ Magic link sent to your email.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: { access_type: "offline", prompt: "consent" },
        },
      });
      if (error) alert(`❌ ${error.message}`);
        },
      });
      if (error) alert("❌ " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 560, margin: "64px auto", padding: "0 16px" }}>
      <h1 style={{ fontSize: 28, marginBottom: 4, color: "#d4af37" }}>
        Growfinitys Login
      </h1>
      <p style={{ opacity: 0.85, marginBottom: 24 }}>
        Use magic link or Google Sign-In. Admin email is recognized automatically.
      </p>

      <div style={{ display: "grid", gap: 12 }}>
        <label style={{ display: "grid", gap: 8 }}>
          <span>Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            style={{
              background: "#121212",
              border: "1px solid #333",
              borderRadius: 8,
              padding: "12px 14px",
              color: "#f5f5f5",
            }}
          />
        </label>

        <button onClick={handleLogin} disabled={loading} style={btn()}>
          {loading ? "Sending..." : "Send Magic Link"}
        </button>

        <div style={{ textAlign: "center", opacity: 0.7 }}>— or —</div>

        <button onClick={handleGoogle} disabled={loading} style={btn("outline")}>
          {loading ? "Opening Google..." : "Continue with Google"}
    <main style={{ minHeight: "100dvh", display: "grid", placeItems: "center" }}>
      <div
        style={{
          width: 420,
          maxWidth: "92vw",
          border: "1px solid #2a2a2a",
          borderRadius: 12,
          padding: 24,
          background: "#121212",
        }}
      >
        <h1 style={{ color: "#d4af37", fontSize: 24, marginBottom: 8, fontWeight: 800 }}>
          Growfinitys Login
        </h1>
        <p style={{ opacity: 0.9, marginBottom: 16 }}>Login as Admin or use Google.</p>

        <label style={{ display: "block", fontSize: 12, opacity: 0.85, marginBottom: 6 }}>
          Email
        </label>
        <input
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          placeholder={ADMIN_EMAIL ?? "your@email.com"}
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 8,
            background: "#0b0b0b",
            border: "1px solid #2a2a2a",
            color: "#fff",
            marginBottom: 12,
          }}
        />

        <button
          disabled={loading}
          onClick={handleMagicLink}
          style={{
            width: "100%",
            padding: "10px 16px",
            borderRadius: 8,
            border: "1px solid #d4af37",
            background: "#d4af37",
            color: "#0b0b0b",
            fontWeight: 700,
            marginBottom: 10,
          }}
        >
          {loading ? "Sending…" : "Send Magic Link"}
        </button>

        <button
          disabled={loading}
          onClick={handleGoogle}
          style={{
            width: "100%",
            padding: "10px 16px",
            borderRadius: 8,
            border: "1px solid #2a2a2a",
            background: "#1a1a1a",
            color: "#fff",
            fontWeight: 600,
          }}
        >
          Continue with Google
        </button>
      </div>
    </main>
  );
}

function btn(variant: "solid" | "outline" = "solid") {
  if (variant === "solid") {
    return {
      background: "#d4af37",
      color: "#0a0a0a",
      padding: "12px 18px",
      borderRadius: 8,
      border: "1px solid #d4af37",
      cursor: "pointer",
    } satisfies CSSProperties;
  }
  return {
    background: "transparent",
    color: "#d4af37",
    padding: "12px 18px",
    borderRadius: 8,
    border: "1px solid #d4af37",
    cursor: "pointer",
  } satisfies CSSProperties;
}
