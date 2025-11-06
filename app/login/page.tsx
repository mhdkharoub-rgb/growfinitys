"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const ADMIN_EMAIL = "mhdkharoub@gmail.com";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function redirectByRole(userId: string, fallbackEmail?: string) {
    try {
      for (let i = 0; i < 3; i += 1) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role,email")
          .eq("id", userId)
          .single();

        const profileEmail = profile?.email ?? fallbackEmail;
        const isAdmin = profile?.role === "admin" || profileEmail === ADMIN_EMAIL;

        if (profile?.role || profileEmail) {
          router.replace(isAdmin ? "/admin" : "/dashboard");
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      if (fallbackEmail === ADMIN_EMAIL) {
        router.replace("/admin");
      } else {
        router.replace("/dashboard");
      }
    } catch (error) {
      console.error("Redirect error:", error);
      router.replace("/dashboard");
    }
  }

  async function handleLogin() {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        email: ADMIN_EMAIL,
      });

      if (error) {
        alert(`❌ ${error.message}`);
      } else {
        alert("✅ Magic link sent to your email!");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        await redirectByRole(session.user.id, session.user.email ?? undefined);
      }
    });

    return () => {
      data.subscription?.unsubscribe();
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
