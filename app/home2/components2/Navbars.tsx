'use client'
import { useEffect, useState } from 'react'
import { Menu, X, Dumbbell } from 'lucide-react'

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Services', href: '#services' },
  { name: 'About', href: '#about' },
  { name: 'Trainers', href: '#trainers' },
  { name: 'Schedule', href: '#schedule' },
  { name: 'Plans', href: '#pricing' },
  { name: 'Testimonials', href: '#testimonials' },
  { name: 'Gallery', href: '#gallery' },
  { name: 'FAQ', href: '#faq' },
  { name: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60)
      const sections = navLinks.map(l => l.href.replace('#', ''))
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i])
        if (el && el.getBoundingClientRect().top <= 140) {
          setActiveSection(sections[i])
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : 'auto'
  }, [mobileOpen])

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : '1px solid transparent',
        transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
      }}>
        <div style={{
          maxWidth: 1400, margin: '0 auto', padding: '0 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 70,
        }}>
          {/* Logo */}
          <a href="#home" style={{
            display: 'flex', alignItems: 'center', gap: 10,
            textDecoration: 'none', cursor: 'pointer',
          }}>
            <div style={{
              width: 38, height: 38, background: 'var(--accent-orange)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
            }}>
              <Dumbbell size={18} color="#fff" />
            </div>
            <div>
              <div style={{
                fontFamily: 'Bebas Neue', fontSize: 20, letterSpacing: '0.05em', lineHeight: 1,
              }}>
                <span style={{ color: '#111' }}>FIT</span>
                <span style={{ color: 'var(--accent-orange)' }}>NEST</span>
              </div>
              <div style={{
                fontSize: 7, fontWeight: 700, letterSpacing: '0.25em',
                textTransform: 'uppercase', color: 'rgba(0,0,0,0.3)', marginTop: -1,
              }}>Health Club</div>
            </div>
          </a>

          {/* Desktop Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }} className="nav-desktop">
            {navLinks.map(link => {
              const isActive = activeSection === link.href.replace('#', '')
              return (
                <NavLink key={link.name} href={link.href} isActive={isActive}>
                  {link.name}
                </NavLink>
              )
            })}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="nav-mobile-btn" style={{
            display: 'none', background: 'none', border: '1px solid rgba(0,0,0,0.1)',
            width: 44, height: 44, alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#111',
            clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
          }}>
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <style>{`
          @media (max-width: 1100px) {
            .nav-desktop { display: none !important; }
            .nav-mobile-btn { display: flex !important; }
          }
        `}</style>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99,
          background: 'rgba(255,255,255,0.98)',
          backdropFilter: 'blur(20px)',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', padding: '0 32px',
          animation: 'fadeIn 0.3s ease',
        }}>
          <div style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            {navLinks.map((link, i) => (
              <a key={link.name} href={link.href} onClick={() => setMobileOpen(false)} style={{
                fontFamily: 'Bebas Neue', fontSize: 36, color: activeSection === link.href.replace('#', '') ? 'var(--accent-orange)' : '#111',
                textDecoration: 'none', padding: '10px 0', display: 'block',
                borderBottom: '1px solid rgba(0,0,0,0.06)',
                opacity: 0,
                animation: `slideUp 0.5s ease ${i * 0.04}s forwards`,
              }}>
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

function NavLink({ href, isActive, children }: { href: string; isActive: boolean; children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontSize: 9, fontWeight: 700, letterSpacing: '0.15em',
        textTransform: 'uppercase', textDecoration: 'none',
        padding: '6px 12px',
        color: isActive ? 'var(--accent-orange)' : hovered ? '#111' : 'rgba(0,0,0,0.45)',
        borderBottom: isActive ? '2px solid var(--accent-orange)' : '2px solid transparent',
        transition: 'all 0.3s ease',
      }}
    >
      {children}
    </a>
  )
}
