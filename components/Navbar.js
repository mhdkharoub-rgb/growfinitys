export default function Navbar() {
  return (
    <nav className="bg-black text-white py-4 px-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-yellow-400">Growfinitys</h1>
      <div className="space-x-6">
        <a href="#features" className="hover:text-yellow-400">Features</a>
        <a href="#pricing" className="hover:text-yellow-400">Pricing</a>
        <a href="#example" className="hover:text-yellow-400">Example</a>
        <a href="#how" className="hover:text-yellow-400">How It Works</a>
    <a href="/dashboard" className="hover:text-yellow-400">Dashboard</a>
      </div>
    </nav>
  )
}
