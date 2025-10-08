// pages/dashboard.js
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { supabase } from "../lib/supabase"

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const verifySession = async () => {
      const { data, error } = await supabase.auth.getUser()

      if (error || !data?.user) {
        router.push("/login")
      } else {
        setUser(data.user)
      }
      setLoading(false)
    }

    verifySession()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Checking session...</p>
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
        You’ve successfully logged into your Growfinitys dashboard.
      </p>

      <div className="bg-zinc-900 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-yellow-400 mb-3">
          Your Account Summary
        </h2>
        <p>Email: {user.email}</p>
        <p>User ID: {user.id}</p>
      </div>

      <button
        onClick={async () => {
          await supabase.auth.signOut()
          window.location.href = "/login"
        }}
        className="mt-8 px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg"
      >
        Logout
      </button>
    </div>
  )
}
