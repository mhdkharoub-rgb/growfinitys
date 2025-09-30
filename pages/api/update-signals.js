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

    // ✅ Echo back raw body for debugging
    return res.status(200).json({
      success: true,
      message: "Received signals",
      rawBody: req.body,   // what Zapier actually sent
      normalized: data     // what the API processed
    });

  } catch (err) {
    console.error("❌ Error updating signals:", err);
    return res.status(500).json({ error: "Failed to update signals" });
  }
}
