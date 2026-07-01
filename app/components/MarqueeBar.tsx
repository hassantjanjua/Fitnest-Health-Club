'use client'

import { Dumbbell, Heart, Zap, Trophy, Target, Flame, Activity, TrendingUp } from 'lucide-react'

const topItems = [
  { text: 'STRENGTH TRAINING', icon: <Dumbbell size={18} /> },
  { text: 'CARDIO BLAST', icon: <Heart size={18} /> },
  { text: 'HIIT WORKOUTS', icon: <Zap size={18} /> },
  { text: 'WEIGHT LOSS', icon: <Target size={18} /> },
  { text: 'MUSCLE BUILDING', icon: <Trophy size={18} /> },
  { text: 'CROSSFIT', icon: <Flame size={18} /> },
  { text: 'YOGA & PILATES', icon: <Activity size={18} /> },
  { text: 'PERSONAL TRAINING', icon: <TrendingUp size={18} /> },
]

const bottomItems = [
  { text: 'FUNCTIONAL FITNESS', icon: <Activity size={18} /> },
  { text: 'BODY TRANSFORMATION', icon: <TrendingUp size={18} /> },
  { text: 'NUTRITION COACHING', icon: <Target size={18} /> },
  { text: 'GROUP CLASSES', icon: <Trophy size={18} /> },
  { text: 'EXPERT TRAINERS', icon: <Dumbbell size={18} /> },
  { text: 'MODERN EQUIPMENT', icon: <Zap size={18} /> },
  { text: 'RESULTS GUARANTEED', icon: <Flame size={18} /> },
  { text: 'WELLNESS PROGRAMS', icon: <Heart size={18} /> },
]

export default function MarqueeBar() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #0a0a0a 0%, #080808 100%)',
      position: 'relative',
      overflow: 'hidden',
      zIndex: 2,
      borderTop: '1px solid rgba(255,107,0,0.1)',
      borderBottom: '1px solid rgba(255,107,0,0.1)',
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.02,
        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)',
      }} />

      {/* Top Marquee - Moving Right */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '16px 0',
        borderBottom: '1px solid rgba(255,107,0,0.06)',
      }}>
        <div style={{
          display: 'flex',
          gap: 0,
          animation: 'marqueeRight 30s linear infinite',
          width: 'max-content',
        }}>
          {[...topItems, ...topItems, ...topItems, ...topItems].map((item, i) => (
            <MarqueeItem key={i} item={item} />
          ))}
        </div>
      </div>

      {/* Bottom Marquee - Moving Left */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '16px 0',
      }}>
        <div style={{
          display: 'flex',
          gap: 0,
          animation: 'marqueeLeft 25s linear infinite',
          width: 'max-content',
        }}>
          {[...bottomItems, ...bottomItems, ...bottomItems, ...bottomItems].map((item, i) => (
            <MarqueeItem key={i} item={item} variant="secondary" />
          ))}
        </div>
      </div>

      {/* Gradient Overlays */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 120,
        height: '100%',
        background: 'linear-gradient(90deg, #080808 0%, transparent 100%)',
        pointerEvents: 'none',
        zIndex: 1,
      }} />
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: 120,
        height: '100%',
        background: 'linear-gradient(270deg, #080808 0%, transparent 100%)',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      <style>{`
        @keyframes marqueeRight {
          0% { transform: translateX(0); }
          100% { transform: translateX(-25%); }
        }
        @keyframes marqueeLeft {
          0% { transform: translateX(-25%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}

function MarqueeItem({
  item,
  variant = 'primary',
}: {
  item: typeof topItems[0]
  variant?: 'primary' | 'secondary'
}) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '0 40px',
      position: 'relative',
    }}>
      {/* Icon Circle */}
      <div style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: variant === 'primary'
          ? 'rgba(255,107,0,0.12)'
          : 'rgba(255,107,0,0.08)',
        border: `1px solid ${variant === 'primary' ? 'rgba(255,107,0,0.3)' : 'rgba(255,107,0,0.2)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--accent-orange)',
        flexShrink: 0,
      }}>
        {item.icon}
      </div>

      {/* Text */}
      <span style={{
        fontFamily: 'Bebas Neue, sans-serif',
        fontSize: 18,
        letterSpacing: '0.18em',
        color: variant === 'primary' ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.7)',
        whiteSpace: 'nowrap',
        textTransform: 'uppercase',
      }}>
        {item.text}
      </span>

      {/* Separator Dot */}
      <div style={{
        width: 4,
        height: 4,
        borderRadius: '50%',
        background: 'rgba(255,107,0,0.4)',
        flexShrink: 0,
        marginLeft: 24,
      }} />
    </div>
  )
}
