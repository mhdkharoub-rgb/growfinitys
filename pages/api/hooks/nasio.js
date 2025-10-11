// pages/api/hooks/nasio.js
import { supabaseAdmin } from "../../../lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const secret = req.headers["x-nasio-secret"];
  if (!secret || secret !== process.env.NASIO_WEBHOOK_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { email, tier } = req.body || {};
    if (!email || !tier) return res.status(400).json({ error: "email & tier required" });

    // Find profile by email
    const { data: profiles, error: e1 } = await supabaseAdmin
      .from("profiles")
      .select("id,email")
      .eq("email", email)
      .limit(1);
    if (e1) return res.status(500).json({ error: e1.message });

    if (!profiles?.length) {
      // Create a minimal profile if user hasn’t signed up in app yet
      const { error: e2 } = await supabaseAdmin.from("profiles").insert([
        { email, full_name: "", membership_tier: tier },
      ]);
      if (e2) return res.status(500).json({ error: e2.message });
      return res.status(200).json({ ok: true, created: true });
    }

    const { error: e3 } = await supabaseAdmin
      .from("profiles")
      .update({ membership_tier: tier })
      .eq("id", profiles[0].id);
    if (e3) return res.status(500).json({ error: e3.message });

    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
}
