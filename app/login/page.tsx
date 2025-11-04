"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ✅ Centralized redirect with hardcoded admin fallback
  const redirectByRole = async (userId: string, email?: string) => {
    try {
      // Always prioritize Mohammad's admin access
      if (email === "mhdkharoub@gmail.com") {
        router.replace("/admin");
        return;
      }

      // Otherwise, look up role from profiles
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      const role = profile?.role ?? "member";
      router.replace(role === "admin" ? "/admin" : "/dashboard");
    } catch (error) {
      console.error("Redirect error:", error);
      router.replace("/dashboard");
    }
  };

  // ✅ Magic Link login
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

  // ✅ Auth listener
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          await redirectByRole(session.user.id, session.user.email);
        }
      }
    );

    // Supabase v2 cleanup
    return () => {
      data?.subscription?.unsubscribe();
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
