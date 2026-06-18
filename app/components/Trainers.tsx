'use client'
import { useEffect, useRef, useState } from 'react'
import { Award, ArrowUpRight, X, Dumbbell, Calendar, BadgeCheck, ChevronRight } from 'lucide-react'

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

type TrainerProfile = {
  _id?: string
  name: string
  role: string
  exp: string
  speciality: string
  cert: string
  initials: string
  color: string
  bio: string
  achievements: string[]
  approach: string
  funFact: string
  social: string
}

type TrainerApiItem = {
  _id?: string
  name?: string
  role?: string
  experience?: string
  speciality?: string
  certifications?: string
  initials?: string
  color?: string
  instagram?: string
}

const fallbackTrainers: TrainerProfile[] = [
  {
    name: 'Ahmed Raza',
    role: 'Head Strength Coach',
    exp: '10 Years',
    speciality: 'Powerlifting & Hypertrophy',
    cert: 'NASM-CPT, CSCS',
    initials: 'AR',
    color: '#e05e00',
    bio: 'With over a decade of competitive powerlifting experience, Ahmed has helped hundreds of clients break through plateaus and achieve elite-level strength. His programming combines periodized hypertrophy blocks with evidence-based powerlifting techniques.',
    achievements: ['2x National Powerlifting Champion', '800+ lbs Deadlift Specialist', '1,000+ Transformations'],
    approach: 'Progressive overload with meticulous form coaching. Every rep has a purpose.',
    funFact: 'Can bench press 315 lbs for 10 reps... before breakfast.',
    social: '@ahmedraza_fit',
  },
  {
    name: 'Sara Malik',
    role: 'Cardio & HIIT Specialist',
    exp: '7 Years',
    speciality: 'HIIT, Functional Fitness',
    cert: 'ACE Certified, CrossFit L2',
    initials: 'SM',
    color: '#cc4400',
    bio: 'Sara turned her passion for high-intensity training into a mission to make fitness accessible and fun. Her HIIT classes are legendary at Fitnest for their energy, results, and camaraderie.',
    achievements: ['CrossFit Open Regional Qualifier', 'ACE Certified Personal Trainer', '300+ HIIT Classes Led'],
    approach: 'High-energy intervals with smart scaling. Everyone works at their limit — safely.',
    funFact: 'Once ran a half-marathon on a whim... with zero training.',
    social: '@sarafit_hitt',
  },
  {
    name: 'Bilal Khan',
    role: 'Personal Training Lead',
    exp: '9 Years',
    speciality: 'Body Transformation',
    cert: 'ISSA-CPT, Precision Nutrition',
    initials: 'BK',
    color: '#ff7a00',
    bio: 'Bilal is Fitnest\'s go-to transformation coach. Specializing in dramatic body recomposition, he blends strength training with precision nutrition to deliver visible, lasting results.',
    achievements: ['Precision Nutrition Level 1 Certified', '50+ Client Transformations >20kg', 'ISSA-CPT Master Trainer'],
    approach: 'Science-backed nutrition + progressive resistance training. Sustainable habits, not quick fixes.',
    funFact: 'Has a spreadsheet for everything — including his spreadsheet collection.',
    social: '@bilaltransforms',
  },
  {
    name: 'Zara Ahmed',
    role: 'Yoga & Mobility Coach',
    exp: '6 Years',
    speciality: 'Yoga, Stretching, Recovery',
    cert: 'RYT-500, FMS Certified',
    initials: 'ZA',
    color: '#ff9500',
    bio: 'Zara brings balance to the iron temple. Her yoga and mobility sessions are the perfect counterpoint to heavy lifting — helping athletes move better, recover faster, and prevent injury.',
    achievements: ['RYT-500 Certified Yoga Teacher', 'FMS (Functional Movement Screen) Certified', '500+ Yoga Sessions'],
    approach: 'Mindful movement meets athletic performance. Flexibility is a superpower.',
    funFact: 'Can hold a handstand for over 3 minutes. Yes, really.',
    social: '@zara_yogastrong',
  },
]

export default function Trainers() {
  const [visible, setVisible] = useState(false)
  const [trainers, setTrainers] = useState<TrainerProfile[]>(fallbackTrainers)
  const [selectedTrainer, setSelectedTrainer] = useState<TrainerProfile | null>(null)
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

  useEffect(() => {
    let alive = true

    async function loadTrainers() {
      try {
        const res = await fetch('/api/trainers')
        const data = await res.json()

        if (!res.ok || !Array.isArray(data.trainers)) return

        const dbTrainers = data.trainers.map(normalizeTrainer).filter(Boolean) as TrainerProfile[]
        if (alive && dbTrainers.length > 0) setTrainers(dbTrainers)
      } catch {
        // Keep the static fallback visible if the database cannot be reached.
      }
    }

    loadTrainers()

    return () => {
      alive = false
    }
  }, [])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedTrainer) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [selectedTrainer])

  const handleApplyNow = () => {
    const el = document.getElementById('pricing')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const fade = (delay: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(40px)',
    transition: `opacity 0.9s ease ${delay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  })

  return (
    <>
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
              <TrainerCard
                key={trainer._id || trainer.name}
                trainer={trainer}
                index={i}
                fadeStyle={fade(0.1 + i * 0.08)}
                onViewProfile={() => setSelectedTrainer(trainer)}
              />
            ))}
          </div>

          {/* Bottom CTA */}
          <div style={{ ...fade(0.5), textAlign: 'center', marginTop: 'clamp(40px, 5vw, 64px)' }}>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>
              Want to join our elite team of trainers?
            </p>
            <button
              className="btn-primary"
              onClick={handleApplyNow}
              style={{
                padding: '16px 44px',
                fontSize: 12,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                cursor: 'pointer',
              }}
            >
              Apply Now <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Profile Modal */}
      {selectedTrainer && (
        <TrainerProfileModal
          trainer={selectedTrainer}
          onClose={() => setSelectedTrainer(null)}
        />
      )}
    </>
  )
}

function TrainerCard({
  trainer,
  index,
  fadeStyle,
  onViewProfile,
}: {
  trainer: TrainerProfile
  index: number
  fadeStyle: React.CSSProperties
  onViewProfile: () => void
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
        <ProfileButton hovered={hovered} color={trainer.color} onClick={onViewProfile} />
      </div>
    </div>
  )
}

function ProfileButton({ hovered, color, onClick }: { hovered: boolean; color: string; onClick: () => void }) {
  const [btnHovered, setBtnHovered] = useState(false)

  return (
    <button
      onClick={onClick}
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

function TrainerProfileModal({
  trainer,
  onClose,
}: {
  trainer: TrainerProfile
  onClose: () => void
}) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  const handleBookSession = () => {
    const el = document.getElementById('pricing')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      onClose()
    }
  }

  return (
    <div
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        padding: 24,
      }}
    >
      <div
        ref={modalRef}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 720,
          maxHeight: '90vh',
          overflowY: 'auto',
          background: '#0c0c0c',
          border: '1px solid rgba(255,107,0,0.15)',
          clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
          boxShadow: '0 32px 80px rgba(0,0,0,0.8), 0 0 60px rgba(255,107,0,0.05)',
        }}
      >
        {/* Top accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(90deg, ${trainer.color}, ${trainer.color}88, transparent)`,
          }}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 10,
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.6)',
            cursor: 'pointer',
            clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,107,0,0.2)'
            e.currentTarget.style.color = 'var(--accent-orange)'
            e.currentTarget.style.borderColor = 'rgba(255,107,0,0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
            e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
          }}
        >
          <X size={16} />
        </button>

        {/* Hero Section */}
        <div
          style={{
            padding: '48px 48px 32px',
            background: `linear-gradient(135deg, ${trainer.color}11, ${trainer.color}03)`,
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: `${trainer.color}15`,
                border: `2px solid ${trainer.color}44`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: `0 8px 32px ${trainer.color}22`,
              }}
            >
              <span
                style={{
                  fontFamily: 'Bebas Neue',
                  fontSize: 44,
                  color: trainer.color,
                }}
              >
                {trainer.initials}
              </span>
            </div>

            {/* Info */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: 'Bebas Neue',
                  fontSize: 42,
                  color: '#fff',
                  lineHeight: 1,
                  marginBottom: 6,
                }}
              >
                {trainer.name}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: trainer.color,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.18em',
                  marginBottom: 12,
                }}
              >
                {trainer.role}
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  flexWrap: 'wrap',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '5px 12px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    fontSize: 10,
                    color: 'rgba(255,255,255,0.5)',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                  }}
                >
                  <Award size={11} color="var(--accent-orange)" />
                  {trainer.exp} Experience
                </span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '5px 12px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    fontSize: 10,
                    color: 'rgba(255,255,255,0.5)',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                  }}
                >
                  <InstagramIcon size={12} />
                  {trainer.social}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '32px 48px 48px' }}>
          {/* Bio */}
          <div style={{ marginBottom: 28 }}>
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: trainer.color,
                marginBottom: 10,
              }}
            >
              About
            </div>
            <p
              style={{
                fontSize: 14,
                color: 'rgba(255,255,255,0.65)',
                lineHeight: 1.8,
                margin: 0,
              }}
            >
              {trainer.bio}
            </p>
          </div>

          {/* Two columns */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 28,
              marginBottom: 28,
            }}
            className="modal-details"
          >
            {/* Achievements */}
            <div>
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: trainer.color,
                  marginBottom: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <BadgeCheck size={12} /> Achievements
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {trainer.achievements.map((a) => (
                  <div
                    key={a}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      fontSize: 12,
                      color: 'rgba(255,255,255,0.55)',
                    }}
                  >
                    <ChevronRight size={10} color={trainer.color} />
                    {a}
                  </div>
                ))}
              </div>
            </div>

            {/* Speciality & Certs */}
            <div>
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: trainer.color,
                  marginBottom: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Dumbbell size={12} /> Speciality
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.6)',
                  fontWeight: 500,
                  marginBottom: 16,
                }}
              >
                {trainer.speciality}
              </div>

              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: trainer.color,
                  marginBottom: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Calendar size={12} /> Certifications
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.5)',
                  lineHeight: 1.6,
                }}
              >
                {trainer.cert}
              </div>
            </div>
          </div>

          {/* Approach */}
          <div
            style={{
              padding: '20px 24px',
              background: `${trainer.color}08`,
              border: `1px solid ${trainer.color}22`,
              clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
              marginBottom: 28,
            }}
          >
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: trainer.color,
                marginBottom: 6,
              }}
            >
              Coaching Philosophy
            </div>
            <p
              style={{
                fontSize: 13,
                color: 'rgba(255,255,255,0.55)',
                lineHeight: 1.7,
                fontStyle: 'italic',
                margin: 0,
              }}
            >
              &ldquo;{trainer.approach}&rdquo;
            </p>
          </div>

          {/* Fun Fact */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 28,
            }}
          >
            <span style={{ fontSize: 18 }}>💪</span>
            <span
              style={{
                fontSize: 12,
                color: 'rgba(255,255,255,0.4)',
                lineHeight: 1.5,
              }}
            >
              <strong style={{ color: 'rgba(255,255,255,0.6)' }}>Fun fact: </strong>
              {trainer.funFact}
            </span>
          </div>

          {/* CTA */}
          <button
            onClick={handleBookSession}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '16px',
              fontSize: 11,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              cursor: 'pointer',
            }}
          >
            Book a Session with {trainer.name.split(' ')[0]} <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

function normalizeTrainer(trainer: TrainerApiItem): TrainerProfile | null {
  if (!trainer.name || !trainer.role) return null

  const firstName = trainer.name.split(' ')[0] || 'This trainer'
  const speciality = trainer.speciality || 'Personal training'
  const cert = trainer.certifications || 'Certified trainer'
  const exp = trainer.experience || 'Experienced'

  return {
    _id: trainer._id,
    name: trainer.name,
    role: trainer.role,
    exp,
    speciality,
    cert,
    initials: (trainer.initials || trainer.name.split(' ').map(part => part[0]).join('')).slice(0, 2).toUpperCase(),
    color: trainer.color || '#FF6B00',
    bio: `${trainer.name} specializes in ${speciality.toLowerCase()} and brings ${exp.toLowerCase()} of coaching experience to Fitnest.`,
    achievements: [cert, speciality, `${exp} experience`],
    approach: `Personalized coaching focused on form, consistency, and measurable progress.`,
    funFact: `${firstName} is ready to help members train with confidence.`,
    social: trainer.instagram || '@fitnestlahore',
  }
}
