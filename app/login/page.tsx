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
  }, []);

  async function redirectByRole(userId: string) {
    for (let attempt = 0; attempt < 3; attempt += 1) {
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

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    router.replace("/dashboard");
  }

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: "mhdkharoub@gmail.com",
    });
    alert(error ? `❌ ${error.message}` : "✅ Magic link sent to your email.");
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
          {loading ? "Sending..." : "✉️ Send Magic Link"}
        </button>
      </div>
    </div>
  );
}
