// pages/dashboard.js
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { supabase } from "../lib/supabase"

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [membership, setMembership] = useState("Basic")
  const [signals, setSignals] = useState([])
  const [loading, setLoading] = useState(true)

  // Get logged user + membership
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error || !data?.user) {
        router.push("/login")
        return
      }
      setUser(data.user)

      // Fetch membership from 'profiles' table
      const { data: profile } = await supabase
        .from("profiles")
        .select("membership_tier")
        .eq("id", data.user.id)
        .single()

      setMembership(profile?.membership_tier || "Basic")
    }
    fetchUser()
  }, [router])

  // Fetch signals
  useEffect(() => {
    const fetchSignals = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from("signals")
        .select("*")
        .order("date", { ascending: false })

      if (!error && data) {
        let limited = data
        if (membership === "Basic") limited = data.slice(0, 2)
        else if (membership === "Pro") limited = data.slice(0, 8)
        else limited = data // VIP full feed
        setSignals(limited)
      }
      setLoading(false)
    }
    if (membership) fetchSignals()
  }, [membership])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  if (loading) return <p className="text-center mt-20 text-white">Loading dashboard...</p>

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-5xl mx-auto mt-20 bg-gray-900 p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2 text-yellow-400">
          👋 Welcome, {user?.email}
        </h1>
        <p className="text-gray-400 mb-6">
          You’re logged in as a{" "}
          <span className="text-yellow-400 font-semibold">
            {membership} Member
          </span>
          .
        </p>

        {/* Signals Section */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-yellow-400">
            📊 Daily Market Signals
          </h2>
          {signals.length === 0 ? (
            <p className="text-gray-400">No signals available yet.</p>
          ) : (
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="text-yellow-400 border-b border-gray-700">
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Symbol</th>
                  <th className="p-2 text-left">Signal</th>
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
                    <td className="p-2">{s.confidence}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {membership !== "VIP" && (
            <p className="text-gray-400 mt-3 italic">
              Upgrade to <span className="text-yellow-400 font-semibold">VIP</span> for unlimited live feed access.
            </p>
          )}
        </div>

        {/* VIP Features */}
        {membership === "VIP" && (
          <div className="bg-yellow-500/10 border border-yellow-400 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-semibold mb-3 text-yellow-400">
              💎 VIP AI Tools
            </h2>
            <p className="text-gray-300 mb-4">
              Access your AI Content Pack Generator and exclusive reports.
            </p>
            <button
              onClick={() => router.push("/generate")}
              className="bg-yellow-500 text-black font-semibold py-2 px-6 rounded-lg hover:bg-yellow-400 transition"
            >
              🚀 Generate AI Pack
            </button>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleLogout}
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
