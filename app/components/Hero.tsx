'use client'
import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Play, ChevronDown, Flame, Users, Trophy, Dumbbell } from 'lucide-react'

const stats = [
  { icon: Users, value: 500, suffix: '+', label: 'Active Members' },
  { icon: Trophy, value: 15, suffix: '+', label: 'Expert Trainers' },
  { icon: Flame, value: 8, suffix: 'Y', label: 'Years Strong' },
  { icon: Dumbbell, value: 20, suffix: '+', label: 'Programs' },
]

const words = ['STRENGTH', 'POWER', 'ENDURANCE', 'RESULTS']

export default function Hero() {
  const [visible, setVisible] = useState(false)
  const [counts, setCounts] = useState([0, 0, 0, 0])
  const [wordIndex, setWordIndex] = useState(0)
  const [wordVisible, setWordVisible] = useState(true)
  const countersStarted = useRef(false)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const cycle = setInterval(() => {
      setWordVisible(false)
      setTimeout(() => {
        setWordIndex(i => (i + 1) % words.length)
        setWordVisible(true)
      }, 350)
    }, 2800)
    return () => clearInterval(cycle)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !countersStarted.current) {
        countersStarted.current = true
        const targets = [500, 15, 8, 20]
        let step = 0
        const total = 55
        const iv = setInterval(() => {
          step++
          const p = 1 - Math.pow(1 - step / total, 4)
          setCounts(targets.map(t => Math.floor(t * p)))
          if (step >= total) { setCounts(targets); clearInterval(iv) }
        }, 1800 / total)
      }
    }, { threshold: 0.2 })
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  const fade = (delay: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0px)' : 'translateY(36px)',
    transition: `opacity 0.9s ease ${delay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  })

  return (
    <section id="home" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      paddingTop: 110,
      paddingBottom: 60,
      background: '#080808',
    }}>

      {/* Ambient glows */}
      <div style={{
        position: 'absolute', top: '-10%', left: '-20%',
        width: '80vw', height: '80vw',
        maxWidth: 900, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,107,0,0.11) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-10%', right: '-15%',
        width: '60vw', height: '60vw', maxWidth: 700, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,107,0,0.06) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      {/* Diagonal lines - CSS only, hidden on mobile via opacity */}
      <div className="hero-diagonals" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute', top: '-50%',
            right: `${i * 140 - 80}px`,
            width: '1px', height: '200%',
            background: 'rgba(255,107,0,0.035)',
            transform: 'rotate(-20deg)',
          }} />
        ))}
      </div>

      <div style={{
        maxWidth: 1400, margin: '0 auto',
        padding: '0 48px',
        width: '100%', position: 'relative', zIndex: 1,
      }} className="hero-container">

        {/* Eyebrow */}
        <div style={{
          ...fade(0.1),
          display: 'flex', alignItems: 'center',
          gap: 12, marginBottom: 28,
        }}>
          <div style={{ width: 44, height: 2, background: 'var(--accent-orange)', flexShrink: 0 }} />
          <span style={{
            fontSize: 11, fontWeight: 700,
            letterSpacing: '0.28em',
            textTransform: 'uppercase', color: 'var(--accent-orange)',
          }}>
            Model Town · Lahore · Est. 2017
          </span>
        </div>

        {/* Giant Headline */}
        <div style={{ marginBottom: 0, lineHeight: 0.88 }}>
          <div style={fade(0.15)}>
            <h1 style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(72px, 14vw, 210px)',
              color: '#ffffff', margin: 0, lineHeight: 0.88,
              letterSpacing: '0.01em',
            }}>BUILD</h1>
          </div>

          <div style={fade(0.22)}>
            <h1 style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(72px, 14vw, 210px)',
              color: 'transparent',
              WebkitTextStroke: '2px rgba(255,255,255,0.15)',
              margin: 0, lineHeight: 0.88, letterSpacing: '0.01em',
            }}>YOUR</h1>
          </div>

          <div style={{ ...fade(0.28), position: 'relative' }}>
            <h1 style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(72px, 14vw, 210px)',
              color: 'var(--accent-orange)',
              margin: 0, lineHeight: 0.88, letterSpacing: '0.01em',
              display: 'inline-block',
              opacity: wordVisible ? 1 : 0,
              transform: wordVisible ? 'translateY(0) skewX(0deg)' : 'translateY(-30px) skewX(-3deg)',
              transition: 'opacity 0.35s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1)',
            }}>
              {words[wordIndex]}
            </h1>
            <div style={{
              height: 4,
              background: 'linear-gradient(90deg, var(--accent-orange), #ff9500)',
              width: wordVisible ? '100%' : '0%',
              transition: 'width 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s',
              maxWidth: 680,
              marginTop: 6,
            }} />
          </div>
        </div>

        {/* Bottom section: desc + card */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 420px',
          gap: 80,
          alignItems: 'start',
          marginTop: 52,
        }} className="hero-bottom-grid">

          {/* Left */}
          <div>
            <p style={{
              ...fade(0.42),
              fontSize: 17,
              color: 'rgba(255,255,255,0.45)',
              lineHeight: 1.8, marginBottom: 38,
              maxWidth: 520,
            }}>
              Pakistan&apos;s most driven fitness community. State-of-the-art equipment,
              elite coaches, and a culture built on transformation — not just workouts.
            </p>

            {/* CTA buttons */}
            <div style={{
              ...fade(0.52),
              display: 'flex',
              gap: 16,
              marginBottom: 44,
            }} className="hero-cta-row">
              <button
                className="btn-primary"
                style={{
                  padding: '18px 44px',
                  fontSize: 12,
                  display: 'flex', alignItems: 'center',
                  gap: 10,
                }}
              >
                Start Your Journey <ArrowRight size={15} />
              </button>

              <button
                className="btn-outline"
                style={{
                  padding: '18px 36px',
                  fontSize: 12,
                  display: 'flex', alignItems: 'center',
                  gap: 12,
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  border: '1.5px solid rgba(255,107,0,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  transition: 'all 0.3s ease',
                }}>
                  <Play size={12} fill="var(--accent-orange)" color="var(--accent-orange)" style={{ marginLeft: 2 }} />
                </div>
                Watch Story
              </button>
            </div>

            {/* Trust */}
            <div style={{ ...fade(0.62), display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex' }}>
                {['AK', 'MR', 'SH', 'ZA', 'FA'].map((init, i) => (
                  <div key={init} style={{
                    width: 38, height: 38,
                    borderRadius: '50%', border: '2.5px solid #080808',
                    background: `hsl(${i * 40 + 10}, 65%, 48%)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 800, color: '#fff',
                    marginLeft: i > 0 ? -10 : 0, zIndex: 5 - i, position: 'relative',
                  }}>{init}</div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>
                  500+ members trust Fitnest
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4 }}>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} style={{ color: '#FFB800', fontSize: 12 }}>★</span>
                  ))}
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>5.0 · 200+ reviews</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Snapshot card */}
          <div style={{ ...fade(0.38) }}>
            <SnapshotCard />
          </div>
        </div>

        {/* Stats bar */}
        <div ref={statsRef} style={{
          ...fade(0.72),
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          marginTop: 60,
          border: '1px solid rgba(255,107,0,0.1)',
          position: 'relative', overflow: 'hidden',
        }} className="hero-stats-grid">
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 1,
            background: 'linear-gradient(90deg, transparent, var(--accent-orange), transparent)',
          }} />
          {stats.map(({ icon: Icon, suffix, label }, i) => (
            <StatCard key={label} Icon={Icon} suffix={suffix} label={label} count={counts[i]} index={i} />
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <a href="#services" style={{
        position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        opacity: visible ? 0.5 : 0, transition: 'opacity 1.2s ease 1.6s',
        cursor: 'pointer', textDecoration: 'none',
      }}>
        <span style={{ fontSize: 9, letterSpacing: '0.28em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
          Scroll
        </span>
        <ChevronDown size={15} color="var(--accent-orange)" style={{ animation: 'bounce 2s ease infinite' }} />
      </a>
    </section>
  )
}

function StatCard({ Icon, suffix, label, count, index }: {
  Icon: React.ElementType; suffix: string; label: string; count: number; index: number
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <div style={{
      padding: '34px 24px',
      textAlign: 'center',
      borderRight: index < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none',
      background: hovered ? 'rgba(255,107,0,0.06)' : 'rgba(255,255,255,0.01)',
      transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
      cursor: 'default',
      transform: hovered ? 'scale(1.02)' : 'scale(1)',
    }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        width: 44, height: 44,
        margin: '0 auto 12px',
        background: hovered ? 'rgba(255,107,0,0.15)' : 'rgba(255,107,0,0.08)',
        border: `1px solid ${hovered ? 'rgba(255,107,0,0.4)' : 'rgba(255,107,0,0.18)'}`,
        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.35s ease',
        transform: hovered ? 'scale(1.1)' : 'scale(1)',
      }}>
        <Icon size={18} color="var(--accent-orange)" />
      </div>
      <div style={{
        fontFamily: 'Bebas Neue',
        fontSize: 'clamp(38px, 5vw, 58px)',
        lineHeight: 1, color: '#fff',
      }}>
        {count}
        <span style={{ color: 'var(--accent-orange)', fontSize: 'clamp(28px, 4vw, 46px)' }}>{suffix}</span>
      </div>
      <div style={{
        fontSize: 9, fontWeight: 700, letterSpacing: '0.18em',
        textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginTop: 8,
      }}>
        {label}
      </div>
    </div>
  )
}

function SnapshotCard() {
  return (
    <div style={{
      border: '1px solid rgba(255,107,0,0.2)',
      background: 'rgba(14,14,14,0.95)',
      backdropFilter: 'blur(20px)',
      position: 'relative', overflow: 'hidden',
      clipPath: 'polygon(0 0,calc(100% - 20px) 0,100% 20px,100% 100%,20px 100%,0 calc(100% - 20px))',
    }}>
      <div style={{ height: 3, background: 'linear-gradient(90deg, var(--accent-orange), #ff9500)' }} />
      <div style={{ padding: '26px 28px' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--accent-orange)' }}>
            Today&apos;s Snapshot
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 7, height: 7, borderRadius: '50%', background: '#22c55e',
              boxShadow: '0 0 8px rgba(34,197,94,0.7)', animation: 'glow 2s ease infinite',
            }} />
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>OPEN · 6AM–11PM</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
          {[
            { label: 'Members In', value: '47', unit: 'now' },
            { label: 'Classes Today', value: '6', unit: 'sessions' },
            { label: 'Free Slots', value: '12', unit: 'left' },
            { label: 'Avg Rating', value: '4.9', unit: '/ 5.0' },
          ].map(item => (
            <SnapshotItem key={item.label} {...item} />
          ))}
        </div>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', marginBottom: 16 }} />

        {['Free trial session for new members', 'Personal trainer consultation included', 'No joining fee this month'].map(feat => (
          <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{
              width: 18, height: 18, borderRadius: '50%',
              background: 'rgba(255,107,0,0.12)', border: '1px solid rgba(255,107,0,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <span style={{ color: 'var(--accent-orange)', fontSize: 10, fontWeight: 900 }}>✓</span>
            </div>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>{feat}</span>
          </div>
        ))}

        <button
          className="btn-primary"
          style={{
            width: '100%',
            padding: '15px',
            fontSize: 11,
            marginTop: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          Book a Free Trial <ArrowRight size={13} />
        </button>
      </div>
    </div>
  )
}

function SnapshotItem({ label, value, unit }: { label: string; value: string; unit: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div style={{
      background: hovered ? 'rgba(255,107,0,0.07)' : 'rgba(255,255,255,0.03)',
      border: `1px solid ${hovered ? 'rgba(255,107,0,0.2)' : 'rgba(255,255,255,0.06)'}`,
      padding: '14px 16px', borderRadius: 4,
      transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
      transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
      cursor: 'default',
    }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontFamily: 'Bebas Neue', fontSize: 32, color: '#fff', lineHeight: 1 }}>{value}</span>
        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>{unit}</span>
      </div>
    </div>
  )
}
