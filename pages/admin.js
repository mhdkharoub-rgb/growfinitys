// pages/admin.js
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/router";

const ADMIN_EMAILS = ["mhdkharoub@gmail.com"];

export default function AdminPage() {
  const router = useRouter();
  const [me, setMe] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tab, setTab] = useState("signals"); // signals | announcements | users | export

  // Users data
  const [profiles, setProfiles] = useState([]);
  // Announcements
  const [announcements, setAnnouncements] = useState([]);
  const [annTitle, setAnnTitle] = useState("");
  const [annBody, setAnnBody] = useState("");
  // New Signal form
  const [sig, setSig] = useState({
    symbol: "XAU/USD",
    action: "Buy",
    entry_price: "",
    take_profit: "",
    stop_loss: "",
    confidence: "",
    date: new Date().toISOString(),
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) return router.push("/login");
      setMe(data.user);
      if (!ADMIN_EMAILS.includes(data.user.email)) {
        alert("Admins only");
        return router.push("/dashboard");
      }
      setIsAdmin(true);
      await Promise.all([fetchProfiles(), fetchAnnouncements()]);
    };
    init();
  }, []);

  const fetchProfiles = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("id, email, full_name, membership_tier, created_at")
      .order("created_at", { ascending: false });
    setProfiles(data || []);
  };

  const fetchAnnouncements = async () => {
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);
    setAnnouncements(data || []);
  };

  const stats = useMemo(() => {
    const total = profiles.length;
    const basic = profiles.filter((p) => p.membership_tier === "Basic").length;
    const pro = profiles.filter((p) => p.membership_tier === "Pro").length;
    const vip = profiles.filter((p) => p.membership_tier === "VIP").length;
    const last7 = profiles.filter((p) => Date.now() - new Date(p.created_at).getTime() < 7 * 864e5).length;
    return { total, basic, pro, vip, last7 };
  }, [profiles]);

  const updateTier = async (id, tier) => {
    await supabase.from("profiles").update({ membership_tier: tier }).eq("id", id);
    await fetchProfiles();
    alert(`Updated tier → ${tier}`);
  };

  const addSignal = async () => {
    setLoading(true);
    try {
      const payload = { ...sig };
      if (!payload.symbol || !payload.action || !payload.entry_price) {
        alert("Symbol, Action, Entry are required");
        setLoading(false);
        return;
      }
      const res = await fetch("/api/add-signal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to add signal");
      alert("✅ Signal added");
      setSig((s) => ({ ...s, entry_price: "", take_profit: "", stop_loss: "", confidence: "" }));
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const addAnnouncement = async () => {
    if (!annTitle.trim()) return alert("Title required");
    const res = await fetch("/api/add-announcement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: annTitle, body: annBody }),
    });
    if (!res.ok) return alert("Failed to post");
    setAnnTitle(""); setAnnBody(""); fetchAnnouncements(); alert("✅ Posted");
  };

  const exportCSV = (rows, name) => {
    if (!rows?.length) return alert("Nothing to export");
    const headers = Object.keys(rows[0]);
    const body = rows.map((r) => headers.map((h) => (r[h] ?? "")).join(",")).join("\n");
    const csv = "data:text/csv;charset=utf-8," + [headers.join(","), body].join("\n");
    const a = document.createElement("a");
    a.href = encodeURI(csv);
    a.download = `${name}_${Date.now()}.csv`;
    document.body.appendChild(a); a.click(); a.remove();
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-yellow-400 mb-1">🛠 Admin Panel</h1>
        <p className="text-gray-400 mb-6">Logged in as {me?.email}</p>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Users", value: stats.total },
            { label: "Basic", value: stats.basic },
            { label: "Pro", value: stats.pro },
            { label: "VIP", value: stats.vip },
          ].map((s) => (
            <div key={s.label} className="border border-gray-800 rounded-lg p-4 bg-gray-900/40">
              <div className="text-gray-400 text-sm">{s.label}</div>
              <div className="text-2xl font-bold">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          {["signals", "announcements", "users", "export"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg border ${
                tab === t ? "border-yellow-400 text-yellow-400" : "border-gray-700 text-gray-300"
              }`}
            >
              {t === "signals" ? "Add Signal" : t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Add Signal */}
        {tab === "signals" && (
          <div className="border border-gray-800 rounded-lg p-4 bg-gray-900/30">
            <div className="grid md:grid-cols-3 gap-4">
              {[
                ["symbol", "Symbol (e.g., XAU/USD)"],
                ["action", "Action (Buy/Sell)"],
                ["entry_price", "Entry Price"],
                ["take_profit", "Take Profit"],
                ["stop_loss", "Stop Loss"],
                ["confidence", "Confidence (%)"],
              ].map(([k, ph]) => (
                <input
                  key={k}
                  value={sig[k]}
                  onChange={(e) => setSig({ ...sig, [k]: e.target.value })}
                  placeholder={ph}
                  className="p-2 rounded bg-gray-800 border border-gray-700 outline-none"
                />
              ))}
              <input
                value={sig.date}
                onChange={(e) => setSig({ ...sig, date: e.target.value })}
                placeholder="ISO Date"
                className="p-2 rounded bg-gray-800 border border-gray-700 outline-none"
              />
            </div>
            <button
              onClick={addSignal}
              disabled={loading}
              className="mt-4 bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg hover:bg-yellow-300"
            >
              {loading ? "Saving…" : "➕ Add Signal"}
            </button>
          </div>
        )}

        {/* Announcements */}
        {tab === "announcements" && (
          <div className="border border-gray-800 rounded-lg p-4 bg-gray-900/30">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                value={annTitle}
                onChange={(e) => setAnnTitle(e.target.value)}
                placeholder="Title"
                className="p-2 rounded bg-gray-800 border border-gray-700 outline-none"
              />
              <textarea
                value={annBody}
                onChange={(e) => setAnnBody(e.target.value)}
                placeholder="Body"
                rows={3}
                className="p-2 rounded bg-gray-800 border border-gray-700 outline-none"
              />
            </div>
            <button
              onClick={addAnnouncement}
              className="mt-4 bg-purple-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-purple-500"
            >
              📣 Post Announcement
            </button>

            <div className="mt-6 space-y-3">
              {announcements.map((a) => (
                <div key={a.id} className="border border-gray-800 rounded p-3">
                  <div className="text-sm text-gray-400">
                    {new Date(a.created_at).toLocaleString()}
                  </div>
                  <div className="font-semibold">{a.title}</div>
                  <div className="text-gray-300">{a.body}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users */}
        {tab === "users" && (
          <div className="overflow-x-auto border border-gray-800 rounded-lg">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-yellow-400 border-b border-gray-800">
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Tier</th>
                  <th className="p-3 text-left">Joined</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((p) => (
                  <tr key={p.id} className="border-b border-gray-900">
                    <td className="p-3">{p.full_name || "—"}</td>
                    <td className="p-3">{p.email}</td>
                    <td className="p-3">{p.membership_tier}</td>
                    <td className="p-3">{new Date(p.created_at).toLocaleDateString()}</td>
                    <td className="p-3 flex gap-2">
                      <button onClick={() => updateTier(p.id, "Basic")} className="px-3 py-1 rounded bg-gray-700">Basic</button>
                      <button onClick={() => updateTier(p.id, "Pro")} className="px-3 py-1 rounded bg-purple-600">Pro</button>
                      <button onClick={() => updateTier(p.id, "VIP")} className="px-3 py-1 rounded bg-yellow-400 text-black">VIP</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Export */}
        {tab === "export" && (
          <div className="border border-gray-800 rounded-lg p-4 bg-gray-900/30">
            <div className="flex gap-3">
              <button
                onClick={() => exportCSV(profiles, "growfinitys_users")}
                className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg hover:bg-yellow-300"
              >
                ⬇️ Export Users CSV
              </button>
              <button
                onClick={async () => {
                  const { data } = await supabase
                    .from("signals")
                    .select("*")
                    .order("date", { ascending: false });
                  exportCSV(data || [], "growfinitys_signals");
                }}
                className="bg-purple-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-purple-500"
              >
                ⬇️ Export Signals CSV
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
