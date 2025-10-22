import { NextRequest, NextResponse } from 'next/server';
import { NasioReturnSchema, isValidReturnToken } from '@/lib/nasio';
import { supabaseServer } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = NasioReturnSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  const { plan, email, token } = parsed.data;

  if (!isValidReturnToken(token)) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const supabase = supabaseServer();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 500 });
  }
  const expires = new Date();
  if (plan.endsWith('yearly')) expires.setMonth(expires.getMonth() + 12);
  else expires.setMonth(expires.getMonth() + 1);

  const { data: profile } = await supabase.from('profiles').select('id').eq('email', email).maybeSingle();
  const user_id = profile?.id ?? null;

  if (user_id) {
    await supabase
      .from('subscriptions')
      .upsert({ user_id, plan, status: 'active', expires_at: expires.toISOString() }, { onConflict: 'user_id' });
  }

  return NextResponse.json({ ok: true });
}
