'use client'
import { useEffect, useState } from 'react'
import { Menu, X, ArrowRight } from 'lucide-react'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'Gallery', href: '#gallery' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeLink, setActiveLink] = useState('#home')

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)

      // Detect active section
      const sections = navLinks.map(l => l.href.replace('#', ''))
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i])
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 150) {
            setActiveLink(`#${sections[i]}`)
            break
          }
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: scrolled ? '12px 0' : '20px 0',
        background: scrolled ? 'rgba(8,8,8,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
        transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
      }}>
        <div style={{
          maxWidth: 1400,
          margin: '0 auto',
          padding: '0 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }} className="hero-container">

          {/* Logo */}
          <a href="#home" style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 28,
            color: '#fff',
            textDecoration: 'none',
            letterSpacing: '0.08em',
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            transition: 'transform 0.3s ease',
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            FIT<span style={{ color: 'var(--accent-orange)' }}>NEST</span>
          </a>

          {/* Desktop Links */}
          <div className="nav-links" style={{
            display: 'flex',
            alignItems: 'center',
            gap: 40,
          }}>
            {navLinks.map(link => {
              const isActive = activeLink === link.href
              return (
                <a
                  key={link.href}
                  href={link.href}
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    color: isActive ? 'var(--accent-orange)' : 'rgba(255,255,255,0.55)',
                    position: 'relative',
                    padding: '8px 0',
                    transition: 'color 0.3s ease',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) e.currentTarget.style.color = '#fff'
                  }}
                  onMouseLeave={e => {
                    if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,0.55)'
                  }}
                >
                  {link.label}
                  <span style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: isActive ? '100%' : '0%',
                    height: 2,
                    background: 'var(--accent-orange)',
                    transition: 'width 0.3s cubic-bezier(0.16,1,0.3,1)',
                  }} />
                </a>
              )
            })}
          </div>

          {/* Desktop CTA */}
          <div className="nav-cta-desktop" style={{ display: 'flex' }}>
            <button
              className="btn-primary"
              style={{
                padding: '12px 28px',
                fontSize: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              Join Now <ArrowRight size={13} />
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
              cursor: 'pointer',
              clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
              transition: 'all 0.3s ease',
            }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999,
        background: 'rgba(8,8,8,0.98)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 32,
        opacity: mobileOpen ? 1 : 0,
        pointerEvents: mobileOpen ? 'auto' : 'none',
        transition: 'opacity 0.4s ease',
      }}>
        {navLinks.map((link, i) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setMobileOpen(false)}
            style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 48,
              color: activeLink === link.href ? 'var(--accent-orange)' : '#fff',
              textDecoration: 'none',
              letterSpacing: '0.1em',
              transform: mobileOpen ? 'translateY(0)' : 'translateY(30px)',
              opacity: mobileOpen ? 1 : 0,
              transition: `all 0.5s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.08}s`,
            }}
          >
            {link.label}
          </a>
        ))}

        <button
          className="btn-primary"
          onClick={() => setMobileOpen(false)}
          style={{
            padding: '16px 40px',
            fontSize: 12,
            marginTop: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            opacity: mobileOpen ? 1 : 0,
            transform: mobileOpen ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1) 0.4s',
          }}
        >
          Join Now <ArrowRight size={15} />
        </button>
      </div>
    </>
  )
}
