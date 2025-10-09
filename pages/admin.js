import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/router";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Load user and verify if admin
  useEffect(() => {
    const checkAdmin = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        router.push("/login");
        return;
      }
      setUser(data.user);

      // 🧠 Define admin emails manually for now
      const adminEmails = ["mhdkharoub123@gmail.com"];
      if (!adminEmails.includes(data.user.email)) {
        alert("Access Denied. Admins only.");
        router.push("/dashboard");
        return;
      }
      setIsAdmin(true);
      fetchProfiles();
    };
    checkAdmin();
  }, []);

  // Fetch all profiles
  const fetchProfiles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, membership_tier, created_at")
      .order("created_at", { ascending: false });
    if (error) console.error(error);
    else setProfiles(data);
    setLoading(false);
  };

  // Update user tier
  const updateTier = async (id, newTier) => {
    const { error } = await supabase
      .from("profiles")
      .update({ membership_tier: newTier })
      .eq("id", id);
    if (error) alert("Failed to update tier.");
    else {
      alert(`✅ Updated to ${newTier}`);
      fetchProfiles();
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-yellow-400 mb-4">
          🛠 Admin Panel — Manage Memberships
        </h1>
        <p className="text-gray-400 mb-6">
          Logged in as <span className="text-yellow-400">{user?.email}</span>
        </p>

        {loading ? (
          <p>Loading user profiles...</p>
        ) : (
          <div className="overflow-x-auto border border-gray-700 rounded-lg">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="text-yellow-400 border-b border-gray-700">
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Tier</th>
                  <th className="p-3 text-left">Joined</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-gray-700 hover:bg-gray-800/50"
                  >
                    <td className="p-3">{p.email}</td>
                    <td className="p-3">{p.membership_tier}</td>
                    <td className="p-3">
                      {new Date(p.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => updateTier(p.id, "Basic")}
                        className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
                      >
                        Basic
                      </button>
                      <button
                        onClick={() => updateTier(p.id, "Pro")}
                        className="bg-purple-600 hover:bg-purple-500 px-3 py-1 rounded"
                      >
                        Pro
                      </button>
                      <button
                        onClick={() => updateTier(p.id, "VIP")}
                        className="bg-yellow-400 hover:bg-yellow-300 text-black px-3 py-1 rounded"
                      >
                        VIP
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
