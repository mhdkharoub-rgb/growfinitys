// pages/dashboard.js
import SignalsTable from "../components/SignalsTable"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-4">📊 Trading Signals Dashboard</h1>
        <p className="text-gray-400 mb-8">
          Here you’ll find the latest market signals for Forex, Gold, Oil, and Crypto.  
          Use the filters above the table to refine by pair, type, or date.  
          Refresh manually anytime, or let it auto-refresh every 60 seconds.
        </p>

        {/* ✅ Signals Table Component */}
        <SignalsTable />
      </div>
    </div>
  )
}
