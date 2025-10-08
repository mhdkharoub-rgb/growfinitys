// pages/dashboard.js
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { supabase } from "../lib/supabase"

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check the current session
    const getSession = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error || !data?.user) {
        router.replace("/login")
      } else {
        setUser(data.user)
      }
      setLoading(false)
    }

    getSession()

    // Listen for login/logout events to update session in real time
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT") {
          router.replace("/login")
        } else if (event === "SIGNED_IN" && session?.user) {
          setUser(session.user)
        }
      }
    )

    // Cleanup on unmount
    return () => {
      listener.subscription.unsubscribe()
    }
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading your dashboard...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold text-yellow-400 mb-4">
        👋 Welcome, {user.email}
      </h1>

      <p className="text-gray-300 mb-6">
        You’re now signed in. This dashboard is connected to Supabase.
      </p>

      <div className="bg-zinc-900 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-yellow-400 mb-3">
          Account Information
        </h2>
        <p>Email: {user.email}</p>
        <p>ID: {user.id}</p>
      </div>

      <button
        onClick={async () => {
          await supabase.auth.signOut()
          router.replace("/login")
        }}
        className="mt-8 px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg"
      >
        Logout
      </button>
    </div>
  )
}
