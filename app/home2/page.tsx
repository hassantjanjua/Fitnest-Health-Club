import Navbar from './components2/Navbars'
import Hero from './components2/Hero'
import Marquee from './components2/Marquee'
import Services from './components2/Services'
import About from './components2/About'
import ImageStrip from './components2/ImageStrip'
import Trainers from './components2/Trainers'
import Schedule from './components2/Schedule'
import MembershipPlans from './components2/MemberShipPlans'
import Testimonials from './components2/Testimonials'
import Gallery from './components2/Gallery'
import FAQ from './components2/FAQS'
import Contact from './components2/Contact'
import Footer from './components2/Footers'

export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <Navbar />
      <Hero />
      <Marquee />
      <Services />
      <About />
      <ImageStrip />
      <Trainers />
      <Marquee dark />
      <Schedule />
      <MembershipPlans />
      <Testimonials />
      <Gallery />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  )
}
