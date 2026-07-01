'use client'
import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'

export default function ImageStrip() {
  const [offset, setOffset] = useState(0)
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const viewH = window.innerHeight
      if (rect.top < viewH && rect.bottom > 0) {
        const progress = (viewH - rect.top) / (viewH + rect.height)
        setOffset(progress * 60 - 30)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const navigateToContact = () => {
    const el = document.getElementById('contact')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div ref={ref} style={{
      position: 'relative', overflow: 'hidden',
      height: 420,
      background: '#0a0a0a',
    }}>
      {/* Parallax image */}
      <div style={{
        position: 'absolute', inset: -60,
        backgroundImage: 'url(https://images.pexels.com/photos/9845424/pexels-photo-9845424.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=800&w=1600)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transform: `translateY(${offset}px)`,
        transition: 'transform 0.1s linear',
        filter: 'brightness(0.25)',
      }} />

      {/* Overlay pattern */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            rgba(0,0,0,0.06) 3px,
            rgba(0,0,0,0.06) 4px
          )
        `,
        pointerEvents: 'none',
      }} />

      {/* Dark theme SVG geometric shapes */}
      <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 80, pointerEvents: 'none' }} viewBox="0 0 1400 80" preserveAspectRatio="none">
        <path d="M0 80 L0 40 L1400 0 L1400 80 Z" fill="#080808" />
      </svg>
      <svg style={{ position: 'absolute', top: 0, right: 0, width: '100%', height: 80, pointerEvents: 'none' }} viewBox="0 0 1400 80" preserveAspectRatio="none">
        <path d="M0 0 L1400 0 L1400 40 L0 80 Z" fill="#080808" />
      </svg>

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 2,
        height: '100%', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 20,
        textAlign: 'center', padding: '0 20px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.9s cubic-bezier(0.16,1,0.3,1)',
      }}>
        <div style={{
          fontFamily: 'Bebas Neue', fontSize: 'clamp(36px, 6vw, 72px)',
          color: '#fff', letterSpacing: '0.04em', lineHeight: 1,
        }}>
          TRANSFORM YOUR <span style={{ color: 'var(--accent-orange)' }}>BODY</span>
          <br />
          TRANSFORM YOUR <span style={{ color: 'var(--accent-orange)' }}>LIFE</span>
        </div>
        <p style={{
          fontSize: 14, color: 'rgba(255,255,255,0.45)',
          maxWidth: 500, lineHeight: 1.7,
        }}>
          Join 500+ members who&apos;ve already started their transformation journey at Fitnest Health Club.
        </p>
        <StripCTA onClick={navigateToContact} />
      </div>

      {/* Orange accent triangles */}
      <div style={{
        position: 'absolute', bottom: 60, left: 0,
        width: 0, height: 0,
        borderLeft: '60px solid var(--accent-orange)',
        borderTop: '30px solid transparent',
        borderBottom: '30px solid transparent',
        opacity: 0.3,
      }} />
      <div style={{
        position: 'absolute', top: 60, right: 0,
        width: 0, height: 0,
        borderRight: '60px solid var(--accent-orange)',
        borderTop: '30px solid transparent',
        borderBottom: '30px solid transparent',
        opacity: 0.3,
      }} />
    </div>
  )
}

function StripCTA({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '16px 44px',
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        cursor: 'pointer',
        marginTop: 8,
        background: hovered ? 'var(--accent-orange-hover)' : 'var(--accent-orange)',
        color: '#fff',
        border: 'none',
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered ? '0 12px 40px rgba(255,107,0,0.4)' : '0 4px 20px rgba(255,107,0,0.2)',
        clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
      }}
    >
      Start Now <ArrowRight size={14} />
    </button>
  )
}
