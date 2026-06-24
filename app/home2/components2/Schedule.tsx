'use client'
import { useEffect, useRef, useState } from 'react'
import { Clock, ArrowRight } from 'lucide-react'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const times = ['6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM']

type ClassType = { name: string; trainer: string; cat: string } | null

const schedule: ClassType[][] = [
  [{ name: 'Open Gym', trainer: '', cat: 'gym' }, null, { name: 'CrossFit', trainer: 'Ahmed R.', cat: 'crossfit' }, null, null, { name: 'Weight Training', trainer: 'Bilal K.', cat: 'strength' }, null, { name: 'HIIT', trainer: 'Sara M.', cat: 'hiit' }, null],
  [null, { name: 'Cardio Burn', trainer: 'Sara M.', cat: 'cardio' }, null, { name: 'Open Gym', trainer: '', cat: 'gym' }, null, null, { name: 'CrossFit', trainer: 'Ahmed R.', cat: 'crossfit' }, null, { name: 'Yoga', trainer: 'Zara A.', cat: 'yoga' }],
  [{ name: 'Weight Training', trainer: 'Bilal K.', cat: 'strength' }, null, null, null, { name: 'Open Gym', trainer: '', cat: 'gym' }, { name: 'HIIT', trainer: 'Sara M.', cat: 'hiit' }, null, null, null],
  [null, null, { name: 'Yoga', trainer: 'Zara A.', cat: 'yoga' }, { name: 'CrossFit', trainer: 'Ahmed R.', cat: 'crossfit' }, null, null, { name: 'Weight Training', trainer: 'Bilal K.', cat: 'strength' }, { name: 'Cardio Burn', trainer: 'Sara M.', cat: 'cardio' }, null],
  [{ name: 'Open Gym', trainer: '', cat: 'gym' }, null, null, null, { name: 'HIIT', trainer: 'Sara M.', cat: 'hiit' }, { name: 'CrossFit', trainer: 'Ahmed R.', cat: 'crossfit' }, null, null, { name: 'Open Gym', trainer: '', cat: 'gym' }],
  [{ name: 'Open Gym', trainer: '', cat: 'gym' }, { name: 'Weight Training', trainer: 'Bilal K.', cat: 'strength' }, null, null, null, null, { name: 'Yoga', trainer: 'Zara A.', cat: 'yoga' }, null, null],
]

const catColors: Record<string, string> = {
  gym: 'rgba(0,0,0,0.06)', crossfit: 'rgba(255,107,0,0.08)', strength: 'rgba(255,107,0,0.12)',
  cardio: 'rgba(239,68,68,0.08)', hiit: 'rgba(255,107,0,0.06)', yoga: 'rgba(34,197,94,0.08)',
}
const catBorders: Record<string, string> = {
  gym: 'rgba(0,0,0,0.1)', crossfit: 'rgba(255,107,0,0.2)', strength: 'rgba(255,107,0,0.3)',
  cardio: 'rgba(239,68,68,0.15)', hiit: 'rgba(255,107,0,0.15)', yoga: 'rgba(34,197,94,0.15)',
}

function ScheduleCell({ cls }: { cls: ClassType }) {
  const [hovered, setHovered] = useState(false)
  if (!cls) return <td style={{ padding: 10, borderBottom: '1px solid rgba(0,0,0,0.04)', borderRight: '1px solid rgba(0,0,0,0.04)' }} />
  return (
    <td onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ padding: 6, borderBottom: '1px solid rgba(0,0,0,0.04)', borderRight: '1px solid rgba(0,0,0,0.04)' }}
    >
      <div style={{
        background: hovered ? 'var(--accent-orange)' : catColors[cls.cat],
        border: `1px solid ${hovered ? 'var(--accent-orange)' : catBorders[cls.cat]}`,
        padding: '8px 10px', cursor: 'pointer', transition: 'all 0.3s ease',
        transform: hovered ? 'scale(1.02)' : 'scale(1)',
        clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
      }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: hovered ? '#fff' : '#111', transition: 'color 0.3s ease', marginBottom: 1 }}>{cls.name}</p>
        {cls.trainer && <p style={{ fontSize: 8, fontWeight: 500, color: hovered ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.35)', transition: 'color 0.3s ease' }}>{cls.trainer}</p>}
      </div>
    </td>
  )
}

export default function Schedule() {
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
    <section id="schedule" style={{ padding: '100px 0', background: '#fff', position: 'relative', overflow: 'hidden' }}>
      <div ref={ref} style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <div style={{
          textAlign: 'center', marginBottom: 50, opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 44, height: 2, background: 'var(--accent-orange)' }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--accent-orange)' }}>Training Schedule</span>
            <div style={{ width: 44, height: 2, background: 'var(--accent-orange)' }} />
          </div>
          <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(40px, 7vw, 80px)', lineHeight: 0.95, letterSpacing: '0.02em', color: '#111' }}>
            WEEKLY <span style={{ color: 'var(--accent-orange)' }}>CLASSES</span>
          </h2>
        </div>

        <div style={{
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s ease 0.2s', background: '#fff', border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden',
          clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
        }} className="schedule-table">
          <div style={{ height: 3, background: 'linear-gradient(90deg, var(--accent-orange), #ff9500)' }} />
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
              <thead>
                <tr>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(0,0,0,0.06)', borderRight: '1px solid rgba(0,0,0,0.06)', background: '#fafafa' }}>
                    <Clock size={12} color="var(--accent-orange)" />
                  </th>
                  {days.map(day => (
                    <th key={day} style={{ padding: '14px 10px', textAlign: 'center', fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(0,0,0,0.06)', borderRight: '1px solid rgba(0,0,0,0.04)', background: '#fafafa' }}>{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {times.map((time, ti) => (
                  <tr key={time}>
                    <td style={{ padding: '12px 16px', fontSize: 9, fontWeight: 700, color: 'rgba(0,0,0,0.3)', letterSpacing: '0.08em', whiteSpace: 'nowrap', borderBottom: '1px solid rgba(0,0,0,0.04)', borderRight: '1px solid rgba(0,0,0,0.06)', background: '#fafafa' }}>{time}</td>
                    {schedule.map((daySchedule, di) => <ScheduleCell key={di} cls={daySchedule[ti]} />)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ marginTop: 40, textAlign: 'center' }}>
          <CTAButton href="#contact">Book a Class <ArrowRight size={14} /></CTAButton>
        </div>
      </div>
    </section>
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
