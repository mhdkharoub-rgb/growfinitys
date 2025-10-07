// components/Navbar.js
import Link from "next/link"

export default function Navbar() {
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
  <Link
    href="/dashboard"
    className="border border-yellow-500 text-yellow-500 font-semibold py-2 px-5 rounded-lg hover:bg-yellow-500 hover:text-black transition"
  >
    Dashboard
  </Link>

  <Link
    href="/login"
    className="bg-yellow-500 text-black font-semibold py-2 px-5 rounded-lg hover:bg-yellow-400 transition"
  >
    Login
  </Link>

  <Link
    href="/signup"
    className="bg-transparent border border-yellow-500 text-yellow-500 font-semibold py-2 px-5 rounded-lg hover:bg-yellow-500 hover:text-black transition"
  >
    Sign Up
  </Link>
</div>
<button
  onClick={async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }}
  className="border border-yellow-500 text-yellow-500 font-semibold py-2 px-5 rounded-lg hover:bg-yellow-500 hover:text-black transition"
>
  Logout
</button>

      </div>
    </nav>
  )
}
