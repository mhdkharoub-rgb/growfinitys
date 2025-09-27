import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Pricing from '../components/Pricing'
import ExampleSignal from '../components/ExampleSignal'
import HowItWorks from '../components/HowItWorks'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <main className="bg-black text-white">
      <Navbar />
      <Hero />
      <Features />
      <Pricing />
      <ExampleSignal />
      <HowItWorks />
      <Footer />
    </main>
  )
}
