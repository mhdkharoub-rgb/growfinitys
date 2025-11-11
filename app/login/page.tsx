"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  const handleLogin = async () => {
    try {
      if (!email) {
        alert("Please enter your email");
        return;
      }

      setLoading(true);

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        alert(error.message);
      } else {
        alert("✅ Magic link sent! Check your email.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: "80px auto", textAlign: "center" }}>
      <h1>Growfinitys Login</h1>
      <p>Enter your email to receive a magic login link.</p>

      <input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          margin: "10px 0",
          border: "1px solid #ccc",
          borderRadius: "6px",
        }}
      />

      <button
        onClick={handleLogin}
        disabled={loading}
        style={{
          width: "100%",
          padding: "10px",
          background: "#111",
          color: "#fff",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        {loading ? "Sending..." : "Send Magic Link"}
      </button>
    </div>
  );
}
