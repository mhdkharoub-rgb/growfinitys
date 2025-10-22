export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#030712] to-[#0b132b] text-white flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-5xl md:text-6xl font-bold text-[#00ff95] mb-6 tracking-tight">
        Growfinitys Signals
      </h1>
      <p className="max-w-2xl text-lg opacity-90 mb-10">
        Get instant Forex & Crypto signals from trusted analysts. 
        Real-time alerts, risk management, and verified performance — all in one place.
      </p>

      <div className="flex space-x-4">
        <a
          href="/pricing"
          className="bg-[#00ff95] text-black font-semibold px-8 py-3 rounded-xl hover:opacity-80 transition"
        >
          View Plans
        </a>
        <a
          href="/join"
          className="border border-[#00ff95] text-[#00ff95] px-8 py-3 rounded-xl hover:bg-[#00ff95] hover:text-black transition"
        >
          Join Telegram
        </a>
      </div>

      <div className="mt-20 opacity-60 text-sm">
        © {new Date().getFullYear()} Growfinitys Signals — All Rights Reserved.
      </div>
    </main>
  );
}
