import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Growfinitys</h1>
      <p>Automated trading signals for Basic, Pro, and VIP plans.</p>
      <Link href="/pricing" className="inline-block border rounded px-4 py-2">View Pricing</Link>
    </div>
  );
}
