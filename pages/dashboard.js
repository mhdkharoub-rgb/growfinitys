// pages/dashboard.js
export default function Dashboard() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-6">Your Free Trial Content Pack</h1>
      <p className="text-gray-300 mb-6">
        Welcome to Growfinitys 🚀 Below is your free sample pack.
      </p>

      <a 
        href="https://drive.google.com/drive/folders/1v5B394mmUshdFyXQ0rjDrVE2PlGpMyLl?usp=drive_link" 
        target="_blank" 
        rel="noreferrer"
        className="btn-gold"
      >
        Download Free Pack
      </a>
    </main>
  );
}
