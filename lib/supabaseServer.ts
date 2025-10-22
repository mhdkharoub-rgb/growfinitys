import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

let hasLoggedMissingConfig = false;

function createServerSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    if (!hasLoggedMissingConfig) {
      console.warn('Supabase environment variables are not configured.');
      hasLoggedMissingConfig = true;
    }
    return null;
  }

  const cookieStore = cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch (error) {
          // The cookies store can be read-only in some contexts (e.g. route handlers).
          // Swallow the error because Supabase handles missing setters gracefully.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: '', ...options, maxAge: 0 });
        } catch (error) {
          // Ignore failures for environments where the cookie store is read-only.
        }
      },
    },
  });
}

export function createClient() {
  return createServerSupabaseClient();
}

export const supabaseServer = createServerSupabaseClient;
