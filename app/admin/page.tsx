import { requireAdmin } from "@/lib/auth";

export default async function AdminPage() {
  await requireAdmin();

  return (
    <main className="min-h-screen bg-black text-zinc-100 px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-[#d4af37]">Admin Console</h1>
        <p className="mt-2 text-zinc-300">Send VIP alerts, review signals, and manage automations.</p>

        <div className="mt-8 flex gap-3">
          <form action="/api/admin/vip-alert" method="post">
            <button className="rounded bg-[#d4af37] px-4 py-2 text-black hover:opacity-90">
              Send VIP Alert (Zapier)
            </button>
          </form>

          <form action="/api/auth/logout" method="post">
            <button className="rounded border border-zinc-700 px-4 py-2 hover:bg-zinc-900">
              Log out
            </button>
          </form>
        </div>

        <a href="/" className="mt-6 block text-zinc-400 hover:text-zinc-200">
          ← Back to Home
        </a>
      </div>
    </main>
  );
}
