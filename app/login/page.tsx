"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // ✅ If already logged in, redirect by role
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      const email = data.session?.user?.email;

      if (email) {
        if (email === ADMIN_EMAIL) {
          router.replace("/admin");
        } else {
          router.replace("/dashboard");
        }
      }
    };
    checkSession();
  }, []);

  // ✅ Send Magic Link
  const handleLogin = async () => {
    try {
      setLoading(true);

      const email = ADMIN_EMAIL; // only admin login for now

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        alert("❌ " + error.message);
      } else {
        alert("✅ Magic link sent to your email. Check inbox.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>Growfinitys Admin Login</h1>
      <p>Only admin access is enabled right now.</p>

      <button
        onClick={handleLogin}
        disabled={loading}
        style={{
          marginTop: 20,
          padding: "12px 24px",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          background: "#000",
          color: "#fff",
          fontWeight: "bold",
        }}
      >
        {loading ? "Sending magic link..." : "Login as Admin"}
      </button>
    </div>
  );
}
