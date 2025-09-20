// pages/checkout/success.js
export default function Success() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-24 text-center">
      <h1 className="text-3xl font-bold mb-4">Payment Successful ✅</h1>
      <p className="text-white/80">Thanks for joining Growfinitys! Check your email for your access details.</p>
      <a className="btn-gold mt-8 inline-block" href="/dashboard">Go to Dashboard</a>
    </main>
  );
}
