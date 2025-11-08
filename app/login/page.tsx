"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabaseClient";

const supabase = createClient();
const ADMIN_EMAIL = "mhdkharoub@gmail.com";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

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
        alert("❌ " + error.message);
      } else {
        alert("✅ Magic login link sent to your email.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        justifyContent: "center",
        alignItems: "center",
        background: "#111",
        color: "white",
        flexDirection: "column",
        gap: "20px",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ fontSize: "28px", fontWeight: "600" }}>Growfinitys Admin Login</h1>
      <button
        onClick={handleLogin}
        disabled={loading}
        style={{
          padding: "12px 26px",
          borderRadius: "8px",
          background: loading ? "#444" : "gold",
          color: "#111",
          fontWeight: "600",
          cursor: loading ? "not-allowed" : "pointer",
          fontSize: "16px",
          border: "none",
        }}
      >
        {loading ? "Sending link..." : "Send Magic Login Link"}
      </button>
    </div>
  );
}
