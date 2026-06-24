'use client'
import { useEffect, useRef, useState } from 'react'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Muhammad Ali',
    role: 'Lost 25kg in 6 months',
    initials: 'MA',
    text: "Fitnest completely changed my life. The trainers are incredible — they pushed me beyond what I thought I could achieve. The community here is like family. I've never felt more confident and healthy.",
    rating: 5,
  },
  {
    name: 'Ayesha Khan',
    role: 'Member since 2019',
    initials: 'AK',
    text: "As a working woman, finding a gym with female-only zones was crucial. Fitnest provided not just the space but amazing trainers who understand women's fitness goals. Absolutely love it here!",
    rating: 5,
  },
  {
    name: 'Hamza Sheikh',
    role: 'Competitive Powerlifter',
    initials: 'HS',
    text: "The equipment quality is on par with international gyms. Ahmed Raza's powerlifting program took my deadlift from 120kg to 200kg in one year. No other gym in Lahore comes close.",
    rating: 5,
  },
  {
    name: 'Fatima Zahra',
    role: 'CrossFit Enthusiast',
    initials: 'FZ',
    text: "The group CrossFit sessions are the highlight of my week. The energy is electric! I've made lifelong friends here and my fitness has improved drastically in just 4 months.",
    rating: 5,
  },
]

export default function Testimonials() {
  const [active, setActive] = useState(0)
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true)
    }, { threshold: 0.1 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActive(p => (p + 1) % testimonials.length)
    }, 5000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  const goTo = (i: number) => {
    setActive(i)
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setActive(p => (p + 1) % testimonials.length)
    }, 5000)
  }

  const prev = () => goTo((active - 1 + testimonials.length) % testimonials.length)
  const next = () => goTo((active + 1) % testimonials.length)

  const t = testimonials[active]

  return (
    <section id="testimonials" style={{
      padding: '100px 0', background: '#111',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background watermark */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        fontFamily: 'Bebas Neue', fontSize: 'clamp(120px, 20vw, 300px)',
        color: 'rgba(255,255,255,0.02)',
        whiteSpace: 'nowrap', pointerEvents: 'none',
        letterSpacing: '0.05em',
      }}>
        FEEDBACK
      </div>

      {/* Floating circles */}
      <div style={{
        position: 'absolute', top: '10%', right: '10%',
        width: 200, height: 200, borderRadius: '50%',
        border: '1px solid rgba(255,107,0,0.06)',
        pointerEvents: 'none',
        animation: 'rotateSlow 30s linear infinite',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: '50%', width: 8, height: 8,
          borderRadius: '50%', background: 'rgba(255,107,0,0.3)',
          transform: 'translate(-50%, -50%)',
        }} />
      </div>

      <div ref={ref} style={{ maxWidth: 1400, margin: '0 auto', padding: '0 48px', position: 'relative', zIndex: 1 }} className="hero-container">
        {/* Header */}
        <div style={{
          textAlign: 'center', marginBottom: 60,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 44, height: 2, background: 'var(--accent-orange)' }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--accent-orange)' }}>
              Testimonials
            </span>
            <div style={{ width: 44, height: 2, background: 'var(--accent-orange)' }} />
          </div>
          <h2 style={{
            fontFamily: 'Bebas Neue', fontSize: 'clamp(48px, 8vw, 96px)',
            lineHeight: 0.95, letterSpacing: '0.02em', color: '#fff',
          }}>
            WHAT OUR <span style={{ color: 'var(--accent-orange)' }}>MEMBERS</span> SAY
          </h2>
        </div>

        {/* Testimonial Card */}
        <div style={{
          maxWidth: 800, margin: '0 auto',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.8s ease 0.3s',
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            padding: '48px 56px',
            position: 'relative',
            clipPath: 'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))',
          }}>
            {/* Quote icon */}
            <div style={{
              position: 'absolute', top: -20, left: 56,
              width: 48, height: 48, background: 'var(--accent-orange)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
            }}>
              <Quote size={20} color="#fff" />
            </div>

            {/* Stars */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
              {[...Array(t.rating)].map((_, i) => (
                <Star key={i} size={14} fill="#FFB800" color="#FFB800" />
              ))}
            </div>

            {/* Text */}
            <div style={{ minHeight: 100 }}>
              <p key={active} style={{
                fontSize: 17, lineHeight: 1.9, color: 'rgba(255,255,255,0.5)',
                fontStyle: 'italic',
                animation: 'fadeIn 0.5s ease',
              }}>
                {t.text}
              </p>
            </div>

            {/* Author */}
            <div key={`author-${active}`} style={{
              display: 'flex', alignItems: 'center', gap: 16, marginTop: 32,
              paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)',
              animation: 'fadeIn 0.5s ease 0.15s both',
            }}>
              <div style={{
                width: 52, height: 52,
                background: active % 2 === 0 ? 'var(--accent-orange)' : 'rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 800, color: '#fff',
                clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
              }}>
                {t.initials}
              </div>
              <div>
                <h4 style={{ fontFamily: 'Bebas Neue', fontSize: 20, color: '#fff', letterSpacing: '0.03em' }}>
                  {t.name}
                </h4>
                <p style={{ fontSize: 11, color: 'var(--accent-orange)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {t.role}
                </p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginTop: 32,
          }}>
            {/* Dots */}
            <div style={{ display: 'flex', gap: 8 }}>
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  style={{
                    width: active === i ? 32 : 8, height: 8,
                    background: active === i ? 'var(--accent-orange)' : 'rgba(255,255,255,0.15)',
                    border: 'none', cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
                    clipPath: active === i
                      ? 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px))'
                      : 'none',
                    borderRadius: active === i ? 0 : '50%',
                  }}
                />
              ))}
            </div>

            {/* Arrows */}
            <div style={{ display: 'flex', gap: 8 }}>
              <NavArrow direction="left" onClick={prev} />
              <NavArrow direction="right" onClick={next} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function NavArrow({ direction, onClick }: { direction: 'left' | 'right'; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 44, height: 44,
        background: hovered ? 'var(--accent-orange)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${hovered ? 'var(--accent-orange)' : 'rgba(255,255,255,0.08)'}`,
        color: '#fff', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.3s ease',
        clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
      }}
    >
      {direction === 'left' ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
    </button>
  )
}
