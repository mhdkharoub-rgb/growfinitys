"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // ✅ Watch auth changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        redirectByRole(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // ✅ Role-based redirect
  async function redirectByRole(userId: string) {
    for (let i = 0; i < 3; i++) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (profile?.role) {
        router.replace(profile.role === "admin" ? "/admin" : "/dashboard");
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    router.replace("/dashboard");
  }

  // ✅ Magic link login
  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: "mhdkharoub@gmail.com",
    });
    alert(error ? `❌ ${error.message}` : "✅ Magic link sent to your email.");
    setLoading(false);
  };

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
