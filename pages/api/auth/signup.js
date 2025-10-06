// pages/api/auth/signup.js
import bcrypt from "bcryptjs"
import { supabaseAdmin } from "../../../lib/supabase"

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" })

  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: "Missing credentials" })

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const { data, error } = await supabaseAdmin
      .from("users")
      .insert([{ email, password: hashedPassword }])
      .select()
      .single()

    if (error) throw error
    res.status(200).json({ message: "✅ Account created successfully" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
