'use client'

import { useEffect, useRef, useState } from 'react'
import { Award } from 'lucide-react'

const InstagramIcon = ({ size = 12 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="/instagram-logo-facebook-2-svgrepo-com (2).svg"
  >
    <path
      d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M16.5 11.5a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
  </svg>
)

const trainers = [
  { name: 'Ahmed Raza', role: 'Head Strength Coach', exp: '10 Years', speciality: 'Powerlifting & Hypertrophy', cert: 'NASM-CPT, CSCS', initials: 'AR', color: '#e05e00' },
  { name: 'Sara Malik', role: 'Cardio & HIIT Specialist', exp: '7 Years', speciality: 'HIIT, Functional Fitness', cert: 'ACE Certified, CrossFit L2', initials: 'SM', color: '#cc4400' },
  { name: 'Bilal Khan', role: 'Personal Training Lead', exp: '9 Years', speciality: 'Body Transformation', cert: 'ISSA-CPT, Precision Nutrition', initials: 'BK', color: '#ff7a00' },
  { name: 'Zara Ahmed', role: 'Yoga & Mobility Coach', exp: '6 Years', speciality: 'Yoga, Stretching, Recovery', cert: 'RYT-500, FMS Certified', initials: 'ZA', color: '#ff9500' },
]

export default function Trainers() {
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState<number | null>(null)
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
    <section
      id="trainers"
      ref={ref}
      style={{
        padding: '120px 0',
        background: 'linear-gradient(180deg, #080808 0%, #0d0d0d 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '20%',
          right: '-10%',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,107,0,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 48px' }} className="trainers-container">
        
        {/* Header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 60,
            alignItems: 'end',
            marginBottom: 72,
          }}
          className="trainers-header"
        >
          <div>
            <div style={{ ...fade(0.1), display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 40, height: 2, background: 'var(--accent-orange)' }} />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: 'var(--accent-orange)',
                }}
              >
                Expert Team
              </span>
            </div>

            <h2
              style={{
                ...fade(0.18),
                fontFamily: 'Bebas Neue',
                fontSize: 'clamp(52px, 7vw, 100px)',
                lineHeight: 0.9,
                color: '#fff',
                margin: 0,
              }}
            >
              COACHED BY<br />
              <span style={{ color: 'transparent', WebkitTextStroke: '2px rgba(255,255,255,0.15)' }}>
                THE BEST
              </span>
              <br />
              <span style={{ color: 'var(--accent-orange)' }}>IN LAHORE.</span>
            </h2>
          </div>

          <p
            style={{
              ...fade(0.26),
              fontSize: 16,
              color: 'rgba(255,255,255,0.45)',
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            Every Fitnest trainer is internationally certified, continuously educated,
            and deeply invested in your success. They don’t just coach — they transform.
          </p>
        </div>

        {/* Trainers Grid */}
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}
          className="trainers-grid"
        >
          {trainers.map((trainer, i) => {
            const isHovered = hovered === i

            return (
              <div
                key={trainer.name}
                style={{
                  ...fade(0.1 + i * 0.08),
                  border: `1px solid ${isHovered ? 'rgba(255,107,0,0.35)' : 'rgba(255,255,255,0.06)'}`,
                  background: isHovered ? 'rgba(255,107,0,0.05)' : 'rgba(255,255,255,0.02)',
                  transition: 'all 0.35s ease',
                  cursor: 'none',
                  overflow: 'hidden',
                  position: 'relative',
                  transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
                }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Avatar */}
                <div
                  style={{
                    height: 220,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, rgba(255,107,0,0.06), rgba(255,107,0,0.02))',
                    position: 'relative',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  <div
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      background: `${trainer.color}22`,
                      border: `2px solid ${trainer.color}55`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'Bebas Neue',
                        fontSize: 36,
                        color: trainer.color,
                      }}
                    >
                      {trainer.initials}
                    </span>
                  </div>

                  {/* Experience */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 16,
                      right: 16,
                      background: 'rgba(8,8,8,0.9)',
                      border: '1px solid rgba(255,107,0,0.25)',
                      padding: '5px 10px',
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                    }}
                  >
                    <Award size={11} color="var(--accent-orange)" />
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent-orange)' }}>
                      {trainer.exp}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div style={{ padding: '24px 24px 28px' }}>
                  <div
                    style={{
                      fontFamily: 'Bebas Neue',
                      fontSize: 26,
                      color: '#fff',
                      marginBottom: 4,
                    }}
                  >
                    {trainer.name}
                  </div>

                  <div
                    style={{
                      fontSize: 11,
                      color: 'var(--accent-orange)',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      marginBottom: 14,
                    }}
                  >
                    {trainer.role}
                  </div>

                  <button
                    style={{
                      marginTop: 20,
                      width: '100%',
                      background: isHovered ? 'rgba(255,107,0,0.1)' : 'transparent',
                      border: '1px solid rgba(255,107,0,0.2)',
                      color: 'var(--accent-orange)',
                      padding: '10px',
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      cursor: 'none',
                    }}
                  >
                    <InstagramIcon size={12} /> View Profile
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}