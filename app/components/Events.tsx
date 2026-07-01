'use client'

import { useEffect, useRef, useState } from 'react'

const catColor: Record<string, string> = {
  Competition: '#ef4444',
  Event: '#3b82f6',
  Championship: 'var(--accent-orange)',
  Workshop: '#a855f7',
  Special: '#22c55e',
}

interface EventItem {
  _id: string
  month: string
  day: string
  year: string
  title: string
  description: string
  category: string
  isActive: boolean
}

export default function Events() {
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState<number | null>(null)
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    fetch('/api/events', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => setEvents(data.events || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false))
  }, [])

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
    <section id="events" ref={ref} style={{
      padding: 'clamp(60px,10vw,120px) 0',
      background: 'linear-gradient(180deg, #0a0a0a 0%, #080808 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', bottom: '0%', left: '-10%',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,107,0,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 48px' }} className="events-container">

        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'end', marginBottom: 64 }} className="events-header">
          <div>
            <div style={{ ...fade(0.1), display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 40, height: 2, background: 'var(--accent-orange)' }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--accent-orange)' }}>
                Event
              </span>
            </div>
            <h2 style={{
              ...fade(0.18),
              fontFamily: 'Bebas Neue', fontSize: 'clamp(42px,6vw,88px)',
              lineHeight: 0.9, color: '#fff', margin: 0,
            }}>
              UPCOMING <span style={{ color: 'var(--accent-orange)' }}>EVENTS</span>
            </h2>
          </div>
          <p style={{ ...fade(0.26), fontSize: 15, color: 'rgba(255,255,255,0.4)', lineHeight: 1.8 }}>
            Join us for competitions, championships and special events happening at Fitnest throughout the year.
          </p>
        </div>

        {/* Events list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>

          {loading && (
            <div style={{ padding: 48, textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 14 }}>
              Loading events...
            </div>
          )}

          {!loading && events.length === 0 && (
            <div style={{ padding: 48, textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 14 }}>
              No upcoming events at this time.
            </div>
          )}

          {!loading && events.map((ev, i) => (
            <div
              key={ev._id}
              style={{
                ...fade(0.1 + i * 0.08),
                display: 'grid', gridTemplateColumns: '80px 1fr auto',
                gap: 32, alignItems: 'center',
                padding: '28px 32px',
                background: hovered === i ? 'rgba(255,107,0,0.05)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${hovered === i ? 'rgba(255,107,0,0.2)' : 'rgba(255,255,255,0.05)'}`,
                transition: 'all 0.3s ease', cursor: 'default',
                borderLeft: `3px solid ${hovered === i ? 'var(--accent-orange)' : 'transparent'}`,
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="event-row"
            >
              {/* Date */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'Bebas Neue', fontSize: 40,
                  color: hovered === i ? 'var(--accent-orange)' : '#fff',
                  lineHeight: 1, transition: 'color 0.3s ease',
                }}>
                  {ev.day}
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', color: 'var(--accent-orange)', textTransform: 'uppercase' }}>
                  {ev.month}
                </div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{ev.year}</div>
              </div>

              {/* Info */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{
                    fontSize: 9, fontWeight: 700, padding: '2px 10px', borderRadius: 2,
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                    background: `${catColor[ev.category] || '#FF6B00'}18`,
                    color: catColor[ev.category] || '#FF6B00',
                    border: `1px solid ${catColor[ev.category] || '#FF6B00'}33`,
                  }}>
                    {ev.category}
                  </span>
                  <span style={{ fontFamily: 'Bebas Neue', fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.2em' }}>
                    EVENT {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <div style={{ fontFamily: 'Bebas Neue', fontSize: 24, color: '#fff', letterSpacing: '0.05em', marginBottom: 6 }}>
                  {ev.title}
                </div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, margin: 0, maxWidth: 600 }}>
                  {ev.description}
                </p>
              </div>

              {/* CTA */}
              <button
                onClick={() => { const el = document.getElementById('contact'); if (el) el.scrollIntoView({ behavior: 'smooth' }) }}
                style={{
                  background: hovered === i ? 'var(--accent-orange)' : 'transparent',
                  border: `1px solid ${hovered === i ? 'var(--accent-orange)' : 'rgba(255,255,255,0.15)'}`,
                  color: hovered === i ? '#fff' : 'rgba(255,255,255,0.5)',
                  padding: '12px 24px', fontSize: 10, fontWeight: 700,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  cursor: 'pointer', transition: 'all 0.3s ease',
                  clipPath: 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))',
                  whiteSpace: 'nowrap',
                }}
              >
                Register Now
              </button>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .events-container { padding: 0 20px !important; }
          .events-header { grid-template-columns: 1fr !important; gap: 24px !important; }
          .event-row { grid-template-columns: 64px 1fr !important; }
          .event-row button { grid-column: 1 / -1 !important; width: 100% !important; }
        }
      `}</style>
    </section>
  )
}