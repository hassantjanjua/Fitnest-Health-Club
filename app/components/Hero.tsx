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
  const [isMobile, setIsMobile] = useState(false)
  const countersStarted = useRef(false)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
      paddingTop: isMobile ? 90 : 110,
      paddingBottom: isMobile ? 60 : 60,
      background: '#080808',
    }}>

      {/* Ambient glows */}
      <div style={{
        position: 'absolute', top: '-10%', left: '-20%',
        width: isMobile ? '150vw' : '80vw',
        height: isMobile ? '150vw' : '80vw',
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

      {/* Diagonal lines */}
      {!isMobile && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
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
      )}

      <div style={{
        maxWidth: 1400, margin: '0 auto',
        padding: isMobile ? '0 20px' : '0 48px',
        width: '100%', position: 'relative', zIndex: 1,
      }}>

        {/* Eyebrow */}
        <div style={{
          ...fade(0.1),
          display: 'flex', alignItems: 'center',
          gap: 12, marginBottom: isMobile ? 20 : 28,
        }}>
          <div style={{ width: isMobile ? 28 : 44, height: 2, background: 'var(--accent-orange)', flexShrink: 0 }} />
          <span style={{
            fontSize: isMobile ? 9 : 11, fontWeight: 700,
            letterSpacing: isMobile ? '0.18em' : '0.28em',
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
              fontSize: isMobile ? 'clamp(80px, 22vw, 120px)' : 'clamp(100px, 14vw, 210px)',
              color: '#ffffff', margin: 0, lineHeight: 0.88,
              letterSpacing: '0.01em',
            }}>BUILD</h1>
          </div>

          <div style={fade(0.22)}>
            <h1 style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: isMobile ? 'clamp(80px, 22vw, 120px)' : 'clamp(100px, 14vw, 210px)',
              color: 'transparent',
              WebkitTextStroke: isMobile ? '1.5px rgba(255,255,255,0.15)' : '2px rgba(255,255,255,0.15)',
              margin: 0, lineHeight: 0.88, letterSpacing: '0.01em',
            }}>YOUR</h1>
          </div>

          <div style={{ ...fade(0.28), position: 'relative' }}>
            <h1 style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: isMobile ? 'clamp(80px, 22vw, 120px)' : 'clamp(100px, 14vw, 210px)',
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
              height: isMobile ? 3 : 4,
              background: 'linear-gradient(90deg, var(--accent-orange), #ff9500)',
              width: wordVisible ? (isMobile ? '100%' : '100%') : '0%',
              transition: 'width 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s',
              maxWidth: isMobile ? '100%' : 680,
              marginTop: 6,
            }} />
          </div>
        </div>

        {/* Bottom section: desc + card */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 420px',
          gap: isMobile ? 40 : 80,
          alignItems: 'start',
          marginTop: isMobile ? 36 : 52,
        }}>

          {/* Left */}
          <div>
            <p style={{
              ...fade(0.42),
              fontSize: isMobile ? 15 : 17,
              color: 'rgba(255,255,255,0.45)',
              lineHeight: 1.8, marginBottom: isMobile ? 28 : 38,
              maxWidth: 520,
            }}>
              Pakistan s most driven fitness community. State-of-the-art equipment,
              elite coaches, and a culture built on transformation — not just workouts.
            </p>

            {/* CTA buttons */}
            <div style={{
              ...fade(0.52),
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? 12 : 16,
              marginBottom: isMobile ? 32 : 44,
            }}>
              <button style={{
                background: 'var(--accent-orange)', border: 'none',
                color: '#fff',
                padding: isMobile ? '16px 28px' : '18px 44px',
                fontSize: isMobile ? 11 : 12, fontWeight: 700,
                letterSpacing: '0.16em', textTransform: 'uppercase',
                cursor: 'none', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 10,
                clipPath: 'polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px))',
                transition: 'all 0.3s ease',
                width: isMobile ? '100%' : 'auto',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#ff7a00'
                  e.currentTarget.style.boxShadow = '0 16px 40px rgba(255,107,0,0.3)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'var(--accent-orange)'
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                Start Your Journey <ArrowRight size={15} />
              </button>

              <button style={{
                background: 'transparent',
                border: '1.5px solid rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.75)',
                padding: isMobile ? '16px 28px' : '18px 36px',
                fontSize: isMobile ? 11 : 12, fontWeight: 700,
                letterSpacing: '0.16em', textTransform: 'uppercase',
                cursor: 'none', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 12,
                borderRadius: 2, transition: 'all 0.3s ease',
                width: isMobile ? '100%' : 'auto',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,107,0,0.5)'
                  e.currentTarget.style.color = '#fff'
                  e.currentTarget.style.background = 'rgba(255,107,0,0.05)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.75)'
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  border: '1.5px solid rgba(255,107,0,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
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
                    width: isMobile ? 32 : 38, height: isMobile ? 32 : 38,
                    borderRadius: '50%', border: '2.5px solid #080808',
                    background: `hsl(${i * 40 + 10}, 65%, 48%)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: isMobile ? 9 : 10, fontWeight: 800, color: '#fff',
                    marginLeft: i > 0 ? -10 : 0, zIndex: 5 - i, position: 'relative',
                  }}>{init}</div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: isMobile ? 12 : 13, fontWeight: 700, color: '#fff' }}>
                  500+ members trust Fitnest
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4 }}>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} style={{ color: '#FFB800', fontSize: isMobile ? 11 : 12 }}>★</span>
                  ))}
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>5.0 · 200+ reviews</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Snapshot card (hidden on mobile, shown below stats instead) */}
          {!isMobile && (
            <div style={{ ...fade(0.38) }}>
              <SnapshotCard />
            </div>
          )}
        </div>

        {/* Mobile snapshot card */}
        {isMobile && (
          <div style={{ ...fade(0.5), marginTop: 36 }}>
            <SnapshotCard isMobile />
          </div>
        )}

        {/* Stats bar */}
        <div ref={statsRef} style={{
          ...fade(0.72),
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          marginTop: isMobile ? 40 : 60,
          border: '1px solid rgba(255,107,0,0.1)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 1,
            background: 'linear-gradient(90deg, transparent, var(--accent-orange), transparent)',
          }} />
          {stats.map(({ icon: Icon, suffix, label }, i) => (
            <div key={label} style={{
              padding: isMobile ? '24px 16px' : '34px 24px',
              textAlign: 'center',
              borderRight: isMobile
                ? (i % 2 === 0 ? '1px solid rgba(255,255,255,0.05)' : 'none')
                : (i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none'),
              borderBottom: isMobile && i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              background: 'rgba(255,255,255,0.01)',
              transition: 'background 0.3s ease',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,107,0,0.06)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.01)')}
            >
              <div style={{
                width: isMobile ? 36 : 44, height: isMobile ? 36 : 44,
                margin: '0 auto 12px',
                background: 'rgba(255,107,0,0.08)', border: '1px solid rgba(255,107,0,0.18)',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={isMobile ? 15 : 18} color="var(--accent-orange)" />
              </div>
              <div style={{
                fontFamily: 'Bebas Neue',
                fontSize: isMobile ? 44 : 58,
                lineHeight: 1, color: '#fff',
              }}>
                {counts[i]}
                <span style={{ color: 'var(--accent-orange)', fontSize: isMobile ? 34 : 46 }}>{suffix}</span>
              </div>
              <div style={{
                fontSize: 9, fontWeight: 700, letterSpacing: '0.18em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginTop: 8,
              }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div style={{
        position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        opacity: visible ? 0.5 : 0, transition: 'opacity 1.2s ease 1.6s', cursor: 'none',
      }}>
        <span style={{ fontSize: 9, letterSpacing: '0.28em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
          Scroll
        </span>
        <ChevronDown size={15} color="var(--accent-orange)" style={{ animation: 'bounce 2s ease infinite' }} />
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(7px); }
        }
      `}</style>
    </section>
  )
}

function SnapshotCard({ isMobile = false }: { isMobile?: boolean }) {
  return (
    <div style={{
      border: '1px solid rgba(255,107,0,0.2)',
      background: 'rgba(14,14,14,0.95)',
      backdropFilter: 'blur(20px)',
      position: 'relative', overflow: 'hidden',
      clipPath: 'polygon(0 0,calc(100% - 20px) 0,100% 20px,100% 100%,20px 100%,0 calc(100% - 20px))',
    }}>
      <div style={{ height: 3, background: 'linear-gradient(90deg, var(--accent-orange), #ff9500)' }} />
      <div style={{ padding: isMobile ? '20px 20px' : '26px 28px' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--accent-orange)' }}>
            Today s Snapshot
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
            <div key={item.label} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              padding: '14px 16px', borderRadius: 4, transition: 'all 0.2s ease',
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,107,0,0.07)'
                ;(e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,107,0,0.2)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)'
                ;(e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.06)'
              }}
            >
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>
                {item.label}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontFamily: 'Bebas Neue', fontSize: 32, color: '#fff', lineHeight: 1 }}>{item.value}</span>
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>{item.unit}</span>
              </div>
            </div>
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

        <button style={{
          width: '100%', background: 'var(--accent-orange)', border: 'none',
          color: '#fff', padding: '15px', fontSize: 11, fontWeight: 700,
          letterSpacing: '0.16em', textTransform: 'uppercase', cursor: 'none',
          borderRadius: 2, marginTop: 16, transition: 'all 0.25s ease',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}
          onMouseEnter={e => { e.currentTarget.style.background = '#ff7a00'; e.currentTarget.style.letterSpacing = '0.2em' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent-orange)'; e.currentTarget.style.letterSpacing = '0.16em' }}
        >
          Book a Free Trial <ArrowRight size={13} />
        </button>
      </div>

      <style jsx>{`
        @keyframes glow {
          0%,100% { box-shadow: 0 0 8px rgba(34,197,94,0.6); }
          50% { box-shadow: 0 0 16px rgba(34,197,94,1); }
        }
      `}</style>
    </div>
  )
}