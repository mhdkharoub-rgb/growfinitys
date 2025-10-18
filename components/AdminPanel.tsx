"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [signals, setSignals] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: users } = await supabase.from("profiles").select("*");
      const { data: signals } = await supabase.from("signals").select("*");
      setUsers(users || []);
      setSignals(signals || []);
    };
    fetchData();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4 text-yellow-400">Admin Dashboard</h1>
      <section>
        <h2 className="text-xl mb-2">Users</h2>
        <table className="w-full text-left text-sm bg-zinc-900 rounded-xl">
          <thead>
            <tr className="border-b border-zinc-700">
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Subscription</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u: any) => (
              <tr key={u.id} className="border-b border-zinc-800">
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.role}</td>
                <td className="p-2">{u.subscription_tier}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mt-6">
        <h2 className="text-xl mb-2">Signals</h2>
        <pre className="bg-black text-gray-300 p-4 rounded-lg overflow-auto max-h-64">
          {JSON.stringify(signals, null, 2)}
        </pre>
      </section>
    </div>
  );
}
