export default function Dashboard() {
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
    <div className="min-h-screen bg-black text-white px-6 py-16">
      <h1 className="text-3xl font-bold mb-4">📊 Growfinitys Trading Dashboard</h1>
      <p className="mb-6">Here you’ll find today’s signals & reports.</p>

      <div className="bg-gray-800 p-6 rounded-lg mb-6">
        <h2 className="text-2xl mb-2">Signal Example</h2>
        <p>Pair: XAU/USD (Gold)</p>
        <p>Entry: 1940 | Stop Loss: 1935 | Take Profit: 1950</p>
        <p className="text-gray-400 mt-2">Analysis: Gold bouncing off support zone, bullish momentum building.</p>
      </div>

      <a
        href="https://drive.google.com/your-shared-report"
        target="_blank"
        rel="noreferrer"
        className="bg-yellow-500 text-black py-3 px-6 rounded-lg font-bold"
      >
        📥 Download Weekly Report
      </a>
    </div>
  )
}
