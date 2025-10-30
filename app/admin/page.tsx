"use client";
import { useState } from "react";

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleVIPAlert = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://hooks.zapier.com/hooks/catch/2534204/uissjbx/", // ✅ your actual Zapier webhook URL
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            audience: "vip",
            count: 1,
            sendNow: true,
          }),
        }
      );
      const text = await res.text();
      setResult("🚀 VIP alert sent successfully! Response: " + text);
    } catch (err) {
      console.error(err);
      setResult("❌ Failed to send VIP alert. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#D4AF37] flex flex-col items-center justify-center font-poppins">
      <h1 className="text-4xl font-bold mb-8">Growfinitys Admin Console</h1>

      <div className="bg-[#111] border border-[#D4AF37] p-8 rounded-2xl shadow-lg w-full max-w-lg text-center">
        <p className="mb-4 text-lg">
          Manage your signals, send VIP alerts, and monitor automations.
        </p>

        <button
          onClick={handleVIPAlert}
          disabled={loading}
          className={`mt-6 px-6 py-3 rounded-xl font-semibold border border-[#D4AF37] transition-all duration-300 ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-[#D4AF37] text-black hover:bg-black hover:text-[#D4AF37]"
          }`}
        >
          {loading ? "Sending..." : "🚀 Send Instant VIP Alert"}
        </button>

        {result && (
          <div className="mt-6 text-sm text-[#D4AF37] bg-[#000] border border-[#D4AF37] rounded-lg p-3">
            {result}
          </div>
        )}
      </div>

      <footer className="mt-12 text-sm text-gray-500">
        © {new Date().getFullYear()} Growfinitys. All rights reserved.
      </footer>
    </div>
  );
}
