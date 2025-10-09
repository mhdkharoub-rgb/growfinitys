import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/router";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [signals, setSignals] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("");
  const [loading, setLoading] = useState(false);
  const [tier, setTier] = useState("Basic"); // Default fallback

  // 🔐 Verify user and load data
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        router.push("/login");
        return;
      }
      setUser(data.user);
      await fetchUserTier(data.user.id);
      fetchSignals();
    };
    checkUser();
  }, []);

  // ♻️ Auto-refresh every 60s
  useEffect(() => {
    const interval = setInterval(() => {
      fetchSignals();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchUserTier = async (userId) => {
    // fetch from Supabase table 'profiles' or 'subscriptions'
    const { data, error } = await supabase
      .from("profiles")
      .select("membership_tier")
      .eq("id", userId)
      .single();

    if (!error && data?.membership_tier) {
      setTier(data.membership_tier);
    }
  };

  const fetchSignals = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("signals")
      .select("*")
      .order("date", { ascending: false });

    if (error) console.error(error);
    else {
      // apply access limits
      let filtered = data;
      if (tier === "Basic") filtered = data.slice(0, 2);
      else if (tier === "Pro") filtered = data.slice(0, 8);

      setSignals(filtered);
      const now = new Date();
      setLastUpdated(
        now.toLocaleString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      );
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (!user) return null;

  const tierColors = {
    Basic: "bg-gray-700 text-gray-200",
    Pro: "bg-purple-600 text-white",
    VIP: "bg-yellow-400 text-black font-semibold",
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">👋 Welcome, {user.email}</h1>
            <p className="text-gray-400 mb-3">
              You’re now logged in to <span className="text-yellow-400">Growfinitys Dashboard</span>.
            </p>
          </div>

          {/* 🏆 Tier Badge */}
          <span className={`px-4 py-2 rounded-full text-sm ${tierColors[tier]}`}>
            {tier} Member
          </span>
        </div>

        {/* ✅ Header + Refresh */}
        <div className="flex items-center justify-between mt-6 mb-4">
          <h2 className="text-xl font-semibold text-yellow-400">Daily Trading Signals</h2>
          <div className="flex items-center gap-3">
            <p className="text-gray-400 text-sm">
              Last Updated: {lastUpdated || "Loading..."}
            </p>
            <button
              onClick={fetchSignals}
              disabled={loading}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1.5 rounded-lg text-sm font-semibold transition"
            >
              {loading ? "Refreshing..." : "🔄 Refresh"}
            </button>
          </div>
        </div>

        {/* 📊 Signals Table */}
        <div className="overflow-x-auto border border-gray-700 rounded-lg">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="text-yellow-400 border-b border-gray-700">
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Symbol</th>
                <th className="p-2 text-left">Signal</th>
                <th className="p-2 text-left">Entry</th>
                <th className="p-2 text-left">TP</th>
                <th className="p-2 text-left">SL</th>
                <th className="p-2 text-left">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {signals.map((s, i) => (
                <tr key={i} className="border-b border-gray-700 hover:bg-gray-800/60">
                  <td className="p-2">{new Date(s.date).toLocaleDateString()}</td>
                  <td className="p-2">{s.symbol}</td>
                  <td
                    className={`p-2 font-semibold ${
                      s.action === "BUY" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {s.action}
                  </td>
                  <td className="p-2 text-orange-400">{s.entry_price?.toFixed(2)}</td>
                  <td className="p-2 text-green-400">{s.take_profit?.toFixed(2)}</td>
                  <td className="p-2 text-red-400">{s.stop_loss?.toFixed(2)}</td>
                  <td className="p-2">{s.confidence}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
{user?.email === "mhdkharoub@gmail.com" && (
  <div className="mt-10 border-t border-gray-700 pt-5">
    <h2 className="text-lg text-yellow-400 font-semibold mb-3">
      🧠 Admin Shortcut — Change Your Own Tier
    </h2>
    <div className="flex gap-3">
      {["Basic", "Pro", "VIP"].map((level) => (
        <button
          key={level}
          onClick={async () => {
            await supabase
              .from("profiles")
              .update({ membership_tier: level })
              .eq("id", user.id);
            alert(`✅ You switched your account to ${level} tier!`);
          }}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            level === "Basic"
              ? "bg-gray-700 hover:bg-gray-600"
              : level === "Pro"
              ? "bg-purple-600 hover:bg-purple-500"
              : "bg-yellow-400 hover:bg-yellow-300 text-black"
          }`}
        >
          {level}
        </button>
      ))}
    </div>
  </div>
)}

        {/* 🚪 Logout */}
        <div className="mt-6 text-center">
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
