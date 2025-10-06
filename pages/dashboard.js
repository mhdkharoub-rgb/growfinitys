// pages/dashboard.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import SignalsTable from "../components/SignalsTable";

export default function Dashboard() {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSignals = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("signals")
        .select("*")
        .order("date", { ascending: false });
      if (error) throw error;
      setSignals(data);
    } catch (err) {
      console.error("❌ Error fetching signals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignals();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-4 text-yellow-400">
        📊 Market Signals Dashboard
      </h1>
      <p className="mb-6 text-gray-300">
        Live market insights powered by Growfinitys AI.
      </p>

      {loading ? (
        <p>Loading signals...</p>
      ) : (
        <SignalsTable signals={signals} onRefresh={fetchSignals} />
      )}
    </div>
  );
}
