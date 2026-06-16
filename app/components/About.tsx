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
      padding: 'clamp(60px, 10vw, 120px) 0',
      background: '#080808',
      position: 'relative',
      overflow: 'hidden',
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'end', marginBottom: 'clamp(48px, 6vw, 80px)' }} className="about-top">
          <div>
            <div style={{ ...fade(0.1), display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 40, height: 2, background: 'var(--accent-orange)' }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--accent-orange)' }}>
                About Fitnest
              </span>
            </div>
            <h2 style={{
              ...fade(0.18),
              fontFamily: 'Bebas Neue', fontSize: 'clamp(48px, 7vw, 100px)',
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
              Since 2017, we&apos;ve been Lahore&apos;s most trusted transformation hub, combining elite coaching with
              a community that genuinely cares about your progress.
            </p>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.5)', lineHeight: 1.85, marginBottom: 32 }}>
              Located in the heart of Model Town, our 10,000 sq ft facility is packed with the latest
              equipment, expert trainers, and programs built for every fitness level.
            </p>
            <StoryButton />
          </div>
        </div>

        {/* Values grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 1, marginBottom: 'clamp(48px, 6vw, 80px)',
          background: 'rgba(255,107,0,0.08)',
          border: '1px solid rgba(255,107,0,0.1)',
        }} className="values-grid">
          {values.map((value, i) => (
            <ValueCard key={value.title} value={value} index={i} fadeStyle={fade(0.1 + i * 0.08)} />
          ))}
        </div>

        {/* Timeline + stats split */}
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
                <MilestoneItem key={m.year} milestone={m} isLast={i === milestones.length - 1} />
              ))}
            </div>
          </div>

          {/* Stats visual */}
          <div style={{ ...fade(0.3), position: 'relative' }}>
            <StatsCard visible={visible} />
          </div>
        </div>
      </div>
    </section>
  )
}

function StoryButton() {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center',
        gap: hovered ? 14 : 8,
        background: 'transparent', border: 'none',
        color: 'var(--accent-orange)', fontSize: 12, fontWeight: 700,
        letterSpacing: '0.16em', textTransform: 'uppercase', cursor: 'pointer',
        padding: 0, transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      Our Full Story
      <ChevronRight
        size={16}
        style={{
          transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1)',
          transform: hovered ? 'translateX(4px)' : 'translateX(0)',
        }}
      />
    </button>
  )
}

function ValueCard({ value, index, fadeStyle }: {
  value: typeof values[0]
  index: number
  fadeStyle: React.CSSProperties
}) {
  const [hovered, setHovered] = useState(false)
  const Icon = value.icon

  return (
    <div
      style={{
        ...fadeStyle,
        padding: 'clamp(24px, 3vw, 40px) clamp(20px, 2vw, 32px)',
        background: hovered ? 'rgba(255,107,0,0.05)' : '#080808',
        borderRight: index < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none',
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        cursor: 'default',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        width: 52, height: 52, marginBottom: 20,
        background: hovered ? 'rgba(255,107,0,0.15)' : 'rgba(255,107,0,0.1)',
        border: `1px solid ${hovered ? 'rgba(255,107,0,0.4)' : 'rgba(255,107,0,0.2)'}`,
        clipPath: 'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        transform: hovered ? 'scale(1.1) rotate(-3deg)' : 'scale(1) rotate(0deg)',
      }}>
        <Icon size={22} color="var(--accent-orange)" />
      </div>
      <h3 style={{
        fontFamily: 'Bebas Neue',
        fontSize: 'clamp(20px, 2vw, 24px)',
        color: '#fff',
        letterSpacing: '0.05em',
        marginBottom: 12,
      }}>
        {value.title}
      </h3>
      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, margin: 0 }}>
        {value.desc}
      </p>
    </div>
  )
}

function MilestoneItem({ milestone, isLast }: {
  milestone: typeof milestones[0]
  isLast: boolean
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{
        display: 'flex', gap: 24, alignItems: 'flex-start',
        paddingBottom: isLast ? 0 : 32,
        position: 'relative',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Line */}
      {!isLast && (
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
        background: hovered ? 'rgba(255,107,0,0.2)' : 'rgba(255,107,0,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', zIndex: 1,
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        transform: hovered ? 'scale(1.15)' : 'scale(1)',
      }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: 'var(--accent-orange)',
          transition: 'transform 0.3s ease',
          transform: hovered ? 'scale(1.3)' : 'scale(1)',
        }} />
      </div>
      <div style={{
        paddingTop: 8,
        transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1)',
        transform: hovered ? 'translateX(6px)' : 'translateX(0)',
      }}>
        <div style={{
          fontFamily: 'Bebas Neue',
          fontSize: 28,
          color: 'var(--accent-orange)',
          lineHeight: 1,
          marginBottom: 6,
        }}>
          {milestone.year}
        </div>
        <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
          {milestone.event}
        </div>
      </div>
    </div>
  )
}

function StatsCard({ visible }: { visible: boolean }) {
  const stats = [
    { label: 'Member Retention Rate', value: 94 },
    { label: 'Goal Achievement Rate', value: 87 },
    { label: 'Trainer Satisfaction', value: 98 },
    { label: 'Facility Cleanliness', value: 99 },
  ]

  return (
    <div style={{
      background: 'rgba(255,107,0,0.04)',
      border: '1px solid rgba(255,107,0,0.15)',
      padding: 'clamp(32px, 4vw, 48px) clamp(28px, 3vw, 40px)',
      clipPath: 'polygon(0 0,calc(100% - 24px) 0,100% 24px,100% 100%,24px 100%,0 calc(100% - 24px))',
    }}>
      <div style={{
        fontFamily: 'Bebas Neue',
        fontSize: 11,
        letterSpacing: '0.28em',
        color: 'var(--accent-orange)',
        marginBottom: 32,
        textTransform: 'uppercase',
      }}>
        Why Members Choose Us
      </div>
      {stats.map((item, i) => (
        <StatBar key={item.label} item={item} index={i} isLast={i === stats.length - 1} visible={visible} />
      ))}
    </div>
  )
}

function StatBar({ item, index, isLast, visible }: {
  item: { label: string; value: number }
  index: number
  isLast: boolean
  visible: boolean
}) {
  const animDelay = 0.3 + index * 0.1
  
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{ marginBottom: isLast ? 0 : 28 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{
          fontSize: 13,
          color: hovered ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.6)',
          fontWeight: 500,
          transition: 'color 0.3s ease',
        }}>
          {item.label}
        </span>
        <span style={{
          fontSize: 13,
          color: 'var(--accent-orange)',
          fontWeight: 700,
          transition: 'transform 0.3s ease',
          transform: hovered ? 'scale(1.1)' : 'scale(1)',
        }}>
          {item.value}%
        </span>
      </div>
      <div style={{
        height: 4,
        background: 'rgba(255,255,255,0.06)',
        borderRadius: 2,
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          borderRadius: 2,
          background: 'linear-gradient(90deg, var(--accent-orange), #ff9500)',
          width: visible ? `${item.value}%` : '0%',
          transition: `width 1.2s cubic-bezier(0.16,1,0.3,1) ${animDelay}s`,
          boxShadow: hovered ? '0 0 12px rgba(255,107,0,0.5)' : 'none',
        }} />
      </div>
    </div>
  )
}
