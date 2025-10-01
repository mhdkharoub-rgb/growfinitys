// pages/api/get-signals.js
import { supabase } from "../../lib/supabase"

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  // 🚨 Extra server-side check
  if (!req.cookies["nasio_session"]) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const { data, error } = await supabase
    .from("signals")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  return res.status(200).json({ signals: data })
}
