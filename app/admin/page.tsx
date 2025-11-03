"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import TopBar from "@/components/TopBar";

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
    <div className="min-h-screen bg-black text-[#d4af37]">
      <TopBar />
      <div className="p-8 text-center space-y-6">
        <h2 className="text-3xl font-bold">Admin Control Panel</h2>
        <p>Manage VIP alerts, automations, and tiered signals here.</p>
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
          className={[
            "inline-flex items-center justify-center rounded bg-[#d4af37] px-6 py-3 font-semibold text-black",
            "transition",
            "hover:bg-yellow-400",
          ].join(" ")}
        >
          🚀 Send VIP Signal Alert
        </button>
      </div>
    </div>
  );
}
