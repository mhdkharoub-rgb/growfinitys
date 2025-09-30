// pages/dashboard.js
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSignals() {
      try {
        const res = await fetch("/api/get-signals");
        const data = await res.json();
        setSignals(data.signals || []);
      } catch (err) {
        console.error("❌ Failed to load signals:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSignals();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Loading signals...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">📊 Trading Signals Dashboard</h1>

      {signals.length === 0 ? (
        <p className="text-gray-400">No signals available yet.</p>
      ) : (
        <table className="w-full border border-gray-700 rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-yellow-400">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Pair</th>
              <th className="p-3 text-left">Signal</th>
              <th className="p-3 text-left">Entry</th>
              <th className="p-3 text-left">TP</th>
              <th className="p-3 text-left">SL</th>
            </tr>
          </thead>
          <tbody>
            {signals.map((sig, i) => (
              <tr key={i} className="border-t border-gray-700 hover:bg-gray-900">
                <td className="p-3">{sig.date || "-"}</td>
                <td className="p-3">{sig.pair || "-"}</td>
                <td
                  className={`p-3 font-bold ${
                    sig.signal?.toLowerCase() === "buy"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {sig.signal || "-"}
                </td>
                <td className="p-3">{sig.entry || "-"}</td>
                <td className="p-3">{sig.tp || "-"}</td>
                <td className="p-3">{sig.sl || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
