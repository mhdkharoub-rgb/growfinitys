
# Growfinitys – Premium Bold (Next.js)

A ready-to-deploy landing page for Netlify/Vercel in a luxury black + gold theme.

## Quick Start
npm install
npm run dev

Visit http://localhost:3000

## Configure
- Replace `YOUR_DEMO_PACK_LINK` in `pages/index.js` (or wire process.env.DEMO_PACK_LINK).
- Edit pricing/features in `/components` as needed.

## Deploy
### Vercel
- Import this folder in https://vercel.com/new

### Netlify
- New site from Git
- Build: npm run build
- Publish: .next (Netlify Next plugin may auto-detect)

## Automation (Zapier/Make)
- Trigger: Monthly schedule or new member signup.
- Action: Webhook → POST to `/api/generate-pack` with `{ tier, niche }`.
- Store: Google Drive (create folder per member/month).
- Notify: Mailchimp/Email → send download link.
