// components/Navbar.js
import Link from "next/link"
import { useRouter } from "next/router"
import { supabase } from "../lib/supabase"

export default function Navbar() {
  const router = useRouter()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/login")
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

        {/* Buttons Section */}
        <div className="flex items-center space-x-4">
          {/* Dashboard Button */}
          <Link
            href="/dashboard"
            className="border border-yellow-500 text-yellow-500 font-semibold py-2 px-5 rounded-lg hover:bg-yellow-500 hover:text-black transition"
          >
            Dashboard
          </Link>

          {/* Sign Up Button (your own route) */}
          <Link
            href="/signup"
            className="bg-yellow-500 text-black font-semibold py-2 px-5 rounded-lg hover:bg-yellow-400 transition"
          >
            Sign Up
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="border border-gray-400 text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
