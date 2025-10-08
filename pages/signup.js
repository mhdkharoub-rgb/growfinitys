// pages/signup.js
import { useState } from "react"
import { supabase } from "../lib/supabase"

export default function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleSignup = async (e) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setError("")
    setMessage("")

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/login`,
        },
      })

      if (error) throw error

      setMessage(
        "✅ Account created! Check your inbox for a single verification email."
      )
      setEmail("")
      setPassword("")
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white px-4">
      <div className="bg-zinc-900 p-8 rounded-2xl shadow-2xl max-w-md w-full">
        <h1 className="text-3xl font-bold text-yellow-400 mb-4 text-center">
          Create Your Growfinitys Account
        </h1>
        <p className="text-gray-400 mb-6 text-center">
          Sign up to access your AI business tools
        </p>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-yellow-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Minimum 6 characters"
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-yellow-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-red-500 text-center">{error}</p>}
          {message && <p className="text-green-400 text-center">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 font-semibold rounded-lg transition ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-400 text-black"
            }`}
          >
            {loading ? "Sending email..." : "Sign Up"}
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-yellow-400 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  )
}
