'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Expand, X, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react'

const galleryItems = [
  {
    src: 'https://images.pexels.com/photos/28805366/pexels-photo-28805366.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    alt: 'Weight training session',
    category: 'Strength',
    title: 'Iron Paradise',
    desc: 'Our premium weight room equipped with competition-grade equipment.',
    span: 'tall',
  },
  {
    src: 'https://images.pexels.com/photos/2261485/pexels-photo-2261485.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    alt: 'CrossFit group workout',
    category: 'CrossFit',
    title: 'Group Power',
    desc: 'High-intensity group sessions that push limits together.',
    span: 'wide',
  },
  {
    src: 'https://images.pexels.com/photos/14524650/pexels-photo-14524650.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    alt: 'Woman weightlifting',
    category: 'Training',
    title: 'Focused Strength',
    desc: 'Dedicated training zones for every discipline.',
    span: 'normal',
  },
  {
    src: 'https://images.pexels.com/photos/32610333/pexels-photo-32610333.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    alt: 'Modern gym interior',
    category: 'Facility',
    title: 'State of the Art',
    desc: 'World-class facility with top-tier equipment and ambiance.',
    span: 'normal',
  },
  {
    src: 'https://images.pexels.com/photos/5327551/pexels-photo-5327551.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    alt: 'Man carrying weight plate',
    category: 'Performance',
    title: 'Raw Power',
    desc: 'Functional training that builds real-world strength.',
    span: 'wide',
  },
  {
    src: 'https://images.pexels.com/photos/4164759/pexels-photo-4164759.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    alt: 'Man exercising with dumbbells',
    category: 'One-on-One',
    title: 'Personal Focus',
    desc: 'Dedicated personal training with certified coaches.',
    span: 'tall',
  },
  {
    src: 'https://images.pexels.com/photos/27433192/pexels-photo-27433192.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    alt: 'Group fitness class',
    category: 'Community',
    title: 'Team Energy',
    desc: 'Community-driven workouts that fuel motivation.',
    span: 'normal',
  },
  {
    src: 'https://images.pexels.com/photos/1566414/pexels-photo-1566414.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    alt: 'Female athlete lifting barbell',
    category: 'Strength',
    title: 'Break Barriers',
    desc: 'Empowering athletes to surpass their limits every day.',
    span: 'normal',
  },
]

const categories = ['All', 'Strength', 'CrossFit', 'Training', 'Facility', 'Performance', 'Community']

export default function Gallery() {
  const [visible, setVisible] = useState(false)
  const [activeFilter, setActiveFilter] = useState('All')
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.05 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const filteredItems = activeFilter === 'All'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeFilter)

  const openLightbox = useCallback((index: number) => {
    setLightbox(index)
    document.body.style.overflow = 'hidden'
  }, [])

  const closeLightbox = useCallback(() => {
    setLightbox(null)
    document.body.style.overflow = ''
  }, [])

  const navigateLightbox = useCallback((dir: number) => {
    setLightbox(prev => {
      if (prev === null) return null
      const next = prev + dir
      if (next < 0) return filteredItems.length - 1
      if (next >= filteredItems.length) return 0
      return next
    })
  }, [filteredItems.length])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightbox === null) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') navigateLightbox(-1)
      if (e.key === 'ArrowRight') navigateLightbox(1)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightbox, closeLightbox, navigateLightbox])

  const fade = (delay: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(40px)',
    transition: `opacity 0.9s ease ${delay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  })

  return (
    <section id="gallery" ref={ref} style={{
      padding: '120px 0',
      background: 'linear-gradient(180deg, #0d0d0d 0%, #080808 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background decorative element */}
      <div style={{
        position: 'absolute', top: '20%', right: '-10%',
        width: 800, height: 800, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,107,0,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', left: '-5%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,107,0,0.03) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 48px' }} className="gallery-container">

        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'end', marginBottom: 48 }} className="gallery-header">
          <div>
            <div style={{ ...fade(0.1), display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 40, height: 2, background: 'var(--accent-orange)' }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--accent-orange)' }}>
                Our Gallery
              </span>
            </div>
            <h2 style={{
              ...fade(0.18),
              fontFamily: 'Bebas Neue', fontSize: 'clamp(52px, 7vw, 100px)',
              lineHeight: 0.9, color: '#fff', margin: 0,
            }}>
              WHERE<br />
              <span style={{ color: 'transparent', WebkitTextStroke: '2px rgba(255,255,255,0.15)' }}>LEGENDS</span><br />
              <span style={{ color: 'var(--accent-orange)' }}>TRAIN.</span>
            </h2>
          </div>
          <div style={fade(0.26)}>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, margin: 0, marginBottom: 24 }}>
              Step inside our world-class facility. From state-of-the-art equipment
              to electrifying group sessions — every corner is designed to ignite your potential.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {['50,000 sq.ft', 'Premium Equipment', 'Open 24/7'].map(tag => (
                <span key={tag} style={{
                  padding: '7px 16px', fontSize: 11, fontWeight: 700,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  border: '1px solid rgba(255,107,0,0.3)',
                  color: 'var(--accent-orange)', borderRadius: 2,
                  background: 'rgba(255,107,0,0.06)',
                }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{ ...fade(0.3), display: 'flex', gap: 4, marginBottom: 40, flexWrap: 'wrap' }} className="gallery-filters">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              style={{
                padding: '10px 22px',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                border: activeFilter === cat ? '1px solid var(--accent-orange)' : '1px solid rgba(255,255,255,0.08)',
                background: activeFilter === cat ? 'rgba(255,107,0,0.12)' : 'rgba(255,255,255,0.03)',
                color: activeFilter === cat ? 'var(--accent-orange)' : 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
              }}
              onMouseEnter={e => {
                if (activeFilter !== cat) {
                  e.currentTarget.style.borderColor = 'rgba(255,107,0,0.4)'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                }
              }}
              onMouseLeave={e => {
                if (activeFilter !== cat) {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.4)'
                }
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div style={{
          ...fade(0.35),
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 4,
          gridAutoRows: '220px',
        }} className="gallery-grid">
          {filteredItems.map((item, i) => {
            const isHovered = hoveredItem === i
            const gridStyle: React.CSSProperties = {}
            if (item.span === 'tall') {
              gridStyle.gridRow = 'span 2'
            } else if (item.span === 'wide') {
              gridStyle.gridColumn = 'span 2'
            }

            return (
              <div
                key={`${item.title}-${activeFilter}`}
                style={{
                  ...gridStyle,
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: '1px solid rgba(255,255,255,0.06)',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'scale(1)' : 'scale(0.95)',
                  transition: `opacity 0.6s ease ${0.1 + i * 0.06}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.06}s`,
                }}
                onMouseEnter={() => setHoveredItem(i)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => openLightbox(i)}
              >
                {/* Image */}
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1), filter 0.6s ease',
                    transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                    filter: isHovered ? 'brightness(0.5)' : 'brightness(0.7)',
                  }}
                />

                {/* Gradient overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: isHovered
                    ? 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.85) 100%)'
                    : 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.6) 100%)',
                  transition: 'all 0.4s ease',
                }} />

                {/* Category tag */}
                <div style={{
                  position: 'absolute', top: 16, left: 16,
                  padding: '5px 12px',
                  fontSize: 9, fontWeight: 700,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  background: 'rgba(255,107,0,0.9)',
                  color: '#fff',
                  clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? 'translateY(0)' : 'translateY(-10px)',
                  transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
                }}>
                  {item.category}
                </div>

                {/* Expand icon */}
                <div style={{
                  position: 'absolute', top: 16, right: 16,
                  width: 36, height: 36,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? 'translateY(0)' : 'translateY(-10px)',
                  transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1) 0.05s',
                  backdropFilter: 'blur(8px)',
                }}>
                  <Expand size={14} color="#fff" />
                </div>

                {/* Bottom info */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  padding: '20px 20px',
                  transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
                  transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
                }}>
                  <h4 style={{
                    fontFamily: 'Bebas Neue',
                    fontSize: 22,
                    letterSpacing: '0.05em',
                    color: '#fff',
                    margin: '0 0 4px',
                  }}>
                    {item.title}
                  </h4>
                  <p style={{
                    fontSize: 12,
                    color: 'rgba(255,255,255,0.5)',
                    margin: 0,
                    lineHeight: 1.5,
                    opacity: isHovered ? 1 : 0,
                    transform: isHovered ? 'translateY(0)' : 'translateY(8px)',
                    transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1) 0.08s',
                  }}>
                    {item.desc}
                  </p>
                </div>

                {/* Bottom accent line */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
                  background: 'var(--accent-orange)',
                  transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
                  transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
                  transformOrigin: 'left',
                }} />
              </div>
            )
          })}
        </div>

        {/* Stats Row */}
        <div style={{
          ...fade(0.5),
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 1,
          marginTop: 40,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.06)',
        }} className="gallery-stats">
          {[
            { number: '50K+', label: 'Sq. Ft. Facility' },
            { number: '200+', label: 'Equipment Pieces' },
            { number: '6', label: 'Training Zones' },
            { number: '24/7', label: 'Access Hours' },
          ].map((stat, i) => (
            <div key={stat.label} style={{
              padding: '32px 28px',
              background: '#0a0a0a',
              textAlign: 'center',
              borderRight: i < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            }}>
              <div style={{
                fontFamily: 'Bebas Neue',
                fontSize: 'clamp(32px, 4vw, 48px)',
                color: 'var(--accent-orange)',
                letterSpacing: '0.05em',
                lineHeight: 1,
                marginBottom: 8,
              }}>
                {stat.number}
              </div>
              <div style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.35)',
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ ...fade(0.6), textAlign: 'center', marginTop: 64 }}>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>
            Want a tour of our facility?
          </p>
          <button
            style={{
              background: 'var(--accent-orange)',
              border: 'none',
              color: '#fff',
              padding: '16px 44px',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
              transition: 'all 0.3s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#ff7a00'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent-orange)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            Book a Free Tour <ArrowUpRight size={16} />
          </button>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.95)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'fadeIn 0.3s ease',
          }}
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            style={{
              position: 'absolute', top: 24, right: 24,
              width: 48, height: 48,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff', cursor: 'pointer',
              clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
              transition: 'all 0.3s ease',
              zIndex: 10,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,107,0,0.3)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
          >
            <X size={20} />
          </button>

          {/* Prev button */}
          <button
            onClick={e => { e.stopPropagation(); navigateLightbox(-1) }}
            style={{
              position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)',
              width: 52, height: 52,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#fff', cursor: 'pointer',
              clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
              transition: 'all 0.3s ease',
              zIndex: 10,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,107,0,0.2)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
          >
            <ChevronLeft size={24} />
          </button>

          {/* Next button */}
          <button
            onClick={e => { e.stopPropagation(); navigateLightbox(1) }}
            style={{
              position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)',
              width: 52, height: 52,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#fff', cursor: 'pointer',
              clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
              transition: 'all 0.3s ease',
              zIndex: 10,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,107,0,0.2)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
          >
            <ChevronRight size={24} />
          </button>

          {/* Image */}
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: '85vw', maxHeight: '85vh', position: 'relative' }}>
            <img
              src={filteredItems[lightbox].src}
              alt={filteredItems[lightbox].alt}
              style={{
                maxWidth: '85vw',
                maxHeight: '80vh',
                objectFit: 'contain',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            />
            {/* Image info bar */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 0', marginTop: 12,
              borderTop: '1px solid rgba(255,255,255,0.08)',
            }}>
              <div>
                <h4 style={{
                  fontFamily: 'Bebas Neue',
                  fontSize: 24,
                  color: '#fff',
                  letterSpacing: '0.05em',
                  margin: '0 0 4px',
                }}>
                  {filteredItems[lightbox].title}
                </h4>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                  {filteredItems[lightbox].desc}
                </p>
              </div>
              <span style={{
                padding: '6px 14px',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                background: 'rgba(255,107,0,0.15)',
                border: '1px solid rgba(255,107,0,0.3)',
                color: 'var(--accent-orange)',
                clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
              }}>
                {filteredItems[lightbox].category}
              </span>
            </div>
            {/* Counter */}
            <div style={{
              position: 'absolute', top: 16, left: 16,
              padding: '6px 14px',
              background: 'rgba(0,0,0,0.7)',
              border: '1px solid rgba(255,255,255,0.1)',
              fontSize: 11, fontWeight: 700,
              letterSpacing: '0.12em',
              color: 'rgba(255,255,255,0.6)',
              backdropFilter: 'blur(8px)',
              clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
            }}>
              <span style={{ color: 'var(--accent-orange)' }}>{lightbox + 1}</span> / {filteredItems.length}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @media (max-width: 1024px) {
          .gallery-container { padding: 0 20px !important; }
          .gallery-header { grid-template-columns: 1fr !important; gap: 32px !important; }
          .gallery-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .gallery-stats { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .gallery-grid { grid-template-columns: 1fr !important; grid-auto-rows: 260px !important; }
          .gallery-stats { grid-template-columns: 1fr !important; }
          .gallery-filters { gap: 6px !important; }
        }
      `}</style>
    </section>
  )
}
