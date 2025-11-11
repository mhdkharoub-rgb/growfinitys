import { requireSession } from "@/lib/auth";

export default async function Dashboard() {
  await requireSession();

  return (
    <main className="min-h-screen bg-black text-zinc-100 px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-[#d4af37]">Growfinitys VIP Dashboard</h1>
        <p className="mt-2 text-zinc-300">
          Exclusive AI signals and automation tools will appear here soon.
        </p>
        <div className="mt-8">
          <form action="/api/auth/logout" method="post">
            <button className="rounded border border-zinc-700 px-4 py-2 hover:bg-zinc-900">
              Log out
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
