import SignalsTable from "../components/SignalsTable"

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">
        📊 Trading Signals Dashboard
      </h1>
      <p className="text-center text-gray-400 mb-10">
        Live signals for Forex, Gold, Oil, and Crypto.
      </p>
      <SignalsTable />
    </main>
  )
}
