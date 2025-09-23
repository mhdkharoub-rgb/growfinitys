// pages/api/lemonsqueezy-webhook.js
import crypto from "crypto";

export const config = {
  // We need the raw body to verify the signature
  api: { bodyParser: false },
};

// Read raw body without extra deps
async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

function verifySignature(rawBody, secret, signature) {
  if (!secret || !signature) return false;
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(rawBody, "utf8");
  const digest = hmac.digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const raw = await readRawBody(req);
    const signature = req.headers["x-signature"];
    const secret = process.env.LS_WEBHOOK_SECRET;

    // 1) Verify signature
    const valid = verifySignature(raw, secret, signature);
    if (!valid) {
      console.error("❌ Invalid Lemon Squeezy signature");
      return res.status(400).json({ error: "Invalid signature" });
    }

    // 2) Parse JSON
    const payload = JSON.parse(raw);
    const event = payload?.meta?.event_name || payload?.event || "unknown";
    console.log("🍋 Lemon Squeezy event:", event);

    // 3) Handle key events
    if (event === "subscription_created" || event === "subscription_payment_success") {
      const email =
        payload?.data?.attributes?.user_email ||
        payload?.data?.attributes?.customer_email ||
        payload?.data?.attributes?.email ||
        "unknown@unknown";
      // TODO: grant access (e.g., tag member in Memberstack, update DB, send email, etc.)
      console.log("✅ Grant access to:", email);
    }

    // 4) Acknowledge
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(400).json({ error: "Invalid payload" });
  }
}
