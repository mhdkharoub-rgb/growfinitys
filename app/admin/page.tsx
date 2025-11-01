"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import LogoutBar from "@/components/LogoutBar";

export default function AdminPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (error || !profile) {
        console.error("Profile fetch failed:", error);
        router.replace("/");
        return;
      }

      if (profile.role === "admin") {
        setIsAdmin(true);
      } else {
        router.replace("/");
      }

      setLoading(false);
    }

    checkSession();
  }, [supabase, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-gold">
        Checking session...
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-black text-gold p-10 relative">
      <LogoutBar />
      <h1 className="text-4xl font-bold mb-8 text-center">Admin Dashboard</h1>
      <p className="text-center mb-6">👑 Welcome Admin! Manage signals below.</p>

      <div className="max-w-3xl mx-auto space-y-6">
        <p className="text-center">
          👋 Welcome, <strong>Admin</strong>! You have full access to send VIP alerts and manage AI trading
          signals.
        </p>

        <button
          onClick={async () => {
            try {
              const response = await fetch("/api/admin/vip-alert", {
                method: "POST",
              });
              const result = await response.json();
              alert(result?.message || "VIP alert sent successfully!");
            } catch (err) {
              console.error("Alert failed:", err);
              alert("❌ Failed to send alert. Check logs or Supabase auth.");
            }
          }}
          className="block w-full bg-gold text-black font-semibold py-3 rounded hover:bg-yellow-400 transition"
        >
          🚀 Send VIP Signal Alert
        </button>
      </div>
    </div>
  );
}
