export default function Dashboard() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-6">Your Content Packs</h1>
      <p className="text-white/70">Welcome! Your latest downloads are below.</p>

      <div className="mt-8 card">
        <h2 className="text-xl font-semibold">Latest Pack</h2>
        <a href="YOUR_DRIVE_LINK" className="btn-gold mt-4 inline-block">Download</a>
      </div>
    </main>
  );
}
