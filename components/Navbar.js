// components/Navbar.js
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

export default function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState(null)

  // Fetch Supabase user session on mount
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data?.user) setUser(data.user)
    }
    getUser()

    // Subscribe to login/logout changes
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null)
    })

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [])

  // Handle logout
  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push("/login")
  }

  return (
    <nav className="bg-black text-white fixed top-0 left-0 w-full z-50 shadow-md border-b border-yellow-600">
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

        {/* Buttons Section */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {/* Dashboard */}
              <Link
                href="/dashboard"
                className="border border-yellow-500 text-yellow-500 font-semibold py-2 px-5 rounded-lg hover:bg-yellow-500 hover:text-black transition"
              >
                Dashboard
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="bg-yellow-500 text-black font-semibold py-2 px-5 rounded-lg hover:bg-yellow-400 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Login */}
              <Link
                href="/login"
                className="border border-yellow-500 text-yellow-500 font-semibold py-2 px-5 rounded-lg hover:bg-yellow-500 hover:text-black transition"
              >
                Login
              </Link>

              {/* Sign Up */}
              <a
                href="https://nas.io/growfinitys"
                target="_blank"
                rel="noreferrer"
                className="bg-yellow-500 text-black font-semibold py-2 px-5 rounded-lg hover:bg-yellow-400 transition"
              >
                Sign Up
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
