export default function Success() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-24 text-center">
      <h1 className="text-3xl font-bold mb-4">Payment Successful ✅</h1>
      <p className="text-white/80">Check your email for access. If you already have an account, go to your dashboard.</p>
      <a className="btn-gold mt-8 inline-block" href="/dashboard">Go to Dashboard</a>
    </main>
  );
}

