// components/AdminMembershipPanel.js
import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"

export default function AdminMembershipPanel() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Fetch all members from Supabase
  const fetchMembers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("memberships")
      .select("*")
      .order("created_at", { ascending: false })
    if (error) console.error("❌ Error loading members:", error)
    else setMembers(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  // Handle plan update
  const handlePlanChange = async (email, newPlan) => {
    setSaving(true)
    const { error } = await supabase
      .from("memberships")
      .update({ plan: newPlan })
      .eq("email", email)
    if (error) console.error("❌ Update error:", error)
    await fetchMembers()
    setSaving(false)
  }

  if (loading) return <p>Loading members...</p>

  return (
    <div className="mt-10 bg-gray-900 rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-yellow-400 mb-4">👑 Admin Panel — Manage Memberships</h2>

      <table className="min-w-full border border-gray-700 rounded-lg">
        <thead>
          <tr className="bg-gray-800 text-yellow-400">
            <th className="py-2 px-3 text-left">Email</th>
            <th className="py-2 px-3 text-left">Plan</th>
            <th className="py-2 px-3 text-left">Created At</th>
            <th className="py-2 px-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.email} className="border-t border-gray-700 hover:bg-gray-800 transition">
              <td className="py-2 px-3">{m.email}</td>
              <td className="py-2 px-3">{m.plan}</td>
              <td className="py-2 px-3">{new Date(m.created_at).toLocaleDateString()}</td>
              <td className="py-2 px-3">
                <select
                  className="bg-black text-yellow-400 border border-yellow-500 rounded px-2 py-1"
                  value={m.plan}
                  onChange={(e) => handlePlanChange(m.email, e.target.value)}
                  disabled={saving}
                >
                  <option>Basic</option>
                  <option>Pro</option>
                  <option>VIP</option>
                  <option>Basic-Yearly</option>
                  <option>Pro-Yearly</option>
                  <option>VIP-Yearly</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
