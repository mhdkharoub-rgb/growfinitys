"use client";
import { useMemo, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const supabase = useMemo(() => {
    if (!supabaseUrl || !supabaseAnonKey) {
      return null;
    }

    return createBrowserClient(supabaseUrl, supabaseAnonKey);
  }, [supabaseUrl, supabaseAnonKey]);

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

  async function handleSignup() {
    setLoading(true);
    setError(null);
    if (!supabase) {
      setError("Supabase is not configured. Please try again later.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    else {
      setShowSignup(false);
      router.push("/dashboard");
    }
  }

  return (
    <main className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
      {/* HERO */}
      <section className="flex flex-col items-center justify-center text-center min-h-screen relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(212,175,55,0.05)] to-transparent blur-3xl pointer-events-none" />
        <h1 className="glow-text text-6xl md:text-7xl font-poppins font-bold text-gold mb-6">
          Growfinitys Signals
        </h1>
        <p className="max-w-2xl text-gray-300 text-lg md:text-xl mb-10">
          Premium <span className="text-gold">Forex</span> & <span className="text-gold">Crypto</span> trading signals.
          Accurate entries, trusted analysis, and VIP alerts.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => window.open("https://nas.io/growfinitys/zerolink/basic", "_blank")}
            className="bg-gold text-black px-8 py-3 rounded-lg font-semibold hover:bg-goldDark transition"
          >
            Join Now
          </button>
          <button
            onClick={() => {
              setError(null);
              setShowLogin(true);
              setShowSignup(false);
            }}
            className="border border-gold text-gold px-8 py-3 rounded-lg font-semibold hover:bg-gold hover:text-black transition"
          >
            Login
          </button>
        </div>
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
            {
              name: "Basic",
              price: "29",
              yearly: "290",
              perks: [
                "AI-filtered Forex & Crypto signals (3–5/day)",
                "Market overview summary every morning",
                "Email notifications for each trade alert",
                "Access to member dashboard",
                "Basic AI chat support (24/7)",
                "10% off upgrades to Pro or VIP",
              ],
              monthlyLink: "https://nas.io/growfinitys/zerolink/basic",
              yearlyLink: "https://nas.io/growfinitys/zerolink/basic-yearly",
            },
            {
              name: "Pro",
              price: "59",
              yearly: "590",
              perks: [
                "Priority signal delivery (5–10/day)",
                "AI trade summaries and reasoning per signal",
                "Auto-Risk Manager (AI-generated lot size & SL/TP)",
                "Weekly AI market recap video",
                "Telegram and mobile push alerts",
                "AI portfolio tracking dashboard",
                "Priority AI chat + analyst-assisted support",
              ],
              monthlyLink: "https://nas.io/growfinitys/zerolink/pro",
              yearlyLink: "https://nas.io/growfinitys/zerolink/pro-yearly",
            },
            {
              name: "VIP",
              price: "99",
              yearly: "990",
              perks: [
                "Auto-Trade Execution Bot (MT4, Binance, or TradingView)",
                "Custom AI signal filters (choose your own risk level)",
                "Private 1-on-1 strategy session each month",
                "Real-time AI Market Radar dashboard",
                "VIP Telegram & Discord private channels",
                "Early access to AI backtesting and new trading tools",
                "Dedicated personal account manager",
              ],
              monthlyLink: "https://nas.io/growfinitys/zerolink/vip",
              yearlyLink: "https://nas.io/growfinitys/zerolink/vip-yearly",
            },
          ].map((plan) => (
            <div
              key={plan.name}
              className="w-72 p-6 border border-gold/30 rounded-2xl hover:border-gold hover:scale-105 transition"
            >
              <h3 className="text-2xl font-semibold text-gold mb-2">{plan.name}</h3>
              <p className="text-4xl font-bold mb-2">
                ${plan.price}
                <span className="text-sm font-normal text-gray-400"> /month</span>
              </p>
              <p className="text-sm text-gray-400 mb-4">
                or <span className="text-gold font-semibold">${plan.yearly}</span> yearly (save 2 months)
              </p>
              <ul className="text-gray-400 space-y-2 mb-6">
                {plan.perks.map((perk) => (
                  <li key={perk}>• {perk}</li>
                ))}
              </ul>
              <button
                onClick={() => window.open(plan.monthlyLink, "_blank")}
                className="bg-gold text-black w-full py-2 rounded-lg font-semibold hover:bg-goldDark transition"
              >
                Join {plan.name} Monthly
              </button>
              <button
                onClick={() => window.open(plan.yearlyLink, "_blank")}
                className="border border-gold text-gold w-full py-2 rounded-lg font-semibold hover:bg-gold hover:text-black transition mt-2"
              >
                Join {plan.name} Yearly
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
            <p className="text-gray-400 mt-4 text-sm">
              Need an account?{" "}
              <span
                onClick={() => {
                  setShowLogin(false);
                  setShowSignup(true);
                  setError(null);
                }}
                className="text-gold cursor-pointer hover:underline"
              >
                Join now
              </span>
            </p>
            <button
              onClick={() => {
                setShowLogin(false);
                setError(null);
              }}
              className="mt-4 text-sm text-gray-400 hover:text-gold transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* SIGNUP MODAL */}
      {showSignup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-8 rounded-xl w-full max-w-md shadow-lg border border-gold">
            <h2 className="text-2xl font-bold mb-4 text-gold">Create Account</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mb-3 bg-black border border-zinc-700 rounded-lg text-white"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mb-3 bg-black border border-zinc-700 rounded-lg text-white"
            />
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <button
              onClick={handleSignup}
              disabled={loading}
              className="bg-gold text-black w-full py-2 rounded-lg font-semibold hover:bg-goldDark transition"
            >
              {loading ? "Creating..." : "Join Now"}
            </button>
            <p className="text-gray-400 mt-4 text-sm">
              Already have an account?{" "}
              <span
                onClick={() => {
                  setShowSignup(false);
                  setShowLogin(true);
                  setError(null);
                }}
                className="text-gold cursor-pointer hover:underline"
              >
                Log in
              </span>
            </p>
            <button
              onClick={() => {
                setShowSignup(false);
                setError(null);
              }}
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
