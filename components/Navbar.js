
export default function Navbar(){
  return (
    <header className="sticky top-0 z-50 bg-black/70 backdrop-blur border-b border-goldDeep/20">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">∞</span>
          <span className="font-bold text-xl">Growfinitys</span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a href="#pricing" className="nav-link">Pricing</a>
          <a href="#testimonials" className="nav-link">Testimonials</a>
          <a href="#faq" className="nav-link">FAQ</a>
          <a href="#join" className="btn-gold">Join Now</a>
        </nav>
      </div>
    </header>
  )
}
