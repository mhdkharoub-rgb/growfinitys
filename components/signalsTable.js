import { useEffect, useState } from "react"

export default function SignalsTable() {
  const [signals, setSignals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSignals() {
      try {
        const res = await fetch("/api/get-signals")
        const data = await res.json()
        setSignals(data.signals || [])
      } catch (err) {
        console.error("Error fetching signals:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchSignals()
  }, [])

  if (loading) {
    return <p className="text-center text-white">Loading signals...</p>
  }

  return (
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
          {signals.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-4 py-6 text-center text-gray-400">
                No signals yet
              </td>
            </tr>
          ) : (
            signals.map((sig, i) => (
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
