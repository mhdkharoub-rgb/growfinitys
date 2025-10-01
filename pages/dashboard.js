// pages/dashboard.js
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import SignalsTable from "../components/SignalsTable"

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined" && window.Nas?.io) {
      window.Nas.io.isLoggedIn().then((loggedIn) => {
        if (!loggedIn) {
          router.replace("/") // ✅ Redirect immediately if not logged in
        } else {
          setIsAuthenticated(true)
        }
        setIsLoading(false)
      })
    } else {
      setIsLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    if (window.Nas?.io) {
      window.Nas.io.logout()
      router.push("/") // ✅ Redirect to homepage after logout
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading authentication...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // prevent flashing the dashboard before redirect
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">📊 Trading Signals Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

        <p className="text-gray-400 mb-8">
          Welcome back! Use the filters to refine by pair, type, or date.  
          Refresh manually anytime, or let it auto-refresh every 60 seconds.
        </p>

        <SignalsTable />
      </div>
    </div>
  )
}
