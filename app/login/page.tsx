"use client";

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
        alert("❌ " + error.message);
      } else {
        alert("✅ Magic link sent to your email.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) alert("❌ " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
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
