import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/router";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [signals, setSignals] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        router.push("/login");
        return;
      }
      setUser(data.user);
      fetchSignals();
    };

    checkUser();
  }, []);

  const fetchSignals = async () => {
    const { data, error } = await supabase
      .from("signals")
      .select("*")
      .order("date", { ascending: false });

    if (error) console.error(error);
    else {
      setSignals(data);
      const now = new Date();
      setLastUpdated(now.toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }));
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">👋 Welcome, {user.email}</h1>
        <p className="text-gray-400 mb-6">
          You’re now logged in to <span className="text-yellow-400">Growfinitys Dashboard</span>.
        </p>

        {/* ✅ Last Updated Time */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-yellow-400">Daily Trading Signals</h2>
          <p className="text-gray-400 text-sm">
            Last Updated: {lastUpdated || "Loading..."}
          </p>
        </div>

        {/* ✅ Signals Table */}
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
                  <td className={`p-2 font-semibold ${s.action === "BUY" ? "text-green-400" : "text-red-400"}`}>
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
