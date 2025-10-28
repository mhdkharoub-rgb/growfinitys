import { z } from 'zod';

// If you can append a shared token to your Nas.io redirect links like
// https://growfinitys.vercel.app/join/success?plan=pro&email=...&token=XXXX
// then we verify token === NASIO_RETURN_SECRET
export const NasioReturnSchema = z.object({
  plan: z.enum(['basic', 'basic-yearly', 'pro', 'pro-yearly', 'vip', 'vip-yearly']),
  email: z.string().email(),
  token: z.string().optional(),
});

export function isValidReturnToken(token?: string | null) {
  if (!process.env.NASIO_RETURN_SECRET) return true; // fallback: allow if no secret set
  return token === process.env.NASIO_RETURN_SECRET;
}
