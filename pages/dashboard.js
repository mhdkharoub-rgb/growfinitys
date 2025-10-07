// pages/dashboard.js
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { supabase } from "../lib/supabase"
import dynamic from "next/dynamic"

// Lazy load table (optional)
const SignalsTable = dynamic(() => import("../components/SignalsTable"), {
  ssr: false,
})

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [signals, setSignals] = useState([])
  const [loading, setLoading] = useState(true)

  // ✅ Check user session on mount
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }
      setUser(user)
    }
    checkUser()
  }, [router])

  // ✅ Fetch signals data
  const fetchSignals = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("signals")
        .select("*")
        .order("date", { ascending: false })
      if (error) throw error
      setSignals(data || [])
    } catch (err) {
      console.error("❌ Error fetching signals:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) fetchSignals()
  }, [user])

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-yellow-400">
          📊 Market Signals Dashboard
        </h1>
        <p className="mb-6 text-gray-300">
          Welcome {user?.email}! Here are your live Growfinitys AI insights.
        </p>

        {loading ? (
          <p>Loading signals...</p>
        ) : signals.length > 0 ? (
          <SignalsTable signals={signals} onRefresh={fetchSignals} />
        ) : (
          <p className="text-gray-500">No signals found yet.</p>
        )}
      </div>
    </div>
  )
}
