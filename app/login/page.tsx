"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabaseClient";

const ADMIN_EMAIL = "mhdkharoub@gmail.com";
const supabase = createClient();

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
