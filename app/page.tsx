export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center space-y-6">
      <h1 className="text-5xl font-bold text-brand-accent">Growfinitys</h1>
      <p className="text-lg max-w-xl">
        AI-powered Business Content Hub — Automate your marketing, design, and content
        in seconds.
      </p>
      <a
        href="/signup"
        className="px-6 py-3 bg-brand-accent text-brand-dark font-semibold rounded-xl hover:opacity-80 transition"
      >
        Join Now
      </a>
      <footer className="absolute bottom-5 text-sm opacity-70">
        © {new Date().getFullYear()} Growfinitys Inc.
      </footer>
    </main>
  );
}
