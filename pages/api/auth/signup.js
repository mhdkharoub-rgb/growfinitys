import { supabase } from "../../../lib/supabase"
import bcrypt from "bcryptjs"

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()

  const { email, password } = req.body

  const hashedPassword = await bcrypt.hash(password, 10)

  const { error } = await supabase.from("users").insert([
    { email, password: hashedPassword, role: "free" }
  ])

  if (error) return res.status(400).json({ error: error.message })

  return res.status(200).json({ success: true, message: "User registered" })
}
