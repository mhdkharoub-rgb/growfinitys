import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/router";

const NAS_LINKS = {
  monthly: {
    Basic: "https://nas.io/growfinitys/zerolink/basic",
    Pro: "https://nas.io/growfinitys/zerolink/pro",
    VIP: "https://nas.io/growfinitys/zerolink/vip",
  },
  yearly: {
    Basic: "https://nas.io/growfinitys/zerolink/basic-yearly",
    Pro: "https://nas.io/growfinitys/zerolink/pro-yearly",
    VIP: "https://nas.io/growfinitys/zerolink/vip-yearly",
  },
};

function TierBanner({ tier }) {
  const style =
    tier === "VIP"
      ? "bg-yellow-400 text-black"
      : tier === "Pro"
      ? "bg-purple-600 text-white"
      : "bg-gray-800 text-white";

  const desc =
    tier === "VIP"
      ? "You have full live access to all signals."
      : tier === "Pro"
      ? "You get 5–8 high-confidence signals per day."
      : "You get 2 signals per day. Upgrade to unlock more.";

  return (
    <div className={`rounded-xl p-4 mb-6 ${style}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Your Plan: {tier || "Basic"}</h2>
          <p className={tier === "VIP" ? "text-black/80" : "text-white/80"}>{desc}</p>
        </div>
        {/* Upgrade buttons always visible (no harm if VIP clicks) */}
        <div className="flex gap-2">
          <a
            href={NAS_LINKS.monthly[tier || "Basic"]}
            target="_blank"
            rel="noreferrer"
            className={`px-4 py-2 rounded-lg font-semibold ${
              tier === "VIP" ? "bg-black/20" : "bg-black/80 text-white"
            }`}
          >
            {tier === "VIP" ? "Manage (Monthly)" : "Upgrade (Monthly)"}
          </a>
          <a
            href={NAS_LINKS.yearly[tier || "Basic"]}
            target="_blank"
            rel="noreferrer"
            className={`px-4 py-2 rounded-lg font-semibold ${
              tier === "VIP" ? "bg-black/20" : "bg-black/80 text-white"
            }`}
          >
            {tier === "VIP" ? "Manage (Yearly)" : "Upgrade (Yearly)"}
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [signals, setSignals] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch profile + signals + announcements
  const fetchAll = async () => {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      router.push("/login");
      return;
    }

    // profile
    const { data: prof } = await supabase
      .from("profiles")
      .select("id, email, full_name, membership_tier, created_at")
      .eq("id", userData.user.id)
      .single();

    setProfile(prof || { membership_tier: "Basic" });

    // signals (latest first)
    const { data: sigs } = await supabase
      .from("signals")
      .select("*")
      .order("date", { ascending: false })
      .order("created_at", { ascending: false });

    setSignals(sigs || []);

    // announcements (latest 5)
    const { data: anns } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    setAnnouncements(anns || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const limitedSignals = useMemo(() => {
    const tier = (profile?.membership_tier || "Basic").trim();
    if (tier === "VIP") return signals;

    // filter by "today" then limit
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const todays = signals.filter((s) => (s.date || "").startsWith(today));

    if (tier === "Pro") {
      // choose up to 8 (or minimum 5 if fewer exist)
      return todays.slice(0, Math.min(8, todays.length));
    }
    // Basic → 2/day
    return todays.slice(0, Math.min(2, todays.length));
  }, [signals, profile]);

  return (
    <div className="min-h-screen bg-black text-white px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-yellow-400">📊 Growfinitys Dashboard</h1>
        <p className="text-gray-300 mb-6">Live market insights powered by AI.</p>

        {profile && <TierBanner tier={profile?.membership_tier || "Basic"} />}

        {/* Membership summary */}
        {profile && (
          <div className="mb-8 border border-gray-800 rounded-lg p-4">
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-gray-400">Full Name</div>
                <div>{profile.full_name || "—"}</div>
              </div>
              <div>
                <div className="text-gray-400">Email</div>
                <div>{profile.email || "—"}</div>
              </div>
              <div>
                <div className="text-gray-400">Tier</div>
                <div>{profile.membership_tier || "Basic"}</div>
              </div>
              <div>
                <div className="text-gray-400">Joined</div>
                <div>{profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "—"}</div>
              </div>
            </div>
          </div>
        )}

        {/* Signals */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold">Today’s Signals</h2>
          <button
            onClick={fetchAll}
            className="px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p>Loading…</p>
        ) : (
          <div className="overflow-x-auto border border-gray-800 rounded-lg mb-10">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-yellow-400 border-b border-gray-800">
                  <th className="p-3 text-left">Symbol</th>
                  <th className="p-3 text-left">Action</th>
                  <th className="p-3 text-left">Entry</th>
                  <th className="p-3 text-left">TP</th>
                  <th className="p-3 text-left">SL</th>
                  <th className="p-3 text-left">Confidence</th>
                  <th className="p-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {limitedSignals.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-5 text-center text-gray-400">
                      No signals available for today yet.
                    </td>
                  </tr>
                )}
                {limitedSignals.map((s) => (
                  <tr key={s.id} className="border-b border-gray-900">
                    <td className="p-3">{s.symbol}</td>
                    <td className="p-3">{s.action}</td>
                    <td className="p-3">{s.entry_price}</td>
                    <td className="p-3">{s.take_profit}</td>
                    <td className="p-3">{s.stop_loss}</td>
                    <td className="p-3">{s.confidence ? `${s.confidence}%` : "—"}</td>
                    <td className="p-3">{s.date ? new Date(s.date).toLocaleString() : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Announcements */}
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-3">Announcements</h2>
          <div className="space-y-3">
            {announcements.length === 0 && <p className="text-gray-400">No announcements yet.</p>}
            {announcements.map((a) => (
              <div key={a.id} className="border border-gray-800 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">
                  {a.created_at ? new Date(a.created_at).toLocaleString() : ""}
                </div>
                <div className="font-semibold">{a.title || "Announcement"}</div>
                <div className="text-gray-300">{a.body || ""}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
