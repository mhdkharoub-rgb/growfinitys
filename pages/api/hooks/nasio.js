// pages/api/hooks/nasio.js
import { supabaseAdmin } from "../../lib/supabase"

export default async function handler(req, res) {
  try {
    const secret = req.headers["x-nasio-secret"]
    if (secret !== process.env.NASIO_WEBHOOK_SECRET) {
      return res.status(401).json({ error: "Invalid secret" })
    }

    const { email, tier } = req.body
    if (!email || !tier) {
      return res.status(400).json({ error: "Missing email or tier" })
    }

    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ membership_tier: tier })
      .eq("email", email)

    if (error) throw error

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error("Nas.io Webhook Error:", err)
    return res.status(500).json({ error: err.message })
  }
}
