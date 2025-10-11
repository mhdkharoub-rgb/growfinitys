// pages/api/get-signals.js
import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  try {
    const { limit = 50, from } = req.query;
    let q = supabase.from("signals").select("*").order("date", { ascending: false });
    if (from) q = q.gte("date", from);
    const { data, error } = await q.limit(Number(limit));
    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json(data || []);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
}
