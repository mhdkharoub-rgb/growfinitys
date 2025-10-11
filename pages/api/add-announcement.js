// pages/api/add-announcement.js
import { supabaseAdmin } from "../../lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { title, body } = req.body || {};
    if (!title) return res.status(400).json({ error: "title required" });

    const { error } = await supabaseAdmin.from("announcements").insert([{ title, body }]);
    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: "Server error" });
  }
}
