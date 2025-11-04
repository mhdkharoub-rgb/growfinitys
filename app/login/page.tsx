"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ✅ Universal redirect handler with hard-coded admin fallback
  const redirectUser = async (session: any) => {
    const email = session?.user?.email;
    const id = session?.user?.id;

    if (!email) return;

    // --- Force Mohammad's admin redirect ---
    if (email === "mhdkharoub@gmail.com") {
      console.log("🔐 Admin detected:", email);
      router.replace("/admin");
      return;
    }

    // --- Otherwise, use profiles role if available ---
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", id)
        .single();

      const role = profile?.role || "member";
      console.log("👤 Role from profile:", role);
      router.replace(role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      console.error("Redirect error:", err);
      router.replace("/dashboard");
    }
  };

  // ✅ Magic link login
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

  // ✅ Listen for auth state change
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          await redirectUser(session);
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe?.();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-4 font-semibold">Growfinitys Login</h1>
      <button
        onClick={handleLogin}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        {loading ? "Sending Magic Link..." : "Login as Admin"}
      </button>
    </div>
  );
}
