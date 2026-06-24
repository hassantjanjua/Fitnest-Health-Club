'use client'
import { useEffect, useRef, useState } from 'react'
import { MapPin, Dumbbell, Clock, ArrowRight, Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react'

const galleryItems = [
  { image: 'https://images.pexels.com/photos/28805366/pexels-photo-28805366.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', category: 'Strength', title: 'Iron Paradise', description: 'Our premium weight room with competition-grade equipment.', span: true },
  { image: 'https://images.pexels.com/photos/2261485/pexels-photo-2261485.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', category: 'CrossFit', title: 'Group Power', description: 'High-intensity group sessions that push limits together.' },
  { image: 'https://images.pexels.com/photos/14524650/pexels-photo-14524650.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', category: 'Training', title: 'Focused Strength', description: 'Dedicated training zones for every discipline.' },
  { image: 'https://images.pexels.com/photos/5327551/pexels-photo-5327551.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', category: 'Performance', title: 'Raw Power', description: 'Functional training that builds real-world strength.' },
  { image: 'https://images.pexels.com/photos/4164759/pexels-photo-4164759.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', category: 'Training', title: 'Personal Focus', description: 'Dedicated personal training with certified coaches.', span: true },
  { image: 'https://images.pexels.com/photos/1566414/pexels-photo-1566414.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', category: 'Strength', title: 'Break Barriers', description: 'Empowering athletes to surpass their limits every day.' },
]

function GalleryItem({ item, index, onOpen }: { item: typeof galleryItems[0]; index: number; onOpen: () => void }) {
  const [hovered, setHovered] = useState(false)
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true)
    }, { threshold: 0.1 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={onOpen}
      style={{
        opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: `all 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 0.08}s`,
        position: 'relative', overflow: 'hidden', height: item.span ? 340 : 240,
        gridColumn: item.span ? 'span 2' : 'span 1', cursor: 'pointer',
        clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
      }}
    >
      <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hovered ? 'scale(1.08)' : 'scale(1)', transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1)' }} loading="lazy" />
      <div style={{ position: 'absolute', inset: 0, background: hovered ? 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)' : 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 40%)', transition: 'background 0.5s ease' }} />
      <div style={{ position: 'absolute', top: 12, left: 12, background: 'var(--accent-orange)', color: '#fff', fontSize: 7, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '4px 10px', clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))' }}>{item.category}</div>
      <div style={{ position: 'absolute', top: 12, right: 12, width: 32, height: 32, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: hovered ? 1 : 0, transform: hovered ? 'scale(1)' : 'scale(0.6)', transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)', clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))' }}>
        <Maximize2 size={12} color="#fff" />
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '18px', transform: hovered ? 'translateY(0)' : 'translateY(8px)', opacity: hovered ? 1 : 0.7, transition: 'all 0.4s ease' }}>
        <h4 style={{ fontFamily: 'Bebas Neue', fontSize: 20, color: '#fff', letterSpacing: '0.02em', marginBottom: 3 }}>{item.title}</h4>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', opacity: hovered ? 1 : 0, transition: 'all 0.4s ease 0.1s' }}>{item.description}</p>
      </div>
    </div>
  )
}

export default function Gallery() {
  const [visible, setVisible] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true)
    }, { threshold: 0.1 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return
      if (e.key === 'Escape') setLightboxIndex(null)
      if (e.key === 'ArrowRight') setLightboxIndex((lightboxIndex + 1) % galleryItems.length)
      if (e.key === 'ArrowLeft') setLightboxIndex((lightboxIndex - 1 + galleryItems.length) % galleryItems.length)
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = lightboxIndex !== null ? 'hidden' : 'auto'
    return () => { document.removeEventListener('keydown', handleKey); document.body.style.overflow = 'auto' }
  }, [lightboxIndex])

  return (
    <section id="gallery" style={{ padding: '100px 0', background: '#fff', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '5%', right: '-3%', fontFamily: 'Bebas Neue', fontSize: 'clamp(80px, 14vw, 200px)', color: 'rgba(0,0,0,0.015)', whiteSpace: 'nowrap', pointerEvents: 'none' }}>GALLERY</div>

      <div ref={ref} style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 60, opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 44, height: 2, background: 'var(--accent-orange)' }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--accent-orange)' }}>Gallery</span>
            <div style={{ width: 44, height: 2, background: 'var(--accent-orange)' }} />
          </div>
          <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(40px, 7vw, 80px)', lineHeight: 0.95, letterSpacing: '0.02em', color: '#111' }}>OUR <span style={{ color: 'var(--accent-orange)' }}>FACILITY</span></h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }} className="gallery-grid">
          {galleryItems.map((item, i) => <GalleryItem key={i} item={item} index={i} onOpen={() => setLightboxIndex(i)} />)}
        </div>

        <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }} className="gallery-stats">
          {[{ icon: MapPin, value: '10K+', label: 'Sq. Ft. Facility' }, { icon: Dumbbell, value: '200+', label: 'Equipment Pieces' }, { icon: MapPin, value: '6', label: 'Training Zones' }, { icon: Clock, value: '17hrs', label: 'Daily Access' }].map(({ icon: Icon, value, label }, i) => (
            <StatItem key={i} Icon={Icon} value={value} label={label} />
          ))}
        </div>

        <div style={{ marginTop: 50, textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: 'rgba(0,0,0,0.4)', marginBottom: 16 }}>Want a tour of our facility?</p>
          <CTAButton href="#contact">Book a Free Tour <ArrowRight size={14} /></CTAButton>
        </div>
      </div>

      {lightboxIndex !== null && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, animation: 'fadeIn 0.3s ease' }}
          onClick={(e) => { if (e.target === e.currentTarget) setLightboxIndex(null) }}
        >
          <LightboxButton onClick={() => setLightboxIndex(null)} position="top-right"><X size={18} /></LightboxButton>
          <LightboxButton onClick={() => setLightboxIndex((lightboxIndex - 1 + galleryItems.length) % galleryItems.length)} position="left"><ChevronLeft size={18} /></LightboxButton>
          <LightboxButton onClick={() => setLightboxIndex((lightboxIndex + 1) % galleryItems.length)} position="right"><ChevronRight size={18} /></LightboxButton>
          <div style={{ maxWidth: 900, animation: 'scaleIn 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
            <img key={lightboxIndex} src={galleryItems[lightboxIndex].image} alt={galleryItems[lightboxIndex].title} style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain', clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))' }} />
            <div style={{ marginTop: 14, textAlign: 'center' }}>
              <h4 style={{ fontFamily: 'Bebas Neue', fontSize: 22, color: '#fff' }}>{galleryItems[lightboxIndex].title}</h4>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{galleryItems[lightboxIndex].description}</p>
              <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', marginTop: 6 }}>{lightboxIndex + 1} / {galleryItems.length} — Use arrow keys to navigate</p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function LightboxButton({ onClick, position, children }: { onClick: () => void; position: 'top-right' | 'left' | 'right'; children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false)
  const posStyles = position === 'top-right' ? { top: 20, right: 20 } : position === 'left' ? { left: 20, top: '50%', transform: 'translateY(-50%)' } : { right: 20, top: '50%', transform: 'translateY(-50%)' }
  return (
    <button onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        position: 'absolute', ...posStyles, width: 44, height: 44,
        background: hovered ? 'rgba(255,107,0,0.3)' : 'rgba(255,255,255,0.05)',
        border: `1px solid ${hovered ? 'rgba(255,107,0,0.5)' : 'rgba(255,255,255,0.1)'}`,
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
        transition: 'all 0.3s ease',
        clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
      }}
    >{children}</button>
  )
}

function StatItem({ Icon, value, label }: { Icon: React.ElementType; value: string; label: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(255,107,0,0.04)' : '#fafafa',
        border: `1px solid ${hovered ? 'rgba(255,107,0,0.15)' : 'rgba(0,0,0,0.04)'}`,
        padding: '22px 16px', textAlign: 'center', cursor: 'default', transition: 'all 0.35s ease',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered ? '0 12px 32px rgba(255,107,0,0.06)' : 'none',
        clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
      }}
    >
      <div style={{ width: 36, height: 36, margin: '0 auto 10px', background: 'rgba(255,107,0,0.06)', border: '1px solid rgba(255,107,0,0.12)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.35s ease', transform: hovered ? 'scale(1.15)' : 'scale(1)' }}>
        <Icon size={14} color="var(--accent-orange)" />
      </div>
      <div style={{ fontFamily: 'Bebas Neue', fontSize: 28, color: '#111', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.3)', marginTop: 4 }}>{label}</div>
    </div>
  )
}

function CTAButton({ href, children }: { href: string; children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a href={href} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 40px',
        fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', textDecoration: 'none',
        background: hovered ? '#e55f00' : 'var(--accent-orange)', color: '#fff',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered ? '0 14px 40px rgba(255,107,0,0.35)' : '0 6px 20px rgba(255,107,0,0.2)',
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
      }}
    >{children}</a>
  )
}
