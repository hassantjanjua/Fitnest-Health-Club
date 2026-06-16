import { useEffect, useRef, useState } from 'react'
import { Dumbbell, Heart, Zap, Users, Apple, Flame, ChevronRight } from 'lucide-react'

const services = [
  {
    icon: Dumbbell,
    title: 'Weight Training',
    tag: 'Strength',
    desc: 'Progressive overload programs built around compound lifts and muscle hypertrophy. Suitable for all levels.',
    features: ['Personalized programs', 'Form coaching', 'Progressive tracking'],
    featured: false,
  },
  {
    icon: Heart,
    title: 'Cardio Training',
    tag: 'Endurance',
    desc: 'HIIT, steady-state, and sport-specific cardio designed to maximize fat burn and cardiovascular health.',
    features: ['Heart rate zones', 'Custom intervals', 'Endurance building'],
    featured: false,
  },
  {
    icon: Zap,
    title: 'Personal Training',
    tag: 'One-on-One',
    desc: "1-on-1 sessions with Pakistan's top certified trainers. Fastest route to your specific goals.",
    features: ['Goal assessment', 'Tailored workouts', 'Weekly check-ins'],
    featured: true,
  },
  {
    icon: Users,
    title: 'Group Classes',
    tag: 'Community',
    desc: 'High-energy group sessions that blend accountability with fun. 20+ class types every week.',
    features: ['Bootcamp', 'Circuit training', 'Core & mobility'],
    featured: false,
  },
  {
    icon: Apple,
    title: 'Nutrition Coaching',
    tag: 'Diet & Health',
    desc: 'Personalized meal plans and macro guidance from certified nutritionists aligned with your training.',
    features: ['Macro planning', 'Meal prep guides', 'Supplement advice'],
    featured: false,
  },
  {
    icon: Flame,
    title: 'CrossFit & HIIT',
    tag: 'Performance',
    desc: 'Functional movements at high intensity. Build strength, agility, and mental toughness simultaneously.',
    features: ['WOD programming', 'Olympic lifting', 'Functional fitness'],
    featured: false,
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
      padding: 'clamp(60px, 10vw, 120px) 0',
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'end', marginBottom: 'clamp(40px, 6vw, 72px)' }} className="services-header">
          <div>
            <div style={{ ...fade(0.1), display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 40, height: 2, background: 'var(--accent-orange)' }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--accent-orange)' }}>
                What We Offer
              </span>
            </div>
            <h2 style={{
              ...fade(0.18),
              fontFamily: 'Bebas Neue', fontSize: 'clamp(48px, 7vw, 100px)',
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
              Whether you&apos;re a first-timer or a seasoned athlete, we have a track for you.
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
          {services.map((service, i) => (
            <ServiceCard
              key={service.title}
              service={service}
              index={i}
              isActive={activeService === i}
              onHover={() => setActiveService(i)}
              onLeave={() => setActiveService(null)}
              fadeStyle={fade(0.1 + i * 0.07)}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ ...fade(0.5), textAlign: 'center', marginTop: 'clamp(40px, 5vw, 64px)' }}>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>
            Not sure which program is right for you?
          </p>
          <button className="btn-primary" style={{
            padding: '16px 44px', fontSize: 12,
            display: 'inline-flex', alignItems: 'center', gap: 10,
          }}>
            Get a Free Consultation <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </section>
  )
}

function ServiceCard({ service, index, isActive, onHover, onLeave, fadeStyle }: {
  service: typeof services[0]
  index: number
  isActive: boolean
  onHover: () => void
  onLeave: () => void
  fadeStyle: React.CSSProperties
}) {
  const Icon = service.icon

  return (
    <div
      style={{
        ...fadeStyle,
        padding: 'clamp(24px, 3vw, 40px) clamp(20px, 2.5vw, 36px)',
        background: isActive ? 'rgba(255,107,0,0.07)' : '#0a0a0a',
        borderRight: (index + 1) % 3 !== 0 ? '1px solid rgba(255,255,255,0.04)' : 'none',
        borderBottom: index < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none',
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        cursor: 'pointer', position: 'relative', overflow: 'hidden',
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Featured badge */}
      {service.featured && (
        <div style={{
          position: 'absolute', top: 16, right: 16,
          background: 'var(--accent-orange)', color: '#fff',
          fontSize: 9, fontWeight: 700, letterSpacing: '0.16em',
          padding: '4px 10px', textTransform: 'uppercase',
          clipPath: 'polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,6px 100%,0 calc(100% - 6px))',
          animation: 'pulseGlow 2s ease infinite',
        }}>
          Most Popular
        </div>
      )}

      {/* Bottom hover accent */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
        background: 'linear-gradient(90deg, var(--accent-orange), #ff9500)',
        transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
        transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
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
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        transform: isActive ? 'scale(1.1) rotate(-3deg)' : 'scale(1) rotate(0deg)',
      }}>
        <Icon size={24} color="var(--accent-orange)" />
      </div>

      <h3 style={{
        fontFamily: 'Bebas Neue', fontSize: 'clamp(22px, 2vw, 28px)', color: '#fff',
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
        {service.features.map((f, fi) => (
          <div key={f} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            transform: isActive ? 'translateX(6px)' : 'translateX(0)',
            transition: `transform 0.35s cubic-bezier(0.16,1,0.3,1) ${fi * 0.05}s`,
          }}>
            <div style={{
              width: 5, height: 5, borderRadius: '50%',
              background: 'var(--accent-orange)', flexShrink: 0,
              transition: 'all 0.3s ease',
              transform: isActive ? 'scale(1.4)' : 'scale(1)',
            }} />
            <span style={{ fontSize: 13, color: isActive ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.5)', transition: 'color 0.3s ease' }}>{f}</span>
          </div>
        ))}
      </div>

      <button style={{
        display: 'flex', alignItems: 'center', gap: 6,
        background: 'transparent', border: 'none',
        color: isActive ? 'var(--accent-orange)' : 'rgba(255,255,255,0.3)',
        fontSize: 11, fontWeight: 700, letterSpacing: '0.14em',
        textTransform: 'uppercase', cursor: 'pointer', padding: 0,
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        transform: isActive ? 'translateX(4px)' : 'translateX(0)',
      }}>
        Learn More
        <ChevronRight size={14} style={{
          transition: 'transform 0.3s ease',
          transform: isActive ? 'translateX(4px)' : 'translateX(0)',
        }} />
      </button>
    </div>
  )
}
