import { useEffect, useState } from "react"

export default function Dashboard() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  // 🔒 Simple auth check using Nas.io SDK
  if (typeof window !== "undefined" && !window.Nas?.io?.isLoggedIn()) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">🔒 Members Only</h2>
        <button
          onClick={() => window.Nas.io.login()}
          className="bg-yellow-500 text-black py-3 px-6 rounded-lg"
        >
          Log in with Nas.io
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white py-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* 👋 Welcome Message */}
        <h1 className="text-3xl font-bold mb-4">👋 Welcome back to Growfinitys!</h1>
        <p className="text-white/70 mb-6">
          You’re logged in via Nas.io. Here’s today’s market insights and signals:
        </p>

        {/* 📊 Example Signal Section */}
        <div className="bg-gray-900 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-bold mb-3">📈 Today’s Market Signals</h2>
          <ul className="list-disc list-inside text-left">
            <li>Gold (XAU/USD): <span className="text-green-400">Buy at 1925 → TP 1935</span></li>
            <li>EUR/USD: <span className="text-red-400">Sell at 1.0850 → TP 1.0800</span></li>
            <li>Bitcoin (BTC): <span className="text-green-400">Buy at $42,500 → TP $43,200</span></li>
          </ul>
        </div>

        {/* 📥 Download Latest Report */}
        <div className="bg-yellow-500 text-black p-6 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-2">📥 Weekly Analysis Report</h2>
          <p className="mb-4">Get a deeper breakdown of this week’s trends.</p>
          <a
            href="https://drive.google.com/your-weekly-report.pdf"
            target="_blank"
            rel="noreferrer"
            className="bg-black hover:bg-gray-900 text-yellow-500 font-bold py-3 px-6 rounded-lg"
          >
            Download Report
          </a>
        </div>
      </div>
    </div>
  )
}
