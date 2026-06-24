'use client'
import { useEffect, useRef, useState } from 'react'
import { Shield, Trophy, Heart, Target, Play, X } from 'lucide-react'

const values = [
  { icon: Shield, title: 'Safety First', description: 'Every program designed with your safety and injury prevention as the top priority.' },
  { icon: Trophy, title: 'Elite Training', description: 'Cutting-edge techniques used by professional athletes, now accessible to everyone.' },
  { icon: Heart, title: 'Community', description: 'A supportive family of 500+ members pushing each other to be their best.' },
  { icon: Target, title: 'Proven Results', description: '8 years of transforming bodies and minds across Lahore.' },
]

const timeline = [
  { year: '2017', event: 'Founded in Model Town, Lahore' },
  { year: '2019', event: 'Expanded to 10,000 sq ft facility' },
  { year: '2021', event: 'Launched 20+ fitness programs' },
  { year: '2024', event: '#1 Rated Gym in Model Town' },
]

const stats = [
  { label: 'Member Retention Rate', value: 94 },
  { label: 'Goal Achievement Rate', value: 87 },
  { label: 'Trainer Satisfaction', value: 98 },
  { label: 'Facility Cleanliness', value: 99 },
]

function ValueCard({ item, index }: { item: typeof values[0]; index: number }) {
  const [hovered, setHovered] = useState(false)
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const Icon = item.icon

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true)
    }, { threshold: 0.2 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: `all 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 0.1}s`,
        background: hovered ? 'var(--accent-orange)' : '#fff',
        border: `1px solid ${hovered ? 'var(--accent-orange)' : 'rgba(0,0,0,0.06)'}`,
        padding: '28px 24px', cursor: 'default',
        clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
      }}
    >
      <div style={{
        width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: hovered ? 'rgba(255,255,255,0.2)' : 'rgba(255,107,0,0.06)',
        border: `1px solid ${hovered ? 'rgba(255,255,255,0.3)' : 'rgba(255,107,0,0.12)'}`,
        marginBottom: 16, transition: 'all 0.4s ease',
        clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
      }}>
        <Icon size={18} color={hovered ? '#fff' : 'var(--accent-orange)'} style={{ transition: 'color 0.4s ease' }} />
      </div>
      <h3 style={{
        fontFamily: 'Bebas Neue', fontSize: 20, letterSpacing: '0.02em',
        color: hovered ? '#fff' : '#111', marginBottom: 6, transition: 'color 0.4s ease',
      }}>{item.title}</h3>
      <p style={{
        fontSize: 11, lineHeight: 1.7, color: hovered ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.45)', transition: 'color 0.4s ease',
      }}>{item.description}</p>
    </div>
  )
}

function ProgressBar({ stat, index }: { stat: typeof stats[0]; index: number }) {
  const [width, setWidth] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setTimeout(() => setWidth(stat.value), 200 + index * 150)
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [stat.value, index])

  return (
    <div ref={ref} style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.6)' }}>{stat.label}</span>
        <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent-orange)' }}>{stat.value}%</span>
      </div>
      <div style={{ width: '100%', height: 5, background: 'rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        <div style={{
          width: `${width}%`, height: '100%',
          background: 'linear-gradient(90deg, var(--accent-orange), #ff9500)',
          transition: 'width 1.2s cubic-bezier(0.16,1,0.3,1)',
        }} />
      </div>
    </div>
  )
}

export default function About() {
  const [visible, setVisible] = useState(false)
  const [img1Hovered, setImg1Hovered] = useState(false)
  const [img2Hovered, setImg2Hovered] = useState(false)
  const [activeTab, setActiveTab] = useState<'mission' | 'vision'>('mission')
  const [videoOpen, setVideoOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true)
    }, { threshold: 0.1 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (videoOpen) {
      document.body.style.overflow = 'hidden'
      const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setVideoOpen(false) }
      document.addEventListener('keydown', handleEsc)
      return () => { document.body.style.overflow = 'auto'; document.removeEventListener('keydown', handleEsc) }
    }
  }, [videoOpen])

  return (
    <section id="about" style={{ padding: '100px 0', background: '#fafafa', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: '8%', left: '-5%', fontFamily: 'Bebas Neue', fontSize: 'clamp(80px, 14vw, 220px)',
        color: 'rgba(0,0,0,0.015)', whiteSpace: 'nowrap', pointerEvents: 'none', letterSpacing: '0.05em', lineHeight: 1,
      }}>ABOUT US</div>
      <div style={{
        position: 'absolute', top: '50%', left: 0, width: '60vw', height: '60vw', maxWidth: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,107,0,0.04) 0%, transparent 65%)', pointerEvents: 'none', transform: 'translate(-50%, -50%)',
      }} />

      <div ref={ref} style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        {/* Main About */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center', marginBottom: 60 }} className="about-grid">
          {/* Text */}
          <div style={{
            opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(-40px)',
            transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 44, height: 2, background: 'var(--accent-orange)' }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--accent-orange)' }}>About Fitnest</span>
            </div>
            <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 0.95, letterSpacing: '0.02em', marginBottom: 24 }}>
              <span style={{ color: '#111' }}>WE HELP TO GET</span><br />
              <span style={{ color: 'var(--accent-orange)' }}>FITNESS</span> <span style={{ color: '#111' }}>GOAL</span>
            </h2>
            <p style={{ fontSize: 13, lineHeight: 1.9, color: 'rgba(0,0,0,0.45)', marginBottom: 24 }}>
              We are an independent gym committed to working with you to gain the results you want. Whether your aim is to lose weight, tone up, build bulk or gain weight.
            </p>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 0, marginBottom: 16 }}>
              {(['mission', 'vision'] as const).map(tab => (
                <TabButton key={tab} label={tab === 'mission' ? 'Our Mission' : 'Our Vision'} active={activeTab === tab} onClick={() => setActiveTab(tab)} />
              ))}
            </div>
            <div style={{ fontSize: 12, lineHeight: 1.8, color: 'rgba(0,0,0,0.45)', marginBottom: 28, minHeight: 50, animation: 'fadeIn 0.4s ease' }} key={activeTab}>
              {activeTab === 'mission'
                ? "Since 2017, we've been Lahore's most trusted transformation hub, combining elite coaching with a community that genuinely cares about your progress."
                : "To become Pakistan's leading fitness community where every individual has access to world-class training, nutrition guidance, and a supportive environment."
              }
            </div>

            {/* Phone CTA */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px',
              background: 'rgba(255,107,0,0.04)', border: '1px solid rgba(255,107,0,0.1)',
              clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
            }}>
              <div style={{
                width: 38, height: 38, background: 'var(--accent-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
              }}>
                <span style={{ fontSize: 14 }}>📞</span>
              </div>
              <div>
                <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)' }}>Call us for help</p>
                <p style={{ fontFamily: 'Bebas Neue', fontSize: 20, color: '#111', letterSpacing: '0.03em' }}>+92 300 123 4567</p>
              </div>
            </div>
          </div>

          {/* Dual Images */}
          <div style={{
            position: 'relative', opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(40px)',
            transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s',
          }}>
            {/* Main image with video */}
            <div
              onMouseEnter={() => setImg1Hovered(true)}
              onMouseLeave={() => setImg1Hovered(false)}
              onClick={() => setVideoOpen(true)}
              style={{
                width: '75%', height: 360, overflow: 'hidden', position: 'relative', zIndex: 2, cursor: 'pointer',
                clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
                boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
              }}
            >
              <img
                src="https://images.pexels.com/photos/5327496/pexels-photo-5327496.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=500"
                alt="Gym training" style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  transform: img1Hovered ? 'scale(1.06)' : 'scale(1)',
                  transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1)',
                }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)' }} />
              
              {/* Play button - always visible */}
              <div style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                transition: 'all 0.4s ease',
              }}>
                <div style={{
                  width: 70, height: 70, background: 'var(--accent-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transform: img1Hovered ? 'scale(1.1)' : 'scale(1)',
                  boxShadow: img1Hovered ? '0 12px 40px rgba(255,107,0,0.5)' : '0 8px 32px rgba(255,107,0,0.3)',
                  transition: 'all 0.4s ease',
                  clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
                }}>
                  <Play size={28} fill="#fff" color="#fff" style={{ marginLeft: 4 }} />
                </div>
              </div>
              
              <div style={{ position: 'absolute', bottom: 14, left: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-orange)' }} />
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#fff' }}>Watch Our Story</span>
              </div>
            </div>

            {/* Secondary image */}
            <div
              onMouseEnter={() => setImg2Hovered(true)}
              onMouseLeave={() => setImg2Hovered(false)}
              style={{
                width: '50%', height: 220, overflow: 'hidden', position: 'absolute', bottom: -30, right: -10, zIndex: 3,
                clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
                border: '4px solid #fafafa', boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
              }}
            >
              <img
                src="https://images.pexels.com/photos/3838700/pexels-photo-3838700.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=350"
                alt="Professional trainer" style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  transform: img2Hovered ? 'scale(1.06)' : 'scale(1)',
                  transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1)',
                }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 50%)' }} />
              <div style={{ position: 'absolute', bottom: 10, left: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-orange)' }} />
                <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#fff' }}>Professional Trainer</span>
              </div>
            </div>

            {/* Experience badge */}
            <div style={{
              position: 'absolute', top: 24, right: 24, width: 80, height: 80, zIndex: 4,
              background: 'var(--accent-orange)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
              boxShadow: '0 8px 32px rgba(255,107,0,0.3)',
            }}>
              <span style={{ fontFamily: 'Bebas Neue', fontSize: 32, color: '#fff', lineHeight: 1 }}>8+</span>
              <span style={{ fontSize: 7, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>Years</span>
            </div>
          </div>
        </div>

        {/* Values */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 60 }} className="hero-stats-grid">
          {values.map((item, i) => <ValueCard key={i} item={item} index={i} />)}
        </div>

        {/* Timeline + Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="about-grid">
          {/* Timeline */}
          <div style={{
            background: '#111', padding: '32px 28px', position: 'relative', overflow: 'hidden',
            clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--accent-orange)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <div style={{ width: 28, height: 2, background: 'var(--accent-orange)' }} />
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--accent-orange)' }}>Our Journey</span>
            </div>
            {timeline.map((item, i) => <TimelineItem key={i} item={item} isLast={i === timeline.length - 1} />)}
          </div>

          {/* Stats */}
          <div style={{
            background: '#fff', border: '1px solid rgba(0,0,0,0.06)', padding: '32px 28px', position: 'relative', overflow: 'hidden',
            clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'rgba(255,107,0,0.3)' }} />
            <h3 style={{ fontFamily: 'Bebas Neue', fontSize: 24, letterSpacing: '0.02em', color: '#111', marginBottom: 24 }}>Why Members Choose Us</h3>
            {stats.map((stat, i) => <ProgressBar key={i} stat={stat} index={i} />)}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {videoOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, animation: 'fadeIn 0.3s ease',
        }} onClick={(e) => { if (e.target === e.currentTarget) setVideoOpen(false) }}>
          <button onClick={() => setVideoOpen(false)} style={{
            position: 'absolute', top: 20, right: 20, width: 50, height: 50, background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
          }}>
            <X size={22} color="#fff" />
          </button>
          <div style={{
            width: '100%', maxWidth: 1000, aspectRatio: '16 / 9', background: '#000', overflow: 'hidden',
            border: '1px solid rgba(255,107,0,0.3)', animation: 'scaleIn 0.4s cubic-bezier(0.16,1,0.3,1)',
            clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
          }}>
            <iframe width="100%" height="100%" src="https://www.youtube.com/embed/EngW7tLk6R8?autoplay=1&rel=0"
              title="Fitnest Story" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen style={{ display: 'block' }}
            />
          </div>
        </div>
      )}
    </section>
  )
}

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        padding: '10px 24px', fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
        border: 'none', cursor: 'pointer',
        background: active ? 'var(--accent-orange)' : hovered ? 'rgba(0,0,0,0.04)' : 'transparent',
        color: active ? '#fff' : 'rgba(0,0,0,0.4)', transition: 'all 0.3s ease',
        clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
      }}
    >{label}</button>
  )
}

function TimelineItem({ item, isLast }: { item: { year: string; event: string }; isLast: boolean }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: isLast ? 0 : 22, cursor: 'default' }}
    >
      <div style={{ position: 'relative' }}>
        <div style={{
          width: 44, height: 44, background: hovered ? 'var(--accent-orange)' : 'rgba(255,107,0,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 800, color: hovered ? '#fff' : 'var(--accent-orange)', flexShrink: 0,
          transition: 'all 0.4s ease', transform: hovered ? 'scale(1.08)' : 'scale(1)',
          clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
        }}>{item.year}</div>
        {!isLast && <div style={{ position: 'absolute', top: 44, left: '50%', width: 1, height: 22, background: 'rgba(255,107,0,0.15)', transform: 'translateX(-50%)' }} />}
      </div>
      <div style={{ paddingTop: 10 }}>
        <p style={{ fontSize: 12, color: hovered ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.5)', transition: 'color 0.3s ease' }}>{item.event}</p>
      </div>
    </div>
  )
}
