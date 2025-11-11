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
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });
    setLoading(false);
  };

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #0b0b0c, #1a1a1f)",
      color: "#fff",
      padding: "28px",
      textAlign: "center"
    }}>
      <div style={{ maxWidth: "420px", width: "100%" }}>
        <h1 style={{ fontSize: "36px", marginBottom: "12px" }}>
          Welcome to <strong style={{ color: "#FFD87A" }}>Growfinitys</strong>
        </h1>
        <p style={{ opacity: 0.75, marginBottom: "32px" }}>
          Premium AI Growth Platform
        </p>

        <button
          onClick={signInWithGoogle}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            fontSize: "18px",
            fontWeight: "600",
            borderRadius: "10px",
            cursor: "pointer",
            background: "linear-gradient(90deg, #FFD87A, #E5B55A, #C9983F)",
            color: "#111",
            border: "none",
            boxShadow: "0 0 18px rgba(255, 215, 140, 0.6)",
            transition: ".3s"
          }}
        >
          {loading ? "Connecting..." : "Continue with Google"}
        </button>

        <p style={{ marginTop: "20px", opacity: 0.45, fontSize: "14px" }}>
          No password needed – secure, encrypted login
        </p>
      </div>
    </div>
  );
}
