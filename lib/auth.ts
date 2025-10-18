import { createServerClient } from "./supabaseServer";

export const getUser = async () => {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const requireAdmin = async () => {
  const user = await getUser();
  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    throw new Error("Unauthorized");
  }
  return user;
};
