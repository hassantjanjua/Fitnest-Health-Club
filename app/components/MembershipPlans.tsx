'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Zap, Crown, Star } from 'lucide-react'

const plans = [
  {
    icon: Star,
    name: 'Monthly',
    price: 3500,
    period: 'month',
    tag: 'Flexible',
    color: 'rgba(255,255,255,0.04)',
    features: [
      'Full gym access (6AM–11PM)',
      'Locker & changing room',
      'Basic fitness assessment',
      'Access to group classes',
      '1 trainer consultation',
      'Parking included',
    ],
    cta: 'Start Monthly',
  },
  {
    icon: Zap,
    name: 'Quarterly',
    price: 9000,
    period: '3 months',
    tag: 'Best Value',
    featured: true,
    color: 'rgba(255,107,0,0.06)',
    features: [
      'Everything in Monthly',
      'Priority class booking',
      '3 personal training sessions',
      'Nutrition consultation',
      'Body composition analysis',
      'Guest pass (2/month)',
      'Supplements discount 10%',
    ],
    cta: 'Start Quarterly',
  },
  {
    icon: Crown,
    name: 'Annual',
    price: 30000,
    period: 'year',
    tag: 'Maximum Gains',
    color: 'rgba(255,255,255,0.04)',
    features: [
      'Everything in Quarterly',
      'Unlimited personal training',
      'Custom meal plan (monthly)',
      'Priority gym access',
      'Guest pass (4/month)',
      'Supplements discount 20%',
      'Free gym merchandise',
      'Dedicated trainer assigned',
    ],
    cta: 'Start Annual',
  },
]

export default function MembershipPlans() {
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState<number | null>(null)
  const ref = useRef<HTMLElement>(null)

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
    <section id="plans" ref={ref} style={{
      padding: '120px 0', background: '#080808',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', bottom: '0%', right: '-10%',
        width: 700, height: 700, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,107,0,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 48px' }} className="plans-container">

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <div style={{ ...fade(0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 40, height: 2, background: 'var(--accent-orange)' }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--accent-orange)' }}>
              Membership
            </span>
            <div style={{ width: 40, height: 2, background: 'var(--accent-orange)' }} />
          </div>
          <h2 style={{
            ...fade(0.18),
            fontFamily: 'Bebas Neue', fontSize: 'clamp(52px, 7vw, 100px)',
            lineHeight: 0.9, color: '#fff', margin: '0 auto 24px',
          }}>
            INVEST IN YOUR<br />
            <span style={{ color: 'var(--accent-orange)' }}>BEST SELF.</span>
          </h2>
          <p style={{ ...fade(0.26), fontSize: 16, color: 'rgba(255,255,255,0.4)', maxWidth: 520, margin: '0 auto' }}>
            Transparent pricing. No hidden fees. Cancel anytime on monthly plans.
          </p>
        </div>

        {/* Plans */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }} className="plans-grid">
          {plans.map((plan, i) => {
            const Icon = plan.icon
            const isHovered = hovered === i
            return (
              <div
                key={plan.name}
                style={{
                  ...fade(0.1 + i * 0.1),
                  position: 'relative', overflow: 'hidden',
                  background: isHovered ? 'rgba(255,107,0,0.07)' : '#0c0c0c',
                  border: plan.featured
                    ? '1px solid rgba(255,107,0,0.35)'
                    : '1px solid rgba(255,255,255,0.05)',
                  padding: '48px 36px',
                  transition: 'all 0.35s ease',
                  transform: plan.featured ? 'scaleY(1.02)' : 'scaleY(1)',
                }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Top bar for featured */}
                {plan.featured && (
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                    background: 'linear-gradient(90deg, var(--accent-orange), #ff9500)',
                  }} />
                )}

                {/* Tag badge */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '5px 12px', marginBottom: 28,
                  background: plan.featured ? 'var(--accent-orange)' : 'rgba(255,255,255,0.04)',
                  border: plan.featured ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 2,
                }}>
                  <Icon size={11} color={plan.featured ? '#fff' : 'rgba(255,255,255,0.4)'} />
                  <span style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: plan.featured ? '#fff' : 'rgba(255,255,255,0.4)',
                  }}>
                    {plan.tag}
                  </span>
                </div>

                <div style={{ fontFamily: 'Bebas Neue', fontSize: 32, letterSpacing: '0.08em', color: '#fff', marginBottom: 8 }}>
                  {plan.name}
                </div>

                {/* Price */}
                <div style={{ marginBottom: 32 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{ fontFamily: 'Bebas Neue', fontSize: 64, color: plan.featured ? 'var(--accent-orange)' : '#fff', lineHeight: 1 }}>
                      ₨{plan.price.toLocaleString()}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', marginTop: 4 }}>
                    PER {plan.period.toUpperCase()}
                  </div>
                  {plan.name === 'Annual' && (
                    <div style={{ fontSize: 12, color: '#22c55e', marginTop: 6, fontWeight: 600 }}>
                      Save ₨12,000 vs monthly
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 28 }} />

                {/* Features */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 36 }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                        background: plan.featured ? 'rgba(255,107,0,0.15)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${plan.featured ? 'rgba(255,107,0,0.3)' : 'rgba(255,255,255,0.1)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1,
                      }}>
                        <Check size={11} color={plan.featured ? 'var(--accent-orange)' : 'rgba(255,255,255,0.4)'} />
                      </div>
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>{f}</span>
                    </div>
                  ))}
                </div>

                <button style={{
                  width: '100%',
                  background: plan.featured ? 'var(--accent-orange)' : 'transparent',
                  border: plan.featured ? 'none' : '1.5px solid rgba(255,255,255,0.15)',
                  color: plan.featured ? '#fff' : 'rgba(255,255,255,0.6)',
                  padding: '16px', fontSize: 11, fontWeight: 700,
                  letterSpacing: '0.16em', textTransform: 'uppercase', cursor: 'none',
                  clipPath: 'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))',
                  transition: 'all 0.3s ease',
                }}
                  onMouseEnter={e => {
                    if (plan.featured) {
                      e.currentTarget.style.background = '#ff7a00'
                    } else {
                      e.currentTarget.style.background = 'rgba(255,107,0,0.08)'
                      e.currentTarget.style.borderColor = 'rgba(255,107,0,0.4)'
                      e.currentTarget.style.color = 'var(--accent-orange)'
                    }
                  }}
                  onMouseLeave={e => {
                    if (plan.featured) {
                      e.currentTarget.style.background = 'var(--accent-orange)'
                    } else {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
                      e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
                    }
                  }}
                >
                  {plan.cta}
                </button>
              </div>
            )
          })}
        </div>

        {/* Bottom note */}
        <div style={{ ...fade(0.5), textAlign: 'center', marginTop: 40 }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
            All plans include free locker access · No joining fee currently · Cancel monthly anytime
          </p>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .plans-container { padding: 0 20px !important; }
          .plans-grid { grid-template-columns: 1fr !important; max-width: 480px; margin: 0 auto; }
        }
      `}</style>
    </section>
  )
}