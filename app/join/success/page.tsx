import type { z } from 'zod';

import { NasioReturnSchema, isValidReturnToken } from '@/lib/nasio';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';

type SearchParams = Record<string, string | string[] | undefined>;
type NasioReturn = z.infer<typeof NasioReturnSchema>;

const PLAN_LABELS: Record<NasioReturn['plan'], string> = {
  basic: 'Basic (monthly)',
  'basic-yearly': 'Basic (yearly)',
  pro: 'Pro (monthly)',
  'pro-yearly': 'Pro (yearly)',
  vip: 'VIP (monthly)',
  'vip-yearly': 'VIP (yearly)',
};

function pickFirstValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value.find((entry) => typeof entry === 'string' && entry.trim().length > 0) ?? value[0];
  }

  return value;
}

function normalizeParams(searchParams: SearchParams) {
  const entries: Array<[string, string]> = [];

  for (const [key, rawValue] of Object.entries(searchParams)) {
    const candidate = pickFirstValue(rawValue);
    if (typeof candidate !== 'string') continue;

    const trimmed = candidate.trim();
    if (!trimmed) continue;

    entries.push([key, trimmed]);
  }

  return Object.fromEntries(entries) as Partial<Record<string, string>>;
}

function InvalidPayloadMessage() {
  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Thanks!</h1>
      <p>We couldn’t detect plan details. If you paid, contact support with your receipt.</p>
    </div>
  );
}

function InvalidTokenMessage() {
  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Almost there</h1>
      <p>Return token invalid. Please use the official pricing buttons so we can activate instantly.</p>
    </div>
  );
}

function MissingConfigurationMessage() {
  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Configuration required</h1>
      <p>Supabase is not configured. Please contact support to complete your activation.</p>
    </div>
  );
}

export default async function JoinSuccess({ searchParams }: { searchParams: SearchParams }) {
  const normalized = normalizeParams(searchParams);
  const parsed = NasioReturnSchema.safeParse({
    ...normalized,
    ...(normalized.plan ? { plan: normalized.plan.toLowerCase() } : {}),
  });
  if (!parsed.success) return <InvalidPayloadMessage />;

  const { plan, email, token } = parsed.data;
  if (!isValidReturnToken(token)) return <InvalidTokenMessage />;

  const supabase = createSupabaseServerClient();
  if (!supabase) return <MissingConfigurationMessage />;

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .ilike('email', email.toLowerCase())
    .maybeSingle();

  if (profileError) {
    console.error('Failed to load profile for Nas.io return', profileError);
    return (
      <div className="space-y-3">
        <h1 className="text-xl font-semibold">We hit a snag</h1>
        <p>
          We received your payment but couldn’t look up the account. Please contact support so we can activate your
          subscription manually.
        </p>
      </div>
    );
  }

  const subscriptionExpiresAt = new Date();
  subscriptionExpiresAt.setMonth(
    subscriptionExpiresAt.getMonth() + (plan.endsWith('yearly') ? 12 : 1)
  );

  let activationError: string | null = null;

  if (profile?.id) {
    const { error } = await supabase.from('subscriptions').upsert(
      {
        user_id: profile.id,
        plan,
        status: 'active',
        expires_at: subscriptionExpiresAt.toISOString(),
      },
      { onConflict: 'user_id' }
    );
    if (error) {
      activationError = error.message;
      console.error('Failed to upsert subscription from Nas.io return', error);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Payment received 🎉</h1>
      <p>
        Your plan <b>{PLAN_LABELS[plan] ?? plan}</b> is now associated with <b>{email}</b>.
      </p>
      {profile?.id ? (
        <p>
          {activationError ? (
            <span>
              We couldn’t update your subscription automatically ({activationError}). Please reach out to support and we’ll fix
              it straight away.
            </span>
          ) : (
            <span>
              Everything is set! Visit the{' '}
              <a className="underline" href="/dashboard">
                dashboard
              </a>{' '}
              to see your signals.
            </span>
          )}
        </p>
      ) : (
        <p>
          We didn’t find an existing account for this email yet.{' '}
          <a className="underline" href="/signup">
            Sign up
          </a>{' '}
          with {email} and we’ll link the subscription automatically on your first login.
        </p>
      )}
    </div>
  );
}
