'use client';
import { createBrowserClient } from '@supabase/ssr';

export function supabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    console.warn('Supabase environment variables are not configured.');
    return null;
  }

  return createBrowserClient(url, anonKey);
}
