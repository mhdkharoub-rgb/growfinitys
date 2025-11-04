"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ✅ Unified redirect function
  const redirectByRole = async (userId: string) => {
    try {
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

        await new Promise((resolve) => setTimeout(resolve, 1000)); // retry delay
      }
    } catch (error) {
      console.error("Redirect error:", error);
    }
  };

  // ✅ Magic link login (single version only)
  const handleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        email: "mhdkharoub@gmail.com",
      });

      if (error) alert(`❌ ${error.message}`);
      else alert("✅ Magic link sent to your email!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Supabase auth listener
  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          await redirectByRole(session.user.id);
        }
      }
    );
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <button
        onClick={handleLogin}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        {loading ? "Sending link..." : "Login with Magic Link"}
      </button>
    </div>
  );
}
