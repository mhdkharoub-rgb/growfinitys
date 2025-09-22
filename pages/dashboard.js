export default function Dashboard() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-6 text-white">
        Your Free Trial Content Pack
      </h1>

      <p className="text-gray-300 mb-8">
        Welcome to Growfinitys 🚀 Below is your free sample pack.
      </p>

      {/* Button goes to Google Drive file */}
      <a
        href="https://drive.google.com/file/d/1vWnoS3B-khKTV8NMMeBsiiQi-GFKU4mF/view?usp=sharing"
        target="_blank"
        rel="noreferrer"
        className="btn-gold inline-block px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-yellow-500 to-yellow-700 hover:opacity-90 transition"
      >
        Download Free Pack
      </a>
    </main>
  );
}
