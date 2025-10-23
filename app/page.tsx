"use client";
import { useMemo, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

export default function Home() {
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
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    setLoading(true);
    setError(null);
    if (!supabase) {
      setError("Supabase is not configured. Please try again later.");
      setLoading(false);
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    else {
      setShowLogin(false);
      router.push("/dashboard");
    }
  }

  return (
    <main className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
      {/* HERO */}
      <section className="flex flex-col items-center justify-center text-center min-h-screen relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(212,175,55,0.05)] to-transparent blur-3xl" />
        <h1 className="glow-text text-6xl md:text-7xl font-poppins font-bold text-gold mb-6">
          Growfinitys Signals
        </h1>
        <p className="max-w-2xl text-gray-300 text-lg md:text-xl mb-10">
          Premium <span className="text-gold">Forex</span> & <span className="text-gold">Crypto</span> trading signals.
          Accurate entries, trusted analysis, and VIP alerts.
        </p>
        <button
          onClick={() => setShowLogin(true)}
          className="bg-gold text-black font-semibold px-8 py-3 rounded-xl hover:bg-goldDark transition"
        >
          Login / Join Now
        </button>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 px-6 text-center bg-black">
        <h2 className="text-4xl font-bold text-gold mb-8">Why Growfinitys?</h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="p-6 border border-gold/20 rounded-xl hover:border-gold transition">
            <h3 className="text-xl font-semibold mb-3 text-gold">Accuracy</h3>
            <p className="text-gray-400">
              AI-filtered and human-verified trading signals with precision risk-reward ratios.
            </p>
          </div>
          <div className="p-6 border border-gold/20 rounded-xl hover:border-gold transition">
            <h3 className="text-xl font-semibold mb-3 text-gold">Speed</h3>
            <p className="text-gray-400">
              Instant alerts to your dashboard and Telegram for fast execution.
            </p>
          </div>
          <div className="p-6 border border-gold/20 rounded-xl hover:border-gold transition">
            <h3 className="text-xl font-semibold mb-3 text-gold">Transparency</h3>
            <p className="text-gray-400">
              Real-time performance tracking and monthly win-rate reports.
            </p>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-20 px-6 bg-black text-center">
        <h2 className="text-4xl font-bold text-gold mb-10">Membership Plans</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {[
            { name: "Basic", price: "19", perks: ["Daily Signals", "Email Support"] },
            { name: "Pro", price: "49", perks: ["All Basic Perks", "VIP Group", "Performance Dashboard"] },
            { name: "VIP", price: "99", perks: ["Private Alerts", "1-on-1 Coaching", "Lifetime Access"] },
          ].map((plan) => (
            <div
              key={plan.name}
              className="w-72 p-6 border border-gold/30 rounded-2xl hover:border-gold hover:scale-105 transition"
            >
              <h3 className="text-2xl font-semibold text-gold mb-2">{plan.name}</h3>
              <p className="text-4xl font-bold mb-4">${plan.price}</p>
              <ul className="text-gray-400 space-y-2 mb-6">
                {plan.perks.map((p) => (
                  <li key={p}>• {p}</li>
                ))}
              </ul>
              <button
                onClick={() => setShowLogin(true)}
                className="bg-gold text-black w-full py-2 rounded-lg font-semibold hover:bg-goldDark transition"
              >
                Join Now
              </button>
            </div>
          ))}
        </div>
      </section>

      <footer className="py-10 text-center text-gray-500 text-sm border-t border-gold/10">
        © {new Date().getFullYear()} Growfinitys Signals — All Rights Reserved
      </footer>

      {/* LOGIN MODAL */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-black border border-gold/40 rounded-2xl p-8 w-[90%] max-w-md text-center">
            <h3 className="text-2xl font-bold text-gold mb-4">Member Login</h3>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-3 px-4 py-2 rounded bg-gray-900 text-white border border-gold/20"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-5 px-4 py-2 rounded bg-gray-900 text-white border border-gold/20"
            />
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-gold text-black font-semibold py-2 rounded hover:bg-goldDark transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <button
              onClick={() => setShowLogin(false)}
              className="mt-4 text-sm text-gray-400 hover:text-gold transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
