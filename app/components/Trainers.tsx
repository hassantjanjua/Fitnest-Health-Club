'use client'
import { useEffect, useRef, useState } from 'react'
import { Award, ArrowUpRight } from 'lucide-react'

const InstagramIcon = ({ size = 12 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
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
  {
    name: 'Ahmed Raza',
    role: 'Head Strength Coach',
    exp: '10 Years',
    speciality: 'Powerlifting & Hypertrophy',
    cert: 'NASM-CPT, CSCS',
    initials: 'AR',
    color: '#e05e00',
  },
  {
    name: 'Sara Malik',
    role: 'Cardio & HIIT Specialist',
    exp: '7 Years',
    speciality: 'HIIT, Functional Fitness',
    cert: 'ACE Certified, CrossFit L2',
    initials: 'SM',
    color: '#cc4400',
  },
  {
    name: 'Bilal Khan',
    role: 'Personal Training Lead',
    exp: '9 Years',
    speciality: 'Body Transformation',
    cert: 'ISSA-CPT, Precision Nutrition',
    initials: 'BK',
    color: '#ff7a00',
  },
  {
    name: 'Zara Ahmed',
    role: 'Yoga & Mobility Coach',
    exp: '6 Years',
    speciality: 'Yoga, Stretching, Recovery',
    cert: 'RYT-500, FMS Certified',
    initials: 'ZA',
    color: '#ff9500',
  },
]

export default function Trainers() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true)
      },
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
        padding: 'clamp(60px, 10vw, 120px) 0',
        background: 'linear-gradient(180deg, #080808 0%, #0d0d0d 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow */}
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
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '-15%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,107,0,0.03) 0%, transparent 70%)',
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
            marginBottom: 'clamp(40px, 6vw, 72px)',
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
                fontSize: 'clamp(48px, 7vw, 100px)',
                lineHeight: 0.9,
                color: '#fff',
                margin: 0,
              }}
            >
              COACHED BY
              <br />
              <span style={{ color: 'transparent', WebkitTextStroke: '2px rgba(255,255,255,0.15)' }}>
                THE BEST
              </span>
              <br />
              <span style={{ color: 'var(--accent-orange)' }}>IN LAHORE.</span>
            </h2>
          </div>

          <div style={fade(0.26)}>
            <p
              style={{
                fontSize: 16,
                color: 'rgba(255,255,255,0.45)',
                lineHeight: 1.8,
                margin: 0,
                marginBottom: 24,
              }}
            >
              Every Fitnest trainer is internationally certified, continuously educated, and deeply invested
              in your success. They don&apos;t just coach — they transform.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {['Certified Pros', '30+ Combined Years', 'Personalized Approach'].map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: '7px 16px',
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    border: '1px solid rgba(255,107,0,0.3)',
                    color: 'var(--accent-orange)',
                    borderRadius: 2,
                    background: 'rgba(255,107,0,0.06)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Trainers Grid */}
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}
          className="trainers-grid"
        >
          {trainers.map((trainer, i) => (
            <TrainerCard key={trainer.name} trainer={trainer} index={i} fadeStyle={fade(0.1 + i * 0.08)} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ ...fade(0.5), textAlign: 'center', marginTop: 'clamp(40px, 5vw, 64px)' }}>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>
            Want to join our elite team of trainers?
          </p>
          <button
            className="btn-primary"
            style={{
              padding: '16px 44px',
              fontSize: 12,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            Apply Now <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </section>
  )
}

function TrainerCard({
  trainer,
  index,
  fadeStyle,
}: {
  trainer: (typeof trainers)[0]
  index: number
  fadeStyle: React.CSSProperties
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{
        ...fadeStyle,
        border: `1px solid ${hovered ? 'rgba(255,107,0,0.35)' : 'rgba(255,255,255,0.06)'}`,
        background: hovered ? 'rgba(255,107,0,0.05)' : 'rgba(255,255,255,0.02)',
        transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
        cursor: 'pointer',
        overflow: 'hidden',
        position: 'relative',
        transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: hovered ? '0 20px 40px rgba(255,107,0,0.1)' : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top accent line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${trainer.color}, ${trainer.color}88)`,
          transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
          transformOrigin: 'left',
          transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
        }}
      />

      {/* Avatar Section */}
      <div
        style={{
          height: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${trainer.color}11, ${trainer.color}05)`,
          position: 'relative',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        {/* Avatar circle */}
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: `${trainer.color}18`,
            border: `2px solid ${trainer.color}44`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: hovered ? 'scale(1.12) rotate(-3deg)' : 'scale(1) rotate(0deg)',
            transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
            boxShadow: hovered ? `0 8px 32px ${trainer.color}33` : 'none',
          }}
        >
          <span
            style={{
              fontFamily: 'Bebas Neue',
              fontSize: 36,
              color: trainer.color,
              transition: 'transform 0.3s ease',
              transform: hovered ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            {trainer.initials}
          </span>
        </div>

        {/* Experience badge */}
        <div
          style={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            background: 'rgba(8,8,8,0.95)',
            border: '1px solid rgba(255,107,0,0.25)',
            padding: '6px 12px',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            clipPath: 'polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,6px 100%,0 calc(100% - 6px))',
            transition: 'all 0.3s ease',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
          }}
        >
          <Award size={12} color="var(--accent-orange)" />
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent-orange)', letterSpacing: '0.05em' }}>
            {trainer.exp}
          </span>
        </div>

        {/* Index number */}
        <div
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            fontFamily: 'Bebas Neue',
            fontSize: 48,
            color: 'rgba(255,255,255,0.03)',
            lineHeight: 1,
            transition: 'color 0.3s ease',
          }}
        >
          0{index + 1}
        </div>
      </div>

      {/* Info Section */}
      <div style={{ padding: 'clamp(16px, 2vw, 24px)' }}>
        <div
          style={{
            fontFamily: 'Bebas Neue',
            fontSize: 'clamp(22px, 2vw, 26px)',
            color: '#fff',
            marginBottom: 4,
            letterSpacing: '0.03em',
          }}
        >
          {trainer.name}
        </div>

        <div
          style={{
            fontSize: 10,
            color: trainer.color,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            marginBottom: 12,
          }}
        >
          {trainer.role}
        </div>

        {/* Speciality */}
        <div
          style={{
            fontSize: 12,
            color: 'rgba(255,255,255,0.4)',
            lineHeight: 1.5,
            marginBottom: 8,
            opacity: hovered ? 1 : 0.7,
            transition: 'opacity 0.3s ease',
          }}
        >
          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 9, letterSpacing: '0.1em' }}>SPECIALITY: </span>
          {trainer.speciality}
        </div>

        {/* Certifications */}
        <div
          style={{
            fontSize: 11,
            color: 'rgba(255,255,255,0.35)',
            marginBottom: 16,
            opacity: hovered ? 1 : 0.7,
            transition: 'opacity 0.3s ease',
          }}
        >
          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 9, letterSpacing: '0.1em' }}>CERTS: </span>
          {trainer.cert}
        </div>

        {/* Profile Button */}
        <ProfileButton hovered={hovered} color={trainer.color} />
      </div>
    </div>
  )
}

function ProfileButton({ hovered, color }: { hovered: boolean; color: string }) {
  const [btnHovered, setBtnHovered] = useState(false)

  return (
    <button
      onMouseEnter={() => setBtnHovered(true)}
      onMouseLeave={() => setBtnHovered(false)}
      style={{
        width: '100%',
        background: btnHovered ? `${color}22` : hovered ? 'rgba(255,107,0,0.08)' : 'transparent',
        border: `1px solid ${btnHovered ? color : 'rgba(255,107,0,0.2)'}`,
        color: btnHovered ? color : 'var(--accent-orange)',
        padding: '12px',
        fontSize: 10,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.14em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: btnHovered ? 10 : 6,
        cursor: 'pointer',
        clipPath: 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))',
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        transform: btnHovered ? 'scale(1.02)' : 'scale(1)',
      }}
    >
      <InstagramIcon size={12} /> View Profile
    </button>
  )
}
