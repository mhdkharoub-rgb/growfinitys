import { getSession, getActiveSubscription } from '@/lib/auth';
import SignalList from '@/components/SignalList';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const session = await getSession();
  if (!session)
    return (
      <div className="space-y-3">
        <h1 className="text-xl font-semibold">Please log in</h1>
        <a href="/login" className="px-4 py-2 border rounded inline-block">
          Login
        </a>
      </div>
    );

  const sub = await getActiveSubscription(session.user.id);
  if (!sub)
    return (
      <div className="space-y-3">
        <h1 className="text-xl font-semibold">No active subscription</h1>
        <p>Purchase a plan to access signals.</p>
        <a href="/pricing" className="px-4 py-2 border rounded inline-block">
          See Pricing
        </a>
      </div>
    );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Latest signals</h1>
      <SignalList />
    </div>
  );
}
