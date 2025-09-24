const tiers = [
  {
    name: 'Basic',
    price: '$19/mo',
    variantId: process.env.NEXT_PUBLIC_LS_BASIC_VARIANT_ID,
    features: ['30 captions', '30 images', 'Content calendar'],
  },
  {
    name: 'Pro',
    price: '$49/mo',
    variantId: process.env.NEXT_PUBLIC_LS_PRO_VARIANT_ID,
    popular: true,
    features: ['100 posts', '4 blog ideas', '2 ad copies', 'Calendar + hashtags'],
  },
  {
    name: 'VIP',
    price: '$99/mo',
    variantId: process.env.NEXT_PUBLIC_LS_VIP_VARIANT_ID,
    features: ['100 posts + 10 blog ideas', '5 ad copies', '4 email campaigns', 'Caption Generator tool'],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="max-w-6xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-10 text-white text-center">Choose your plan</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Basic */}
        <div className="card p-6">
          <h3 className="text-xl font-bold text-white">Basic</h3>
          <p className="text-white/70 mt-2">$19 / month</p>
          <ul className="text-white/70 mt-4 space-y-2">
            <li>30 posts/month (captions + images)</li>
            <li>Content calendar</li>
          </ul>
          <a
            href="https://nas.io/growfinitys/zerolink/basic"
            className="btn-gold mt-6 inline-block"
          >
            Get Basic
          </a>
        </div>

        {/* Pro */}
        <div className="card p-6 border border-yellow-600">
          <h3 className="text-xl font-bold text-white">Pro</h3>
          <p className="text-white/70 mt-2">$49 / month</p>
          <ul className="text-white/70 mt-4 space-y-2">
            <li>100 posts/month</li>
            <li>4 blog ideas, 2 ad copies</li>
            <li>Hashtag suggestions</li>
          </ul>
          <a
            href="https://nas.io/growfinitys/zerolink/pro"
            className="btn-gold mt-6 inline-block"
          >
            Get Pro
          </a>
        </div>

        {/* VIP */}
        <div className="card p-6">
          <h3 className="text-xl font-bold text-white">VIP</h3>
          <p className="text-white/70 mt-2">$99 / month</p>
          <ul className="text-white/70 mt-4 space-y-2">
            <li>100 posts + 10 blog ideas</li>
            <li>5 ad copies, 4 email campaigns</li>
            <li>Priority niche support + Caption Generator</li>
          </ul>
          <a
            href="https://nas.io/growfinitys/zerolink/vip"
            className="btn-gold mt-6 inline-block"
          >
            Get VIP
          </a>
        </div>
      </div>

      {/* Free Trial CTA (Nas.io signup) */}
      <div className="text-center mt-10">
        <a
          href="https://nas.io/your-org/signup?plan=FREE_LINK"
          className="btn-gold inline-block"
        >
          Join Free Trial
        </a>
      </div>
    </section>
  );
}
