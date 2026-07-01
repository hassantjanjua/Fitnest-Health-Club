'use client'
import { useEffect, useRef, useState } from 'react'
import { Clock, Calendar, Zap, ChevronLeft, ChevronRight, MapPin } from 'lucide-react'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const times = ['6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM']
const categories = ['All', 'Cardio', 'Strength', 'Yoga', 'CrossFit', 'Cycling', 'HIIT', 'Boxing', 'Pilates']

const colorMap: Record<string, { bg: string; border: string; glow: string; text: string }> = {
  Cardio:   { bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.25)',  glow: 'rgba(239,68,68,0.4)',   text: '#ef4444' },
  Strength: { bg: 'rgba(255,107,0,0.08)',  border: 'rgba(255,107,0,0.25)',  glow: 'rgba(255,107,0,0.4)',   text: '#FF6B00' },
  Yoga:     { bg: 'rgba(168,85,247,0.08)', border: 'rgba(168,85,247,0.25)', glow: 'rgba(168,85,247,0.4)',  text: '#a855f7' },
  CrossFit: { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.25)', glow: 'rgba(59,130,246,0.4)',  text: '#3b82f6' },
  Cycling:  { bg: 'rgba(34,197,94,0.08)',  border: 'rgba(34,197,94,0.25)',  glow: 'rgba(34,197,94,0.4)',   text: '#22c55e' },
  HIIT:     { bg: 'rgba(234,179,8,0.08)',  border: 'rgba(234,179,8,0.25)',  glow: 'rgba(234,179,8,0.4)',   text: '#eab308' },
  Boxing:   { bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.25)', glow: 'rgba(249,115,22,0.4)',  text: '#f97316' },
  Pilates:  { bg: 'rgba(236,72,153,0.08)', border: 'rgba(236,72,153,0.25)', glow: 'rgba(236,72,153,0.4)',  text: '#ec4899' },
}

// Build trainer avatar initials from name
function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function getTrainerColor(name: string) {
  const colors = [
    'hsl(15,70%,50%)', 'hsl(210,60%,50%)',
    'hsl(320,55%,55%)', 'hsl(270,50%,55%)',
    'hsl(160,60%,45%)', 'hsl(45,70%,50%)',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

type DbClass = {
  _id: string
  day: string
  time: string
  className: string
  trainer: string
  category: string
  isActive: boolean
}

// Build a lookup: schedule[day][time] = class
type ScheduleMap = Record<string, Record<string, DbClass | null>>

export default function ClassSchedule() {
  const [visible, setVisible] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeDay, setActiveDay] = useState('Monday')
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null)
  const [scheduleMap, setScheduleMap] = useState<ScheduleMap>({})
  const [loading, setLoading] = useState(true)
  const ref = useRef<HTMLElement>(null)

  // ── Fetch from database ──
  useEffect(() => {
    async function fetchSchedule() {
      try {
        const res = await fetch('/api/schedule')
        const data = await res.json()
        const classes: DbClass[] = data.schedule || []

        // Build lookup map from flat array
        const map: ScheduleMap = {}
        days.forEach(d => { map[d] = {} })
        classes.forEach(cls => {
          if (!map[cls.day]) map[cls.day] = {}
          map[cls.day][cls.time] = cls
        })
        setScheduleMap(map)
      } catch {
        setScheduleMap({})
      } finally {
        setLoading(false)
      }
    }
    fetchSchedule()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.05 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const fade = (delay: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0px)' : 'translateY(40px)',
    transition: `opacity 0.9s ease ${delay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  })

  const daySchedule = scheduleMap[activeDay] || {}
  const totalClasses = Object.values(daySchedule).filter(Boolean).length
  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' })

  function navigateDay(direction: 'prev' | 'next') {
    const i = days.indexOf(activeDay)
    const next = direction === 'next' ? (i + 1) % days.length : (i - 1 + days.length) % days.length
    setActiveDay(days[next])
  }

  return (
    <section
      id="schedule"
      ref={ref}
      style={{
        padding: 'clamp(80px, 12vw, 140px) 0',
        background: '#080808',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glows */}
      <div style={{
        position: 'absolute', top: '5%', right: '-15%',
        width: '50vw', height: '50vw', maxWidth: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,107,0,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', left: '-10%',
        width: '40vw', height: '40vw', maxWidth: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Diagonal lines */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', opacity: 0.5 }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute', top: '-50%',
            left: `${i * 200 - 50}px`,
            width: '1px', height: '200%',
            background: 'rgba(255,107,0,0.03)',
            transform: 'rotate(-15deg)',
          }} />
        ))}
      </div>

      <div style={{
        maxWidth: 1400, margin: '0 auto',
        padding: '0 48px', width: '100%', position: 'relative', zIndex: 1,
      }} className="schedule-container">

        {/* Header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr auto',
          gap: 48, alignItems: 'end', marginBottom: 56,
        }} className="schedule-header">
          <div>
            <div style={{ ...fade(0.1), display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 40, height: 2, background: 'var(--accent-orange)', flexShrink: 0 }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--accent-orange)' }}>
                Weekly Timetable
              </span>
            </div>
            <h2 style={{
              ...fade(0.18),
              fontFamily: 'Bebas Neue', fontSize: 'clamp(48px, 7vw, 96px)',
              lineHeight: 0.85, color: '#fff', margin: 0,
            }}>
              CLASS{' '}
              <span style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(255,255,255,0.2)' }}>
                SCHEDULE
              </span>
            </h2>
          </div>

          {/* Day counter card */}
          <div style={{
            ...fade(0.26),
            border: '1px solid rgba(255,107,0,0.15)',
            background: 'rgba(14,14,14,0.8)',
            backdropFilter: 'blur(12px)',
            padding: '20px 28px',
            clipPath: 'polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px))',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Calendar size={14} color="var(--accent-orange)" />
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent-orange)' }}>
                {activeDay === todayName ? 'Today' : activeDay}
              </span>
            </div>
            <div style={{ fontFamily: 'Bebas Neue', fontSize: 42, lineHeight: 1, color: '#fff' }}>
              {loading ? '—' : totalClasses}
              <span style={{ fontSize: 22, color: 'var(--accent-orange)' }}> classes</span>
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 4, letterSpacing: '0.05em' }}>
              scheduled today
            </div>
          </div>
        </div>

        {/* Description */}
        <p style={{
          ...fade(0.3),
          fontSize: 15, color: 'rgba(255,255,255,0.4)',
          lineHeight: 1.8, maxWidth: 560, marginBottom: 40,
        }}>
          Plan your week with our comprehensive class timetable.
          All levels welcome — from beginner to advanced.
        </p>

        {/* Category filters */}
        <div style={{ ...fade(0.32), display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28, alignItems: 'center' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                background: activeCategory === cat ? 'var(--accent-orange)' : 'transparent',
                border: `1px solid ${activeCategory === cat ? 'var(--accent-orange)' : 'rgba(255,255,255,0.08)'}`,
                color: activeCategory === cat ? '#fff' : 'rgba(255,255,255,0.45)',
                padding: '10px 20px', fontSize: 10, fontWeight: 700,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                cursor: 'pointer', borderRadius: 3, transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => {
                if (activeCategory !== cat) {
                  e.currentTarget.style.borderColor = 'rgba(255,107,0,0.4)'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                  e.currentTarget.style.background = 'rgba(255,107,0,0.06)'
                }
              }}
              onMouseLeave={e => {
                if (activeCategory !== cat) {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.45)'
                  e.currentTarget.style.background = 'transparent'
                }
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Day tabs */}
        <div style={{
          ...fade(0.36),
          display: 'flex', alignItems: 'center', gap: 4, marginBottom: 1,
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '4px 4px 0 0', padding: '6px 8px',
        }}>
          <button
            onClick={() => navigateDay('prev')}
            style={{
              background: 'none', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 3, width: 32, height: 32,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.2s ease', flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,107,0,0.4)'; e.currentTarget.style.background = 'rgba(255,107,0,0.06)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'none' }}
          >
            <ChevronLeft size={14} color="rgba(255,255,255,0.4)" />
          </button>

          {days.map(day => {
            const isToday = day === todayName
            const isActive = day === activeDay
            return (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                style={{
                  flex: 1, minWidth: 0, padding: '10px 4px',
                  background: isActive ? 'var(--accent-orange)' : 'transparent',
                  border: 'none',
                  color: isActive ? '#fff' : isToday ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)',
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
                  textTransform: 'uppercase', cursor: 'pointer',
                  transition: 'all 0.25s ease', borderRadius: 3,
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                    e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = isToday ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)'
                  }
                }}
              >
                {day.slice(0, 3)}
                {isToday && (
                  <div style={{
                    width: 4, height: 4, borderRadius: '50%',
                    background: 'var(--accent-orange)',
                    margin: '4px auto 0',
                    boxShadow: '0 0 6px rgba(255,107,0,0.5)',
                  }} />
                )}
              </button>
            )
          })}

          <button
            onClick={() => navigateDay('next')}
            style={{
              background: 'none', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 3, width: 32, height: 32,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.2s ease', flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,107,0,0.4)'; e.currentTarget.style.background = 'rgba(255,107,0,0.06)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'none' }}
          >
            <ChevronRight size={14} color="rgba(255,255,255,0.4)" />
          </button>
        </div>

        {/* Schedule grid */}
        <div style={{
          ...fade(0.42),
          border: '1px solid rgba(255,255,255,0.06)',
          borderTop: 'none',
          background: 'rgba(255,255,255,0.008)',
          borderRadius: '0 0 4px 4px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: 1,
            background: 'linear-gradient(90deg, transparent, var(--accent-orange), transparent)',
            opacity: 0.5,
          }} />

          {/* Loading state */}
          {loading ? (
            <div style={{ padding: 60, textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: 14 }}>
              <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.3 }}>◷</div>
              Loading schedule...
            </div>
          ) : Object.keys(daySchedule).length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 14 }}>
              <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.2 }}>📅</div>
              No classes scheduled for {activeDay}
            </div>
          ) : (
            times.map((time, ti) => {
              const slot = daySchedule[time] as DbClass | null | undefined
              const show = !slot || activeCategory === 'All' || slot.category === activeCategory
              const slotKey = `${activeDay}-${time}`
              const isHovered = hoveredSlot === slotKey
              const colors = slot ? colorMap[slot.category] || colorMap['Strength'] : null
              const hasClass = !!slot && show

              // Skip times with no class and no match
              if (!slot) return (
                <div
                  key={time}
                  style={{
                    display: 'grid', gridTemplateColumns: '140px 1fr',
                    borderBottom: ti < times.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                    minHeight: 64,
                  }}
                >
                  <div style={{
                    padding: '16px 24px', borderRight: '1px solid rgba(255,255,255,0.04)',
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: 'rgba(255,255,255,0.008)',
                  }}>
                    <Clock size={13} color="rgba(255,255,255,0.1)" />
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.15)', letterSpacing: '0.06em' }}>
                      {time}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', padding: '14px 20px' }}>
                    <div style={{ height: 1, width: 60, background: 'rgba(255,255,255,0.04)', borderRadius: 1 }} />
                  </div>
                </div>
              )

              return (
                <div
                  key={time}
                  onMouseEnter={() => setHoveredSlot(slotKey)}
                  onMouseLeave={() => setHoveredSlot(null)}
                  style={{
                    display: 'grid', gridTemplateColumns: '140px 1fr',
                    borderBottom: ti < times.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                    transition: 'background 0.3s ease',
                    background: isHovered ? 'rgba(255,255,255,0.015)' : 'transparent',
                    minHeight: 80,
                  }}
                >
                  {/* Time */}
                  <div style={{
                    padding: '20px 24px', borderRight: '1px solid rgba(255,255,255,0.04)',
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: 'rgba(255,255,255,0.008)',
                  }}>
                    <Clock size={13} color={hasClass ? colors?.text || 'var(--accent-orange)' : 'rgba(255,255,255,0.15)'} />
                    <span style={{
                      fontSize: 12, fontWeight: 700,
                      color: hasClass ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.2)',
                      letterSpacing: '0.06em', transition: 'color 0.3s ease',
                    }}>
                      {time}
                    </span>
                  </div>

                  {/* Class content */}
                  <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center' }}>
                    {show ? (
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 16,
                        padding: '14px 22px', width: '100%',
                        background: colors?.bg || 'rgba(255,107,0,0.06)',
                        border: `1px solid ${isHovered ? colors?.border || 'rgba(255,107,0,0.4)' : colors?.border || 'rgba(255,107,0,0.2)'}`,
                        borderRadius: 4,
                        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                        transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
                        cursor: 'default', overflow: 'hidden',
                      }}>
                        {/* Color dot */}
                        <div style={{
                          width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                          background: colors?.text || 'var(--accent-orange)',
                          boxShadow: isHovered
                            ? `0 0 16px ${colors?.glow || 'rgba(255,107,0,0.5)'}`
                            : `0 0 8px ${colors?.glow || 'rgba(255,107,0,0.4)'}`,
                          transition: 'box-shadow 0.3s ease',
                        }} />

                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 4, letterSpacing: '0.02em' }}>
                            {slot.className}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{
                              width: 20, height: 20, borderRadius: '50%',
                              background: getTrainerColor(slot.trainer),
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 7, fontWeight: 800, color: '#fff', flexShrink: 0,
                            }}>
                              {getInitials(slot.trainer)}
                            </div>
                            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                              {slot.trainer}
                            </span>
                          </div>
                        </div>

                        {/* Category badge */}
                        <span style={{
                          fontSize: 9, fontWeight: 700, padding: '4px 10px', borderRadius: 2,
                          letterSpacing: '0.12em', textTransform: 'uppercase', flexShrink: 0,
                          background: `${colors?.text || 'var(--accent-orange)'}18`,
                          color: colors?.text || 'var(--accent-orange)',
                          border: `1px solid ${colors?.text || 'var(--accent-orange)'}25`,
                        }}>
                          {slot.category}
                        </span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', padding: '12px 0' }}>
                        <div style={{ height: 1, width: 60, background: 'rgba(255,255,255,0.04)', borderRadius: 1 }} />
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Legend */}
        <div style={{
          ...fade(0.5),
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginTop: 32,
          flexWrap: 'wrap', gap: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            {Object.entries(colorMap).map(([name, c]) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: c.text, boxShadow: `0 0 6px ${c.glow}`,
                }} />
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {name}
                </span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <MapPin size={10} color="rgba(255,255,255,0.3)" />
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>Model Town, Lahore</span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .schedule-container { padding: 0 20px !important; }
          .schedule-header { grid-template-columns: 1fr !important; gap: 24px !important; }
        }
        @media (max-width: 768px) {
          .schedule-header > div:last-child { display: none !important; }
        }
      `}</style>
    </section>
  )
}