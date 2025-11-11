"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function LoginPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function signInWithGoogle() {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    if (error) alert(`❌ ${error.message}`);
    setLoading(false);
  }

  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h1>Growfinitys Login</h1>
      <button
        onClick={signInWithGoogle}
        disabled={loading}
        style={{
          padding: "12px 24px",
          marginTop: "18px",
          fontSize: "18px",
          borderRadius: "6px",
          background: "#000",
          color: "#fff",
        }}
      >
        {loading ? "Connecting..." : "Login with Google"}
      </button>
    </div>
  );
}
