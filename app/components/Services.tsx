'use client'

import { useEffect, useRef, useState } from 'react'
import { Dumbbell, Heart, Zap, Users, Apple, Flame, Clock, ChevronRight } from 'lucide-react'

const services = [
  {
    icon: Dumbbell,
    title: 'Weight Training',
    tag: 'Strength',
    desc: 'Progressive overload programs built around compound lifts and muscle hypertrophy. Suitable for all levels.',
    features: ['Personalized programs', 'Form coaching', 'Progressive tracking'],
    color: 'rgba(255,107,0,0.08)',
  },
  {
    icon: Heart,
    title: 'Cardio Training',
    tag: 'Endurance',
    desc: 'HIIT, steady-state, and sport-specific cardio designed to maximize fat burn and cardiovascular health.',
    features: ['Heart rate zones', 'Custom intervals', 'Endurance building'],
    color: 'rgba(255,107,0,0.04)',
  },
  {
    icon: Zap,
    title: 'Personal Training',
    tag: 'One-on-One',
    desc: '1-on-1 sessions with Pakistan\'s top certified trainers. Fastest route to your specific goals.',
    features: ['Goal assessment', 'Tailored workouts', 'Weekly check-ins'],
    color: 'rgba(255,107,0,0.08)',
    featured: true,
  },
  {
    icon: Users,
    title: 'Group Classes',
    tag: 'Community',
    desc: 'High-energy group sessions that blend accountability with fun. 20+ class types every week.',
    features: ['Bootcamp', 'Circuit training', 'Core & mobility'],
    color: 'rgba(255,107,0,0.04)',
  },
  {
    icon: Apple,
    title: 'Nutrition Coaching',
    tag: 'Diet & Health',
    desc: 'Personalized meal plans and macro guidance from certified nutritionists aligned with your training.',
    features: ['Macro planning', 'Meal prep guides', 'Supplement advice'],
    color: 'rgba(255,107,0,0.08)',
  },
  {
    icon: Flame,
    title: 'CrossFit & HIIT',
    tag: 'Performance',
    desc: 'Functional movements at high intensity. Build strength, agility, and mental toughness simultaneously.',
    features: ['WOD programming', 'Olympic lifting', 'Functional fitness'],
    color: 'rgba(255,107,0,0.04)',
  },
]

export default function Services() {
  const [visible, setVisible] = useState(false)
  const [activeService, setActiveService] = useState<number | null>(null)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.05 }
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
    <section id="services" ref={ref} style={{
      padding: '120px 0',
      background: 'linear-gradient(180deg, #080808 0%, #0d0d0d 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '30%', left: '-15%',
        width: 700, height: 700, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,107,0,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 48px' }} className="services-container">

        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'end', marginBottom: 72 }} className="services-header">
          <div>
            <div style={{ ...fade(0.1), display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 40, height: 2, background: 'var(--accent-orange)' }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--accent-orange)' }}>
                What We Offer
              </span>
            </div>
            <h2 style={{
              ...fade(0.18),
              fontFamily: 'Bebas Neue', fontSize: 'clamp(52px, 7vw, 100px)',
              lineHeight: 0.9, color: '#fff', margin: 0,
            }}>
              PROGRAMS<br />
              <span style={{ color: 'transparent', WebkitTextStroke: '2px rgba(255,255,255,0.15)' }}>BUILT FOR</span><br />
              <span style={{ color: 'var(--accent-orange)' }}>RESULTS.</span>
            </h2>
          </div>
          <div style={fade(0.26)}>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, margin: 0, marginBottom: 24 }}>
              Every program at Fitnest is engineered by certified professionals.
              Whether you re a first-timer or a seasoned athlete, we have a track for you.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {['20+ Programs', 'All Levels', 'Certified Trainers'].map(tag => (
                <span key={tag} style={{
                  padding: '7px 16px', fontSize: 11, fontWeight: 700,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  border: '1px solid rgba(255,107,0,0.3)',
                  color: 'var(--accent-orange)', borderRadius: 2,
                  background: 'rgba(255,107,0,0.06)',
                }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Services grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.06)',
        }} className="services-grid">
          {services.map((service, i) => {
            const Icon = service.icon
            const isActive = activeService === i
            return (
              <div
                key={service.title}
                style={{
                  ...fade(0.1 + i * 0.07),
                  padding: '40px 36px',
                  background: isActive ? 'rgba(255,107,0,0.07)' : '#0a0a0a',
                  borderRight: (i + 1) % 3 !== 0 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  transition: 'all 0.3s ease',
                  cursor: 'none', position: 'relative', overflow: 'hidden',
                }}
                onMouseEnter={() => setActiveService(i)}
                onMouseLeave={() => setActiveService(null)}
              >
                {/* Featured badge */}
                {service.featured && (
                  <div style={{
                    position: 'absolute', top: 20, right: 20,
                    background: 'var(--accent-orange)', color: '#fff',
                    fontSize: 9, fontWeight: 700, letterSpacing: '0.16em',
                    padding: '4px 10px', textTransform: 'uppercase',
                    clipPath: 'polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,6px 100%,0 calc(100% - 6px))',
                  }}>
                    Most Popular
                  </div>
                )}

                {/* Bottom hover accent */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
                  background: 'var(--accent-orange)',
                  transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                  transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
                  transformOrigin: 'left',
                }} />

                {/* Tag */}
                <div style={{
                  fontSize: 9, fontWeight: 700, letterSpacing: '0.22em',
                  textTransform: 'uppercase', color: 'rgba(255,107,0,0.7)', marginBottom: 16,
                }}>
                  {service.tag}
                </div>

                {/* Icon */}
                <div style={{
                  width: 56, height: 56, marginBottom: 20,
                  background: isActive ? 'rgba(255,107,0,0.15)' : 'rgba(255,107,0,0.08)',
                  border: `1px solid ${isActive ? 'rgba(255,107,0,0.4)' : 'rgba(255,107,0,0.18)'}`,
                  clipPath: 'polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.3s ease',
                }}>
                  <Icon size={24} color="var(--accent-orange)" />
                </div>

                <h3 style={{
                  fontFamily: 'Bebas Neue', fontSize: 28, color: '#fff',
                  letterSpacing: '0.05em', margin: '0 0 14px',
                }}>
                  {service.title}
                </h3>

                <p style={{
                  fontSize: 14, color: 'rgba(255,255,255,0.4)',
                  lineHeight: 1.75, marginBottom: 20,
                }}>
                  {service.desc}
                </p>

                {/* Features */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                  {service.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 5, height: 5, borderRadius: '50%',
                        background: 'var(--accent-orange)', flexShrink: 0,
                      }} />
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{f}</span>
                    </div>
                  ))}
                </div>

                <button style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'transparent', border: 'none',
                  color: isActive ? 'var(--accent-orange)' : 'rgba(255,255,255,0.3)',
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.14em',
                  textTransform: 'uppercase', cursor: 'none', padding: 0,
                  transition: 'all 0.3s ease',
                }}>
                  Learn More <ChevronRight size={14} />
                </button>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div style={{ ...fade(0.5), textAlign: 'center', marginTop: 64 }}>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>
            Not sure which program is right for you?
          </p>
          <button style={{
            background: 'var(--accent-orange)', border: 'none', color: '#fff',
            padding: '16px 44px', fontSize: 12, fontWeight: 700,
            letterSpacing: '0.16em', textTransform: 'uppercase', cursor: 'none',
            clipPath: 'polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px))',
            transition: 'all 0.3s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#ff7a00'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent-orange)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            Get a Free Consultation
          </button>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .services-container { padding: 0 20px !important; }
          .services-header { grid-template-columns: 1fr !important; gap: 32px !important; }
          .services-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          .services-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}