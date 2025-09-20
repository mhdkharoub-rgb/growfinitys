# Growfinitys – Lemon Squeezy Integration

## Setup
1. Add your environment variables in `.env.local`:
   - NEXT_PUBLIC_LS_BASIC_VARIANT_ID=1007004
   - NEXT_PUBLIC_LS_PRO_VARIANT_ID=1007007
   - NEXT_PUBLIC_LS_VIP_VARIANT_ID=1007008
   - NEXT_PUBLIC_SUCCESS_URL=https://yourdomain.com/checkout/success
   - NEXT_PUBLIC_CANCEL_URL=https://yourdomain.com/checkout/cancel
   - LS_WEBHOOK_SECRET=Darker1986

2. In Lemon Squeezy Dashboard:
   - Create a store and product with 3 variants (Basic, Pro, VIP).
   - Copy each Variant ID into `.env.local`.
   - Go to Settings → Webhooks → Add endpoint:
     https://yourdomain.com/api/lemonsqueezy-webhook
   - Copy the signing secret → paste into `.env.local`.

3. Deploy your Next.js site (Vercel recommended).

4. Test a subscription in Lemon Squeezy test mode.
