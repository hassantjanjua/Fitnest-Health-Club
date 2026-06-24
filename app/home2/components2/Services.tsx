'use client'
import { useEffect, useRef, useState } from 'react'
import { Dumbbell, Heart, UserCheck, Users, Apple, Flame, ArrowRight, Check, X } from 'lucide-react'

const services = [
  {
    icon: Dumbbell, category: 'Strength', title: 'Weight Training',
    description: 'Progressive overload programs built around compound lifts and muscle hypertrophy. Suitable for all levels.',
    features: ['Personalized programs', 'Form coaching', 'Progressive tracking'],
    fullDescription: 'Our Weight Training program is designed for all fitness levels. We focus on compound movements like squats, deadlifts, and bench press to build functional strength. Our certified trainers ensure proper form and progressive overload to maximize your gains while minimizing injury risk.',
  },
  {
    icon: Heart, category: 'Endurance', title: 'Cardio Training',
    description: 'HIIT, steady-state, and sport-specific cardio designed to maximize fat burn and cardiovascular health.',
    features: ['Heart rate zones', 'Custom intervals', 'Endurance building'],
    fullDescription: 'Cardio Training at Fitnest combines HIIT sessions with steady-state cardio for optimal fat burning. We use heart rate monitors to keep you in the right zone, and our varied equipment ensures you never get bored while improving your cardiovascular health.',
  },
  {
    icon: UserCheck, category: 'One-on-One', title: 'Personal Training',
    description: "1-on-1 sessions with Pakistan's top certified trainers. Fastest route to your specific goals.",
    features: ['Goal assessment', 'Tailored workouts', 'Weekly check-ins'],
    popular: true,
    fullDescription: 'Personal Training offers you dedicated 1-on-1 attention from our elite trainers. We start with a comprehensive assessment, create a customized plan, and provide weekly check-ins to ensure you stay on track to reach your goals faster than ever.',
  },
  {
    icon: Users, category: 'Community', title: 'Group Classes',
    description: 'High-energy group sessions that blend accountability with fun. 20+ class types every week.',
    features: ['Bootcamp', 'Circuit training', 'Core & mobility'],
    fullDescription: 'Group Classes bring the energy and accountability you need. From high-intensity bootcamps to focused core and mobility sessions, our certified instructors lead 20+ different class types weekly to keep you motivated and engaged.',
  },
  {
    icon: Apple, category: 'Diet & Health', title: 'Nutrition Coaching',
    description: 'Personalized meal plans and macro guidance from certified nutritionists aligned with your training.',
    features: ['Macro planning', 'Meal prep guides', 'Supplement advice'],
    fullDescription: 'Nutrition Coaching pairs you with certified nutritionists who create personalized meal plans based on your goals. We provide macro tracking guidance, meal prep strategies, and evidence-based supplement recommendations.',
  },
  {
    icon: Flame, category: 'Performance', title: 'CrossFit & HIIT',
    description: 'Functional movements at high intensity. Build strength, agility, and mental toughness simultaneously.',
    features: ['WOD programming', 'Olympic lifting', 'Functional fitness'],
    fullDescription: 'CrossFit & HIIT combines functional movements with high intensity for complete fitness transformation. Our programming includes Olympic lifting technique work, daily WODs, and functional fitness challenges to build your strength and mental toughness.',
  },
]

function ServiceModal({ service, onClose }: { service: typeof services[0]; onClose: () => void }) {
  const Icon = service.icon
  
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.body.style.overflow = 'auto'
      document.removeEventListener('keydown', handleEsc)
    }
  }, [onClose])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, animation: 'fadeIn 0.3s ease',
    }} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{
        background: '#fff', maxWidth: 600, width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative',
        animation: 'scaleIn 0.4s cubic-bezier(0.16,1,0.3,1)',
        clipPath: 'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))',
      }}>
        <div style={{ height: 4, background: 'var(--accent-orange)' }} />
        <button onClick={onClose} style={{
          position: 'absolute', top: 20, right: 20, width: 40, height: 40, background: 'rgba(0,0,0,0.05)',
          border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
        }}>
          <X size={18} color="#111" />
        </button>
        
        <div style={{ padding: '40px 36px' }}>
          <div style={{
            width: 64, height: 64, background: 'rgba(255,107,0,0.1)', border: '1px solid rgba(255,107,0,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24,
            clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
          }}>
            <Icon size={28} color="var(--accent-orange)" />
          </div>
          
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent-orange)' }}>
            {service.category}
          </span>
          <h3 style={{ fontFamily: 'Bebas Neue', fontSize: 36, color: '#111', margin: '8px 0 20px', letterSpacing: '0.02em' }}>
            {service.title}
          </h3>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: 'rgba(0,0,0,0.5)', marginBottom: 28 }}>
            {service.fullDescription}
          </p>
          
          <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: 24, marginBottom: 28 }}>
            <h4 style={{ fontSize: 12, fontWeight: 700, color: '#111', marginBottom: 16, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              What s Included
            </h4>
            {service.features.map(feat => (
              <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{
                  width: 20, height: 20, background: 'rgba(255,107,0,0.1)', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Check size={10} color="var(--accent-orange)" strokeWidth={3} />
                </div>
                <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.6)' }}>{feat}</span>
              </div>
            ))}
          </div>
          
          <CTAButton href="#contact" onClick={onClose}>
            Get Started <ArrowRight size={14} />
          </CTAButton>
        </div>
      </div>
    </div>
  )
}

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const [hovered, setHovered] = useState(false)
  const [visible, setVisible] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const Icon = service.icon

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true)
    }, { threshold: 0.15 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <div
        ref={ref}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(40px)',
          transition: `opacity 0.7s ease ${index * 0.1}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 0.1}s`,
          background: hovered ? '#111' : '#fff',
          border: `1px solid ${hovered ? '#111' : service.popular ? 'rgba(255,107,0,0.3)' : 'rgba(0,0,0,0.06)'}`,
          padding: '32px 28px', position: 'relative', overflow: 'hidden', cursor: 'default',
          clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
        }}
      >
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: hovered ? 'var(--accent-orange)' : service.popular ? 'var(--accent-orange)' : 'transparent',
          transition: 'background 0.4s ease',
        }} />

        {service.popular && (
          <div style={{
            position: 'absolute', top: 14, right: -28, background: 'var(--accent-orange)', color: '#fff',
            fontSize: 7, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '4px 36px', transform: 'rotate(45deg)',
          }}>Popular</div>
        )}

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{
            width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: hovered ? 'rgba(255,107,0,0.15)' : 'rgba(255,107,0,0.06)',
            border: `1px solid ${hovered ? 'rgba(255,107,0,0.4)' : 'rgba(255,107,0,0.12)'}`,
            transition: 'all 0.4s ease',
            clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
          }}>
            <Icon size={20} color="var(--accent-orange)" />
          </div>
          <span style={{
            fontSize: 8, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
            color: hovered ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)', transition: 'color 0.4s ease',
          }}>{service.category}</span>
        </div>

        <h3 style={{
          fontFamily: 'Bebas Neue', fontSize: 24, letterSpacing: '0.02em',
          color: hovered ? '#fff' : '#111', marginBottom: 10, transition: 'color 0.4s ease',
        }}>{service.title}</h3>

        <p style={{
          fontSize: 12, lineHeight: 1.7, color: hovered ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)',
          marginBottom: 20, transition: 'color 0.4s ease',
        }}>{service.description}</p>

        <div style={{ borderTop: `1px solid ${hovered ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`, paddingTop: 16, marginBottom: 20, transition: 'border-color 0.4s ease' }}>
          {service.features.map(feat => (
            <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{
                width: 14, height: 14, background: hovered ? 'rgba(255,107,0,0.2)' : 'rgba(255,107,0,0.08)',
                border: `1px solid ${hovered ? 'rgba(255,107,0,0.5)' : 'rgba(255,107,0,0.2)'}`,
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.4s ease',
              }}>
                <Check size={7} color="var(--accent-orange)" strokeWidth={3} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 500, color: hovered ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)', transition: 'color 0.4s ease' }}>{feat}</span>
            </div>
          ))}
        </div>

        <LearnMoreButton hovered={hovered} onClick={() => setModalOpen(true)} />
      </div>
      
      {modalOpen && <ServiceModal service={service} onClose={() => setModalOpen(false)} />}
    </>
  )
}

function LearnMoreButton({ onClick }: { hovered: boolean; onClick: () => void }) {
  const [btnHovered, setBtnHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setBtnHovered(true)}
      onMouseLeave={() => setBtnHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 8, fontSize: 10, fontWeight: 700, letterSpacing: '0.18em',
        textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        color: btnHovered ? '#fff' : 'var(--accent-orange)',
        transform: btnHovered ? 'translateX(4px)' : 'translateX(0)',
        transition: 'all 0.3s ease',
      }}
    >
      Learn More <ArrowRight size={12} style={{ transition: 'transform 0.3s ease', transform: btnHovered ? 'translateX(4px)' : 'translateX(0)' }} />
    </button>
  )
}

function CTAButton({ href, onClick, children }: { href: string; onClick?: () => void; children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={href}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 36px',
        fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
        textDecoration: 'none', cursor: 'pointer',
        background: hovered ? '#e55f00' : 'var(--accent-orange)', color: '#fff',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered ? '0 12px 40px rgba(255,107,0,0.3)' : 'none',
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
      }}
    >
      {children}
    </a>
  )
}

export default function Services() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true)
    }, { threshold: 0.1 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="services" style={{ padding: '100px 0', background: '#fff', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ position: 'absolute', top: '-50%', left: `${i * 200 + 100}px`, width: '1px', height: '200%', background: 'rgba(255,107,0,0.04)', transform: 'rotate(15deg)' }} />
        ))}
      </div>

      <div ref={ref} style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <div style={{
          textAlign: 'center', marginBottom: 60,
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 44, height: 2, background: 'var(--accent-orange)' }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--accent-orange)' }}>Our Services</span>
            <div style={{ width: 44, height: 2, background: 'var(--accent-orange)' }} />
          </div>
          <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(40px, 7vw, 80px)', lineHeight: 0.95, letterSpacing: '0.02em', color: '#111' }}>
            WHAT WE <span style={{ color: 'var(--accent-orange)' }}>OFFER</span>
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(0,0,0,0.4)', marginTop: 14, maxWidth: 480, margin: '14px auto 0' }}>
            Six comprehensive programs designed to transform every aspect of your fitness journey.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }} className="services-grid">
          {services.map((service, i) => <ServiceCard key={i} service={service} index={i} />)}
        </div>

        <div style={{
          marginTop: 50, textAlign: 'center',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s ease 0.6s',
        }}>
          <p style={{ fontSize: 14, color: 'rgba(0,0,0,0.4)', marginBottom: 16 }}>Not sure which program is right for you?</p>
          <CTAButton href="#contact">Get Free Consultation <ArrowRight size={14} /></CTAButton>
        </div>
      </div>
    </section>
  )
}
