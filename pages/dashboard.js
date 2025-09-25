import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Dashboard() {
  const router = useRouter();
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    if (router.query.plan) {
      // Store plan in cookie for 30 days
      document.cookie = `growfinitys_plan=${router.query.plan}; path=/; max-age=2592000`;
      setPlan(router.query.plan);
    } else {
      // Check cookie if already unlocked
      const match = document.cookie.match(/growfinitys_plan=([^;]+)/);
      if (match) setPlan(match[1]);
    }
  }, [router.query]);

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Access Restricted</h1>
          <p>Please sign up or purchase a plan to access this content.</p>
          <a href="/#pricing" className="btn-gold mt-6 inline-block">
            View Plans
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto py-16 px-4">
        <h1 className="text-4xl font-bold mb-6">🎉 Welcome to Growfinitys Dashboard</h1>
        <p className="mb-6">You’re currently on the <strong>{plan.toUpperCase()}</strong> plan.</p>

        {/* Example: Content per plan */}
        {plan === "free" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Free Trial Pack</h2>
            <a
              href="https://drive.google.com/drive/folders/1JGohQ0sC4SigFQ_8SvEUbLW1UDJk-94p?usp=sharing"
              className="btn-gold"
              target="_blank"
              rel="noreferrer"
            >
              📥 Download Free Pack
            </a>
          </div>
        )}

        {plan === "basic" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Basic Monthly Pack</h2>
            <p>✔ 30 posts/month + content calendar</p>
            {/* https://nas.io/growfinitys/zerolink/basic */}
          </div>
        )}

        {plan === "pro" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Pro Monthly Pack</h2>
            <p>✔ 100 posts + blog ideas + ad copies</p>
            {/* https://nas.io/growfinitys/zerolink/pro */}
          </div>
        )}

        {plan === "vip" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">VIP Premium Pack</h2>
            <p>✔ All features + caption generator</p>
            {/* https://nas.io/growfinitys/zerolink/vip */}
          </div>
        )}
      </div>
    </div>
  );
}
