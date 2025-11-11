"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      setLoading(true);
      const email = ADMIN_EMAIL || "mhdkharoub@gmail.com";

    const { error } = await supabase.auth.signInWithOtp({
  email,
  options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
});

  // When supabase confirms login, decide where to go
  supabase.auth.onAuthStateChange(async (_, session) => {
    if (!session?.user) return;

    const email = session.user.email;

    if (email === ADMIN_EMAIL) {
      router.replace("/admin"); // Admin goes here
    } else {
      router.replace("/dashboard"); // VIP users go here
    }
  });

  return (
    <div style={{ textAlign: "center", paddingTop: "80px" }}>
      <h2>Login as Admin</h2>
      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Sending magic link..." : "Send Magic Link"}
      </button>
    </div>
  );
}
