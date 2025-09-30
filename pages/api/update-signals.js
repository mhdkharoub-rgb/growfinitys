// pages/api/update-signals.js
import fs from "fs";
import path from "path";

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

    // Path to signals.json
    const filePath = path.join(process.cwd(), "data", "signals.json");

    // Load existing signals
    let existing = [];
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      existing = raw ? JSON.parse(raw) : [];
    }

    // Append new signals with timestamp
    const newSignals = data.map(sig => ({
      ...sig,
      savedAt: new Date().toISOString()
    }));
    const updated = [...existing, ...newSignals];

    // Save back to file
    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));

    return res.status(200).json({
      success: true,
      message: "Signals stored successfully",
      newSignals,
      totalSignals: updated.length
    });
  } catch (err) {
    console.error("❌ Error updating signals:", err);
    return res.status(500).json({ error: "Failed to update signals" });
  }
}
