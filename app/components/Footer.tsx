'use client'
import { useState } from 'react'
import { ArrowRight, MapPin, Phone, Mail } from 'lucide-react'
import FitnestLogo from './FitnestLogo'

// SVG icons for social media
const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)

const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)

const YoutubeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
  </svg>
)

const footerLinks = {
  programs: [
    { label: 'Weight Training', href: '#services' },
    { label: 'Cardio Training', href: '#services' },
    { label: 'Personal Training', href: '#services' },
    { label: 'Group Classes', href: '#services' },
    { label: 'Nutrition Coaching', href: '#services' },
  ],
  company: [
    { label: 'About Us', href: '#about' },
    { label: 'Our Gallery', href: '#gallery' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
  ],
  social: [
    { Icon: InstagramIcon, href: 'https://instagram.com', label: 'Instagram' },
    { Icon: FacebookIcon, href: 'https://facebook.com', label: 'Facebook' },
    { Icon: YoutubeIcon, href: 'https://youtube.com', label: 'YouTube' },
  ],
}

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  return (
    <footer style={{
      background: 'linear-gradient(180deg, #050505 0%, #030303 100%)',
      borderTop: '1px solid rgba(255,107,0,0.1)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background accent */}
      <div style={{
        position: 'absolute', top: '-50%', left: '50%', transform: 'translateX(-50%)',
        width: 800, height: 800, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,107,0,0.03) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '80px 48px 40px' }} className="footer-container">

        {/* Top section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1.2fr', gap: 60, marginBottom: 60 }} className="footer-grid">

          {/* Brand column */}
          <div>
            <a href="#home" style={{
              textDecoration: 'none',
              display: 'inline-block',
              marginBottom: 20,
            }}>
              <FitnestLogo size="md" />
            </a>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.8, marginBottom: 24 }}>
              Pakistan&apos;s premier fitness destination. Transforming lives since 2017 with world-class training and an unmatched community.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              {footerLinks.social.map(({ Icon, href, label }) => (
                <SocialIcon key={label} Icon={Icon} href={href} label={label} />
              ))}
            </div>
          </div>

          {/* Programs */}
          <div>
            <h4 style={{
              fontFamily: 'Bebas Neue',
              fontSize: 11,
              letterSpacing: '0.28em',
              color: 'var(--accent-orange)',
              marginBottom: 24,
              textTransform: 'uppercase',
            }}>
              Programs
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {footerLinks.programs.map(link => (
                <FooterLink key={link.label} {...link} />
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 style={{
              fontFamily: 'Bebas Neue',
              fontSize: 11,
              letterSpacing: '0.28em',
              color: 'var(--accent-orange)',
              marginBottom: 24,
              textTransform: 'uppercase',
            }}>
              Company
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {footerLinks.company.map(link => (
                <FooterLink key={link.label} {...link} />
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{
              fontFamily: 'Bebas Neue',
              fontSize: 11,
              letterSpacing: '0.28em',
              color: 'var(--accent-orange)',
              marginBottom: 24,
              textTransform: 'uppercase',
            }}>
              Stay Updated
            </h4>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, marginBottom: 16 }}>
              Get fitness tips, exclusive offers, and event updates.
            </p>
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: 0 }}>
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRight: 'none',
                  color: '#fff',
                  padding: '12px 16px',
                  fontSize: 13,
                  outline: 'none',
                  transition: 'border-color 0.3s ease',
                }}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(255,107,0,0.4)'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
              <button
                type="submit"
                style={{
                  background: subscribed ? '#22c55e' : 'var(--accent-orange)',
                  border: 'none',
                  color: '#fff',
                  padding: '12px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                }}
              >
                {subscribed ? '✓' : <ArrowRight size={16} />}
              </button>
            </form>

            {/* Contact info */}
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <MapPin size={14} color="var(--accent-orange)" />
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Model Town, Lahore</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Phone size={14} color="var(--accent-orange)" />
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>+92 300 1234567</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Mail size={14} color="var(--accent-orange)" />
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>info@fitnestlahore.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: 32,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', margin: 0 }}>
            © {new Date().getFullYear()} Fitnest Health Club. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy Policy', 'Terms of Service'].map(item => (
              <a
                key={item}
                href="#"
                style={{
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.35)',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-orange)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

function SocialIcon({ Icon, href, label }: {
  Icon: React.ElementType
  href: string
  label: string
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 40,
        height: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: hovered ? 'rgba(255,107,0,0.15)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${hovered ? 'rgba(255,107,0,0.3)' : 'rgba(255,255,255,0.08)'}`,
        clipPath: 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))',
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
      }}
    >
      <span style={{ color: hovered ? 'var(--accent-orange)' : 'rgba(255,255,255,0.5)', transition: 'color 0.3s ease' }}>
        <Icon />
      </span>
    </a>
  )
}

function FooterLink({ label, href }: { label: string; href: string }) {
  const [hovered, setHovered] = useState(false)

  return (
    <li style={{ marginBottom: 12 }}>
      <a
        href={href}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          fontSize: 14,
          color: hovered ? '#fff' : 'rgba(255,255,255,0.45)',
          textDecoration: 'none',
          transition: 'all 0.3s ease',
          display: 'inline-flex',
          alignItems: 'center',
          gap: hovered ? 8 : 0,
        }}
      >
        <span style={{
          width: hovered ? 12 : 0,
          height: 1,
          background: 'var(--accent-orange)',
          transition: 'width 0.3s cubic-bezier(0.16,1,0.3,1)',
        }} />
        {label}
      </a>
    </li>
  )
}
