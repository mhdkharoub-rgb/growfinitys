import { useEffect, useState } from "react"

export default function Dashboard() {
  const [signals, setSignals] = useState([])
  const [reportUrl, setReportUrl] = useState("")

  useEffect(() => {
    async function fetchData() {
      try {
        const signalsRes = await fetch("/data/signals.json")
        if (signalsRes.ok) {
          const signalsData = await signalsRes.json()
          setSignals(signalsData)
        }

        const reportRes = await fetch("/data/report.json")
        if (reportRes.ok) {
          const reportData = await reportRes.json()
          setReportUrl(reportData.reportUrl)
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-black text-white py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">👋 Welcome back to Growfinitys!</h1>

        {/* Signals */}
        <div className="bg-gray-900 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-bold mb-3">📈 Today’s Market Signals</h2>
          <ul className="list-disc list-inside text-left">
            {signals.length > 0 ? (
              signals.map((s, idx) => (
                <li key={idx}>
                  {s.pair}: <span className={s.signal === "Buy" ? "text-green-400" : "text-red-400"}>
                    {s.signal} at {s.entry} → TP {s.tp} (SL {s.sl})
                  </span>
                </li>
              ))
            ) : (
              <li>No signals yet.</li>
            )}
          </ul>
        </div>

        {/* Weekly Report */}
        <div className="bg-yellow-500 text-black p-6 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-2">📥 Weekly Analysis Report</h2>
          {reportUrl ? (
            <a
              href={reportUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-black hover:bg-gray-900 text-yellow-500 font-bold py-3 px-6 rounded-lg"
            >
              Download Report
            </a>
          ) : (
            <p>No report available yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
