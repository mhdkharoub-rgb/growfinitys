// pages/dashboard.js
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { supabase } from "../lib/supabase"

const SignalsTable = dynamic(() => import("../components/SignalsTable"), { ssr: false })

export default function Dashboard() {
  const [signals, setSignals] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  const fetchSignals = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("signals")
        .select("*")
        .order("date", { ascending: false })
      if (error) throw error
      setSignals(data)
    } catch (err) {
      console.error("❌ Error fetching signals:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchUser = async () => {
    const { data } = await supabase.auth.getUser()
    setUser(data?.user)
  }

  useEffect(() => {
    fetchUser()
    fetchSignals()
  }, [])

  if (!user)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <h2 className="text-2xl mb-4">🔒 Please log in to view your dashboard</h2>
        <a
          href="/login"
          className="bg-yellow-500 text-black px-6 py-3 rounded-lg hover:bg-yellow-400 transition"
        >
          Go to Login
        </a>
      </div>
    )

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-4 text-yellow-400">📊 Market Signals Dashboard</h1>
      <p className="mb-6 text-gray-300">Live AI-powered trading signals from Growfinitys.</p>

      {/* Payment Buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        <a href="https://nas.io/growfinitys/zerolink/basic" target="_blank" rel="noreferrer"
          className="bg-yellow-600 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500">
          Upgrade to Basic — $29/mo
        </a>
        <a href="https://nas.io/growfinitys/zerolink/pro" target="_blank" rel="noreferrer"
          className="bg-yellow-600 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500">
          Upgrade to Pro — $59/mo
        </a>
        <a href="https://nas.io/growfinitys/zerolink/vip" target="_blank" rel="noreferrer"
          className="bg-yellow-600 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500">
          Upgrade to VIP — $99/mo
        </a>
      </div>

      {loading ? (
        <p>Loading signals...</p>
      ) : (
        <SignalsTable signals={signals} onRefresh={fetchSignals} />
      )}
    </div>
  )
}
