"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "mhdkharoub@gmail.com";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleMagicLink() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: ADMIN_EMAIL,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setLoading(false);
    if (error) alert("❌ " + error.message);
    else alert("✅ Magic link sent! Check your email.");
  }

  async function handleGoogleLogin() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) alert(error.message);
  }

  return (
    <div style={{ textAlign: "center", padding: "80px 20px" }}>
      <h1>Growfinitys Login</h1>
      <p>You will receive a magic link in your email.</p>

      <button
        onClick={handleMagicLink}
        disabled={loading}
        style={{
          background: "#d4af37",
          color: "white",
          padding: "10px 24px",
          margin: "12px",
          borderRadius: 6,
          border: "none",
        }}
      >
        {loading ? "Sending..." : "Login as Admin"}
      </button>

      <div style={{ marginTop: 20 }}>
        <button
          onClick={handleGoogleLogin}
          style={{
            background: "#4285F4",
            color: "white",
            padding: "10px 24px",
            borderRadius: 6,
            border: "none",
          }}
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}
