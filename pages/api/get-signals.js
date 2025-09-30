// pages/api/get-signals.js
import fs from "fs";
import path from "path";

export default function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), "data", "signals.json");

    if (!fs.existsSync(filePath)) {
      return res.status(200).json({ signals: [] });
    }

    const raw = fs.readFileSync(filePath, "utf-8");
    const signals = raw ? JSON.parse(raw) : [];

    return res.status(200).json({ signals });
  } catch (err) {
    console.error("❌ Error reading signals:", err);
    return res.status(500).json({ error: "Failed to load signals" });
  }
}
