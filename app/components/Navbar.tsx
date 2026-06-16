'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { Menu, X, Zap } from 'lucide-react'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Plans', href: '#plans' },
  { label: 'Trainers', href: '#trainers' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [hovered, setHovered] = useState<string | null>(null)

  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60)

      const sections = ['home', 'about', 'services', 'plans', 'trainers', 'gallery', 'faq', 'contact']

      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(id)
          break
        }
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const scrollTo = (href: string) => {
    const id = href.replace('#', '')
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: scrolled ? '14px 0' : '22px 0',
          background: scrolled ? 'rgba(8,8,8,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,107,0,0.12)' : 'none',
          transition: 'all 0.5s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <div
          style={{
            maxWidth: 1320,
            margin: '0 auto',
            padding: '0 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* LOGO */}
          <Link
            href="/"
            onClick={() => scrollTo('#home')}
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                background: 'var(--accent-orange)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Zap size={20} color="#fff" />
            </div>

            <div>
              <div
                style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: 26,
                  color: '#fff',
                }}
              >
                FIT<span style={{ color: 'var(--accent-orange)' }}>NEST</span>
              </div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>
                Health Club
              </div>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <div className="nav-desktop" style={{ display: 'flex', gap: 8 }}>
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '')
              const isHovered = hovered === link.label

              return (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  onMouseEnter={() => setHovered(link.label)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    background: isActive
                      ? 'rgba(255,107,0,0.1)'
                      : isHovered
                      ? 'rgba(255,255,255,0.05)'
                      : 'transparent',
                    border: isActive
                      ? '1px solid rgba(255,107,0,0.3)'
                      : '1px solid transparent',
                    color: isActive ? 'var(--accent-orange)' : 'rgba(255,255,255,0.65)',
                    padding: '8px 14px',
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                  }}
                >
                  {link.label}
                </button>
              )
            })}
          </div>

          {/* CTA */}
          <div className="nav-desktop" style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => scrollTo('#contact')}
              style={{
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'transparent',
                color: 'rgba(255,255,255,0.7)',
                padding: '10px 18px',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Login
            </button>

            <button
              onClick={() => scrollTo('#plans')}
              style={{
                background: 'var(--accent-orange)',
                border: 'none',
                color: '#fff',
                padding: '11px 20px',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Join Now
            </button>
          </div>

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="nav-mobile-btn"
            style={{
              display: 'none',
              background: 'rgba(255,107,0,0.1)',
              border: '1px solid rgba(255,107,0,0.3)',
              width: 42,
              height: 42,
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div
        ref={menuRef}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 300,
          background: 'rgba(8,8,8,0.98)',
          zIndex: 999,
          padding: '100px 32px',
          transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: '0.4s ease',
        }}
      >
        {navLinks.map((link, i) => (
          <button
            key={link.label}
            onClick={() => scrollTo(link.href)}
            style={{
              display: 'block',
              width: '100%',
              padding: '16px 0',
              border: 'none',
              background: 'transparent',
              color: 'rgba(255,255,255,0.7)',
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            {link.label}
          </button>
        ))}
      </div>

      {/* OVERLAY */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 998,
          }}
        />
      )}

      <style jsx>{`
        @media (max-width: 1024px) {
          .nav-desktop {
            display: none !important;
          }
          .nav-mobile-btn {
            display: flex !important;
          }
        }
      `}</style>
    </>
  )
}