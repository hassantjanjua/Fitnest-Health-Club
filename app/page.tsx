import Navbar from '@/app/components/Navbar'
import Hero from '@/app/components/Hero'
import About from './components/About'
import Services from './components/Services'
import MembershipPlans from './components/MembershipPlans'
import Trainers from './components/Trainers'
import FAQ from './components/FAQ'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Gallery from './components/Gallery'


export default function Home() {
  return (
    <main style={{ position: 'relative', zIndex: 1 }}>
      <Navbar />
      <Hero />
      <About/>
      <Services/>
      <MembershipPlans/>
      <Trainers/>
      <Gallery/>
      <FAQ/>
      <Contact/>
      <Footer/>
    </main>
  )
}