// /pages/api/auth/logout.js
import { supabase } from "../../../lib/supabase"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error

    // Clear cookie
    res.setHeader("Set-Cookie", `sb:token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`)

    return res.status(200).json({ success: true, message: "Logged out successfully" })
  } catch (err) {
    console.error("Logout error:", err.message)
    return res.status(500).json({ error: "Failed to logout" })
  }
}
