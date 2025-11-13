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
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        alert(`❌ ${error.message}`);
      } else {
        alert("✅ Magic link sent. Please check your email.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: { access_type: "offline", prompt: "consent" },
        },
      });
      if (error) alert(`❌ ${error.message}`);
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
