"use client";
import { useMemo } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = useMemo(() => {
    if (typeof window === "undefined") {
      return null;
    }

    if (!supabaseUrl || !supabaseAnonKey) {
      return null;
    }

    return createBrowserClient(supabaseUrl, supabaseAnonKey);
  }, [supabaseUrl, supabaseAnonKey]);

  async function handleLogout() {
    if (!supabase) {
      router.push("/");
      return;
    }
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-5xl font-bold text-gold mb-6">Welcome to Growfinitys VIP Dashboard</h1>
      <p className="text-gray-400 mb-10">You’re logged in. Exclusive signals coming soon!</p>
      <button
        onClick={handleLogout}
        className="bg-gold text-black font-semibold px-8 py-3 rounded-xl hover:bg-goldDark transition"
      >
        Logout
      </button>
      {!supabase && (
        <p className="mt-6 text-sm text-gray-500">
          Supabase is not configured. Please add your project credentials.
        </p>
      )}
    </main>
  );
}
