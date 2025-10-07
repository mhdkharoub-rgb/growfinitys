// /pages/login.js
import { useState } from "react"
import { supabase } from "../lib/supabase"
import { useRouter } from "next/router"
import Link from "next/link"

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess("Login successful! Redirecting…")
      setTimeout(() => router.push("/dashboard"), 1500)
    }

    setLoading(false)
  }

  const handleSignupRedirect = () => router.push("/signup")

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white px-6">
      <h1 className="text-4xl font-bold text-yellow-500 mb-6">
        Welcome Back 👋
      </h1>
      <p className="text-gray-400 mb-8">
        Log in to your Growfinitys account to access your AI dashboard.
      </p>

      <form
        onSubmit={handleLogin}
        className="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-sm border border-gray-800"
      >
        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-black border border-gray-700 text-white focus:border-yellow-500 outline-none"
            placeholder="you@example.com"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm text-gray-300 mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-black border border-gray-700 text-white focus:border-yellow-500 outline-none"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm mb-3 text-center">{error}</p>
        )}
        {success && (
          <p className="text-green-400 text-sm mb-3 text-center">{success}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-500 text-black font-semibold py-3 rounded-lg hover:bg-yellow-400 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="mt-6 text-gray-400 text-sm">
        Don’t have an account?{" "}
        <button
          onClick={handleSignupRedirect}
          className="text-yellow-400 hover:underline"
        >
          Sign up
        </button>
      </p>

      <Link
        href="/"
        className="mt-8 text-gray-500 hover:text-yellow-400 transition text-sm"
      >
        ← Back to Home
      </Link>
    </div>
  )
}
