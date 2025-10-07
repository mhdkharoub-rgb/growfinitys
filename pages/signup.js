// /pages/signup.js
import { useState } from "react"
import { supabase } from "../lib/supabase"
import { useRouter } from "next/router"
import Link from "next/link"

export default function Signup() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSignup = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // Insert into users table
    const { error: insertError } = await supabase
      .from("users")
      .insert([{ email, role: "member" }])

    if (insertError) {
      console.error("Error inserting into users:", insertError.message)
    }

    setSuccess("Signup successful! Redirecting…")
    setTimeout(() => router.push("/dashboard"), 1500)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white px-6">
      <h1 className="text-4xl font-bold text-yellow-500 mb-6">
        Create Your Account ✨
      </h1>
      <p className="text-gray-400 mb-8">
        Join Growfinitys and access premium AI-powered trading insights.
      </p>

      <form
        onSubmit={handleSignup}
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

        <div className="mb-4">
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

        <div className="mb-6">
          <label className="block text-sm text-gray-300 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <p className="mt-6 text-gray-400 text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-yellow-400 hover:underline">
          Log in
        </Link>
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
