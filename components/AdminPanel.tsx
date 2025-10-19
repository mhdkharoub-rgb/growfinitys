"use client";

import { useEffect, useState } from "react";

export default function AdminPanel() {
  const [signals, setSignals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchSignals() {
    const res = await fetch("/api/signals/list");
    const json = await res.json();
    setSignals(json.signals ?? []);
  }

  async function generate(timeframe: "hourly" | "daily" | "monthly") {
    setLoading(true);
    try {
      await fetch("/api/signals/generate", {
        method: "POST",
        body: JSON.stringify({ timeframe }),
        headers: { "Content-Type": "application/json" }
      });
      await fetchSignals();
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSignals();
  }, []);

  return (
    <div>
      <h2>Admin</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button disabled={loading} onClick={() => generate("hourly")}>Generate Hourly</button>
        <button disabled={loading} onClick={() => generate("daily")}>Generate Daily</button>
        <button disabled={loading} onClick={() => generate("monthly")}>Generate Monthly</button>
      </div>

      <h3>Signals</h3>
      <div style={{ display: "grid", gap: 8 }}>
        {signals.map(s => (
          <div key={s.id} style={{ border: "1px solid #ddd", padding: 8 }}>
            <b>{s.timeframe}</b> · {new Date(s.created_at).toLocaleString()}
          </div>
        ))}
      </div>
    </div>
  );
}
