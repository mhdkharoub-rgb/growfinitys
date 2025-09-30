// pages/api/test-supabase.js
import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  try {
    // Just try to fetch 1 row from the signals table
    const { data, error } = await supabase
      .from("signals")
      .select("*")
      .limit(1);

    if (error) {
      console.error("❌ Supabase test error:", error);
      return res.status(500).json({ success: false, error: error.message });
    }

    return res.status(200).json({
      success: true,
      message: "✅ Supabase connection is working!",
      sampleRow: data[0] || null,
    });
  } catch (err) {
    console.error("❌ Unexpected error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
