import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

// Safe client (anon key) → use for reads
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client (service role key) → use for writes only in API routes
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)
