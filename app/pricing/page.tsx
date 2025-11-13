export default function Pricing() {
  return (
    <main className="min-h-screen bg-black text-zinc-100 px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-[#d4af37]">Plans</h1>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Plan
            name="Basic"
            price="$29/mo • $290/yr"
            linkM="https://nas.io/growfinitys/zerolink/basic"
            linkY="https://nas.io/growfinitys/zerolink/basic-yearly"
          />
          <Plan
            name="Pro"
            price="$59/mo • $590/yr"
            linkM="https://nas.io/growfinitys/zerolink/pro"
            linkY="https://nas.io/growfinitys/zerolink/pro-yearly"
          />
          <Plan
            name="VIP"
            price="$99/mo • $990/yr"
            linkM="https://nas.io/growfinitys/zerolink/vip"
            linkY="https://nas.io/growfinitys/zerolink/vip-yearly"
          />
        </div>
        <a href="/" className="mt-8 inline-block text-zinc-400 hover:text-zinc-200">
          ← Back to Home
        </a>
      </div>
    </main>
  );
}

function Plan({
  name,
  price,
  linkM,
  linkY,
}: {
  name: string;
  price: string;
  linkM: string;
  linkY: string;
}) {
  return (
    <div className="rounded border border-zinc-800 p-5">
      <h2 className="text-xl font-semibold">{name}</h2>
      <p className="mt-2 text-zinc-400">{price}</p>
      <div className="mt-4 flex gap-2">
        <a className="rounded bg-[#d4af37] px-3 py-2 text-black hover:opacity-90" href={linkM}>
          Join Monthly
        </a>
        <a
          className="rounded border border-[#d4af37] px-3 py-2 hover:bg-[#d4af37] hover:text-black"
          href={linkY}
        >
          Join Yearly
        </a>
      </div>
    </div>
  );
}
