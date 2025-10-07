import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "../lib/supabase"
import { useRouter } from "next/router"

export default function Navbar() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    // Check current auth session
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data.session?.user || null)
    }

    getSession()

    // Listen for login/logout events
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/")
  }

  return (
    <nav className="bg-black text-white fixed top-0 left-0 w-full z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-yellow-500">
          Growfinitys
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-8 text-sm font-semibold">
          <a href="#features" className="hover:text-yellow-400 transition">Features</a>
          <a href="#pricing" className="hover:text-yellow-400 transition">Pricing</a>
          <a href="#how" className="hover:text-yellow-400 transition">How It Works</a>
        </div>

        {/* Dynamic Buttons */}
        <div className="flex items-center space-x-4">
          {!user ? (
            <>
              <Link
                href="/login"
                className="border border-yellow-500 text-yellow-500 font-semibold py-2 px-5 rounded-lg hover:bg-yellow-500 hover:text-black transition"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-yellow-500 text-black font-semibold py-2 px-5 rounded-lg hover:bg-yellow-400 transition"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/dashboard"
                className="border border-yellow-500 text-yellow-500 font-semibold py-2 px-5 rounded-lg hover:bg-yellow-500 hover:text-black transition"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-red-500 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
