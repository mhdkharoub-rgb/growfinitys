import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/router";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tierFilter, setTierFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        router.push("/login");
        return;
      }
      setUser(data.user);
      const adminEmails = ["mhdkharoub@gmail.com"];
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

  const fetchProfiles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, full_name, membership_tier, created_at")
      .order("created_at", { ascending: false });
    if (error) console.error(error);
    else {
      setProfiles(data);
      setFilteredProfiles(data);
    }
    setLoading(false);
  };

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

  const handleSearch = (value) => {
    setSearchTerm(value);
    const filtered = profiles.filter(
      (p) =>
        p.email.toLowerCase().includes(value.toLowerCase()) ||
        (p.full_name && p.full_name.toLowerCase().includes(value.toLowerCase()))
    );
    setFilteredProfiles(filtered);
  };

  const handleTierFilter = (value) => {
    setTierFilter(value);
    if (value === "All") setFilteredProfiles(profiles);
    else setFilteredProfiles(profiles.filter((p) => p.membership_tier === value));
  };

  const exportToCSV = () => {
    const headers = ["Full Name", "Email", "Membership Tier", "Joined"];
    const rows = filteredProfiles.map((p) => [
      p.full_name || "",
      p.email,
      p.membership_tier,
      new Date(p.created_at).toLocaleDateString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `growfinitys_users_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

        {/* Search + Filter + Export */}
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full md:w-1/2 p-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-yellow-400 outline-none"
          />

          <div className="flex gap-3">
            <select
              value={tierFilter}
              onChange={(e) => handleTierFilter(e.target.value)}
              className="p-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-yellow-400 outline-none"
            >
              <option value="All">All Tiers</option>
              <option value="Basic">Basic</option>
              <option value="Pro">Pro</option>
              <option value="VIP">VIP</option>
            </select>

            <button
              onClick={exportToCSV}
              className="bg-yellow-500 text-black font-semibold px-4 py-2 rounded-lg hover:bg-yellow-400 transition"
            >
              ⬇️ Export CSV
            </button>
          </div>
        </div>

        {loading ? (
          <p>Loading user profiles...</p>
        ) : (
          <div className="overflow-x-auto border border-gray-700 rounded-lg">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="text-yellow-400 border-b border-gray-700">
                  <th className="p-3 text-left">Full Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Tier</th>
                  <th className="p-3 text-left">Joined</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProfiles.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-gray-700 hover:bg-gray-800/50"
                  >
                    <td className="p-3">{p.full_name || "—"}</td>
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
