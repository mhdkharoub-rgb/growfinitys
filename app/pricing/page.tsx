export default function Pricing() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {[
        { name: "Basic (Monthly)", plan: "basic", url: "https://nas.io/growfinitys/zerolink/basic" },
        { name: "Basic (Yearly)", plan: "basic-yearly", url: "https://nas.io/growfinitys/zerolink/basic-yearly" },
        { name: "Pro (Monthly)", plan: "pro", url: "https://nas.io/growfinitys/zerolink/pro" },
        { name: "Pro (Yearly)", plan: "pro-yearly", url: "https://nas.io/growfinitys/zerolink/pro-yearly" },
        { name: "VIP (Monthly)", plan: "vip", url: "https://nas.io/growfinitys/zerolink/vip" },
        { name: "VIP (Yearly)", plan: "vip-yearly", url: "https://nas.io/growfinitys/zerolink/vip-yearly" },
      ].map((p) => (
        <div key={p.plan} className="border rounded p-4">
          <div className="font-semibold mb-2">{p.name}</div>
          <a className="border rounded px-3 py-1 inline-block"
             href={p.url}
             target="_blank" rel="noreferrer">Buy</a>
          <p className="text-xs text-gray-500 mt-2">
            After purchase, you’ll be redirected back to claim access.
          </p>
        </div>
      ))}
    </div>
  );
}
