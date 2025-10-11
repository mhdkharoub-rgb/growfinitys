// pages/api/add-signal.js
import { supabaseAdmin } from "../../lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { symbol, action, entry_price, take_profit, stop_loss, confidence, date } = req.body || {};
    if (!symbol || !action || !entry_price) {
      return res.status(400).json({ error: "symbol, action, entry_price are required" });
    }

    const { error } = await supabaseAdmin.from("signals").insert([
      {
        symbol,
        action,
        entry_price,
        take_profit,
        stop_loss,
        confidence: confidence ? Number(confidence) : null,
        date: date || new Date().toISOString(),
      },
    ]);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: "Server error" });
  }
}
