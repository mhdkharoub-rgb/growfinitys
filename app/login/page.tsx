"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Watch for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        // Fetch the user role from profiles
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (profile?.role === "admin") {
          router.replace("/admin");
        } else {
          router.replace("/dashboard");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  const handleLogin = async () => {
    setLoading(true);
    const email = "mhdkharoub@gmail.com"; // Change if needed

    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      alert("❌ Login failed: " + error.message);
    } else {
      alert("✅ Magic link sent to your email.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-gold">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-6">Login to Growfinitys</h1>
        <p className="mb-4 text-gray-400">Access your dashboard securely</p>
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
