
export default function Hero(){
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 opacity-40" style={{background: 'radial-gradient(600px 300px at 10% 10%, #D4AF37 0%, transparent 60%), radial-gradient(600px 300px at 90% 10%, #FFD700 0%, transparent 60%)'}}/>
      <div className="max-w-6xl mx-auto px-4 py-24 relative">
        <p className="badge mb-4">Premium Bold</p>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">Exclusive AI Solutions for Ambitious Brands</h1>
        <p className="mt-4 text-white/80 max-w-2xl">Automate content, scale output, and grow faster with AI. Get ready-to-post captions, branded images, ads, and email campaigns—updated every month.</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <a href="#join" className="btn-gold text-center">Join Now</a>
          <a href="#demo" className="btn-gold-outline text-center">📥 Download Free AI Content Pack</a>
        </div>
      </div>
    </section>
  )
}

