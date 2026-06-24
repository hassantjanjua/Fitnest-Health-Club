'use client'
import { useState } from 'react'
import { Dumbbell, ArrowUp, Heart, MapPin, Phone, Mail, ArrowRight } from 'lucide-react'

const footerLinks = {
  'Quick Links': [
    { name: 'Home', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'About Us', href: '#about' },
    { name: 'Trainers', href: '#trainers' },
  ],
  Programs: [
    { name: 'Weight Training', href: '#services' },
    { name: 'Cardio Training', href: '#services' },
    { name: 'Personal Training', href: '#services' },
    { name: 'Group Classes', href: '#services' },
  ],
  Support: [
    { name: 'Membership Plans', href: '#pricing' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Contact Us', href: '#contact' },
  ],
}

export default function Footer() {
  const [emailFocused, setEmailFocused] = useState(false)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer style={{
      background: '#0a0a0a', color: '#fff',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Orange accent bar */}
      <div style={{ height: 3, background: 'linear-gradient(90deg, var(--accent-orange), #ff9500, var(--accent-orange))' }} />

      {/* Diagonal lines */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute', top: '-50%',
            right: `${i * 180 - 60}px`,
            width: '1px', height: '200%',
            background: 'rgba(255,107,0,0.03)',
            transform: 'rotate(-20deg)',
          }} />
        ))}
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 48px', position: 'relative', zIndex: 1 }} className="hero-container">
        {/* Main Footer */}
        <div style={{
          padding: '80px 0 60px',
          display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48,
        }} className="footer-grid">
          {/* Brand */}
          <div>
            <a href="#home" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 24 }}>
              <div style={{
                width: 40, height: 40, background: 'var(--accent-orange)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
              }}>
                <Dumbbell size={20} color="#fff" />
              </div>
              <div>
                <div style={{ fontFamily: 'Bebas Neue', fontSize: 22, letterSpacing: '0.05em', lineHeight: 1 }}>
                  <span style={{ color: '#fff' }}>FIT</span>
                  <span style={{ color: 'var(--accent-orange)' }}>NEST</span>
                </div>
                <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginTop: -1 }}>
                  Health Club
                </div>
              </div>
            </a>

            <p style={{ fontSize: 13, lineHeight: 1.8, color: 'rgba(255,255,255,0.35)', maxWidth: 340, marginBottom: 28 }}>
              Pakistan s most driven fitness community. Transform your body, elevate your mind, and join a family that pushes boundaries every day.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { icon: MapPin, text: 'Model Town, Lahore, Pakistan' },
                { icon: Phone, text: '+92 300 123 4567' },
                { icon: Mail, text: 'info@fitnest.pk' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Icon size={13} color="var(--accent-orange)" />
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 style={{
                fontFamily: 'Bebas Neue', fontSize: 16, letterSpacing: '0.1em',
                color: '#fff', marginBottom: 24,
              }}>
                {title}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {links.map(link => (
                  <li key={link.name}>
                    <FooterLink href={link.href} text={link.name} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div style={{
          padding: '32px 0', borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 24,
        }}>
          <div>
            <h4 style={{ fontFamily: 'Bebas Neue', fontSize: 20, color: '#fff', marginBottom: 4 }}>
              Stay Updated
            </h4>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
              Get the latest news, offers, and fitness tips.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="email"
              placeholder="Your email address"
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              style={{
                width: 260, padding: '14px 18px',
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${emailFocused ? 'rgba(255,107,0,0.4)' : 'rgba(255,255,255,0.06)'}`,
                color: '#fff', fontSize: 12, fontFamily: 'Inter, sans-serif',
                outline: 'none', transition: 'all 0.3s ease',
                clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
              }}
            />
            <button className="btn-primary" style={{
              padding: '14px 24px', fontSize: 10,
              clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
            }}>
              Subscribe <ArrowRight size={12} style={{ marginLeft: 6 }} />
            </button>
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          padding: '24px 0', borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 16,
        }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', gap: 6 }}>
            © 2024 Fitnest Health Club. Made with <Heart size={10} color="var(--accent-orange)" fill="var(--accent-orange)" /> in Lahore
          </p>
          <div style={{ display: 'flex', gap: 24 }}>
            <FooterLink href="#" text="Privacy Policy" />
            <FooterLink href="#" text="Terms of Service" />
          </div>
        </div>
      </div>

      {/* Back to top */}
      <BackToTopButton onClick={scrollToTop} />
    </footer>
  )
}

function FooterLink({ href, text }: { href: string; text: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontSize: 12, textDecoration: 'none',
        color: hovered ? 'var(--accent-orange)' : 'rgba(255,255,255,0.35)',
        transition: 'color 0.3s ease',
        display: 'inline-flex', alignItems: 'center', gap: 6,
      }}
    >
      {hovered && <span style={{ width: 12, height: 1, background: 'var(--accent-orange)', display: 'inline-block' }} />}
      {text}
    </a>
  )
}

function BackToTopButton({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'fixed', bottom: 32, right: 32, zIndex: 50,
        width: 48, height: 48,
        background: hovered ? '#e55f00' : 'var(--accent-orange)',
        border: 'none', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 8px 32px rgba(255,107,0,0.3)',
        transition: 'all 0.3s ease',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
      }}
    >
      <ArrowUp size={18} />
    </button>
  )
}
