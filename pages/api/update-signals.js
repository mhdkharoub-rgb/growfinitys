import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let data = req.body;

    // Handle if Zapier wraps signals inside { signals: [...] }
    if (data.signals) {
      data = data.signals;
    }

    // Handle if data comes as a string (Zapier sometimes does this)
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch (err) {
        return res.status(400).json({ error: "Invalid JSON format" });
      }
    }

    // Validate that data is an array
    if (!Array.isArray(data)) {
      return res.status(400).json({ error: "Signals must be an array" });
    }

    const filePath = path.join(process.cwd(), "data", "signals.json");

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    return res.status(200).json({ message: "Signals updated successfully" });
  } catch (err) {
    console.error("Update failed:", err);
    return res.status(500).json({ error: "Failed to update signals" });
  }
}
