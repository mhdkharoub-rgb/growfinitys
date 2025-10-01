// pages/api/get-signals.js
import { supabase } from "../../lib/supabase"

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" })

  const { data, error } = await supabase
    .from("signals")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) return res.status(500).json({ error: error.message })

  return res.status(200).json({ signals: data })
}
