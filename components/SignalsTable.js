// components/SignalsTable.js
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { toast } from "react-hot-toast"

export default function SignalsTable() {
  const [signals, setSignals] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    pair: "",
    signal: "",
    date: "",
  })

  // ✅ Load filters from localStorage on mount
  useEffect(() => {
    const savedFilters = localStorage.getItem("signalFilters")
    if (savedFilters) {
      setFilters(JSON.parse(savedFilters))
    }
  }, [])

  // ✅ Save filters to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("signalFilters", JSON.stringify(filters))
  }, [filters])

  // ✅ Fetch signals from Supabase
  async function fetchSignals() {
    setLoading(true)
    let query = supabase.from("signals").select("*").order("date", { ascending: false })

    if (filters.pair) query = query.eq("pair", filters.pair)
    if (filters.signal) query = query.eq("signal", filters.signal)
    if (filters.date) query = query.eq("date", filters.date)

    const { data, error } = await query
    setLoading(false)

    if (error) {
      console.error(error)
      toast.error("Failed to fetch signals")
    } else {
      setSignals(data)
      toast.success("Signals updated")
    }
  }

  // ✅ Auto refresh every 60s
  useEffect(() => {
    fetchSignals()
    const interval = setInterval(fetchSignals, 60000)
    return () => clearInterval(interval)
  }, [filters])

  // ✅ Clear filters
  function clearFilters() {
    setFilters({ pair: "", signal: "", date: "" })
    toast.success("Filters cleared")
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Filters + Refresh */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Pair (e.g. XAU/USD)"
            value={filters.pair}
            onChange={(e) => setFilters({ ...filters, pair: e.target.value })}
            className="px-3 py-2 rounded bg-gray-800 text-white"
          />
          <select
            value={filters.signal}
            onChange={(e) => setFilters({ ...filters, signal: e.target.value })}
            className="px-3 py-2 rounded bg-gray-800 text-white"
          >
            <option value="">All Signals</option>
            <option value="Buy">Buy</option>
            <option value="Sell">Sell</option>
          </select>
          <input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            className="px-3 py-2 rounded bg-gray-800 text-white"
          />
          <button
            onClick={clearFilters}
            className="bg-red-500 text-white px-3 py-2 rounded"
          >
            Clear
          </button>
        </div>
        <button
          onClick={fetchSignals}
          className="bg-yellow-500 text-black px-4 py-2 rounded"
        >
          🔄 Refresh
        </button>
      </div>

      {/* ✅ Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border border-gray-700 text-white">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-4 py-2 border border-gray-700">Pair</th>
              <th className="px-4 py-2 border border-gray-700">Signal</th>
              <th className="px-4 py-2 border border-gray-700">Entry</th>
              <th className="px-4 py-2 border border-gray-700">TP</th>
              <th className="px-4 py-2 border border-gray-700">SL</th>
              <th className="px-4 py-2 border border-gray-700">Date</th>
            </tr>
          </thead>
          <tbody>
            {signals.map((s, i) => (
              <tr key={i} className="text-center bg-gray-800 hover:bg-gray-700">
                <td className="px-4 py-2 border border-gray-700">{s.pair}</td>
                <td className={`px-4 py-2 border border-gray-700 font-bold ${
                  s.signal === "Buy" ? "text-green-400" : "text-red-400"
                }`}>
                  {s.signal}
                </td>
                <td className="px-4 py-2 border border-gray-700">{s.entry}</td>
                <td className="px-4 py-2 border border-gray-700">{s.tp}</td>
                <td className="px-4 py-2 border border-gray-700">{s.sl}</td>
                <td className="px-4 py-2 border border-gray-700">{s.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Mobile Cards */}
      <div className="md:hidden space-y-4">
        {signals.map((s, i) => (
          <div key={i} className="p-4 bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-xl font-bold">{s.pair}</h3>
            <p className={`font-bold ${
              s.signal === "Buy" ? "text-green-400" : "text-red-400"
            }`}>
              {s.signal}
            </p>
            <p>Entry: {s.entry}</p>
            <p>TP: {s.tp}</p>
            <p>SL: {s.sl}</p>
            <p className="text-sm text-gray-400">Date: {s.date}</p>
          </div>
        ))}
      </div>

      {loading && <p className="text-gray-400 mt-4">Loading...</p>}
    </div>
  )
}
