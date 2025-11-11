"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });
    if (error) alert(`❌ ${error.message}`);
    setLoading(false);
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #111, #222)",
        color: "#fff",
        textAlign: "center",
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: "420px", width: "100%" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "600", marginBottom: "12px" }}>
          Welcome to <span style={{ color: "#FFD87A" }}>Growfinitys</span>
        </h1>
        <p style={{ opacity: 0.8, marginBottom: "32px" }}>
          Premium AI Business Growth Platform
        </p>

        <button
          onClick={signInWithGoogle}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px 22px",
            fontSize: "18px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            background: "linear-gradient(90deg, #FFD87A, #E5B55A, #C9983F)",
            color: "#111",
            fontWeight: "600",
            boxShadow: "0 0 14px rgba(255, 220, 160, 0.6)",
            transition: "0.3s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.boxShadow = "0 0 24px rgba(255, 220, 160, 0.9)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.boxShadow = "0 0 14px rgba(255, 220, 160, 0.6)";
          }}
        >
          {loading ? "Connecting..." : "Continue with Google"}
        </button>

        <p style={{ marginTop: "22px", opacity: 0.6, fontSize: "14px" }}>
          Secure Encrypted Login • No Password Needed
        </p>
      </div>
    </div>
  );
}
