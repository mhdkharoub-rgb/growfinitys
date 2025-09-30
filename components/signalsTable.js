import { useEffect, useState } from "react"

export default function SignalsTable() {
  const [signals, setSignals] = useState([])
  const [filteredSignals, setFilteredSignals] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [toast, setToast] = useState({ message: "", type: "" })

  // filters with persistence
  const [pairFilter, setPairFilter] = useState("All")
  const [typeFilter, setTypeFilter] = useState("All")
  const [dateFilter, setDateFilter] = useState("All")

  // ✅ Load saved filters from localStorage on first render
  useEffect(() => {
    const savedPair = localStorage.getItem("pairFilter")
    const savedType = localStorage.getItem("typeFilter")
    const savedDate = localStorage.getItem("dateFilter")

    if (savedPair) setPairFilter(savedPair)
    if (savedType) setTypeFilter(savedType)
    if (savedDate) setDateFilter(savedDate)
  }, [])

  // ✅ Save filters whenever they change
  useEffect(() => {
    localStorage.setItem("pairFilter", pairFilter)
    localStorage.setItem("typeFilter", typeFilter)
    localStorage.setItem("dateFilter", dateFilter)
  }, [pairFilter, typeFilter, dateFilter])

  const showToast = (message, type = "success") => {
    setToast({ message, type })
    setTimeout(() => setToast({ message: "", type: "" }), 3000)
  }

  // fetch function
  const fetchSignals = async (manual = false) => {
    setLoading(true)
    try {
      const res = await fetch("/api/get-signals")
      if (!res.ok) throw new Error("Failed to fetch signals")

      const data = await res.json()
      setSignals(data.signals || [])
      setLastUpdated(new Date().toLocaleTimeString())

      if (manual) showToast("✅ Signals updated", "success")
    } catch (err) {
      console.error("Error fetching signals:", err)
      showToast("⚠ Failed to update signals", "error")
    } finally {
      setLoading(false)
    }
  }

  // apply filters
  useEffect(() => {
    let filtered = [...signals]

    if (pairFilter !== "All") {
      filtered = filtered.filter((s) => s.pair === pairFilter)
    }
    if (typeFilter !== "All") {
      filtered = filtered.filter((s) => s.signal === typeFilter)
    }
    if (dateFilter !== "All") {
      const today = new Date()
      filtered = filtered.filter((s) => {
        const d = new Date(s.date)
        if (dateFilter === "Today") {
          return d.toDateString() === today.toDateString()
        }
        if (dateFilter === "This Week") {
          const weekAgo = new Date()
          weekAgo.setDate(today.getDate() - 7)
          return d >= weekAgo && d <= today
        }
        if (dateFilter === "This Month") {
          return (
            d.getMonth() === today.getMonth() &&
            d.getFullYear() === today.getFullYear()
          )
        }
        return true
      })
    }

    setFilteredSignals(filtered)
  }, [signals, pairFilter, typeFilter, dateFilter])

  // auto-refresh every 60s
  useEffect(() => {
    fetchSignals()
    const interval = setInterval(() => fetchSignals(false), 60000)
    return () => clearInterval(interval)
  }, [])

  const clearFilters = () => {
    setPairFilter("All")
    setTypeFilter("All")
    setDateFilter("All")
  }

  return (
    <div className="overflow-x-auto relative">
      {/* ✅ Toast Notification */}
      {toast.message && (
        <div
          className={`fixed top-6 right-6 px-4 py-2 rounded-lg shadow-lg transition-all animate-fade-in 
            ${toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}
        >
          {toast.message}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4 justify-between items-center">
        <div className="flex gap-4">
          <select
            className="bg-gray-800 text-white px-3 py-2 rounded"
            value={pairFilter}
            onChange={(e) => setPairFilter(e.target.value)}
          >
            <option>All</option>
            <option>XAU/USD</option>
            <option>BTC/USD</option>
            <option>ETH/USD</option>
            <option>EUR/USD</option>
            <option>GBP/USD</option>
          </select>

          <select
            className="bg-gray-800 text-white px-3 py-2 rounded"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option>All</option>
            <option>Buy</option>
            <option>Sell</option>
          </select>

          <select
            className="bg-gray-800 text-white px-3 py-2 rounded"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option>All</option>
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>

          {/* ✅ Clear Filters Button */}
          <button
            onClick={clearFilters}
            className="bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-500 transition"
          >
            ❌ Clear
          </button>
        </div>

        <div className="flex items-center gap-4">
          <p className="text-gray-400 text-sm">
            {lastUpdated ? `Last updated: ${lastUpdated}` : "Loading..."}
          </p>
          <button
            onClick={() => fetchSignals(true)}
            className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-400 transition"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <table className="w-full border border-gray-700 rounded-lg">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-4 py-2 text-left">Pair</th>
            <th className="px-4 py-2 text-left">Signal</th>
            <th className="px-4 py-2 text-left">Entry</th>
            <th className="px-4 py-2 text-left">TP</th>
            <th className="px-4 py-2 text-left">SL</th>
            <th className="px-4 py-2 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="px-4 py-6 text-center text-gray-400">
                Loading signals...
              </td>
            </tr>
          ) : filteredSignals.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-4 py-6 text-center text-gray-400">
                No signals found
              </td>
            </tr>
          ) : (
            filteredSignals.map((sig, i) => (
              <tr
                key={i}
                className="border-t border-gray-700 hover:bg-gray-800 transition"
              >
                <td className="px-4 py-2">{sig.pair}</td>
                <td
                  className={`px-4 py-2 font-bold ${
                    sig.signal === "Buy" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {sig.signal}
                </td>
                <td className="px-4 py-2">{sig.entry}</td>
                <td className="px-4 py-2">{sig.tp}</td>
                <td className="px-4 py-2">{sig.sl}</td>
                <td className="px-4 py-2">
                  {new Date(sig.date).toLocaleDateString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
