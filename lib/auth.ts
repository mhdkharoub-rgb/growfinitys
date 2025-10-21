import { supabaseServer } from './supabaseServer';


export async function getSession() {
const supabase = supabaseServer();
const { data: { session } } = await supabase.auth.getSession();
return session;
}


export async function requireAdmin() {
const supabase = supabaseServer();
const { data: { user } } = await supabase.auth.getUser();
if (!user) return null;
const { data } = await supabase.from('profiles').select('role,email').eq('id', user.id).single();
if (data?.role === 'admin' || data?.email === process.env.ADMIN_EMAIL) return user;
return null;
}


export async function getActiveSubscription(userId: string) {
const supabase = supabaseServer();
const { data } = await supabase
.from('subscriptions')
.select('*')
.eq('user_id', userId)
.eq('status', 'active')
.gt('expires_at', new Date().toISOString())
.maybeSingle();
return data ?? null;
}
