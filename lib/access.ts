import { createSupabaseServer } from "./supabaseServer";

export async function userHasActiveSubscription(userId: string) {
  const supabase = createSupabaseServer();
  const { data, error } = await supabase
    .from("subscriptions")
    .select("status,current_period_end")
    .eq("user_id", userId)
    .order("current_period_end", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return false;
  if (data.status !== "active") return false;
  if (!data.current_period_end) return false;
  return new Date(data.current_period_end) > new Date();
}
