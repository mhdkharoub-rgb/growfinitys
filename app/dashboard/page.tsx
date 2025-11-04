"use client";

import TopBar from "@/components/TopBar";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black text-[#d4af37]">
      <TopBar />
      <div className="p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Welcome to Growfinitys VIP Dashboard</h2>
        <p>Exclusive AI signals and automation tools will appear here soon.</p>
      </div>
    </div>
  );
}
