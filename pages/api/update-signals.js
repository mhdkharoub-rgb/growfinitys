import { supabaseAdmin } from "../../lib/supabase"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    let data = req.body

    if (!Array.isArray(data)) {
      data = [data]
    }

    const { error } = await supabaseAdmin.from("signals").insert(data)

    if (error) {
      console.error("❌ Supabase insert error:", error)
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json({
      success: true,
      message: "Signals saved to Supabase",
      signals: data,
    })
  } catch (err) {
    console.error("❌ Error saving signals:", err)
    return res.status(500).json({ error: "Failed to update signals" })
  }
}
