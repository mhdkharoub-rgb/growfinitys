const BASE = 'https://nas.io/growfinitys/zerolink';
const PLANS = [
{ id: 'basic', name: 'Basic (Monthly)', url: `${BASE}/basic` },
{ id: 'basic-yearly',name: 'Basic (Yearly)', url: `${BASE}/basic-yearly` },
{ id: 'pro', name: 'Pro (Monthly)', url: `${BASE}/pro` },
{ id: 'pro-yearly', name: 'Pro (Yearly)', url: `${BASE}/pro-yearly` },
{ id: 'vip', name: 'VIP (Monthly)', url: `${BASE}/vip` },
{ id: 'vip-yearly', name: 'VIP (Yearly)', url: `${BASE}/vip-yearly` },
];


export default function Pricing() {
const site = process.env.SITE_URL ?? 'https://growfinitys.vercel.app';
const token = process.env.NASIO_RETURN_SECRET ? `&token=${process.env.NASIO_RETURN_SECRET}` : '';


return (
<div className="space-y-6">
<h1 className="text-2xl font-semibold">Choose your plan</h1>
<p>Payments handled by Nas.io Zero Links. You’ll be redirected back to us for instant access.</p>
<div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
{PLANS.map(p => {
const redirect = encodeURIComponent(`${site}/join/success?plan=${p.id}${token}`);
const link = `${p.url}?redirect=${redirect}`;
return (
<a key={p.id} href={link} className="border rounded p-4 hover:bg-gray-50">
<div className="font-medium">{p.name}</div>
<div className="text-sm text-gray-500">Redirects back for access</div>
</a>
);
})}
</div>
</div>
);
}
