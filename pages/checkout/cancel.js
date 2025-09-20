// pages/checkout/cancel.js
export default function Cancel() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-24 text-center">
      <h1 className="text-3xl font-bold mb-4">Payment Canceled</h1>
      <p className="text-white/80">No worries — you can try again anytime.</p>
      <a className="btn-gold mt-8 inline-block" href="#pricing">Back to Pricing</a>
    </main>
  );
}
