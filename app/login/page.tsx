"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const ADMIN_EMAIL = "mhdkharoub@gmail.com";

export default function LoginPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // ✅ Redirect user based on role
  const redirectByRole = async (user_id: string, email?: string | null) => {
    if (!email) {
      router.replace("/login");
      return;
    }

    // Admin override rule
    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      router.replace("/admin");
      return;
    }

    // Member fallback
    router.replace("/dashboard");
  };

  // ✅ Detect login session from magic link callback
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(async (_, session) => {
      if (session?.user) {
        await redirectByRole(session.user.id, session.user.email);
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  // ✅ Magic Link Login
  const handleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        email: ADMIN_EMAIL,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        alert(`❌ ${error.message}`);
      } else {
        alert("✅ Magic login link sent to your email.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Growfinitys Admin Login</h1>
      <p>Access restricted to admin only.</p>

      <button
        onClick={handleLogin}
        disabled={loading}
        style={{
          marginTop: "20px",
          padding: "12px 22px",
          background: "#111",
          color: "#fff",
          borderRadius: "6px",
        }}
      >
        {loading ? "Sending magic link..." : "Login as Admin"}
      </button>
    </div>
  );
}
