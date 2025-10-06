// pages/login.js
import { useState } from "react"
import AuthLayout from "../components/AuthLayout"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    if (res.ok) {
      window.location.href = "/dashboard"
    } else {
      alert("Invalid credentials")
    }
  }

  return (
    <AuthLayout title="Welcome back! Sign in to continue">
      <form onSubmit={handleLogin} className="space-y-5">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-zinc-800 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-zinc-800 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        <button
          type="submit"
          className="w-full bg-yellow-500 text-black font-semibold py-2 rounded-md hover:bg-yellow-400 transition"
        >
          Login
        </button>
      </form>

      <p className="text-center text-gray-400 mt-4">
        Don’t have an account?{" "}
        <a href="/signup" className="text-yellow-500 hover:underline">
          Sign up
        </a>
      </p>
    </AuthLayout>
  )
}
