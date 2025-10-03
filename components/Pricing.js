// components/Pricing.js

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-black text-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">
          Membership Plans
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Basic Plan */}
          <div className="bg-gray-900 rounded-xl p-8 shadow-lg text-center border border-yellow-500">
            <h3 className="text-2xl font-semibold mb-4">Basic</h3>
            <p className="text-4xl font-bold mb-6">$29<span className="text-lg">/mo</span></p>
            <ul className="text-gray-300 mb-6 space-y-2">
              <li>Daily Gold, Oil & USD signals</li>
              <li>Basic Crypto Signals</li>
              <li>Email alerts included</li>
            </ul>
            <a
              href="https://nas.io/growfinitys/zerolink/basic"
              target="_blank"
              rel="noreferrer"
              className="bg-yellow-500 text-black font-semibold py-3 px-6 rounded-lg hover:bg-yellow-400 transition"
            >
              Join Basic
            </a>
          </div>

          {/* Pro Plan with "Most Popular" badge */}
          <div className="relative bg-gray-900 rounded-xl p-8 shadow-lg text-center border-2 border-yellow-500 transform scale-105">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black px-4 py-1 rounded-full text-sm font-semibold shadow-md">
              ⭐ Most Popular
            </div>
            <h3 className="text-2xl font-semibold mb-4 mt-4">Pro</h3>
            <p className="text-4xl font-bold mb-6">$59<span className="text-lg">/mo</span></p>
            <ul className="text-gray-300 mb-6 space-y-2">
              <li>All Basic Features +</li>
              <li>Advanced Forex Pairs</li>
              <li>Premium Crypto Signals</li>
              <li>Telegram/Email Alerts</li>
            </ul>
            <a
              href="https://nas.io/growfinitys/zerolink/pro"
              target="_blank"
              rel="noreferrer"
              className="bg-yellow-500 text-black font-semibold py-3 px-6 rounded-lg hover:bg-yellow-400 transition"
            >
              Join Pro
            </a>
          </div>

          {/* VIP Plan */}
          <div className="bg-gray-900 rounded-xl p-8 shadow-lg text-center border border-yellow-500">
            <h3 className="text-2xl font-semibold mb-4">VIP</h3>
            <p className="text-4xl font-bold mb-6">$99<span className="text-lg">/mo</span></p>
            <ul className="text-gray-300 mb-6 space-y-2">
              <li>All Pro Features +</li>
              <li>1-on-1 Strategy Sessions</li>
              <li>Priority Support</li>
              <li>Exclusive Market Insights</li>
            </ul>
            <a
              href="https://nas.io/growfinitys/zerolink/vip"
              target="_blank"
              rel="noreferrer"
              className="bg-yellow-500 text-black font-semibold py-3 px-6 rounded-lg hover:bg-yellow-400 transition"
            >
              Join VIP
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
