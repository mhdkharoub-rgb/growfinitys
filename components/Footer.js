
export default function Footer(){
  return (
    <footer className="border-t border-goldDeep/20 py-10 mt-10">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-6 items-center">
        <div className="flex items-center gap-3">
          <span className="text-2xl">∞</span>
          <span className="font-bold text-xl">Growfinitys</span>
        </div>
        <nav className="flex gap-6 justify-center">
          <a href="#pricing" className="footer-link">Pricing</a>
          <a href="#testimonials" className="footer-link">Testimonials</a>
          <a href="#join" className="footer-link">Join Now</a>
        </nav>
        <div className="text-right text-white/60">© 2025 Growfinitys</div>
      </div>
    </footer>
  )
}
