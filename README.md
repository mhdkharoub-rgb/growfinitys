## Local
1. Copy `.env.example` to `.env.local` and fill values.
2. `npm i`
3. `npm run dev`

## Deploy
- Push to GitHub → Import into Vercel → Add Env Vars from `.env.local`.
- Set **Vercel Cron Jobs** (Project → Settings → Cron Jobs):
  - Hourly:  `GET  /api/cron/hourly`
  - Daily:   `GET  /api/cron/daily`
  - Monthly: `GET  /api/cron/monthly`
- Add header to each cron: `x-cron-secret: <CRON_SECRET>`

## Nas.io Zero Links (redirect flow)
- In Nas.io → for each Zero Link (Basic, Pro, VIP), set **Redirect URL** after purchase to:
  `https://YOUR-DOMAIN/join/success?plan=<plan-code>`
  - Use one of: `basic`, `basic-yearly`, `pro`, `pro-yearly`, `vip`, `vip-yearly`.

### Flow
1) User clicks a Nas.io pay link from `/pricing`.
2) On success, Nas.io redirects to `/join/success?plan=...`.
3) If the user is logged in, the page calls `POST /api/subscription/claim` and grants access.
4) If not logged in, it asks the user to log in and revisit the URL to claim.

### Admin
- Only `ADMIN_EMAIL` can open `/admin`.
- Admin can:
  - View users + subscription status
  - Add users manually (email + plan)
  - Manually generate signals (hourly/daily/monthly)
