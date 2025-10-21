# Growfinitys (Nas.io + Supabase + Resend)


## Quick Start
1) Duplicate `.env.example` → `.env.local` and fill values.
2) In Supabase, run `scripts/supabase.sql` in the SQL editor.
3) Deploy to Vercel. Set env vars in Vercel too.
4) In Pricing page buttons, Nas.io Zero Links redirect to `https://growfinitys.vercel.app/join/success?plan=...&token=YOUR_SECRET`.
- If you cannot add `email` from Nas.io, users will sign up with the same email and the admin can confirm.
5) Set Vercel Cron:
- Hourly: `GET /api/cron/hourly`
- Daily: `GET /api/cron/daily`
- Monthly: `GET /api/cron/monthly`


## Admin
- Admin email: `mhdkharoub@gmail.com` (set via env `ADMIN_EMAIL`).
- Admin can trigger signal generation manually at `/admin`.


## Emails
- Uses Resend with `RESEND_API_KEY`.


## Notes
- Nas.io Zero Links don’t expose a public webhook; we use redirect-based activa
