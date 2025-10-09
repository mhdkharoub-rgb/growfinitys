import { useState } from "react";

const LINKS = {
  monthly: {
    Basic: "https://nas.io/growfinitys/zerolink/basic",
    Pro: "https://nas.io/growfinitys/zerolink/pro",
    VIP: "https://nas.io/growfinitys/zerolink/vip",
  },
  yearly: {
    Basic: "https://nas.io/growfinitys/zerolink/basic-yearly",
    Pro: "https://nas.io/growfinitys/zerolink/pro-yearly",
    VIP: "https://nas.io/growfinitys/zerolink/vip-yearly",
  },
};

export default function Pricing() {
  const [cycle, setCycle] = useState("monthly"); // 'monthly' | 'yearly'

  return (
    <section id="pricing" className="bg-black text-white py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-3xl font-bold">Pricing</h2>

          {/* Billing cycle toggle */}
          <div className="flex items-center gap-3 text-sm">
            <button
              onClick={() => setCycle("monthly")}
              className={`px-3 py-1 rounded border ${
                cycle === "monthly" ? "border-yellow-400 text-yellow-400" : "border-gray-700 text-gray-400"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setCycle("yearly")}
              className={`px-3 py-1 rounded border ${
                cycle === "yearly" ? "border-yellow-400 text-yellow-400" : "border-gray-700 text-gray-400"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Basic */}
          <div className="rounded-xl border border-gray-800 p-6 bg-gradient-to-b from-gray-950 to-black">
            <h3 className="text-xl font-bold mb-2">Basic</h3>
            <p className="text-gray-400 mb-4">2 signals per day. Core access.</p>
            <ul className="text-sm text-gray-300 space-y-2 mb-6">
              <li>• Daily signals (2/day)</li>
              <li>• Entry / TP / SL included</li>
              <li>• Email alerts (optional)</li>
            </ul>
            <a
              href={LINKS[cycle].Basic}
              target="_blank"
              rel="noreferrer"
              className="inline-block w-full text-center bg-gray-200 text-black font-semibold py-3 rounded-lg hover:bg-white transition"
            >
              Join {cycle === "monthly" ? "Monthly" : "Yearly"}
            </a>
          </div>

          {/* Pro */}
          <div className="rounded-xl border border-purple-700/40 p-6 bg-gradient-to-b from-purple-950/50 to-black">
            <h3 className="text-xl font-bold mb-2">Pro</h3>
            <p className="text-gray-400 mb-4">5–8 signals per day. Serious growth.</p>
            <ul className="text-sm text-gray-300 space-y-2 mb-6">
              <li>• Daily signals (5–8/day)</li>
              <li>• Priority pairs (Gold, Oil, Majors)</li>
              <li>• Higher confidence setups</li>
            </ul>
            <a
              href={LINKS[cycle].Pro}
              target="_blank"
              rel="noreferrer"
              className="inline-block w-full text-center bg-purple-600 text-white font-semibold py-3 rounded-lg hover:bg-purple-500 transition"
            >
              Join {cycle === "monthly" ? "Monthly" : "Yearly"}
            </a>
          </div>

          {/* VIP */}
          <div className="rounded-xl border border-yellow-500/40 p-6 bg-gradient-to-b from-yellow-900/20 to-black">
            <h3 className="text-xl font-bold mb-2">VIP</h3>
            <p className="text-gray-400 mb-4">Full live feed. Max access.</p>
            <ul className="text-sm text-gray-300 space-y-2 mb-6">
              <li>• Unlimited live signals</li>
              <li>• All asset classes (FX, Gold, Oil, BTC, ETH…)</li>
              <li>• Priority support</li>
            </ul>
            <a
              href={LINKS[cycle].VIP}
              target="_blank"
              rel="noreferrer"
              className="inline-block w-full text-center bg-yellow-400 text-black font-semibold py-3 rounded-lg hover:bg-yellow-300 transition"
            >
              Join {cycle === "monthly" ? "Monthly" : "Yearly"}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
