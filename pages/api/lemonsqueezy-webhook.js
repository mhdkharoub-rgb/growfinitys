import getRawBody from 'raw-body';
import crypto from 'crypto';

export const config = {
  api: { bodyParser: false },
};

function verifySignature(rawBody, secret, signature) {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(rawBody, 'utf8');
  const digest = hmac.digest('hex');
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const raw = (await getRawBody(req)).toString('utf8');
    const signature = req.headers['x-signature'];
    const secret = process.env.LS_WEBHOOK_SECRET;

    if (!signature || !secret || !verifySignature(raw, secret, signature)) {
      console.error('❌ Invalid Lemon Squeezy signature');
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const payload = JSON.parse(raw);
    const event = payload?.meta?.event_name || payload?.event || 'unknown';

    console.log('🍋 Lemon Squeezy event:', event);

    if (event === 'subscription_created' || event === 'subscription_payment_success') {
      const email =
        payload?.data?.attributes?.user_email ||
        payload?.data?.attributes?.customer_email ||
        payload?.data?.attributes?.email ||
        'unknown';

      console.log('✅ Granting access to:', email);
      // TODO: Add user to your members system, send email, etc.
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return res.status(400).json({ error: 'Invalid payload' });
  }
}
