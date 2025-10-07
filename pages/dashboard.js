// pages/dashboard.js
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { supabase } from "../lib/supabase";
import { verifyAuth } from "../lib/auth";

const SignalsTable = dynamic(() => import("../components/SignalsTable"), { ssr: false });

export default function Dashboard({ authorized }) {
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

  if (!authorized) {
    if (typeof window !== "undefined") window.location.href = "/login";
    return <p className="text-white text-center mt-20">Redirecting to login...</p>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-4 text-yellow-400">
        📊 Market Signals Dashboard
      </h1>
      <p className="mb-6 text-gray-300">Live market insights powered by Growfinitys AI.</p>
      {loading ? <p>Loading signals...</p> : <SignalsTable signals={signals} onRefresh={fetchSignals} />}
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const user = verifyAuth(req);
  return {
    props: { authorized: !!user },
  };
}
