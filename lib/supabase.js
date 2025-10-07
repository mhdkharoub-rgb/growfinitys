// lib/supabase.js
import { createClient } from "@supabase/supabase-js"

// --- Client-side (public) Supabase instance ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing Supabase environment variables. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// --- Server-side (admin) Supabase instance ---
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Only create admin client if both are present
export const supabaseAdmin =
  supabaseServiceRoleKey && supabaseUrl
    ? createClient(supabaseUrl, supabaseServiceRoleKey)
    : null
