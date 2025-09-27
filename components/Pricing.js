export default function Pricing() {
  return (
    <section id="pricing" className="bg-gray-900 py-16 px-6 text-center">
      <h2 className="text-3xl font-bold mb-8">💰 Membership Plans</h2>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Basic – $29/mo</h3>
          <p>3–5 weekly signals (Forex only)</p>
          <p>Weekly analysis summary</p>
        </div>
        <div className="bg-yellow-500 text-black p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4">Pro – $59/mo</h3>
          <p>Daily Forex + Crypto signals</p>
          <p>Full daily market overview</p>
          <p>Weekly premium reports</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4">VIP – $99/mo</h3>
          <p>All Pro features</p>
          <p>Instant alerts (Telegram/Email)</p>
          <p>Priority support</p>
        </div>
      </div>
    </section>
  )
}
