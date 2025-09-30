import { useEffect, useState } from "react"

export default function SignalsTable() {
  const [signals, setSignals] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)

  // filters
  const [pairFilter, setPairFilter] = useState("")
  const [signalFilter, setSignalFilter] = useState("")
  const [dateFilter, setDateFilter] = useState("")

  useEffect(() => {
    async function fetchSignals() {
      try {
        const res = await fetch("/api/get-signals")
        const data = await res.json()
        setSignals(data.signals || [])
        setLastUpdated(new Date()) // ⏰ update timestamp
      } catch (err) {
        console.error("Error fetching signals:", err)
      } finally {
        setLoading(false)
      }
    }

    // fetch immediately
    fetchSignals()

    // refresh every 60 seconds
    const interval = setInterval(fetchSignals, 60000)

    // cleanup
    return () => clearInterval(interval)
  }, [])

  // quick filter buttons
  const applyQuickFilter = (type) => {
    const today = new Date()
    let startDate

    if (type === "today") {
      setDateFilter(today.toISOString().split("T")[0])
    } else if (type === "week") {
      startDate = new Date(today)
      startDate.setDate(today.getDate() - 7)
      setDateFilter(
        startDate.toISOString().split("T")[0] +
          " - " +
          today.toISOString().split("T")[0]
      )
    } else if (type === "month") {
      startDate = new Date(today)
      startDate.setMonth(today.getMonth() - 1)
      setDateFilter(
        startDate.toISOString().split("T")[0] +
          " - " +
          today.toISOString().split("T")[0]
      )
    } else {
      setDateFilter("")
    }
  }

  // filtering logic
  const filteredSignals = signals.filter((sig) => {
    const sigDate = new Date(sig.date)

    // single date match
    if (dateFilter && !dateFilter.includes(" - ")) {
      if (
        sigDate.toLocaleDateString() !==
        new Date(dateFilter).toLocaleDateString()
      ) {
        return false
      }
    }

    // range match (week / month)
    if (dateFilter.includes(" - ")) {
      const [start, end] = dateFilter.split(" - ")
      const startDate = new Date(start)
      const endDate = new Date(end)
      if (sigDate < startDate || sigDate > endDate) {
        return false
      }
    }

    return (
      (pairFilter ? sig.pair === pairFilter : true) &&
      (signalFilter ? sig.signal === signalFilter : true)
    )
  })

  if (loading) {
    return <p className="text-center text-white">Loading signals...</p>
  }

  return (
    <div className="space-y-6">
      {/* Last Updated */}
      {lastUpdated && (
        <p className="text-center text-gray-400">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 justify-center">
        {/* Pair Filter */}
        <select
          value={pairFilter}
          onChange={(e) => setPairFilter(e.target.value)}
          className="bg-gray-800 text-white px-3 py-2 rounded-lg"
        >
          <option value="">All Pairs</option>
          <option value="XAU/USD">Gold (XAU/USD)</option>
          <option value="WTI/USD">Oil (WTI/USD)</option>
          <option value="BTC/USD">Bitcoin (BTC/USD)</option>
          <option value="ETH/USD">Ethereum (ETH/USD)</option>
          <option value="EUR/USD">EUR/USD</option>
          <option value="GBP/USD">GBP/USD</option>
        </select>

        {/* Signal Type Filter */}
        <select
          value={signalFilter}
          onChange={(e) => setSignalFilter(e.target.value)}
          className="bg-gray-800 text-white px-3 py-2 rounded-lg"
        >
          <option value="">All Signals</option>
          <option value="Buy">Buy</option>
          <option value="Sell">Sell</option>
        </select>

        {/* Date Picker */}
        <input
          type="date"
          value={!dateFilter.includes(" - ") ? dateFilter : ""}
          onChange={(e) => setDateFilter(e.target.value)}
          className="bg-gray-800 text-white px-3 py-2 rounded-lg"
        />
      </div>

      {/* Quick Filters */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => applyQuickFilter("today")}
          className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-400"
        >
          Today
        </button>
        <button
          onClick={() => applyQuickFilter("week")}
          className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-400"
        >
          This Week
        </button>
        <button
          onClick={() => applyQuickFilter("month")}
          className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-400"
        >
          This Month
        </button>
        <button
          onClick={() => applyQuickFilter("all")}
          className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
        >
          Clear
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
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
            {filteredSignals.length === 0 ? (
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
    </div>
  )
}
