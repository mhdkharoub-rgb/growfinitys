// pages/api/auth/signup.js
import { supabaseAdmin } from "../../../lib/supabase"
import bcrypt from "bcryptjs"

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()

  const { email, password } = req.body

  try {
    const hashedPassword = await bcrypt.hash(password, 10)

    const { error } = await supabaseAdmin.from("users").insert([
      { email, password: hashedPassword, role: "free" }
    ])

    if (error) return res.status(400).json({ error: error.message })

    return res.status(200).json({ success: true, message: "User registered" })
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" })
  }
}
