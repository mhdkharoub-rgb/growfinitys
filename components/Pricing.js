// components/Pricing.js
export default function Pricing() {
  const tiers = [
    {
      name: "Basic",
      price: "$29/mo",
      btnMonthly: "https://nas.io/growfinitys/zerolink/basic",
      btnYearly: "https://nas.io/growfinitys/zerolink/basic-yearly",
      features: ["Daily summary", "2 signals/day", "Email alerts"],
    },
    {
      name: "Pro",
      price: "$59/mo",
      btnMonthly: "https://nas.io/growfinitys/zerolink/pro",
      btnYearly: "https://nas.io/growfinitys/zerolink/pro-yearly",
      features: ["All Basic", "5–8 signals/day", "Priority alerts"],
      highlight: true,
    },
    {
      name: "VIP",
      price: "$99/mo",
      btnMonthly: "https://nas.io/growfinitys/zerolink/vip",
      btnYearly: "https://nas.io/growfinitys/zerolink/vip-yearly",
      features: ["All Pro", "DM support", "Weekly report"],
    },
  ]

  return (
    <section id="pricing" className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold text-yellow-500 mb-6">Pricing</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {tiers.map((t) => (
          <div
            key={t.name}
            className={`rounded-2xl p-6 border ${
              t.highlight ? "border-yellow-500" : "border-gray-800"
            } bg-gray-900`}
          >
            <h3 className="text-xl font-bold mb-2">{t.name}</h3>
            <p className="text-gray-400 mb-4">{t.price}</p>
            <ul className="text-sm text-gray-300 space-y-2 mb-6">
              {t.features.map((f) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>

            <div className="flex flex-col gap-3">
              <a
                href={t.btnMonthly}
                target="_blank"
                rel="noreferrer"
                className="bg-yellow-500 text-black font-semibold py-2 px-4 rounded-lg text-center hover:bg-yellow-400 transition"
              >
                Join Monthly
              </a>
              <a
                href={t.btnYearly}
                target="_blank"
                rel="noreferrer"
                className="border border-yellow-500 text-yellow-500 font-semibold py-2 px-4 rounded-lg text-center hover:bg-yellow-500 hover:text-black transition"
              >
                Join Yearly
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
