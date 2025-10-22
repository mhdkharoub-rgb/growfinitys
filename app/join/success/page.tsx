import { NasioReturnSchema, isValidReturnToken } from '@/lib/nasio';
import { supabaseServer } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';

type SearchParams = Record<string, string | string[]>;

function normalizeParams(searchParams: SearchParams) {
  return Object.fromEntries(
    Object.entries(searchParams).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value])
  );
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
  const parsed = NasioReturnSchema.safeParse(normalizeParams(searchParams));
  if (!parsed.success) return <InvalidPayloadMessage />;

  const { plan, email, token } = parsed.data;
  if (!isValidReturnToken(token)) return <InvalidTokenMessage />;

  const supabase = supabaseServer();
  if (!supabase) return <MissingConfigurationMessage />;

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
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
        Your plan <b>{plan}</b> is now associated with <b>{email}</b>.
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
