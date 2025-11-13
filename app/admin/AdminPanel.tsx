"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/lib/types";

export default function AdminPanel() {
  const supabase = createClientComponentClient<Database>();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const triggerAlert = async (tier: "basic" | "pro" | "vip") => {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(`/api/admin/${tier}-alert`, { method: "POST" });
      const result = await response.json();

      if (response.ok) {
        setMessage(result.message || `✅ ${tier.toUpperCase()} alert sent successfully`);
      } else {
        setMessage(`❌ ${result.error || "Something went wrong"}`);
      }
    } catch (error) {
      console.error(error);
      setMessage("⚠️ Network or server error.");
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <main style={{ maxWidth: 800, margin: "48px auto", padding: "24px" }}>
      <h1 style={{ fontSize: 28, color: "#d4af37", textAlign: "center", marginBottom: 24 }}>
        Admin Dashboard
      </h1>

      <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginBottom: 24 }}>
        <button
          onClick={() => triggerAlert("basic")}
          disabled={loading}
          style={{ padding: "10px 18px", borderRadius: 6, background: "#ccc", cursor: "pointer" }}
        >
          Send Basic Alert
        </button>
        <button
          onClick={() => triggerAlert("pro")}
          disabled={loading}
          style={{ padding: "10px 18px", borderRadius: 6, background: "#0070f3", color: "#fff", cursor: "pointer" }}
        >
          Send Pro Alert
        </button>
        <button
          onClick={() => triggerAlert("vip")}
          disabled={loading}
          style={{ padding: "10px 18px", borderRadius: 6, background: "#d4af37", color: "#000", cursor: "pointer" }}
        >
          Send VIP Alert
        </button>
      </div>

      {message && (
        <div style={{ textAlign: "center", marginBottom: 20, color: message.startsWith("✅") ? "green" : "red" }}>
          {message}
        </div>
      )}

      <div style={{ textAlign: "center" }}>
        <button
          onClick={signOut}
          style={{
            background: "#444",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </main>
  );
}
