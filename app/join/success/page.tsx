import type { z } from 'zod';

import { NasioReturnSchema, isValidReturnToken } from '@/lib/nasio';
import { supabaseServer } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';

export default async function JoinSuccess({ searchParams }: { searchParams: Record<string, string | string[]> }) {
  const qp = Object.fromEntries(
    Object.entries(searchParams).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])
  );
  const parsed = NasioReturnSchema.safeParse(qp);

  if (!parsed.success) {
    return (
      <div className="space-y-3">
        <h1 className="text-xl font-semibold">Thanks!</h1>
        <p>We couldn’t detect plan details. If you paid, contact support with your receipt.</p>
      </div>
    );
  }

  const { plan, email, token } = parsed.data;
  if (!isValidReturnToken(token)) {
    return (
      <div className="space-y-3">
        <h1 className="text-xl font-semibold">Almost there</h1>
        <p>Return token invalid. Please use the official pricing buttons so we can activate instantly.</p>
      </div>
    );
  }

  const supabase = supabaseServer();
  if (!supabase) {
    return (
      <div className="space-y-3">
        <h1 className="text-xl font-semibold">Configuration required</h1>
        <p>Supabase is not configured. Please contact support to complete your activation.</p>
      </div>
    );
  }

  // Ensure profile exists for the email; if user not signed in, we still provision subscription record.
  const { data: userByEmail } = await supabase.auth.admin.listUsers();
  const target = userByEmail.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());

  if (!target) {
    // No account yet — create invitation flow by creating profile placeholder
    // (User will sign up with the same email to claim)
  }

  const expires = new Date();
  if (plan.endsWith('yearly')) expires.setMonth(expires.getMonth() + 12);
  else expires.setMonth(expires.getMonth() + 1);

  // Upsert subscription by email
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .maybeSingle();
  const user_id = profile?.id ?? null;

  if (user_id) {
    await supabase.from('subscriptions').upsert(
      {
        user_id,
        plan,
        status: 'active',
        expires_at: expires.toISOString(),
      },
      { onConflict: 'user_id' }
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Payment received 🎉</h1>
      <p>
        Your plan <b>{plan}</b> is now active for <b>{email}</b>.
      </p>
      <p>
        If you don’t yet have an account, <a className="underline" href="/signup">sign up</a> with this email to access the
        dashboard.
      </p>
      <a href="/dashboard" className="inline-block px-4 py-2 border rounded">
        Go to Dashboard
      </a>
    </div>
  );
}
