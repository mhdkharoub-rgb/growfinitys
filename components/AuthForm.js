// components/AuthForm.js
import { useState } from "react"

export default function AuthForm({ mode }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Something went wrong")

      if (mode === "signup") {
        setMessage("✅ Signup successful! You can now log in.")
      } else {
        setMessage("✅ Login successful! Redirecting...")
        setTimeout(() => (window.location.href = "/dashboard"), 1000)
      }
    } catch (err) {
      setMessage(`❌ ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-900 text-white p-8 rounded-xl shadow-lg w-full max-w-md mx-auto mt-20">
      <h2 className="text-2xl font-bold mb-6 text-yellow-400 text-center">
        {mode === "signup" ? "Create Your Account" : "Welcome Back"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-2 text-sm">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-yellow-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm">Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-yellow-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2 rounded-lg transition"
        >
          {loading
            ? "Please wait..."
            : mode === "signup"
            ? "Sign Up"
            : "Log In"}
        </button>
      </form>

      {message && (
        <p className="text-center mt-4 text-sm text-yellow-300">{message}</p>
      )}
    </div>
  )
}
