"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, _session) => {
      // no-op; the /auth/callback route handles redirects after OTP exchange
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const email = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? process.env.ADMIN_EMAIL ?? "";
      if (!email) {
        alert("ADMIN_EMAIL is not configured in environment variables.");
        return;
      }

      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback`
          : "/auth/callback";

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo },
      });

      if (error) {
        alert("❌ " + error.message);
      } else {
        alert("✅ Magic link sent to your email.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-zinc-100 flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded border border-zinc-800 p-6">
        <h1 className="text-2xl font-bold text-[#d4af37]">Admin Login</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Click the button below to receive a magic link.
        </p>
        <button
          onClick={handleLogin}
          disabled={loading}
          className="mt-6 w-full rounded bg-[#d4af37] px-4 py-3 text-black hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send Magic Link"}
        </button>
        <a href="/" className="mt-4 block text-center text-zinc-400 hover:text-zinc-200">
          ← Back to Home
        </a>
      </div>
    </main>
  );
}
