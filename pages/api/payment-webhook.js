export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const payload = req.body;
  console.log('2CO webhook received:', payload);

  // TODO: Verify signature using TCO_WEBHOOK_SECRET
  // TODO: Grant access (DB update, Memberstack call, email, etc.)

  return res.status(200).json({ ok: true });
}

