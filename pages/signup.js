import { useState } from "react"
import AuthLayout from "../components/AuthLayout"

export default function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSignup = async (e) => {
    e.preventDefault()

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (res.ok) {
      alert("✅ Account created successfully! Redirecting...")
      window.location.href = "/dashboard"
    } else {
      const err = await res.json()
      alert(`❌ ${err.error || "Failed to sign up"}`)
    }
  }

  return (
    <AuthLayout title="Join Growfinitys and access AI trading insights">
      <form onSubmit={handleSignup} className="space-y-5">
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-zinc-800 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          required
        />

        <input
          type="password"
          placeholder="Create password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-zinc-800 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          required
        />

        <button
          type="submit"
          className="w-full bg-yellow-500 text-black font-semibold py-2 rounded-md hover:bg-yellow-400 transition"
        >
          Create Account
        </button>
      </form>

      <p className="text-center text-gray-400 mt-4">
        Already have an account?{" "}
        <a href="/login" className="text-yellow-500 hover:underline">
          Sign in
        </a>
      </p>
    </AuthLayout>
  )
}
