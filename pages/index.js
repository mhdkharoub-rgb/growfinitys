
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Pricing from '@/components/Pricing'
import Testimonials from '@/components/Testimonials'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'

export default function Home(){
  return (
    <main>
      <Navbar />
      <Hero />
      <Features />
      <Pricing />
      <section id="demo" className="max-w-6xl mx-auto px-4 py-16">
        <div className="card flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold">Download the Free AI Content Pack</h3>
            <p className="text-white/80 mt-2">Get 5 sample posts + images. See the quality before you join.</p>
          </div>
          <a className="btn-gold" href="YOUR_DEMO_PACK_LINK" target="_blank" rel="noreferrer">📥 Get the Free Pack</a>
        </div>
      </section>
      <FAQ />
      <section id="join" className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h3 className="text-3xl font-bold mb-4">Ready to Grow?</h3>
        <p className="text-white/80 mb-6">Pick a plan and your first month’s content pack will be generated automatically.</p>
        <a className="btn-gold" href="#pricing">Choose Your Plan</a>
      </section>
      <Footer />
    </main>
  )
}
