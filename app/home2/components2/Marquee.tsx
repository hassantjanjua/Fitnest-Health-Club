'use client'
import { Dumbbell } from 'lucide-react'

const items = [
  'WEIGHT TRAINING', 'CARDIO', 'CROSSFIT', 'PERSONAL TRAINING',
  'NUTRITION', 'GROUP CLASSES', 'YOGA', 'HIIT',
]

// Triple the items so the seamless loop never shows a gap
const repeated = [...items, ...items, ...items]

export default function Marquee({ dark = false }: { dark?: boolean }) {
  return (
    <div style={{
      overflow: 'hidden',
      background: dark ? '#111' : '#fff',
      borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`,
      borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`,
      padding: '28px 0',
      position: 'relative',
      zIndex: 1,
    }}>
      <div className="marquee-track">
        {repeated.map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 20,
            paddingRight: 40,
            whiteSpace: 'nowrap',
          }}>
            <Dumbbell size={18} color="var(--accent-orange)" style={{ opacity: 0.4 }} />
            <span style={{
              fontFamily: 'Bebas Neue', fontSize: 28,
              letterSpacing: '0.08em',
              color: dark
                ? (i % 2 === 0 ? 'rgba(255,255,255,0.08)' : 'rgba(255,107,0,0.2)')
                : (i % 2 === 0 ? 'rgba(0,0,0,0.06)' : 'rgba(255,107,0,0.15)'),
            }}>
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}