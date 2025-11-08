"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

const ADMIN_EMAIL = "mhdkharoub@gmail.com";
const supabase = createClient();

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // ✅ Redirect user based on role
  const redirectByRole = async (userId: string, email?: string) => {
    if (email === ADMIN_EMAIL) {
      router.replace("/admin");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (profile?.role === "admin") {
      router.replace("/admin");
    } else {
      router.replace("/dashboard");
    }
  };

  // ✅ Session listener (build-safe)
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(async (_, session) => {
      if (session?.user) {
        await redirectByRole(session.user.id, session.user.email ?? undefined);
      }
    });

    return () => {
      data?.subscription?.unsubscribe?.();
    };
  }, []);

  // ✅ Only one login function now — admin only
  const handleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        email: ADMIN_EMAIL,
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
    <div style={{ maxWidth: 350, margin: "80px auto", textAlign: "center" }}>
      <h2>Growfinitys Admin Login</h2>
      <button
        onClick={handleLogin}
        disabled={loading}
        style={{ padding: "10px 16px", marginTop: 20 }}
      >
        {loading ? "Sending..." : "Login as Admin"}
      </button>
    </div>
  );
}
