import { createSupabaseServer } from "./supabaseServer";

export async function getSessionUser() {
  const supabase = createSupabaseServer();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return user ?? null;
}

export async function requireAdmin() {
  const user = await getSessionUser();
  if (!user || user.email !== process.env.ADMIN_EMAIL) return null;
  return user;
}
