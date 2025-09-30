// lib/supabase.js
import { createClient } from "@supabase/supabase-js";

// ✅ These values will come from your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create and export the client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
