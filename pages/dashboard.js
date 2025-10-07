// pages/dashboard.js
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { supabase } from "../lib/supabase";
import { verifyAuth } from "../lib/auth";

// Lazy load the SignalsTable to avoid hydration issues
const SignalsTable = dynamic(() => import("../components/SignalsTable"), { ssr: false });

export default function Dashboard({ user }) {
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

  if (!user) {
    if (typeof window !== "undefined") window.location.href = "/login";
    return <p className="text-white text-center mt-20">Redirecting to login...</p>;
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-yellow-400 mb-2">📊 Dashboard</h1>
          <p className="text-gray-300">
            Welcome back, <span className="text-yellow-300">{user.email}</span>
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Membership:{" "}
            <span className="font-semibold text-yellow-500">
              {user.plan || "Basic"} {/* Replace this with Nas.io data later */}
            </span>
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="mt-4 md:mt-0 bg-transparent border border-yellow-500 text-yellow-500 font-semibold py-2 px-6 rounded-lg hover:bg-yellow-500 hover:text-black transition"
        >
          Logout
        </button>
      </div>

      {loading ? (
        <p>Loading signals...</p>
      ) : (
        <SignalsTable signals={signals} onRefresh={fetchSignals} />
      )}
    </div>
  );
}

// ✅ Server-side authentication check
export async function getServerSideProps({ req }) {
  const session = verifyAuth(req);
  return {
    props: {
      user: session || null,
    },
  };
}
