'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="w-full border-b">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold">
          Growfinitys
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/pricing">Pricing</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/admin">Admin</Link>
          <Link href="/login">Login</Link>
        </div>
      </div>
    </nav>
  );
}
