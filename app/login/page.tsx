"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await redirectByRole(session.user.id);
      }
    });
    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function redirectByRole(userId: string) {
    // retry up to 3 times while waiting for profile
    for (let i = 0; i < 3; i++) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (profile?.role) {
        if (profile.role === "admin") {
          router.replace("/admin");
        } else {
          router.replace("/dashboard");
        }
        return;
      }
    });

      // wait 1 s before retry
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // fallback redirect
    router.replace("/dashboard");
  }

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: "mhdkharoub@gmail.com", // admin email
    });
    alert(error ? "❌ " + error.message : "✅ Magic link sent to your email.");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-gold">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-6">Login to Growfinitys</h1>
        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-gold text-black px-6 py-3 rounded font-semibold hover:bg-yellow-400 transition disabled:opacity-50"
        >
          {loading ? "Sending…" : "✉️ Send Magic Link"}
        </button>
      </div>
    </div>
  );
}
