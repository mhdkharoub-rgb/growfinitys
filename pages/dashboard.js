import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { supabase } from "../lib/supabase"

// Lazy load to avoid build-time circular references
const SignalsTable = dynamic(() => import("../components/SignalsTable"), { ssr: false })

export default function Dashboard() {
  const router = useRouter()
  const [signals, setSignals] = useState([])
  const [loading, setLoading] = useState(true)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    const verifyUser = async () => {
      const { data } = await supabase.auth.getSession()
      const user = data?.session?.user
      if (!user) {
        router.push("/login")
      } else {
        await fetchSignals()
      }
      setCheckingAuth(false)
    }
    verifyUser()
  }, [])

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

  if (checkingAuth)
    return (
      <div className="min-h-screen bg-black text-yellow-400 flex items-center justify-center">
        Checking session...
      </div>
    )

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-4 text-yellow-400">
        📊 Market Signals Dashboard
      </h1>
      <p className="mb-6 text-gray-300">
        Exclusive AI-powered trading insights for Growfinitys members.
      </p>

      {loading ? (
        <p>Loading signals...</p>
      ) : (
        <SignalsTable signals={signals} onRefresh={fetchSignals} />
      )}
    </div>
  )
}
