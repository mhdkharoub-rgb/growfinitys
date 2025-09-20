# Growfinitys – 2Checkout Integration

## Setup
1. Create products in 2Checkout (Basic, Pro, VIP).
2. Copy your Merchant ID and Product IDs → put them in `.env.local`.
3. In 2Checkout → Product settings, set Return URL = https://yourdomain.com/checkout/success.
4. In 2Checkout → Integrations → Webhooks, add:
   https://yourdomain.com/api/payment-webhook

## Flow
- User clicks "Choose Plan" → Goes to 2Checkout hosted checkout.
- After payment → Returns to /checkout/success.
- Webhook → Confirms order → You unlock content for them.

