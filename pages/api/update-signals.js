import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let data = req.body;

    // Case 1: Zapier wraps inside { signals: [...] }
    if (data && data.signals) {
      data = data.signals;
    }

    // Case 2: Zapier wraps inside { data: { signals: [...] } }
    if (data && data.data && data.data.signals) {
      data = data.data.signals;
    }

    // Case 3: Zapier sends stringified JSON
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch (err) {
        return res.status(400).json({ error: "Invalid JSON string" });
      }
    }

    // Case 4: Zapier sends { "signals": "[...]" } (string inside field)
    if (typeof data === "object" && data !== null) {
      for (const key of Object.keys(data)) {
        if (typeof data[key] === "string" && data[key].trim().startsWith("[")) {
          try {
            data = JSON.parse(data[key]);
          } catch (err) {
            return res.status(400).json({ error: "Invalid JSON inside object" });
          }
        }
      }
    }

    // Final validation
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
