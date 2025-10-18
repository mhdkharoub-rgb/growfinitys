"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [signals, setSignals] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const { data: users } = await supabase.from("profiles").select("*");
      const { data: signals } = await supabase.from("signals").select("*");
      setUsers(users || []);
      setSignals(signals || []);
    };
    loadData();
  }, []);

  return (
    <div className="p-8 bg-black text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-yellow-400">Admin Dashboard</h1>

      <section className="mb-6">
        <h2 className="text-xl mb-2">👥 Users</h2>
        <table className="w-full text-left border border-gray-700 rounded-xl">
          <thead>
            <tr>
              <th className="p-2 border-b border-gray-700">Email</th>
              <th className="p-2 border-b border-gray-700">Role</th>
              <th className="p-2 border-b border-gray-700">Plan</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u: any) => (
              <tr key={u.id} className="border-b border-gray-800">
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.role || "user"}</td>
                <td className="p-2">{u.subscription_tier || "none"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="text-xl mb-2">📊 Signals</h2>
        <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
          {JSON.stringify(signals, null, 2)}
        </pre>
      </section>
    </div>
  );
}
