// pages/api/update-signals.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let data = req.body;

    // Wrap single object into array
    if (!Array.isArray(data)) {
      data = [data];
    }

    // ✅ Debug: log the raw body
    console.log("🔎 Raw request body:", JSON.stringify(req.body, null, 2));

    // ✅ Looser validation: only require pair & signal
    if (!data.every(sig => sig.pair && sig.signal)) {
      return res.status(400).json({ error: "Invalid signal format", received: data });
    }

    // At this point, we accept partial data
    console.log("✅ Received signals:", data);

    return res.status(200).json({ success: true, signals: data });
  } catch (err) {
    console.error("❌ Error updating signals:", err);
    return res.status(500).json({ error: "Failed to update signals" });
  }
}
