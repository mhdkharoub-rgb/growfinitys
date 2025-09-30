import { supabase } from "../../lib/supabase"

export default async function handler(req, res) {
  try {
    const { data, error } = await supabase
      .from("signals")
      .select("*")
      .order("date", { ascending: false })

    if (error) {
      console.error("❌ Supabase fetch error:", error)
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json({ signals: data })
  } catch (err) {
    console.error("❌ Error fetching signals:", err)
    return res.status(500).json({ error: "Failed to fetch signals" })
  }
}
