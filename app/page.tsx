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
      <header className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur border-b border-gold/10">
        <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <a href="#hero" className="text-lg md:text-xl font-poppins font-semibold gold-text">
            Growfinitys Signals
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm uppercase tracking-wide">
            <a href="#features" className="hover:text-gold transition-colors">
              Features
            </a>
            <a href="#pricing" className="hover:text-gold transition-colors">
              Plans
            </a>
            <a href="#contact" className="hover:text-gold transition-colors">
              Contact
            </a>
            <button
              onClick={() => {
                setError(null);
                setShowLogin(true);
                setShowSignup(false);
              }}
              className="border border-gold text-gold px-5 py-2 rounded-full font-semibold hover:bg-gold hover:text-black transition"
            >
              Login
            </button>
          </div>
          <button
            onClick={() => window.open("https://nas.io/growfinitys/zerolink/vip", "_blank")}
            className="md:hidden btn-gold text-sm"
          >
            Join VIP
          </button>
        </nav>
      </header>

      {/* HERO */}
      <section
        id="hero"
        className="section min-h-screen flex flex-col items-center justify-center text-center relative pt-32"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(212,175,55,0.08)] to-transparent blur-3xl pointer-events-none" />
        <p className="uppercase tracking-[0.6rem] text-xs md:text-sm text-gray-400 mb-6">Premium AI Trading Collective</p>
        <h1 className="glow-text text-5xl md:text-7xl font-poppins font-bold text-gold mb-6 leading-tight px-4">
          Luxury Forex & Crypto Signals Powered by AI
        </h1>
        <p className="max-w-2xl text-gray-300 text-lg md:text-xl mb-10 px-6">
          Access real-time intelligence, automated risk management, and concierge-level support. Growfinitys delivers
          elite trading signals and actionable insights the moment markets move.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => window.open("https://nas.io/growfinitys/zerolink/vip", "_blank")}
            className="btn-gold"
          >
            Join Now
          </button>
          <button
            onClick={() => {
              setError(null);
              setShowLogin(true);
              setShowSignup(false);
            }}
            className="border border-gold text-gold px-8 py-3 rounded-full font-semibold hover:bg-gold hover:text-black transition"
          >
            Member Login
          </button>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-3 max-w-4xl w-full px-6">
          {["AI-vetted Entries", "Risk Management Automation", "Concierge Support"].map((item) => (
            <div key={item} className="bg-zinc-900/60 border border-gold/20 rounded-2xl p-6 shadow-lg">
              <p className="font-semibold text-gold mb-2">{item}</p>
              <p className="text-sm text-gray-400">
                Tailored execution pathways built for traders demanding speed, precision, and confidence.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="section bg-black">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <h2 className="text-4xl md:text-5xl font-poppins font-bold gold-text glow">Why Traders Choose Growfinitys</h2>
          <div className="grid gap-8 md:grid-cols-3 text-left">
            {[
              {
                title: "AI Intelligence",
                description:
                  "Multi-model AI scans 24/7 to uncover high-probability setups across Forex and Crypto pairs.",
              },
              {
                title: "Speed & Delivery",
                description:
                  "Signals hit your dashboard, email, and Telegram instantly so you never miss the window to act.",
              },
              {
                title: "Transparent Results",
                description:
                  "Performance dashboards, win-rate reporting, and audited archives keep every entry accountable.",
              },
            ].map((feature) => (
              <div key={feature.title} className="bg-zinc-900/60 border border-gold/20 rounded-2xl p-6 shadow-lg">
                <h3 className="text-2xl font-semibold text-gold mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="section bg-black">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-center mb-12 text-gold">Choose Your AI Signal Plan</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {[
              {
                name: "Basic",
                price: "29",
                yearly: "290",
                perks: [
                  "AI-Generated Forex & Crypto Signals (3–5 daily)",
                  "Instant alerts via email and dashboard",
                  "Daily AI Market Summary – automated morning recap",
                  "Access to member dashboard (Supabase)",
                  "24/7 AI chat support (bot-assisted Q&A)",
                  "10% upgrade discount when moving to Pro or VIP",
                  "Beginner AI course access (coming soon)",
                ],
                links: {
                  monthly: "https://nas.io/growfinitys/zerolink/basic",
                  yearly: "https://nas.io/growfinitys/zerolink/basic-yearly",
                },
              },
              {
                name: "Pro",
                price: "59",
                yearly: "590",
                perks: [
                  "Everything in Basic, plus:",
                  "AI Priority Signals (5–10 daily, higher accuracy)",
                  "Trade Reasoning Engine – AI explains each setup",
                  "Auto-Risk Manager (AI-based position sizing)",
                  "Weekly AI Market Recap Video",
                  "Telegram + mobile push alerts",
                  "AI Portfolio Tracker synced with Supabase",
                  "Priority AI chat + analyst-assisted support",
                ],
                links: {
                  monthly: "https://nas.io/growfinitys/zerolink/pro",
                  yearly: "https://nas.io/growfinitys/zerolink/pro-yearly",
                },
              },
              {
                name: "VIP",
                price: "99",
                yearly: "990",
                perks: [
                  "Everything in Pro, plus:",
                  "Auto-Trade Execution Bot (MT4, Binance, TradingView)",
                  "Custom AI Signal Filters (risk-profile selector)",
                  "Real-time AI Market Radar Dashboard (24/7)",
                  "Private 1-on-1 strategy session each month",
                  "VIP Telegram & Discord private channels",
                  "Beta access to new AI tools and backtesting reports",
                  "Dedicated account manager for premium support",
                ],
                links: {
                  monthly: "https://nas.io/growfinitys/zerolink/vip",
                  yearly: "https://nas.io/growfinitys/zerolink/vip-yearly",
                },
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className="bg-zinc-900 border border-gold/30 hover:border-gold transition rounded-2xl p-6 flex flex-col justify-between shadow-lg w-full max-w-sm"
              >
                <div>
                  <h3 className="text-2xl font-semibold text-gold mb-2">{plan.name}</h3>
                  <p className="text-4xl font-bold mb-2">
                    ${plan.price}
                    <span className="text-sm font-normal text-gray-400"> /month</span>
                  </p>
                  <p className="text-sm text-gray-400 mb-4">
                    or <span className="text-gold font-semibold">${plan.yearly}</span> yearly (save 2 months)
                  </p>
                  <ul className="text-gray-300 space-y-2">
                    {plan.perks.map((perk) => (
                      <li key={perk}>• {perk}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col gap-2 mt-6">
                  <button
                    onClick={() => window.open(plan.links.monthly, "_blank")}
                    className="bg-gold text-black w-full py-2 rounded-lg font-semibold hover:bg-goldDark transition"
                  >
                    Join {plan.name} Monthly – ${plan.price}
                  </button>
                  <button
                    onClick={() => window.open(plan.links.yearly, "_blank")}
                    className="border border-gold text-gold w-full py-2 rounded-lg font-semibold hover:bg-gold hover:text-black transition"
                  >
                    Join {plan.name} Yearly – ${plan.yearly}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section bg-black">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold gold-text">Concierge Support</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Questions about enterprise automation, custom integrations, or private trading desks? Our team responds
            within 24 hours.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a
              href="mailto:support@growfinitys.com"
              className="border border-gold text-gold px-5 py-3 rounded-full hover:bg-gold hover:text-black transition"
            >
              support@growfinitys.com
            </a>
            <a
              href="https://t.me/growfinitys"
              target="_blank"
              rel="noreferrer"
              className="border border-gold text-gold px-5 py-3 rounded-full hover:bg-gold hover:text-black transition"
            >
              Telegram
            </a>
            <a
              href="https://instagram.com/growfinitys"
              target="_blank"
              rel="noreferrer"
              className="border border-gold text-gold px-5 py-3 rounded-full hover:bg-gold hover:text-black transition"
            >
              Instagram
            </a>
          </div>
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
