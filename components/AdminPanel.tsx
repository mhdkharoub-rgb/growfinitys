"use client";
import { useEffect, useState } from "react";

export default function AdminPanel() {
  const [users, setUsers] = useState<any[]>([]);
  const [signals, setSignals] = useState<any[]>([]);
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("basic");

  async function refresh() {
    const u = await fetch("/api/signals/list").then(r => r.json()); // returns {signals, users}
    setUsers(u.users ?? []);
    setSignals(u.signals ?? []);
  }

  async function addUser() {
    await fetch("/api/subscription/claim", { method: "POST", body: JSON.stringify({ email, plan }), headers: { "Content-Type": "application/json" }});
    setEmail(""); setPlan("basic");
    await refresh();
  }

  async function gen(period: "hourly"|"daily"|"monthly") {
    await fetch(`/api/signals/generate?secret=${encodeURIComponent(process.env.NEXT_PUBLIC_APP_URL || "")}&period=${period}`, { method: "POST" })
      .catch(() => {}); // In production, call with CRON_SECRET from server (admin page can also POST to a proxy route)
    await refresh();
  }

  useEffect(() => { refresh(); }, []);

  return (
    <div className="space-y-6">
      <div className="border p-4 rounded">
        <h3 className="font-semibold mb-2">Manual actions</h3>
        <div className="flex gap-2">
          <button className="border px-3 py-1 rounded" onClick={() => gen("hourly")}>Generate Hourly</button>
          <button className="border px-3 py-1 rounded" onClick={() => gen("daily")}>Generate Daily</button>
          <button className="border px-3 py-1 rounded" onClick={() => gen("monthly")}>Generate Monthly</button>
        </div>
      </div>

      <div className="border p-4 rounded">
        <h3 className="font-semibold mb-2">Add user manually</h3>
        <div className="flex gap-2">
          <input className="border px-2 py-1 rounded w-72" placeholder="user@email.com" value={email} onChange={e => setEmail(e.target.value)} />
          <select className="border px-2 py-1 rounded" value={plan} onChange={e => setPlan(e.target.value)}>
            <option value="basic">basic</option>
            <option value="basic-yearly">basic-yearly</option>
            <option value="pro">pro</option>
            <option value="pro-yearly">pro-yearly</option>
            <option value="vip">vip</option>
            <option value="vip-yearly">vip-yearly</option>
          </select>
          <button className="border px-3 py-1 rounded" onClick={addUser}>Add</button>
        </div>
      </div>

      <div className="border p-4 rounded">
        <h3 className="font-semibold mb-2">Users</h3>
        <div className="text-sm">
          {users.map(u => (
            <div key={u.email} className="border-b py-2 flex justify-between">
              <div>{u.email} • role: {u.role} • plan: {u.plan ?? "—"} • status: {u.status ?? "—"}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="border p-4 rounded">
        <h3 className="font-semibold mb-2">Signals (latest)</h3>
        <div className="text-sm space-y-2">
          {signals.map((s, i) => (
            <div key={i} className="border rounded p-2">
              <div className="text-xs text-gray-500">{new Date(s.created_at).toLocaleString()} • {s.period}</div>
              <div>{s.summary}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
