"use client";

import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient | null = null;

function ensureClient(): SupabaseClient {
  if (cachedClient) {
    return cachedClient;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Supabase environment variables are not configured.");
  }

  cachedClient = createBrowserSupabaseClient({
    supabaseUrl: url,
    supabaseKey: anonKey,
  });

  return cachedClient;
}

export function supabaseClient(): SupabaseClient {
  return ensureClient();
}

export const supabase = ensureClient();
