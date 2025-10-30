"use client";
import { useCallback, useState } from "react";

type Tier = "vip" | "pro" | "basic";

type Status = "idle" | "sending" | "success" | "error";

const BUTTON_STYLES: Record<Tier, string> = {
  vip: "border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black",
  pro: "border-[#C0A060] text-[#C0A060] hover:bg-[#C0A060] hover:text-black",
  basic: "border-[#999966] text-[#999966] hover:bg-[#999966] hover:text-black",
};

const BUTTON_LABELS: Record<Tier, string> = {
  vip: "🚀 Send VIP Alert",
  pro: "⚡ Send Pro Alert",
  basic: "📈 Send Basic Alert",
};

export default function AdminPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sendAlert = useCallback(async (tier: Tier) => {
    try {
      setStatus("sending");
      setErrorMessage(null);

      const res = await fetch(`/api/admin/${tier}-alert`, { method: "POST" });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Request failed");
      }

      const data = await res.json().catch(() => ({ ok: false }));
      if (!data?.ok) {
        throw new Error(data?.error || "Zapier relay returned an error");
      }

      setStatus("success");
    } catch (error: any) {
      console.error(`[admin:${tier}]`, error);
      setErrorMessage(error?.message || "Unknown error");
      setStatus("error");
    }
  }, []);

  return (
    <main className="min-h-screen bg-black text-[#D4AF37] flex flex-col items-center justify-center space-y-6 px-4 py-10">
      <h1 className="text-4xl font-bold text-center">⚡ Growfinitys Admin Panel</h1>

      <p className="max-w-xl text-center text-[#f4e7c2]/80">
        Trigger instant broadcasts for each membership tier without exposing Zapier webhook URLs in the client.
      </p>

      <div className="flex flex-col md:flex-row items-center gap-4">
        {(Object.keys(BUTTON_STYLES) as Tier[]).map((tier) => (
          <button
            key={tier}
            onClick={() => sendAlert(tier)}
            className={`px-6 py-3 rounded-xl border-2 font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-black disabled:opacity-60 disabled:cursor-not-allowed ${BUTTON_STYLES[tier]}`}
            disabled={status === "sending"}
          >
            {status === "sending" ? "Sending..." : BUTTON_LABELS[tier]}
          </button>
        ))}
      </div>

      {status === "sending" && <p className="text-gray-400">Sending alert...</p>}
      {status === "success" && <p className="text-green-400">✅ Alert sent successfully!</p>}
      {status === "error" && (
        <div className="text-red-400 text-center">
          <p>❌ Failed to send alert.</p>
          {errorMessage ? <p className="text-sm text-red-300 mt-1">{errorMessage}</p> : null}
        </div>
      )}
    </main>
  );
}
