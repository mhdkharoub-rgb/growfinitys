export default function Home() {
  return (
    <main className="min-h-screen bg-black text-zinc-100">
      <section className="mx-auto max-w-5xl px-6 py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-bold">
          Growfinitys — AI Signals & Automation
        </h1>
        <p className="mt-4 text-zinc-300">
          Premium Forex & Crypto signals, automated reporting, and VIP tools.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <a
            href="/pricing"
            className="rounded-md border border-[#d4af37] px-6 py-3 hover:bg-[#d4af37] hover:text-black transition"
          >
            View Plans
          </a>
          <a
            href="/login"
            className="rounded-md bg-[#d4af37] px-6 py-3 text-black hover:opacity-90 transition"
          >
            Login
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-2xl font-semibold text-[#d4af37]">Features</h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          <li className="rounded border border-zinc-800 p-4">AI Signals</li>
          <li className="rounded border border-zinc-800 p-4">Automations</li>
          <li className="rounded border border-zinc-800 p-4">VIP Tools</li>
        </ul>
      </section>
    </main>
  );
}
