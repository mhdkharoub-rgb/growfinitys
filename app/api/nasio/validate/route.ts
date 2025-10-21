import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';


export async function GET(req: NextRequest) {
const email = new URL(req.url).searchParams.get('email');
if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 });
const supabase = supabaseServer();
const { data: profile } = await supabase.from('profiles').select('id').eq('email', email).maybeSingle();
if (!profile) return NextResponse.json({ active: false });
const { data: sub } = await supabase
.from('subscriptions')
.select('*')
.eq('user_id', profile.id)
.eq('status','active')
.gt('expires_at', new Date().toISOString())
.maybeSingle();
return NextResponse.json({ active: !!sub, plan: sub?.plan ?? null, expires_at: sub?.expires_at ?? null });
}
