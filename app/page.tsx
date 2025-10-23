export default function Home() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
      {/* Subtle gold gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(212,175,55,0.05)] to-transparent blur-3xl pointer-events-none" />

      <h1 className="text-6xl md:text-7xl font-poppins font-bold text-gold mb-6 tracking-tight drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]">
        Growfinitys Signals
      </h1>

      <p className="text-gray-300 max-w-2xl text-lg md:text-xl mb-10">
        Exclusive <span className="text-gold">Forex</span> & <span className="text-gold">Crypto</span> signals.  
        Accuracy, Speed, and Transparency for serious traders.
      </p>

      <div className="flex flex-wrap gap-4 justify-center">
        <a
          href="/pricing"
          className="bg-gold text-black font-semibold px-8 py-3 rounded-xl hover:bg-goldDark transition"
        >
          View Plans
        </a>
        <a
          href="/join"
          className="border border-gold text-gold px-8 py-3 rounded-xl hover:bg-gold hover:text-black transition"
        >
          Join Now
        </a>
      </div>

      <div className="absolute bottom-10 text-sm text-gray-500">
        © {new Date().getFullYear()} Growfinitys Signals — All Rights Reserved
      </div>
    </main>
  );
}
