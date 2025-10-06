import bcrypt from "bcryptjs"
import { supabaseAdmin } from "../../../lib/supabase"

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" })

  const { email, password } = req.body

  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required" })

  try {
    // 1️⃣ Check if the email already exists
    const { data: existingUser } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle()

    if (existingUser)
      return res.status(400).json({ error: "Email already registered" })

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // 3️⃣ Insert new user
    const { error } = await supabaseAdmin.from("users").insert([
      {
        email,
        password: hashedPassword,
        role: "member",
        created_at: new Date(),
      },
    ])

    if (error) throw error

    console.log("✅ New user created:", email)

    return res.status(200).json({ success: true, message: "User created" })
  } catch (err) {
    console.error("❌ Signup error:", err)
    return res.status(500).json({ error: "Internal Server Error" })
  }
}
