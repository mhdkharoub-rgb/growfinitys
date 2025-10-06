// pages/dashboard.js
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import SignalsTable from "../components/SignalsTable"
import { useRouter } from "next/router"

export default function Dashboard() {
  const [signals, setSignals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  // Fetch signals from Supabase
  async function fetchSignals() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("signals")
        .select("*")
        .order("created_at", { ascending: false })
      if (error) throw error
      setSignals(data || [])
    } catch (err) {
      console.error("Error fetching signals:", err.message)
      setError("Unable to load trading signals. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Optional auth check (placeholder)
    // if (!localStorage.getItem("authUser")) {
    //   router.push("/")
    //   return
    // }

    fetchSignals()
  }, [])

  // UI
  return (
    <main className="bg-black text-white min-h-screen p-6">
      <div className="flex flex-col md:flex-row md:justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-yellow-400 mb-4 md:mb-0">
          📊 Trading Signals Dashboard
        </h1>

        <button
          onClick={fetchSignals}
          className="bg-yellow-500 hover:bg-yellow-400 text-black px-5 py-2 rounded-lg font-semibold transition-all"
        >
          🔄 Refresh Signals
        </button>
      </div>

      {loading && (
        <p className="text-center text-yellow-500 mt-10">Loading signals...</p>
      )}

      {error && (
        <p className="text-center text-red-500 mt-6">{error}</p>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto bg-gray-900 rounded-xl p-4 shadow-lg">
          <SignalsTable signals={signals} />
        </div>
      )}
    </main>
  )
}
