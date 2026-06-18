'use client'
import { useEffect, useRef, useState } from 'react'
import { Check, Zap, Crown, Star, ArrowRight } from 'lucide-react'

const plans = [
  {
    icon: Star,
    name: 'Monthly',
    price: 3500,
    period: 'month',
    tag: 'Flexible',
    featured: false,
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
    featured: false,
    savings: 12000,
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
    <section id="pricing" ref={ref} style={{
      padding: 'clamp(60px, 10vw, 120px) 0',
      background: 'linear-gradient(180deg, #0a0a0a 0%, #080808 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glows */}
      <div style={{
        position: 'absolute', bottom: '0%', right: '-10%',
        width: 700, height: 700, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,107,0,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '20%', left: '-15%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,107,0,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 48px' }} className="plans-container">

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(48px, 6vw, 72px)' }}>
          <div style={{ ...fade(0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 40, height: 2, background: 'var(--accent-orange)' }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--accent-orange)' }}>
              Membership
            </span>
            <div style={{ width: 40, height: 2, background: 'var(--accent-orange)' }} />
          </div>
          <h2 style={{
            ...fade(0.18),
            fontFamily: 'Bebas Neue', fontSize: 'clamp(48px, 7vw, 100px)',
            lineHeight: 0.9, color: '#fff', margin: '0 auto 24px',
          }}>
            INVEST IN YOUR<br />
            <span style={{ color: 'var(--accent-orange)' }}>BEST SELF.</span>
          </h2>
          <p style={{ ...fade(0.26), fontSize: 16, color: 'rgba(255,255,255,0.4)', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
            Transparent pricing. No hidden fees. Cancel anytime on monthly plans.
          </p>
        </div>

        {/* Plans Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }} className="plans-grid">
          {plans.map((plan, i) => (
            <PlanCard key={plan.name} plan={plan} fadeStyle={fade(0.1 + i * 0.1)} />
          ))}
        </div>

        {/* Bottom note */}
        <div style={{ ...fade(0.5), textAlign: 'center', marginTop: 48 }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 1.8 }}>
            All plans include free locker access · No joining fee currently · Cancel monthly anytime
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 24, flexWrap: 'wrap' }}>
            {['Secure Payment', 'Instant Access', 'Money-back Guarantee'].map(item => (
              <div key={item} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 16px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 2,
              }}>
                <Check size={12} color="var(--accent-orange)" />
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function PlanCard({ plan, fadeStyle }: {
  plan: typeof plans[0]
  fadeStyle: React.CSSProperties
}) {
  const [hovered, setHovered] = useState(false)
  const Icon = plan.icon

  return (
    <div
      style={{
        ...fadeStyle,
        position: 'relative',
        overflow: 'hidden',
        background: hovered ? 'rgba(255,107,0,0.06)' : (plan.featured ? 'rgba(255,107,0,0.03)' : '#0c0c0c'),
        border: plan.featured
          ? '1px solid rgba(255,107,0,0.4)'
          : `1px solid ${hovered ? 'rgba(255,107,0,0.25)' : 'rgba(255,255,255,0.06)'}`,
        padding: 'clamp(28px, 3vw, 48px) clamp(24px, 2.5vw, 36px)',
        transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
        transform: hovered ? 'translateY(-8px)' : (plan.featured ? 'translateY(-4px)' : 'translateY(0)'),
        boxShadow: hovered
          ? '0 24px 48px rgba(255,107,0,0.12)'
          : (plan.featured ? '0 16px 40px rgba(255,107,0,0.08)' : 'none'),
        clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top accent bar for featured */}
      {plan.featured && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 3,
          background: 'linear-gradient(90deg, var(--accent-orange), #ff9500)',
        }} />
      )}

      {/* Popular badge for featured */}
      {plan.featured && (
        <div style={{
          position: 'absolute', top: 16, right: -32,
          background: 'var(--accent-orange)',
          color: '#fff',
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.12em',
          padding: '6px 40px',
          transform: 'rotate(45deg)',
          textTransform: 'uppercase',
        }}>
          Popular
        </div>
      )}

      {/* Tag badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '6px 14px', marginBottom: 24,
        background: plan.featured ? 'rgba(255,107,0,0.15)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${plan.featured ? 'rgba(255,107,0,0.3)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 2,
        transition: 'all 0.3s ease',
        transform: hovered ? 'scale(1.05)' : 'scale(1)',
      }}>
        <Icon size={12} color={plan.featured ? 'var(--accent-orange)' : 'rgba(255,255,255,0.5)'} />
        <span style={{
          fontSize: 9, fontWeight: 700, letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: plan.featured ? 'var(--accent-orange)' : 'rgba(255,255,255,0.5)',
        }}>
          {plan.tag}
        </span>
      </div>

      {/* Plan name */}
      <div style={{
        fontFamily: 'Bebas Neue',
        fontSize: 'clamp(26px, 2.5vw, 32px)',
        letterSpacing: '0.08em',
        color: '#fff',
        marginBottom: 8,
      }}>
        {plan.name}
      </div>

      {/* Price */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{
            fontFamily: 'Bebas Neue',
            fontSize: 'clamp(48px, 5vw, 64px)',
            color: plan.featured ? 'var(--accent-orange)' : '#fff',
            lineHeight: 1,
            transition: 'transform 0.3s ease',
            transform: hovered ? 'scale(1.02)' : 'scale(1)',
          }}>
            ₨{plan.price.toLocaleString()}
          </span>
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', marginTop: 4, textTransform: 'uppercase' }}>
          Per {plan.period}
        </div>
        {'savings' in plan && plan.savings && (
          <div style={{
            fontSize: 12,
            color: '#22c55e',
            marginTop: 8,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <span style={{
              background: 'rgba(34,197,94,0.15)',
              padding: '3px 8px',
              borderRadius: 2,
              fontSize: 10,
              fontWeight: 700,
            }}>
              SAVE
            </span>
            ₨{plan.savings.toLocaleString()} vs monthly
          </div>
        )}
      </div>

      {/* Divider */}
      <div style={{
        height: 1,
        background: plan.featured
          ? 'linear-gradient(90deg, transparent, rgba(255,107,0,0.3), transparent)'
          : 'rgba(255,255,255,0.06)',
        marginBottom: 24,
      }} />

      {/* Features */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
        {plan.features.map((f, fi) => (
          <FeatureItem key={f} feature={f} featured={plan.featured} hovered={hovered} index={fi} />
        ))}
      </div>

      {/* CTA Button */}
      <PlanButton plan={plan} />
    </div>
  )
}

function FeatureItem({ feature, featured, hovered, index }: {
  feature: string
  featured: boolean
  hovered: boolean
  index: number
}) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      transform: hovered ? `translateX(${4 + index * 0.5}px)` : 'translateX(0)',
      transition: `transform 0.35s cubic-bezier(0.16,1,0.3,1) ${index * 0.02}s`,
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
        background: featured ? 'rgba(255,107,0,0.15)' : 'rgba(255,255,255,0.05)',
        border: `1px solid ${featured ? 'rgba(255,107,0,0.3)' : 'rgba(255,255,255,0.1)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginTop: 1,
        transition: 'all 0.3s ease',
        transform: hovered ? 'scale(1.1)' : 'scale(1)',
      }}>
        <Check size={11} color={featured ? 'var(--accent-orange)' : 'rgba(255,255,255,0.4)'} />
      </div>
      <span style={{
        fontSize: 13,
        color: hovered ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.5)',
        lineHeight: 1.5,
        transition: 'color 0.3s ease',
      }}>
        {feature}
      </span>
    </div>
  )
}

function PlanButton({ plan }: { plan: typeof plans[0] }) {
  const [btnHovered, setBtnHovered] = useState(false)

  if (plan.featured) {
    return (
      <button
        className="btn-primary"
        onMouseEnter={() => setBtnHovered(true)}
        onMouseLeave={() => setBtnHovered(false)}
        style={{
          width: '100%',
          padding: '16px',
          fontSize: 11,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: btnHovered ? 12 : 8,
          transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
          cursor: 'pointer',
        }}
      >
        {plan.cta} <ArrowRight size={14} />
      </button>
    )
  }

  return (
    <button
      className="btn-outline"
      onMouseEnter={() => setBtnHovered(true)}
      onMouseLeave={() => setBtnHovered(false)}
      style={{
        width: '100%',
        padding: '16px',
        fontSize: 11,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: btnHovered ? 12 : 8,
        clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        cursor: 'pointer',
      }}
    >
      {plan.cta} <ArrowRight size={14} />
    </button>
  )
}
