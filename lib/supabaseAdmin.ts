import { createClient, SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

let client: SupabaseClient | null = null;

if (!url || !serviceRole) {
  console.warn("[supabaseAdmin] Missing envs NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
} else {
  client = createClient(url, serviceRole, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function getSupabaseAdmin(): SupabaseClient {
  if (!client) {
    throw new Error("supabaseAdmin is not configured. Check Supabase environment variables.");
  }
  return client;
}

export const supabaseAdmin = client as SupabaseClient;
