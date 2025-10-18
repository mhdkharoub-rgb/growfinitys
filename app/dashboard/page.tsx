import { supabaseServer } from "@/lib/supabaseServer";
import SignalList from "@/components/SignalList";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getData() {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { user: null, signals: [] };

  // Find active subscription
  const { data: subs } = await supabase.from("subscriptions").select("*").eq("user_id", user.id).eq("status", "active").limit(1);
  const active = subs?.[0];

  const { data: signals } = await supabase.from("signals").select("*").order("created_at", { ascending: false }).limit(20);
  return { user, active, signals: signals ?? [] };
}

export default async function Dashboard() {
  const { user, active, signals } = await getData();

  if (!user) {
    return <div>Please <Link href="/login" className="underline">log in</Link>.</div>;
  }
  if (!active) {
    return (
      <div>
        <p>You don’t have an active plan yet.</p>
        <div className="mt-2">
          <Link href="/pricing" className="underline">Choose a plan</Link> or if you already purchased, <Link className="underline" href="/join/success">claim access</Link>.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Welcome, {user.email}</h2>
      <p>Your plan: <strong>{active.plan}</strong></p>
      <SignalList signals={signals} />
    </div>
  );
}
