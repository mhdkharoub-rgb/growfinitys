"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ADMIN_EMAIL: string = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // ✅ Redirect users automatically if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: session } = await supabase.auth.getSession();

      if (session.session?.user?.email === ADMIN_EMAIL) {
        router.replace("/admin");
      } else if (session.session?.user) {
        router.replace("/dashboard");
      }
    };

    checkSession();
  }, [router]);

  // ✅ Listen for auth state changes (magic link callback)
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(async (_, session) => {
      if (session?.user?.email === ADMIN_EMAIL) {
        router.replace("/admin");
      } else if (session?.user) {
        router.replace("/dashboard");
      }
    });

    return () => data.subscription.unsubscribe();
  }, [router]);

  // ✅ Send magic login link to admin
  const handleAdminLogin = async () => {
    setLoading(true);

    try {
      if (!ADMIN_EMAIL) {
        alert("❌ Missing NEXT_PUBLIC_ADMIN_EMAIL in Vercel environment.");
        return;
      }

      const { error } = await supabase.auth.signInWithOtp({
        email: ADMIN_EMAIL,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        alert("❌ " + error.message);
        return;
      }

      alert("✅ Magic login link sent. Check your email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-gray-900 p-8 rounded-xl shadow-xl w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-6">Growfinitys Login</h1>

        <button
          onClick={handleAdminLogin}
          disabled={loading}
          className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 rounded-lg font-semibold transition"
        >
          {loading ? "Sending Magic Link..." : "Login as Admin"}
        </button>

        <p className="text-sm text-gray-400 mt-4">
          You will receive a magic link in your email.
        </p>
      </div>
    </div>
  );
}
