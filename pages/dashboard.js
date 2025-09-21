export default function Dashboard() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-6">Your Free Trial Content Pack</h1>
      <p className="text-white/70">
        Welcome to Growfinitys 🚀 Here’s a free sample of the type of content you’ll get
        every month as a member.
      </p>

      <div className="mt-8 card">
        <h2 className="text-xl font-semibold">Free Sample Pack</h2>
        <a
          href="https://drive.google.com/drive/folders/1v5B394mmUshdFyXQ0rjDrVE2PlGpMyLl?usp=drive_link"
          className="btn-gold mt-4 inline-block"
          target="_blank"
          rel="noreferrer"
        >
          Download Free Pack
        </a>
      </div>
    </main>
  );
}
