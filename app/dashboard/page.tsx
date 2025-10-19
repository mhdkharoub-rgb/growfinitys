import { createSupabaseServer } from "@/lib/supabaseServer";
import SignalList from "@/components/SignalList";

export default async function Dashboard() {
  const supabase = createSupabaseServer();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  // Load last 20 signals
  const { data: signals } = await supabase
    .from("signals")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div>
      <h2>Welcome {user?.email}</h2>
      <SignalList signals={signals ?? []} />
    </div>
  );
}
