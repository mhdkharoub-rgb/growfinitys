// pages/login.js
import { useState } from "react"
import { useRouter } from "next/router"

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()
    setMessage("Signing you in...")

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (res.ok) router.push("/dashboard")
      else setMessage(data.error)
    } catch {
      setMessage("⚠️ Something went wrong. Try again.")
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-6 text-yellow-500">Welcome Back</h1>
      <form onSubmit={handleLogin} className="w-80 space-y-4">
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
          Log In
        </button>
      </form>
      {message && <p className="mt-4 text-gray-300">{message}</p>}
      <a href="/signup" className="mt-4 text-yellow-400 hover:underline">Create a new account</a>
    </div>
  )
}
