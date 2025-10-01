import { supabase } from "../../../lib/supabase"
import bcrypt from "bcryptjs"
import { serialize } from "cookie"

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()

  const { email, password } = req.body

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single()

  if (error || !data) return res.status(401).json({ error: "Invalid credentials" })

  const isValid = await bcrypt.compare(password, data.password)
  if (!isValid) return res.status(401).json({ error: "Invalid credentials" })

  // Create cookie session
  res.setHeader(
    "Set-Cookie",
    serialize("session_email", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
      path: "/"
    })
  )

  return res.status(200).json({ success: true, message: "Logged in", role: data.role })
}
