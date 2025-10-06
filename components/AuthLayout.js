// components/AuthLayout.js
export default function AuthLayout({ children, title }) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-lg p-8 text-white">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-yellow-500">Growfinitys</h1>
          <p className="text-gray-400 mt-2">{title}</p>
        </div>

        {/* Form content (login/signup) */}
        {children}
      </div>
    </div>
  )
}
