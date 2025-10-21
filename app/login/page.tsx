'use client';
import { supabaseClient } from '@/lib/supabaseClient';
import { useState } from 'react';


export default function Login() {
const supabase = supabaseClient();
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [msg, setMsg] = useState<string | null>(null);


async function onLogin(e: React.FormEvent) {
e.preventDefault();
const { error } = await supabase.auth.signInWithPassword({ email, password });
setMsg(error ? error.message : 'Logged in!');
if (!error) window.location.href = '/dashboard';
}


return (
<form onSubmit={onLogin} className="max-w-md space-y-3">
<h1 className="text-xl font-semibold">Login</h1>
<input className="w-full border p-2 rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
<input className="w-full border p-2 rounded" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
<button className="px-4 py-2 border rounded">Login</button>
{msg && <div className="text-sm text-gray-600">{msg}</div>}
</form>
);
}
