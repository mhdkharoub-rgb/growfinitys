// pages/api/update-signals.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let data = req.body;

    // ✅ If Zapier sends a single object, wrap it in an array
    if (!Array.isArray(data)) {
      data = [data];
    }

    // Validate signals
    if (!data.every(sig => sig.pair && sig.signal && sig.entry && sig.tp && sig.sl && sig.date)) {
      return res.status(400).json({ error: "Invalid signal format" });
    }

    // Here you can save signals to your DB, Google Sheets, etc.
    // For now just log them
    console.log("✅ Received signals:", data);

    return res.status(200).json({ success: true, signals: data });
  } catch (err) {
    console.error("❌ Error updating signals:", err);
    return res.status(500).json({ error: "Failed to update signals" });
  }
}
