// pages/dashboard.js
import { useEffect, useState } from "react"
import SignalsTable from "../components/SignalsTable"

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check login status once Nas.io SDK loads
    if (typeof window !== "undefined" && window.Nas?.io) {
      window.Nas.io.isLoggedIn().then((loggedIn) => {
        setIsAuthenticated(loggedIn)
        setIsLoading(false)
      })
    } else {
      setIsLoading(false)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading authentication...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">🔒 Members Only</h2>
        <p className="text-gray-400 mb-6">
          You need to log in with your Nas.io account to access the trading signals.
        </p>
        <button
          onClick={() => window.Nas?.io?.login()}
          className="bg-yellow-500 text-black py-3 px-6 rounded-lg"
        >
          Log in with Nas.io
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-4">📊 Trading Signals Dashboard</h1>
        <p className="text-gray-400 mb-8">
          Welcome back! Use the filters to refine by pair, type, or date.  
          Refresh manually anytime, or let it auto-refresh every 60 seconds.
        </p>

        <SignalsTable />
      </div>
    </div>
  )
}
