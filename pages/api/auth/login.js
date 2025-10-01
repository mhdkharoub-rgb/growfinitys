// pages/api/auth/login.js
import { supabaseAdmin } from "../../../lib/supabase"
import bcrypt from "bcryptjs"
import { serialize } from "cookie"

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()

  const { email, password } = req.body

  const { data: user, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("email", email)
    .single()

  if (error || !user) {
    return res.status(401).json({ error: "Invalid credentials" })
  }

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    return res.status(401).json({ error: "Invalid credentials" })
  }

  // ✅ Set cookie for session
  res.setHeader(
    "Set-Cookie",
    serialize("session_email", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/"
    })
  )

  return res.status(200).json({ success: true, role: user.role })
}
