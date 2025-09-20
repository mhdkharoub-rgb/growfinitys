const tiers = [
  { name: 'Basic', price: '$19/mo', pid: process.env.NEXT_PUBLIC_TCO_BASIC_PID, features: ['30 captions','30 images','Content calendar'] },
  { name: 'Pro', price: '$49/mo', pid: process.env.NEXT_PUBLIC_TCO_PRO_PID, popular: true, features: ['100 posts','4 blog ideas','2 ad copies','Calendar + hashtags'] },
  { name: 'VIP', price: '$99/mo', pid: process.env.NEXT_PUBLIC_TCO_VIP_PID, features: ['100 posts + 10 blog ideas','5 ad copies','4 email campaigns','Caption Generator tool'] },
];

export default function Pricing() {
  const merchant = process.env.NEXT_PUBLIC_TCO_MERCHANT;
  const buyUrl = (pid) =>
    `https://secure.2checkout.com/checkout/buy?merchant=${merchant}&PRODUCT_ID=${pid}`;

  return (
    <section id="pricing" className="max-w-6xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-8">Pricing</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {tiers.map((t, i) => (
          <div key={i} className={`card ${t.popular ? 'border-2 border-goldDeep' : ''}`}>
            {t.popular && <div className="badge mb-3">Most Popular</div>}
            <h3 className="text-2xl font-semibold">{t.name}</h3>
            <p className="text-3xl mt-2 bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg,#FFD700,#D4AF37)' }}>{t.price}</p>
            <ul className="mt-4 space-y-2 text-white/80">
              {t.features.map((f, idx) => <li key={idx}>• {f}</li>)}
            </ul>
            <a href={buyUrl(t.pid)} className="btn-gold mt-6 inline-block" target="_blank" rel="noreferrer">
              Choose {t.name}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

