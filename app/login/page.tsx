"use client";

import { useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        router.replace("/admin");
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  const handleLogin = async () => {
    await supabase.auth.signInWithOtp({
      email: "mhdkharoub@gmail.com",
    });
    alert("✅ Magic link sent to your email.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-gold">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-6">Login to Growfinitys Admin</h1>
        <button
          onClick={handleLogin}
          className="bg-gold text-black px-6 py-3 rounded font-semibold hover:bg-yellow-400 transition"
        >
          ✉️ Send Magic Link
        </button>
      </div>
    </div>
  );
}
