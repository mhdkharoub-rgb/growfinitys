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

### Dependency install tips
- **Supabase GitHub registry access:**
  1. Generate a GitHub classic token with the `read:packages` scope and store it as `GITHUB_TOKEN` in both your local shell and the Vercel project settings (all environments).
  2. The `.npmrc` in this repo already scopes `@supabase` packages to `https://npm.pkg.github.com` and reads the token automatically via `//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}`. Without this variable, installs will fail with `403 Forbidden`.
  3. After exporting the token locally (for example `export GITHUB_TOKEN=ghp_xxx`), rerun `npm install --legacy-peer-deps` to download `@supabase/ssr` successfully.
- **Registry connectivity issues:** If the sandbox still blocks direct downloads from npm, rerun the install from an unrestricted network, commit the regenerated `package-lock.json`, and redeploy so Vercel can reuse the resolved dependency graph.


## Admin
- Admin email: `mhdkharoub@gmail.com` (set via env `ADMIN_EMAIL`).
- Admin can trigger signal generation manually at `/admin`.


## Emails
- Uses Resend with `RESEND_API_KEY`.


## Notes
- Nas.io Zero Links don’t expose a public webhook; we use redirect-based activation today.


## Zapier automation: Nas.io → Supabase
1. **Trigger:** Nas.io → *Member joined* (or *Payment successful*). Connect your Nas.io account and test; the payload includes the member email and Zero Link URL.
2. **Action:** Supabase → *Find or Create Record* in the `users` table.
   - Match on the `email` column.
   - When creating, populate `email`, `created_at` (Zap meta timestamp), and leave `plan` blank for now.
3. **Action:** Supabase → *Update Record* in the same `users` table using the record ID from step 2.
   - Set `plan` via a Zapier Formatter step that checks the Zero Link URL for `basic`, `pro`, or `vip` and writes the matching value.
   - Set `payment_status` to `paid` and `paid_at` to the Zap meta timestamp.
4. **Optional steps:**
   - SendGrid/Gmail → send a welcome email (e.g., “Welcome to Growfinitys VIP”).
   - Telegram/Discord bot → invite the user to the private channel.
   - Notion/Google Sheets → log the transaction for auditing.
5. **Supabase schema expectations:**

| column | type      | description                             |
| ------ | --------- | --------------------------------------- |
| id     | uuid      | Primary key (default Supabase UUID).    |
| email  | text      | Member email.                           |
| plan   | text      | `basic`, `pro`, or `vip`.                |
| payment_status | text | `paid` or `unpaid`.                 |
| paid_at | timestamp | When the Nas.io payment occurred.     |
| created_at | timestamp | Default `now()` when the row is created. |
| updated_at | timestamp | Automatic trigger/update column.    |

6. **Filters (optional):** Insert a *Filter by Zapier* step if you want individual Zaps per tier (e.g., continue only when the Zero Link contains `/vip`).

With this Zap in place, Nas.io payments will continuously mirror into Supabase so the dashboard can unlock the correct membership tier immediately after login.
