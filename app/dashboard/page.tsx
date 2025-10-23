"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  async function handleLogout() {
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
    </main>
  );
}
