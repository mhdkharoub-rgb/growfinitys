// components/AdminMembershipPanel.js
import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"

export default function AdminMembershipPanel() {
  const [members, setMembers] = useState([])
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data?.user || null)
    }

    const fetchMembers = async () => {
      const { data, error } = await supabase.from("users").select("*")
      if (!error) setMembers(data || [])
    }

    fetchUser().then(fetchMembers).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      setIsAdmin(true)
    }
  }, [user])

  if (loading) {
    return <p className="text-gray-400">Loading members...</p>
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[200px] text-center text-gray-400">
        <h2 className="text-xl font-semibold text-yellow-500">🚫 Access Denied</h2>
        <p className="mt-2">You do not have permission to view this area.</p>
      </div>
    )
  }

  return (
    <div className="bg-black text-white rounded-xl p-6 border border-yellow-500 shadow-lg mt-6">
      <h2 className="text-2xl font-bold text-yellow-500 mb-4">
        👑 Admin — Manage Members
      </h2>
      {members.length === 0 ? (
        <p className="text-gray-400">No members found.</p>
      ) : (
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-yellow-500 text-black">
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Role</th>
              <th className="py-2 px-4 text-left">Created</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-t border-gray-700 hover:bg-gray-900">
                <td className="py-2 px-4">{m.email}</td>
                <td className="py-2 px-4">{m.role || "member"}</td>
                <td className="py-2 px-4 text-sm text-gray-400">
                  {new Date(m.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
