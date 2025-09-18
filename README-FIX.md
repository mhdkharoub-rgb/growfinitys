
# Growfinitys – Fixed Version

This version adds a `jsconfig.json` so that `@/components/...` imports resolve on Vercel.

## Deploy
1. Push to GitHub or upload to Vercel.
2. Framework: Next.js (auto).
3. Build command: npm run build
4. Output: .next

If you still see errors, switch imports in `pages/index.js` to relative paths (../components/...).
