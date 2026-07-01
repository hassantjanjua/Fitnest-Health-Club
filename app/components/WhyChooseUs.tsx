'use client'
import { useEffect, useRef, useState } from 'react'
import { Play, X, Maximize2, Award, Dumbbell, Target, Users, CheckCircle2, TrendingUp } from 'lucide-react'

const features = [
  {
    num: '01',
    title: '10,000 Sq Ft Facility',
    desc: 'Spacious gym equipped with a wide range of modern fitness machines so you achieve maximum results from every workout.',
    icon: <Maximize2 size={18} />,
    color: '#FF6B00',
  },
  {
    num: '02',
    title: 'State of the Art Equipment',
    desc: 'Up-to-date machines, sound systems and studios designed for high-intensity classes and peak performance.',
    icon: <Dumbbell size={18} />,
    color: '#3b82f6',
  },
  {
    num: '03',
    title: 'Programs for Weight Loss',
    desc: 'Special priority programs consulted with certified physicians and dieticians tailored to your personal goals.',
    icon: <Target size={18} />,
    color: '#22c55e',
  },
  {
    num: '04',
    title: 'Expert Certified Trainers',
    desc: 'Every coach is internationally certified, continuously educated, and deeply invested in your transformation.',
    icon: <Award size={18} />,
    color: '#eab308',
  },
]

const highlights = [
  { label: 'Active Members', value: '500+', icon: <Users size={18} /> },
  { label: 'Success Rate', value: '95%', icon: <TrendingUp size={18} /> },
  { label: 'Certified Trainers', value: '15+', icon: <Award size={18} /> },
]

export default function WhyChooseUs() {
  const [visible, setVisible] = useState(false)
  const [videoOpen, setVideoOpen] = useState(false)
  const [playHovered, setPlayHovered] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.05 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setVideoOpen(false)
    }
    if (videoOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'auto'
    }
  }, [videoOpen])

  const fade = (delay: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(36px)',
    transition: `opacity 0.9s ease ${delay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  })

  return (
    <section id="why-us" ref={ref} style={{
      padding: 'clamp(80px, 12vw, 140px) 0',
      background: '#080808',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Radial Gradients */}
      <div style={{
        position: 'absolute', top: '-15%', right: '-20%',
        width: '80vw', height: '80vw',
        maxWidth: 900, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,107,0,0.08) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', left: '-15%',
        width: '70vw', height: '70vw',
        maxWidth: 800, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,107,0,0.05) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      {/* Diagonal Lines */}
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

      <div style={{
        maxWidth: 1400,
        margin: '0 auto',
        padding: '0 48px',
        position: 'relative',
        zIndex: 1,
      }} className="hero-container">

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 68 }}>
          <div style={{
            ...fade(0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            marginBottom: 20,
          }}>
            <div style={{ width: 44, height: 2, background: 'var(--accent-orange)', flexShrink: 0 }} />
            <span style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'var(--accent-orange)',
            }}>
              What Makes Us Different
            </span>
            <div style={{ width: 44, height: 2, background: 'var(--accent-orange)', flexShrink: 0 }} />
          </div>
          <h2 style={{
            ...fade(0.18),
            fontFamily: 'Bebas Neue',
            fontSize: 'clamp(52px, 8vw, 96px)',
            lineHeight: 0.88,
            color: '#fff',
            margin: 0,
            letterSpacing: '0.01em',
          }}>
            WHY CHOOSE <span style={{ color: 'var(--accent-orange)' }}>FITNEST?</span>
          </h2>
          <p style={{
            ...fade(0.26),
            fontSize: 17,
            color: 'rgba(255,255,255,0.45)',
            lineHeight: 1.8,
            marginTop: 20,
            maxWidth: 600,
            margin: '20px auto 0',
          }}>
            We&apos;re not just a gym — we&apos;re a transformation hub with world-class facilities and expert guidance.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 64,
          alignItems: 'center',
          marginBottom: 64,
        }} className="hero-bottom-grid">

          {/* Left: Video Section */}
          <div style={{ ...fade(0.34) }}>
            <VideoSection
              onPlay={() => setVideoOpen(true)}
              playHovered={playHovered}
              setPlayHovered={setPlayHovered}
            />
          </div>

          {/* Right: Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {features.map((f, i) => (
              <FeatureCard
                key={f.num}
                feature={f}
                fadeStyle={fade(0.42 + i * 0.08)}
              />
            ))}
          </div>
        </div>

        {/* Bottom Highlights */}
        <div style={{
          ...fade(0.74),
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 24,
          padding: '48px 0',
          borderTop: '1px solid rgba(255,107,0,0.1)',
        }} className="why-highlights">
          {highlights.map((h, i) => (
            <HighlightCard key={i} highlight={h} />
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {videoOpen && (
        <VideoModal onClose={() => setVideoOpen(false)} />
      )}

      <style>{`
        @media (max-width: 640px) {
          .why-highlights { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

// Video Section Component
function VideoSection({
  onPlay,
  playHovered,
  setPlayHovered,
}: {
  onPlay: () => void
  playHovered: boolean
  setPlayHovered: (hovered: boolean) => void
}) {
  const [cardHovered, setCardHovered] = useState(false)

  return (
    <div style={{ position: 'relative' }}>
      <div
        onMouseEnter={() => setCardHovered(true)}
        onMouseLeave={() => setCardHovered(false)}
        style={{
          border: '1px solid rgba(255,107,0,0.2)',
          background: 'rgba(14,14,14,0.95)',
          backdropFilter: 'blur(20px)',
          position: 'relative',
          overflow: 'hidden',
          clipPath: 'polygon(0 0,calc(100% - 20px) 0,100% 20px,100% 100%,20px 100%,0 calc(100% - 20px))',
          cursor: 'pointer',
          transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
          transform: cardHovered ? 'translateY(-4px)' : 'translateY(0)',
          boxShadow: cardHovered ? '0 20px 60px rgba(255,107,0,0.15)' : 'none',
        }}
        onClick={onPlay}
      >
        {/* Top Accent Line */}
        <div style={{
          height: 3,
          background: 'linear-gradient(90deg, var(--accent-orange), #ff9500)',
        }} />

        {/* Video Thumbnail */}
        <div style={{
          width: '100%',
          paddingBottom: '62%',
          background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Gradient Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(255,107,0,0.12), rgba(255,107,0,0.04))',
          }} />

          {/* Pattern Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.03,
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)',
          }} />

          {/* Center Content */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {/* Play Button */}
            <div
              onMouseEnter={() => setPlayHovered(true)}
              onMouseLeave={() => setPlayHovered(false)}
              style={{
                width: playHovered ? 88 : 80,
                height: playHovered ? 88 : 80,
                borderRadius: '50%',
                background: playHovered
                  ? 'linear-gradient(135deg, #ff7a00, var(--accent-orange))'
                  : 'var(--accent-orange)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: playHovered
                  ? '0 0 0 20px rgba(255,107,0,0.15), 0 8px 32px rgba(255,107,0,0.4)'
                  : '0 0 0 16px rgba(255,107,0,0.12), 0 4px 24px rgba(255,107,0,0.3)',
                transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
                animation: 'pulse-why 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              }}
            >
              <Play
                size={28}
                fill="#fff"
                color="#fff"
                style={{
                  marginLeft: 4,
                  transform: playHovered ? 'scale(1.1)' : 'scale(1)',
                  transition: 'transform 0.3s ease',
                }}
              />
            </div>
          </div>

          {/* Bottom Text */}
          <div style={{
            position: 'absolute',
            bottom: 28,
            left: 28,
            right: 28,
          }}>
            <div style={{
              fontFamily: 'Bebas Neue',
              fontSize: 'clamp(24px, 4vw, 36px)',
              color: 'rgba(255,255,255,0.06)',
              letterSpacing: '0.05em',
              lineHeight: 1,
            }}>
              FITNEST HEALTH CLUB
            </div>
            <div style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.3)',
              marginTop: 8,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              Watch Our Story
            </div>
          </div>
        </div>
      </div>

      {/* Floating Stats Badge */}
      <div style={{
        position: 'absolute',
        bottom: -20,
        right: -20,
      }}>
        <StatBadge
          value="500+"
          label="Members"
          icon={<Users size={18} />}
        />
      </div>

      <style>{`
        @keyframes pulse-why {
          0%, 100% {
            box-shadow: 0 0 0 16px rgba(255,107,0,0.12), 0 4px 24px rgba(255,107,0,0.3);
          }
          50% {
            box-shadow: 0 0 0 20px rgba(255,107,0,0.08), 0 4px 24px rgba(255,107,0,0.3);
          }
        }
      `}</style>
    </div>
  )
}

// Stat Badge Component
function StatBadge({
  value,
  label,
  icon,
}: {
  value: string
  label: string
  icon: React.ReactNode
}) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, var(--accent-orange), #ff9500)',
      padding: '16px 20px',
      clipPath: 'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))',
      boxShadow: '0 8px 24px rgba(255,107,0,0.3)',
      minWidth: 100,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
        color: '#fff',
      }}>
        {icon}
        <div style={{
          fontFamily: 'Bebas Neue',
          fontSize: 32,
          lineHeight: 1,
        }}>
          {value}
        </div>
      </div>
      <div style={{
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.85)',
      }}>
        {label}
      </div>
    </div>
  )
}

// Feature Card Component
function FeatureCard({
  feature,
  fadeStyle,
}: {
  feature: typeof features[0]
  fadeStyle: React.CSSProperties
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{
        ...fadeStyle,
        display: 'flex',
        gap: 20,
        alignItems: 'flex-start',
        padding: '24px 28px',
        border: `1px solid ${hovered ? 'rgba(255,107,0,0.25)' : 'rgba(255,107,0,0.08)'}`,
        background: hovered ? 'rgba(255,107,0,0.06)' : 'rgba(255,255,255,0.01)',
        backdropFilter: 'blur(20px)',
        clipPath: 'polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px))',
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        cursor: 'default',
        transform: hovered ? 'translateX(8px)' : 'translateX(0)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Number Badge */}
      <div style={{
        width: 56,
        height: 56,
        borderRadius: '50%',
        background: hovered
          ? `${feature.color}20`
          : 'rgba(255,107,0,0.08)',
        border: `1px solid ${hovered ? `${feature.color}40` : 'rgba(255,107,0,0.15)'}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'all 0.35s ease',
        position: 'relative',
      }}>
        <div style={{
          fontSize: 11,
          fontWeight: 700,
          color: hovered ? feature.color : 'rgba(255,255,255,0.3)',
          transition: 'color 0.3s ease',
        }}>
          {feature.num}
        </div>
        <div style={{
          position: 'absolute',
          bottom: -6,
          right: -6,
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: hovered ? feature.color : 'rgba(255,107,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          transition: 'all 0.3s ease',
          transform: hovered ? 'scale(1.1)' : 'scale(1)',
        }}>
          {feature.icon}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 10,
        }}>
          <div style={{
            fontFamily: 'Bebas Neue',
            fontSize: 22,
            color: hovered ? '#fff' : 'rgba(255,255,255,0.92)',
            letterSpacing: '0.02em',
            transition: 'color 0.3s ease',
          }}>
            {feature.title}
          </div>
          {hovered && (
            <CheckCircle2
              size={16}
              color={feature.color}
              style={{
                animation: 'fadeIn 0.3s ease',
              }}
            />
          )}
        </div>
        <p style={{
          fontSize: 14,
          color: 'rgba(255,255,255,0.5)',
          lineHeight: 1.75,
          margin: 0,
        }}>
          {feature.desc}
        </p>
      </div>
    </div>
  )
}

// Highlight Card Component
function HighlightCard({ highlight }: { highlight: typeof highlights[0] }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        textAlign: 'center',
        padding: '28px 24px',
        background: hovered ? 'rgba(255,107,0,0.06)' : 'rgba(255,255,255,0.01)',
        border: `1px solid ${hovered ? 'rgba(255,107,0,0.2)' : 'rgba(255,107,0,0.08)'}`,
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        cursor: 'default',
        clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 12,
      }}>
        <div style={{
          width: 40,
          height: 40,
          background: hovered ? 'rgba(255,107,0,0.15)' : 'rgba(255,107,0,0.08)',
          border: `1px solid ${hovered ? 'rgba(255,107,0,0.3)' : 'rgba(255,107,0,0.15)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-orange)',
          transition: 'all 0.3s ease',
          transform: hovered ? 'scale(1.1)' : 'scale(1)',
          clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
        }}>
          {highlight.icon}
        </div>
      </div>
      <div style={{
        fontFamily: 'Bebas Neue',
        fontSize: 'clamp(32px, 4vw, 44px)',
        color: 'var(--accent-orange)',
        lineHeight: 1,
        marginBottom: 8,
        transition: 'transform 0.3s ease',
        transform: hovered ? 'scale(1.05)' : 'scale(1)',
      }}>
        {highlight.value}
      </div>
      <div style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.4)',
      }}>
        {highlight.label}
      </div>
    </div>
  )
}

// Video Modal Component
function VideoModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.95)',
        backdropFilter: 'blur(10px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.3s ease',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <button
        onClick={onClose}
        style={{
          position: 'fixed', top: '24px', right: '24px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          width: '56px', height: '56px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          zIndex: 10,
          clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 107, 0, 0.2)'
          e.currentTarget.style.borderColor = 'rgba(255, 107, 0, 0.5)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
        }}
      >
        <X size={24} color="#fff" />
      </button>

      <div style={{
        width: '100%', maxWidth: '1100px',
        aspectRatio: '16 / 9',
        background: '#000',
        overflow: 'hidden',
        border: '1px solid rgba(255, 107, 0, 0.3)',
        boxShadow: '0 40px 80px rgba(0, 0, 0, 0.6), 0 0 60px rgba(255,107,0,0.1)',
        animation: 'scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
      }}>
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/2pLkMmJkBmM?autoplay=1&rel=0&modestbranding=1"
          title="Fitnest - Why Choose Us"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ display: 'block' }}
        />
      </div>

      <div style={{
        position: 'fixed', bottom: '32px', left: '50%',
        transform: 'translateX(-50%)', textAlign: 'center',
      }}>
        <p style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '0.22em',
          textTransform: 'uppercase', color: 'var(--accent-orange)', marginBottom: 6,
        }}>Why Choose Us</p>
        <p style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.35)' }}>
          Press ESC or click outside to close
        </p>
      </div>
    </div>
  )
}
