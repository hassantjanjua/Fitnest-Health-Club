'use client'

import { useEffect, useRef, useState } from 'react'
import { Quote, MapPin, Star, ChevronLeft, ChevronRight } from 'lucide-react'

const testimonials = [
  {
    name: 'Ahmad Malik',
    location: 'Model Town, Lahore',
    rating: 5,
    text: 'Fitnest completely transformed my body and mindset. The trainers push you to your limits but always keep it safe. Best gym in Lahore, hands down.',
    image: '👨‍💼',
    role: 'Business Owner',
  },
  {
    name: 'Sara Hussain',
    location: 'DHA, Lahore',
    rating: 5,
    text: 'Clean facility, modern equipment, and trainers who genuinely care. I lost 15kg in 4 months with their custom plan. Life changing experience.',
    image: '👩‍💼',
    role: 'Marketing Manager',
  },
  {
    name: 'Usman Farooq',
    location: 'Gulberg, Lahore',
    rating: 5,
    text: 'The community here is incredible. Everyone motivates each other. The CrossFit classes are intense but so rewarding. Highly recommend.',
    image: '🧑‍💻',
    role: 'Software Engineer',
  },
  {
    name: 'Ayesha Khan',
    location: 'Model Town, Lahore',
    rating: 5,
    text: 'As a female member I feel completely comfortable here. The separate training zones and professional female trainers make all the difference.',
    image: '👩‍🏫',
    role: 'Teacher',
  },
  {
    name: 'Bilal Chaudhry',
    location: 'Johar Town, Lahore',
    rating: 5,
    text: 'Been a member for 2 years now. The nutrition coaching alongside training has completely changed my approach to health. Cannot recommend enough.',
    image: '🧑‍⚕️',
    role: 'Doctor',
  },
  {
    name: 'Zainab Raza',
    location: 'Bahria Town, Lahore',
    rating: 5,
    text: 'The yoga and mobility classes are phenomenal. Zara is an exceptional trainer who really understands your body. Great atmosphere overall.',
    image: '👩‍🎨',
    role: 'Designer',
  },
]

export default function Testimonials() {
  const [visible, setVisible] = useState(false)
  const [active, setActive] = useState(0)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
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
    const t = setInterval(() => {
      setActive(a => (a + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(t)
  }, [])

  const fade = (delay: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(36px)',
    transition: `opacity 0.9s ease ${delay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  })

  const handlePrevious = () => {
    setActive(a => (a - 1 + testimonials.length) % testimonials.length)
  }

  const handleNext = () => {
    setActive(a => (a + 1) % testimonials.length)
  }

  return (
    <section id="testimonials" ref={ref} style={{
      padding: 'clamp(80px, 12vw, 140px) 0',
      background: '#080808',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Radial Gradients - matching Hero */}
      <div style={{
        position: 'absolute', top: '-15%', left: '-20%',
        width: '80vw', height: '80vw',
        maxWidth: 900, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,107,0,0.08) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', right: '-15%',
        width: '70vw', height: '70vw',
        maxWidth: 800, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,107,0,0.05) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      {/* Diagonal Lines - matching Hero */}
      <div className="testimonials-diagonals" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
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
      }} className="testimonials-container">

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
              Success Stories
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
            CLIENT <span style={{ color: 'var(--accent-orange)' }}>TESTIMONIALS</span>
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
            Real transformations from real people. See what our members have to say.
          </p>
        </div>

        {/* Featured Testimonial */}
        <div style={{ ...fade(0.34), marginBottom: 56 }}>
          <FeaturedTestimonial
            testimonial={testimonials[active]}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        </div>

        {/* All Testimonials Grid */}
        <div style={{
          ...fade(0.42),
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 24,
          marginBottom: 40,
        }} className="testimonials-grid">
          {testimonials.map((t, i) => (
            <TestimonialCard
              key={t.name}
              testimonial={t}
              isActive={active === i}
              isHovered={hoveredCard === i}
              onClick={() => {
                setActive(i)
              }}
              onHover={() => setHoveredCard(i)}
              onLeave={() => setHoveredCard(null)}
            />
          ))}
        </div>

        {/* Navigation Dots */}
        <div style={{
          ...fade(0.5),
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 10,
        }}>
          {testimonials.map((_, i) => (
            <NavigationDot
              key={i}
              isActive={active === i}
              onClick={() => {
                setActive(i)
              }}
            />
          ))}
        </div>

        {/* Stats Row */}
        <div style={{
          ...fade(0.58),
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 24,
          marginTop: 72,
          padding: '40px 0',
          borderTop: '1px solid rgba(255,107,0,0.1)',
          borderBottom: '1px solid rgba(255,107,0,0.1)',
        }} className="testimonials-stats">
          <StatCard value="500+" label="Happy Members" />
          <StatCard value="4.9/5" label="Average Rating" />
          <StatCard value="200+" label="Reviews" />
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .testimonials-container { padding: 0 32px !important; }
          .testimonials-grid { grid-template-columns: 1fr 1fr !important; gap: 20px !important; }
          .testimonials-stats { grid-template-columns: repeat(3, 1fr) !important; gap: 16px !important; }
        }
        @media (max-width: 640px) {
          .testimonials-container { padding: 0 20px !important; }
          .testimonials-grid { grid-template-columns: 1fr !important; }
          .testimonials-stats { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

// Featured Testimonial Component
function FeaturedTestimonial({
  testimonial,
  onPrevious,
  onNext,
}: {
  testimonial: typeof testimonials[0]
  onPrevious: () => void
  onNext: () => void
}) {
  return (
    <div style={{
      border: '1px solid rgba(255,107,0,0.2)',
      background: 'rgba(14,14,14,0.95)',
      backdropFilter: 'blur(20px)',
      position: 'relative',
      overflow: 'hidden',
      clipPath: 'polygon(0 0,calc(100% - 24px) 0,100% 24px,100% 100%,24px 100%,0 calc(100% - 24px))',
    }}>
      {/* Top Accent Line */}
      <div style={{
        height: 3,
        background: 'linear-gradient(90deg, var(--accent-orange), #ff9500)',
      }} />

      <div style={{ padding: 'clamp(40px, 5vw, 64px) clamp(36px, 5vw, 56px)' }}>
        {/* Quote Icon Background */}
        <div style={{
          position: 'absolute',
          top: 40,
          right: 48,
          opacity: 0.04,
        }}>
          <Quote size={140} color="var(--accent-orange)" />
        </div>

        {/* Rating Stars */}
        <div style={{
          display: 'flex',
          gap: 6,
          marginBottom: 28,
        }}>
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star
              key={i}
              size={20}
              fill="#FFB800"
              color="#FFB800"
              style={{
                animation: `starPop 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s backwards`,
              }}
            />
          ))}
        </div>

        {/* Testimonial Text */}
        <p style={{
          fontSize: 'clamp(17px, 2.2vw, 24px)',
          color: 'rgba(255,255,255,0.85)',
          lineHeight: 1.75,
          marginBottom: 36,
          fontStyle: 'italic',
          maxWidth: 900,
          position: 'relative',
          animation: 'fadeSlide 0.6s cubic-bezier(0.16,1,0.3,1)',
        }}>
          &ldquo;{testimonial.text}&rdquo;
        </p>

        {/* Author Info */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 24,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
          }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-orange), #ff9500)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              border: '2px solid rgba(255,107,0,0.3)',
              boxShadow: '0 8px 24px rgba(255,107,0,0.2)',
            }}>
              {testimonial.image}
            </div>
            <div>
              <div style={{
                fontSize: 18,
                fontWeight: 700,
                color: '#fff',
                marginBottom: 4,
              }}>
                {testimonial.name}
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 13,
                color: 'rgba(255,255,255,0.4)',
                marginBottom: 2,
              }}>
                <MapPin size={12} />
                {testimonial.location}
              </div>
              <div style={{
                fontSize: 12,
                color: 'rgba(255,107,0,0.7)',
                letterSpacing: '0.05em',
              }}>
                {testimonial.role}
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <div style={{
            display: 'flex',
            gap: 12,
          }}>
            <NavigationButton onClick={onPrevious} icon={<ChevronLeft size={20} />} />
            <NavigationButton onClick={onNext} icon={<ChevronRight size={20} />} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlide {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes starPop {
          from {
            opacity: 0;
            transform: scale(0);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  )
}

// Navigation Button Component
function NavigationButton({ onClick, icon }: { onClick: () => void; icon: React.ReactNode }) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 48,
        height: 48,
        borderRadius: '50%',
        background: hovered ? 'rgba(255,107,0,0.15)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${hovered ? 'rgba(255,107,0,0.4)' : 'rgba(255,255,255,0.1)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
        transform: hovered ? 'scale(1.08)' : 'scale(1)',
        color: hovered ? 'var(--accent-orange)' : 'rgba(255,255,255,0.5)',
      }}
    >
      {icon}
    </button>
  )
}

// Testimonial Card Component
function TestimonialCard({
  testimonial,
  isActive,
  isHovered,
  onClick,
  onHover,
  onLeave,
}: {
  testimonial: typeof testimonials[0]
  isActive: boolean
  isHovered: boolean
  onClick: () => void
  onHover: () => void
  onLeave: () => void
}) {
  return (
    <div
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        padding: '28px 24px',
        cursor: 'pointer',
        border: `1px solid ${isActive ? 'rgba(255,107,0,0.3)' : isHovered ? 'rgba(255,107,0,0.15)' : 'rgba(255,107,0,0.08)'}`,
        background: isActive ? 'rgba(255,107,0,0.08)' : isHovered ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.01)',
        backdropFilter: 'blur(20px)',
        clipPath: 'polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px))',
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        transform: isActive ? 'translateY(-6px) scale(1.02)' : isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isActive ? '0 20px 50px rgba(255,107,0,0.15)' : 'none',
      }}
    >
      {/* Top Accent Line */}
      <div style={{
        height: 2,
        background: isActive
          ? 'linear-gradient(90deg, var(--accent-orange), #ff9500)'
          : 'linear-gradient(90deg, rgba(255,107,0,0.3), transparent)',
        marginBottom: 20,
        transition: 'all 0.3s ease',
      }} />

      {/* Rating */}
      <div style={{
        display: 'flex',
        gap: 3,
        marginBottom: 16,
      }}>
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star
            key={i}
            size={12}
            fill="#FFB800"
            color="#FFB800"
          />
        ))}
      </div>

      {/* Text */}
      <p style={{
        fontSize: 13,
        color: isActive ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.5)',
        lineHeight: 1.7,
        marginBottom: 20,
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        transition: 'color 0.3s ease',
      }}>
        {testimonial.text}
      </p>

      {/* Author */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: isActive
            ? 'linear-gradient(135deg, var(--accent-orange), #ff9500)'
            : 'rgba(255,107,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          flexShrink: 0,
          transition: 'all 0.3s ease',
          border: `1px solid ${isActive ? 'rgba(255,107,0,0.4)' : 'rgba(255,107,0,0.2)'}`,
        }}>
          {testimonial.image}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 13,
            fontWeight: 700,
            color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
            marginBottom: 2,
            transition: 'color 0.3s ease',
          }}>
            {testimonial.name}
          </div>
          <div style={{
            fontSize: 10,
            color: 'rgba(255,255,255,0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}>
            <MapPin size={9} />
            {testimonial.location}
          </div>
        </div>
      </div>
    </div>
  )
}

// Navigation Dot Component
function NavigationDot({ isActive, onClick }: { isActive: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: isActive ? 32 : 10,
        height: 10,
        borderRadius: 5,
        border: 'none',
        background: isActive
          ? 'linear-gradient(90deg, var(--accent-orange), #ff9500)'
          : hovered
          ? 'rgba(255,107,0,0.4)'
          : 'rgba(255,255,255,0.15)',
        cursor: 'pointer',
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        padding: 0,
        transform: hovered && !isActive ? 'scale(1.2)' : 'scale(1)',
      }}
    />
  )
}

// Stat Card Component
function StatCard({ value, label }: { value: string; label: string }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        textAlign: 'center',
        padding: '24px 20px',
        background: hovered ? 'rgba(255,107,0,0.06)' : 'transparent',
        border: `1px solid ${hovered ? 'rgba(255,107,0,0.2)' : 'transparent'}`,
        borderRadius: 4,
        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        cursor: 'default',
      }}
    >
      <div style={{
        fontFamily: 'Bebas Neue',
        fontSize: 'clamp(36px, 5vw, 52px)',
        color: 'var(--accent-orange)',
        lineHeight: 1,
        marginBottom: 8,
        transition: 'transform 0.3s ease',
        transform: hovered ? 'scale(1.05)' : 'scale(1)',
      }}>
        {value}
      </div>
      <div style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.4)',
      }}>
        {label}
      </div>
    </div>
  )
}
