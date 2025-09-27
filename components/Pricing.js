export default function Pricing() {
  return (
    <section id="pricing" className="bg-gray-900 py-16 px-6 text-center">
      <h2 className="text-3xl font-bold mb-8">💰 Membership Plans</h2>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        
        {/* Basic Plan */}
        <div className="bg-gray-800 p-6 rounded-lg flex flex-col items-center">
          <h3 className="text-xl font-bold mb-4">Basic – $29/mo</h3>
          <p className="mb-2">✔ 3–5 weekly signals (Forex only)</p>
          <p className="mb-4">✔ Weekly analysis summary</p>
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg mt-auto"
            onClick={() => window.Nas.io.checkout("<iframe
      title="GROWFINITY checkout widget"
      src="https://nas.io/checkout-widget?communityCode=GROWFINITY&communitySlug=%2Fgrowfinitys&buttonText=Join%20Now&buttonTextColorHex=%23000&buttonBgColorHex=%23fccb1d&widgetTheme=light&backgroundColorHex=%23fff"
      width="100%"
      height="320"
      frameborder="0"
      referrerpolicy="no-referrer"
    ></iframe>")}
          >
            Join Basic
          </button>
        </div>

        {/* Pro Plan */}
        <div className="bg-yellow-500 text-black p-6 rounded-lg shadow-lg flex flex-col items-center">
          <h3 className="text-xl font-bold mb-4">Pro – $59/mo</h3>
          <p className="mb-2">✔ Daily Forex + Crypto signals</p>
          <p className="mb-2">✔ Full daily market overview</p>
          <p className="mb-4">✔ Weekly premium reports</p>
          <button
            className="bg-black hover:bg-gray-900 text-yellow-500 font-bold py-3 px-6 rounded-lg mt-auto"
            onClick={() => window.Nas.io.checkout("https://nas.io/growfinitys/zerolink/pro")}
          >
            Join Pro
          </button>
        </div>

        {/* VIP Plan */}
        <div className="bg-gray-800 p-6 rounded-lg flex flex-col items-center">
          <h3 className="text-xl font-bold mb-4">VIP – $99/mo</h3>
          <p className="mb-2">✔ All Pro features</p>
          <p className="mb-2">✔ Instant alerts (Telegram/Email)</p>
          <p className="mb-4">✔ Priority support</p>
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg mt-auto"
            onClick={() => window.Nas.io.checkout("https://nas.io/growfinitys/zerolink/vip")}
          >
            Join VIP
          </button>
        </div>
      </div>
    </section>
  )
}
