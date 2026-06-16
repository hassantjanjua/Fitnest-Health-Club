'use client'

import { useEffect, useRef, useState } from 'react'
import { Shield, Zap, Heart, Award, ChevronRight } from 'lucide-react'

const values = [
  { icon: Shield, title: 'Safety First', desc: 'Every program designed with your safety and injury prevention as the top priority.' },
  { icon: Zap, title: 'Elite Training', desc: 'Cutting-edge techniques used by professional athletes, now accessible to everyone.' },
  { icon: Heart, title: 'Community', desc: 'A supportive family of 500+ members pushing each other to be their best.' },
  { icon: Award, title: 'Proven Results', desc: '8 years of transforming bodies and minds across Lahore.' },
]

const milestones = [
  { year: '2017', event: 'Founded in Model Town, Lahore' },
  { year: '2019', event: 'Expanded to 10,000 sq ft facility' },
  { year: '2021', event: 'Launched 20+ fitness programs' },
  { year: '2024', event: '#1 Rated Gym in Model Town' },
]

export default function About() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const fade = (delay: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(40px)',
    transition: `opacity 0.9s ease ${delay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  })

  return (
    <section id="about" ref={ref} style={{
      padding: '120px 0', background: '#080808',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background accent */}
      <div style={{
        position: 'absolute', top: '20%', right: '-10%',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,107,0,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 48px' }} className="about-container">

        {/* Top: label + heading + intro */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'end', marginBottom: 80 }} className="about-top">
          <div>
            <div style={{ ...fade(0.1), display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 40, height: 2, background: 'var(--accent-orange)' }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--accent-orange)' }}>
                About Fitnest
              </span>
            </div>
            <h2 style={{
              ...fade(0.18),
              fontFamily: 'Bebas Neue', fontSize: 'clamp(52px, 7vw, 100px)',
              lineHeight: 0.9, color: '#fff', margin: 0,
            }}>
              MORE THAN<br />
              <span style={{ color: 'transparent', WebkitTextStroke: '2px rgba(255,255,255,0.15)' }}>JUST A</span><br />
              <span style={{ color: 'var(--accent-orange)' }}>GYM.</span>
            </h2>
          </div>

          <div style={fade(0.26)}>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.5)', lineHeight: 1.85, marginBottom: 24 }}>
              Fitnest Health Club was born from a simple belief — everyone deserves access to world-class fitness. 
              Since 2017, we ve been Lahore s most trusted transformation hub, combining elite coaching with 
              a community that genuinely cares about your progress.
            </p>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.5)', lineHeight: 1.85, marginBottom: 32 }}>
              Located in the heart of Model Town, our 10,000 sq ft facility is packed with the latest 
              equipment, expert trainers, and programs built for every fitness level.
            </p>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'transparent', border: 'none',
              color: 'var(--accent-orange)', fontSize: 12, fontWeight: 700,
              letterSpacing: '0.16em', textTransform: 'uppercase', cursor: 'none',
              padding: 0, transition: 'gap 0.3s ease',
            }}
              onMouseEnter={e => (e.currentTarget.style.gap = '14px')}
              onMouseLeave={e => (e.currentTarget.style.gap = '8px')}
            >
              Our Full Story <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Values grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 1, marginBottom: 80,
          background: 'rgba(255,107,0,0.08)',
          border: '1px solid rgba(255,107,0,0.1)',
        }} className="values-grid">
          {values.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} style={{
              ...fade(0.1 + i * 0.08),
              padding: '40px 32px',
              background: '#080808',
              borderRight: i < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              transition: 'background 0.3s ease',
              cursor: 'default',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,107,0,0.05)')}
              onMouseLeave={e => (e.currentTarget.style.background = '#080808')}
            >
              <div style={{
                width: 52, height: 52, marginBottom: 20,
                background: 'rgba(255,107,0,0.1)', border: '1px solid rgba(255,107,0,0.2)',
                clipPath: 'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={22} color="var(--accent-orange)" />
              </div>
              <h3 style={{ fontFamily: 'Bebas Neue', fontSize: 24, color: '#fff', letterSpacing: '0.05em', marginBottom: 12 }}>
                {title}
              </h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, margin: 0 }}>
                {desc}
              </p>
            </div>
          ))}
        </div>

        {/* Timeline + image split */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }} className="about-bottom">
          {/* Timeline */}
          <div style={fade(0.2)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
              <div style={{ width: 40, height: 2, background: 'var(--accent-orange)' }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--accent-orange)' }}>
                Our Journey
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {milestones.map((m, i) => (
                <div key={m.year} style={{
                  display: 'flex', gap: 24, alignItems: 'flex-start',
                  paddingBottom: i < milestones.length - 1 ? 32 : 0,
                  position: 'relative',
                }}>
                  {/* Line */}
                  {i < milestones.length - 1 && (
                    <div style={{
                      position: 'absolute', left: 19, top: 40,
                      width: 2, height: 'calc(100% - 8px)',
                      background: 'rgba(255,107,0,0.15)',
                    }} />
                  )}
                  {/* Dot */}
                  <div style={{
                    width: 40, height: 40, flexShrink: 0,
                    border: '2px solid var(--accent-orange)',
                    borderRadius: '50%',
                    background: 'rgba(255,107,0,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative', zIndex: 1,
                  }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-orange)' }} />
                  </div>
                  <div style={{ paddingTop: 8 }}>
                    <div style={{ fontFamily: 'Bebas Neue', fontSize: 28, color: 'var(--accent-orange)', lineHeight: 1, marginBottom: 6 }}>
                      {m.year}
                    </div>
                    <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                      {m.event}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats visual */}
          <div style={{ ...fade(0.3), position: 'relative' }}>
            <div style={{
              background: 'rgba(255,107,0,0.04)',
              border: '1px solid rgba(255,107,0,0.15)',
              padding: '48px 40px',
              clipPath: 'polygon(0 0,calc(100% - 24px) 0,100% 24px,100% 100%,24px 100%,0 calc(100% - 24px))',
            }}>
              <div style={{ fontFamily: 'Bebas Neue', fontSize: 11, letterSpacing: '0.28em', color: 'var(--accent-orange)', marginBottom: 32, textTransform: 'uppercase' }}>
                Why Members Choose Us
              </div>
              {[
                { label: 'Member Retention Rate', value: 94 },
                { label: 'Goal Achievement Rate', value: 87 },
                { label: 'Trainer Satisfaction', value: 98 },
                { label: 'Facility Cleanliness', value: 99 },
              ].map((item, i) => (
                <div key={item.label} style={{ marginBottom: i < 3 ? 28 : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{item.label}</span>
                    <span style={{ fontSize: 13, color: 'var(--accent-orange)', fontWeight: 700 }}>{item.value}%</span>
                  </div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 2,
                      background: 'linear-gradient(90deg, var(--accent-orange), #ff9500)',
                      width: visible ? `${item.value}%` : '0%',
                      transition: `width 1.2s cubic-bezier(0.16,1,0.3,1) ${0.3 + i * 0.1}s`,
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .about-top { grid-template-columns: 1fr !important; gap: 40px !important; }
          .about-bottom { grid-template-columns: 1fr !important; gap: 48px !important; }
          .values-grid { grid-template-columns: 1fr 1fr !important; }
          .about-container { padding: 0 20px !important; }
        }
        @media (max-width: 600px) {
          .values-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}