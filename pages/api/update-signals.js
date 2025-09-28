import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const data = req.body; // Zapier will POST JSON with signals
    const filePath = path.join(process.cwd(), "data", "signals.json");

    // Save signals to a JSON file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    return res.status(200).json({ message: "Signals updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to update signals" });
  }
}
