import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { reportUrl } = req.body; // Zapier posts the Drive/Notion link
    const filePath = path.join(process.cwd(), "data", "report.json");

    fs.writeFileSync(filePath, JSON.stringify({ reportUrl }, null, 2));

    return res.status(200).json({ message: "Report link updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to update report" });
  }
}
