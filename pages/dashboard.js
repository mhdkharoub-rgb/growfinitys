// pages/dashboard.js
import AdminMembershipPanel from "../components/AdminMembershipPanel"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { supabase } from "../lib/supabase"
import { verifyAuth } from "../lib/auth"

// Lazy load SignalsTable
const SignalsTable = dynamic(() => import("../components/SignalsTable"), {
  ssr: false,
})

export default function Dashboard({ user }) {
  const [signals, setSignals] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch market signals from Supabase
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

  useEffect(() => {
    fetchSignals()
  }, [])

  if (!user) {
    if (typeof window !== "undefined") window.location.href = "/login"
    return <p className="text-white text-center mt-20">Redirecting to login...</p>
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.href = "/login"
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-yellow-400 mb-2">
            📊 Market Signals Dashboard
          </h1>
          <p className="text-gray-300">
            Welcome back, <span className="text-yellow-300">{user.email}</span>
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Membership:{" "}
            <span className="font-semibold text-yellow-500">
              {user.plan}
            </span>
          </p>
        </div>

        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <button
            onClick={fetchSignals}
            className="border border-yellow-500 text-yellow-500 font-semibold py-2 px-5 rounded-lg hover:bg-yellow-500 hover:text-black transition"
          >
            🔄 Refresh
          </button>
          <button
            onClick={handleLogout}
            className="bg-yellow-500 text-black font-semibold py-2 px-6 rounded-lg hover:bg-yellow-400 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Table */}
      {loading ? (
        <p>Loading signals...</p>
      ) : (
        <SignalsTable signals={signals} onRefresh={fetchSignals} />
      )}
    {user.email === "youradmin@email.com" && <AdminMembershipPanel />}

        </div>
  )
}

// 🔒 Server-side authentication + membership verification
export async function getServerSideProps({ req }) {
  const session = verifyAuth(req)
  if (!session) {
    return {
      redirect: { destination: "/login", permanent: false },
    }
  }

  // Fetch user's membership plan from Supabase
  const { data, error } = await supabase
    .from("memberships")
    .select("plan")
    .eq("email", session.email)
    .single()

  const membershipPlan = data?.plan || "Basic"

  return {
    props: {
      user: {
        email: session.email,
        plan: membershipPlan,
      },
    },
  }
}
