import Link from 'next/link';


export default function Home() {
return (
<div className="space-y-6">
<h1 className="text-3xl font-bold">Growfinitys</h1>
<p>Automated trading signals. Pay with Nas.io Zero Links. Access dashboard instantly.</p>
<div className="flex gap-3">
<Link href="/pricing" className="px-4 py-2 border rounded">See Pricing</Link>
<Link href="/dashboard" className="px-4 py-2 border rounded">Go to Dashboard</Link>
</div>
</div>
);
}
