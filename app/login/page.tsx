"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const ADMIN_EMAIL = "mhdkharoub@gmail.com";

export default function LoginPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // ✅ Redirect based on role
  const redirectByRole = async (userId: string) => {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("email, role")
        .eq("id", userId)
        .single();

      if (!profile) {
        router.replace("/dashboard");
        return;
      }
    );
    return () => {
      subscription?.unsubscribe?.();
    };
  }, []);

  // ✅ Magic Link Login
  const handleLogin = async () => {
    try {
      setLoading(true);
      const email = ADMIN_EMAIL; // Only admin login right now
      const { error } = await supabase.auth.signInWithOtp({ email });

      if (profile.email === ADMIN_EMAIL || profile.role === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/dashboard");
      }
    } catch {
      router.replace("/dashboard");
    }
  };

  // ✅ Listen for Supabase login event
  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        if (session?.user?.id) {
          await redirectByRole(session.user.id);
        } else {
          router.replace("/dashboard");
        }
      }
    );

    return () => {
      subscription?.unsubscribe?.();
    };
  }, []);

  // ✅ Magic Link Login
  const handleLogin = async () => {
    try {
      setLoading(true);
      const email = ADMIN_EMAIL; // Only admin login right now
      const { error } = await supabase.auth.signInWithOtp({ email });

      if (error) {
        alert(`❌ ${error.message}`);
      } else {
        alert("✅ Magic link sent to your email!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: "80px", textAlign: "center" }}>
      <h1>Growfinitys Login</h1>
      <p>Enter using your secure admin magic link login.</p>

      <button
        onClick={handleLogin}
        disabled={loading}
        style={{
          marginTop: "20px",
          padding: "12px 22px",
          background: "black",
          color: "white",
          borderRadius: "8px",
          border: "none",
          opacity: loading ? 0.5 : 1,
          cursor: loading ? "default" : "pointer",
        }}
      >
        {loading ? "Sending Magic Link..." : "Send Magic Login Link"}
      </button>
    </main>
  );
}
