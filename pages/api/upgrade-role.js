// pages/api/upgrade-role.js
import { supabaseAdmin } from "../../lib/supabase"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { email, newRole } = req.body

  if (!email || !newRole) {
    return res.status(400).json({ error: "Missing email or role" })
  }

  // Allowed roles
  const allowedRoles = ["basic", "pro", "vip"]
  if (!allowedRoles.includes(newRole.toLowerCase())) {
    return res.status(400).json({ error: "Invalid role" })
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("users")
      .update({ role: newRole.toLowerCase() })
      .eq("email", email)

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    if (data.length === 0) {
      return res.status(404).json({ error: "User not found" })
    }

    return res.status(200).json({
      success: true,
      message: `User upgraded to ${newRole}`,
      email
    })
  } catch (err) {
    return res.status(500).json({ error: "Server error" })
  }
}
