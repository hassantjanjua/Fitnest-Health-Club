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
import MarqueeBar from './components/MarqueeBar'
import WhyChooseUs from './components/WhyChooseUs'
import BMICalculator from './components/BMICalculator'
import ClassSchedule from './components/ClassSchedule'
import Testimonials from './components/Testimonials'
import Events from './components/Events'
import Partners from './components/Patners'
import ImageStrip from './components/ImageStrap'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function App() {
  return (
    <div style={{ background: '#080808', minHeight: '100vh', position: 'relative' }}>
      <ParticleBackground />
      <CustomCursor />
      <Navbar />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Hero />
        <MarqueeBar/>
        <Services />
        <WhyChooseUs/>
        <About />
        <ImageStrip/>
        <Trainers />
        <Testimonials/>
        <Events/>
        <MembershipPlans />
        <BMICalculator/>
        <ClassSchedule/>
        <Gallery />
        <Partners/>
        <FAQ />
        <Contact />
        <Footer />
      </div>
    </div>
  )
}