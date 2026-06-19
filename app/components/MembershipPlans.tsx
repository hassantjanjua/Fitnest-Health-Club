'use client'
import { useEffect, useRef, useState } from 'react'
import { Check, Zap, Crown, Star } from 'lucide-react'

type MembershipPlan = {
  _id?: string
  icon: React.ElementType
  name: string
  price: number
  period: string
  tag: string
  featured: boolean
  savings?: number
  features: string[]
  cta: string
}

type PlanApiItem = {
  _id?: string
  name?: string
  price?: number
  period?: string
  tag?: string
  featured?: boolean
  features?: string[]
}

const fallbackPlans: MembershipPlan[] = [
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
    cta: 'Contact Us',
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
    cta: 'Contact Us',
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
    cta: 'Contact Us',
  },
]

export default function MembershipPlans() {
  const [visible, setVisible] = useState(false)
  const [plans, setPlans] = useState<MembershipPlan[]>(fallbackPlans)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.05 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let alive = true
    async function loadPlans() {
      try {
        const res = await fetch('/api/plans')
        const data = await res.json()
        if (!res.ok || !Array.isArray(data.plans)) return
        const dbPlans = data.plans.map(normalizePlan).filter(Boolean) as MembershipPlan[]
        if (alive && dbPlans.length > 0) setPlans(dbPlans)
      } catch {
        // keep fallback
      }
    }
    loadPlans()
    return () => { alive = false }
  }, [])

  const fade = (delay: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(40px)',
    transition: `opacity 0.9s ease ${delay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  })

  return (
    <section id="plans" ref={ref} style={{
      padding: 'clamp(60px, 10vw, 120px) 0',
      background: 'linear-gradient(180deg, #0a0a0a 0%, #080808 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
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
          <div style={{
            ...fade(0.1),
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 12, marginBottom: 20,
          }}>
            <div style={{ width: 40, height: 2, background: 'var(--accent-orange)' }} />
            <span style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.28em',
              textTransform: 'uppercase', color: 'var(--accent-orange)',
            }}>
              Membership
            </span>
            <div style={{ width: 40, height: 2, background: 'var(--accent-orange)' }} />
          </div>
          <h2 style={{
            ...fade(0.18),
            fontFamily: 'Bebas Neue', fontSize: 'clamp(48px, 7vw, 100px)',
            lineHeight: 0.9, color: '#fff', margin: '0 auto 24px',
          }}>
            INVEST IN YOUR
            <br />
            <span style={{ color: 'var(--accent-orange)' }}>BEST SELF.</span>
          </h2>
          <p style={{
            ...fade(0.26),
            fontSize: 16, color: 'rgba(255,255,255,0.4)',
            maxWidth: 520, margin: '0 auto', lineHeight: 1.7,
          }}>
            Transparent pricing. No hidden fees. Cancel anytime on monthly plans.
          </p>
        </div>

        {/* Plans Grid */}
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}
          className="plans-grid"
        >
          {plans.map((plan, i) => (
            <PlanCard key={plan.name} plan={plan} fadeStyle={fade(0.1 + i * 0.1)} />
          ))}
        </div>

        {/* ── Horizontal Contact Us buttons row ── */}
        <div style={{
          ...fade(0.45),
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 20,
          marginTop: 0,
        }} className="plans-grid">
          {plans.map((plan, i) => (
            <ContactButton key={plan.name + '-btn'} plan={plan} index={i} />
          ))}
        </div>

        {/* Bottom note */}
        <div style={{ ...fade(0.5), textAlign: 'center', marginTop: 48 }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 1.8 }}>
            All plans include free locker access · No joining fee currently · Cancel monthly anytime
          </p>
          <div style={{
            display: 'flex', justifyContent: 'center',
            gap: 16, marginTop: 24, flexWrap: 'wrap',
          }}>
            {['Secure Payment', 'Instant Access', 'Money-back Guarantee'].map(item => (
              <div key={item} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 16px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 2,
              }}>
                <Check size={12} color="var(--accent-orange)" />
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .plans-container { padding: 0 20px !important; }
          .plans-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

/* ── Contact Us button row — one per plan, aligned horizontally ── */
function ContactButton({ plan, index }: { plan: MembershipPlan; index: number }) {
  const [hovered, setHovered] = useState(false)
  const isFeatured = plan.featured

  function scrollToContact() {
    const el = document.getElementById('contact')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <button
      onClick={scrollToContact}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%',
        padding: '16px 24px',
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: hovered ? 14 : 10,
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        clipPath: 'polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px))',
        background: isFeatured
          ? hovered ? '#ff7a00' : 'var(--accent-orange)'
          : hovered ? 'rgba(255,107,0,0.12)' : 'rgba(255,255,255,0.03)',
        color: isFeatured ? '#fff' : hovered ? 'var(--accent-orange)' : 'rgba(255,255,255,0.6)',
        outline: isFeatured ? 'none' : `1.5px solid ${hovered ? 'rgba(255,107,0,0.5)' : 'rgba(255,255,255,0.1)'}`,
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hovered && isFeatured ? '0 12px 32px rgba(255,107,0,0.25)' : 'none',
      }}
    >
      {/* Mail SVG */}
      <svg
        width="14" height="14" viewBox="0 0 24 24"
        fill="none"
        stroke={isFeatured ? '#fff' : hovered ? 'var(--accent-orange)' : 'rgba(255,255,255,0.5)'}
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ flexShrink: 0, transition: 'stroke 0.2s ease' }}
      >
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
      Contact Us
      {/* Arrow */}
      <svg
        width="14" height="14" viewBox="0 0 24 24"
        fill="none"
        stroke={isFeatured ? '#fff' : hovered ? 'var(--accent-orange)' : 'rgba(255,255,255,0.4)'}
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{
          flexShrink: 0,
          transform: hovered ? 'translateX(3px)' : 'translateX(0)',
          transition: 'all 0.3s ease',
        }}
      >
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    </button>
  )
}

function PlanCard({ plan, fadeStyle }: {
  plan: MembershipPlan
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
        background: hovered
          ? 'rgba(255,107,0,0.06)'
          : plan.featured ? 'rgba(255,107,0,0.03)' : '#0c0c0c',
        border: plan.featured
          ? '1px solid rgba(255,107,0,0.4)'
          : `1px solid ${hovered ? 'rgba(255,107,0,0.25)' : 'rgba(255,255,255,0.06)'}`,
        padding: 'clamp(28px, 3vw, 48px) clamp(24px, 2.5vw, 36px)',
        transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
        transform: hovered
          ? 'translateY(-8px)'
          : plan.featured ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered
          ? '0 24px 48px rgba(255,107,0,0.12)'
          : plan.featured ? '0 16px 40px rgba(255,107,0,0.08)' : 'none',
        clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {plan.featured && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 3,
          background: 'linear-gradient(90deg, var(--accent-orange), #ff9500)',
        }} />
      )}

      {plan.featured && (
        <div style={{
          position: 'absolute', top: 16, right: -32,
          background: 'var(--accent-orange)', color: '#fff',
          fontSize: 9, fontWeight: 700, letterSpacing: '0.12em',
          padding: '6px 40px', transform: 'rotate(45deg)',
          textTransform: 'uppercase',
        }}>
          Popular
        </div>
      )}

      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '6px 14px', marginBottom: 24,
        background: plan.featured
          ? 'rgba(255,107,0,0.15)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${plan.featured ? 'rgba(255,107,0,0.3)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 2,
        transition: 'all 0.3s ease',
        transform: hovered ? 'scale(1.05)' : 'scale(1)',
      }}>
        <Icon
          size={12}
          color={plan.featured ? 'var(--accent-orange)' : 'rgba(255,255,255,0.5)'}
        />
        <span style={{
          fontSize: 9, fontWeight: 700, letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: plan.featured ? 'var(--accent-orange)' : 'rgba(255,255,255,0.5)',
        }}>
          {plan.tag}
        </span>
      </div>

      <div style={{
        fontFamily: 'Bebas Neue',
        fontSize: 'clamp(26px, 2.5vw, 32px)',
        letterSpacing: '0.08em', color: '#fff', marginBottom: 8,
      }}>
        {plan.name}
      </div>

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
            {'₨' + plan.price.toLocaleString()}
          </span>
        </div>
        <div style={{
          fontSize: 12, color: 'rgba(255,255,255,0.35)',
          letterSpacing: '0.1em', marginTop: 4, textTransform: 'uppercase',
        }}>
          Per {plan.period}
        </div>
        {'savings' in plan && plan.savings ? (
          <div style={{
            fontSize: 12, color: '#22c55e', marginTop: 8,
            fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{
              background: 'rgba(34,197,94,0.15)',
              padding: '3px 8px', borderRadius: 2,
              fontSize: 10, fontWeight: 700,
            }}>
              SAVE
            </span>
            {'₨' + plan.savings.toLocaleString() + ' vs monthly'}
          </div>
        ) : null}
      </div>

      <div style={{
        height: 1,
        background: plan.featured
          ? 'linear-gradient(90deg, transparent, rgba(255,107,0,0.3), transparent)'
          : 'rgba(255,255,255,0.06)',
        marginBottom: 24,
      }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {plan.features.map((f, fi) => (
          <FeatureItem
            key={f} feature={f}
            featured={plan.featured} hovered={hovered} index={fi}
          />
        ))}
      </div>
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
      display: 'flex', alignItems: 'flex-start', gap: 12,
      transform: hovered ? `translateX(${4 + index * 0.5}px)` : 'translateX(0)',
      transition: `transform 0.35s cubic-bezier(0.16,1,0.3,1) ${index * 0.02}s`,
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
        background: featured ? 'rgba(255,107,0,0.15)' : 'rgba(255,255,255,0.05)',
        border: `1px solid ${featured ? 'rgba(255,107,0,0.3)' : 'rgba(255,255,255,0.1)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginTop: 1, transition: 'all 0.3s ease',
        transform: hovered ? 'scale(1.1)' : 'scale(1)',
      }}>
        <Check
          size={11}
          color={featured ? 'var(--accent-orange)' : 'rgba(255,255,255,0.4)'}
        />
      </div>
      <span style={{
        fontSize: 13,
        color: hovered ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.5)',
        lineHeight: 1.5, transition: 'color 0.3s ease',
      }}>
        {feature}
      </span>
    </div>
  )
}

function normalizePlan(plan: PlanApiItem, index: number): MembershipPlan | null {
  if (!plan.name || typeof plan.price !== 'number') return null
  const icons = [Star, Zap, Crown]
  return {
    _id: plan._id,
    icon: plan.featured ? Zap : icons[index % icons.length],
    name: plan.name,
    price: plan.price,
    period: plan.period || 'month',
    tag: plan.tag || (plan.featured ? 'Best Value' : 'Membership'),
    featured: Boolean(plan.featured),
    features: Array.isArray(plan.features) && plan.features.length > 0
      ? plan.features.filter(Boolean)
      : ['Full gym access'],
    cta: 'Contact Us',
  }
}