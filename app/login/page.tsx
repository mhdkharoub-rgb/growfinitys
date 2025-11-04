"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // ✅ Watch for auth session
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await redirectByRole(session.user.id);
      }
    });

    return () => {
      data.subscription?.unsubscribe();
    };
  }, []);

  // ✅ Redirect user by role (type-safe)
  async function redirectByRole(userId: string): Promise<void> {
    try {
      for (let i = 0; i < 3; i++) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", userId)
          .single();

        if (profile?.role) {
          const target = profile.role === "admin" ? "/admin" : "/dashboard";
          router.replace(target);
          return;
        }

        // retry delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      router.replace("/dashboard");
    } catch (err) {
      console.error("Redirect error:", err);
    }
  }

  // ✅ Magic Link Login
  async function handleLogin() {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        email: "mhdkharoub@gmail.com",
      });
      alert(error ? `❌ ${error.message}` : "✅ Magic link sent to your email.");
    } finally {
      setLoading(false);
    }

    router.replace("/dashboard");
  }

  // ✅ Magic-link login
  async function handleLogin() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: "mhdkharoub@gmail.com",
    });
    alert(error ? `❌ ${error.message}` : "✅ Magic link sent to your email.");
    setLoading(false);
  }

  // ✅ Magic-link login
  async function handleLogin() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: "mhdkharoub@gmail.com",
    });
    alert(error ? `❌ ${error.message}` : "✅ Magic link sent to your email.");
    setLoading(false);
  }

  // ✅ Magic Link Login
  async function handleLogin() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: "mhdkharoub@gmail.com",
    });

    alert(error ? `❌ ${error.message}` : "✅ Magic link sent to your email.");
    setLoading(false);
  }

  // ✅ Magic Link Login
  async function handleLogin() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: "mhdkharoub@gmail.com",
    });
    alert(error ? `❌ ${error.message}` : "✅ Magic link sent to your email.");
    setLoading(false);
  }

  // ✅ Magic Link Login
  async function handleLogin() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: "mhdkharoub@gmail.com",
    });
    alert(error ? `❌ ${error.message}` : "✅ Magic link sent to your email.");
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-[#d4af37]">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-6">Login to Growfinitys</h1>
        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-[#d4af37] text-black px-6 py-3 rounded font-semibold hover:bg-yellow-400 transition disabled:opacity-50"
        >
          {loading ? "Sending…" : "✉️ Send Magic Link"}
        </button>
      </div>
    </div>
  );
}
