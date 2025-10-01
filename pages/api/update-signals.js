// pages/api/update-signals.js
import { supabase } from "../../lib/supabase"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  // 🚨 Check auth
  if (!req.cookies["nasio_session"]) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  try {
    const signals = Array.isArray(req.body) ? req.body : [req.body]
    const { error } = await supabase.from("signals").insert(signals)

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json({
      success: true,
      message: "Signals saved successfully",
      signals,
    })
  } catch (err) {
    return res.status(500).json({ error: "Failed to save signals" })
  }
}
