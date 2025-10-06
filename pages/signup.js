// pages/signup.js
import { useState } from "react"

export default function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  const handleSignup = async (e) => {
    e.preventDefault()
    setMessage("Creating your account...")

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      setMessage(data.message || data.error)
    } catch {
      setMessage("⚠️ Something went wrong. Try again.")
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-6 text-yellow-500">Create Your Account</h1>
      <form onSubmit={handleSignup} className="w-80 space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-800 text-white focus:outline-none"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-800 text-white focus:outline-none"
          required
        />
        <button
          type="submit"
          className="w-full bg-yellow-500 text-black font-bold py-2 rounded hover:bg-yellow-400 transition"
        >
          Sign Up
        </button>
      </form>
      {message && <p className="mt-4 text-gray-300">{message}</p>}
      <a href="/login" className="mt-4 text-yellow-400 hover:underline">Already have an account?</a>
    </div>
  )
}
