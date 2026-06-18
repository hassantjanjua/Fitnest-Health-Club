import ParticleBackground from './components/ParticleBackground'
import CustomCursor from './components/CustomCursor'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import About from './components/About'
import Trainers from './components/Trainers'
import MembershipPlans from './components/MembershipPlans'
import Gallery from './components/Gallery'
import FAQ from './components/FAQ'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <div style={{ background: '#080808', minHeight: '100vh', position: 'relative' }}>
      <ParticleBackground />
      <CustomCursor />
      <Navbar />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Hero />
        <Services />
        <About />
        <Trainers />
        <MembershipPlans />
        <Gallery />
        <FAQ />
        <Contact />
        <Footer />
      </div>
    </div>
  )
}
