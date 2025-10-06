// pages/api/auth/login.js
import bcrypt from "bcryptjs"
import cookie from "cookie"
import { supabaseAdmin } from "../../../lib/supabase"

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" })

  const { email, password } = req.body
  try {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("id, email, password")
      .eq("email", email)
      .single()

    if (error || !data) return res.status(401).json({ error: "Invalid credentials" })

    const isValid = await bcrypt.compare(password, data.password)
    if (!isValid) return res.status(401).json({ error: "Invalid password" })

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("user", JSON.stringify({ id: data.id, email: data.email }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      })
    )
    res.status(200).json({ message: "✅ Logged in successfully" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
