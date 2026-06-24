'use client'
import { useEffect, useRef, useState } from 'react'
import { Check, Star, Shield, Zap, ArrowRight } from 'lucide-react'

const plans = [
  {
    badge: 'Flexible',
    name: 'Monthly',
    price: '₨3,500',
    period: 'month',
    popular: false,
    features: [
      'Full gym access (6AM–11PM)',
      'Locker & changing room',
      'Basic fitness assessment',
      'Access to group classes',
      '1 trainer consultation',
      'Parking included',
    ],
  },
  {
    badge: 'Best Value',
    name: 'Quarterly',
    price: '₨9,000',
    period: '3 months',
    popular: true,
    features: [
      'Everything in Monthly',
      'Priority class booking',
      '3 personal training sessions',
      'Nutrition consultation',
      'Body composition analysis',
      'Guest pass (2/month)',
      'Supplements discount 10%',
    ],
  },
  {
    badge: 'Maximum Gains',
    name: 'Annual',
    price: '₨30,000',
    period: 'year',
    popular: false,
    savings: '₨12,000',
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
  },
]

function PlanCard({ plan, index }: { plan: typeof plans[0]; index: number }) {
  const [hovered, setHovered] = useState(false)
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true)
    }, { threshold: 0.15 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const isDark = plan.popular

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? (plan.popular ? 'translateY(-12px)' : 'translateY(0)')
          : 'translateY(40px)',
        transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 0.12}s`,
        background: isDark ? '#111' : '#fff',
        border: `1px solid ${isDark ? 'rgba(255,107,0,0.2)' : hovered ? 'rgba(255,107,0,0.2)' : 'rgba(0,0,0,0.06)'}`,
        position: 'relative', overflow: 'hidden',
        boxShadow: isDark ? '0 30px 80px rgba(0,0,0,0.2)' : hovered ? '0 20px 60px rgba(0,0,0,0.06)' : 'none',
        clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
      }}
    >
      {/* Top line */}
      <div style={{
        height: isDark ? 3 : 2,
        background: isDark ? 'var(--accent-orange)' : hovered ? 'var(--accent-orange)' : 'rgba(0,0,0,0.06)',
        transition: 'background 0.4s ease',
      }} />

      {plan.popular && (
        <div style={{
          position: 'absolute', top: 20, right: -32,
          background: 'var(--accent-orange)', color: '#fff',
          fontSize: 8, fontWeight: 800, letterSpacing: '0.15em',
          textTransform: 'uppercase', padding: '5px 40px',
          transform: 'rotate(45deg)',
        }}>
          <Star size={8} style={{ marginRight: 4, display: 'inline' }} /> Popular
        </div>
      )}

      <div style={{ padding: '36px 32px' }}>
        {/* Badge */}
        <span style={{
          display: 'inline-block', fontSize: 9, fontWeight: 700,
          letterSpacing: '0.2em', textTransform: 'uppercase',
          background: isDark ? 'rgba(255,107,0,0.15)' : 'rgba(255,107,0,0.06)',
          border: `1px solid ${isDark ? 'rgba(255,107,0,0.3)' : 'rgba(255,107,0,0.15)'}`,
          color: 'var(--accent-orange)', padding: '6px 14px', marginBottom: 20,
          clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
        }}>
          {plan.badge}
        </span>

        <h3 style={{
          fontFamily: 'Bebas Neue', fontSize: 32, letterSpacing: '0.02em',
          color: isDark ? '#fff' : '#111', marginBottom: 16,
        }}>
          {plan.name}
        </h3>

        {/* Price */}
        <div style={{ marginBottom: 28 }}>
          <span style={{
            fontFamily: 'Bebas Neue', fontSize: 'clamp(42px, 5vw, 56px)',
            color: isDark ? '#fff' : '#111', lineHeight: 1,
          }}>
            {plan.price}
          </span>
          <p style={{
            fontSize: 12, color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)',
            marginTop: 4,
          }}>
            Per {plan.period}
          </p>
          {plan.savings && (
            <p style={{ fontSize: 11, marginTop: 8 }}>
              <span style={{ fontWeight: 800, color: 'var(--accent-orange)' }}>SAVE {plan.savings}</span>
              <span style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}> vs monthly</span>
            </p>
          )}
        </div>

        {/* Features */}
        <div style={{
          borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
          paddingTop: 24, marginBottom: 28,
        }}>
          {plan.features.map(feat => (
            <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{
                width: 18, height: 18, borderRadius: '50%',
                background: isDark ? 'rgba(255,107,0,0.15)' : 'rgba(255,107,0,0.06)',
                border: `1px solid ${isDark ? 'rgba(255,107,0,0.4)' : 'rgba(255,107,0,0.2)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Check size={9} color="var(--accent-orange)" strokeWidth={3} />
              </div>
              <span style={{
                fontSize: 13, color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.5)',
              }}>
                {feat}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          className="btn-primary"
          onClick={() => {
            const el = document.getElementById('contact')
            if (el) el.scrollIntoView({ behavior: 'smooth' })
          }}
          style={{
            width: '100%', padding: '16px', fontSize: 11, gap: 8,
            background: isDark ? 'var(--accent-orange)' : hovered ? 'var(--accent-orange)' : '#111',
            clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
          }}
        >
          Get Started <ArrowRight size={13} />
        </button>
      </div>
    </div>
  )
}

export default function MembershipPlans() {
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
    <section id="pricing" style={{
      padding: '120px 0', background: '#fafafa',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: '50%',
        width: '80vw', height: '80vw', maxWidth: 700, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,107,0,0.04) 0%, transparent 65%)',
        pointerEvents: 'none', transform: 'translate(-50%, -40%)',
      }} />

      <div ref={ref} style={{ maxWidth: 1400, margin: '0 auto', padding: '0 48px', position: 'relative', zIndex: 1 }} className="hero-container">
        {/* Header */}
        <div style={{
          textAlign: 'center', marginBottom: 80,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 44, height: 2, background: 'var(--accent-orange)' }} />
            <span style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.28em',
              textTransform: 'uppercase', color: 'var(--accent-orange)',
            }}>Membership</span>
            <div style={{ width: 44, height: 2, background: 'var(--accent-orange)' }} />
          </div>
          <h2 style={{
            fontFamily: 'Bebas Neue', fontSize: 'clamp(48px, 8vw, 96px)',
            lineHeight: 0.95, letterSpacing: '0.02em', color: '#111',
          }}>
            INVEST IN YOUR<br />
            <span style={{ color: 'var(--accent-orange)' }}>BEST SELF.</span>
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(0,0,0,0.4)', marginTop: 16, maxWidth: 500, margin: '16px auto 0' }}>
            Transparent pricing. No hidden fees. Cancel anytime on monthly plans.
          </p>
        </div>

        {/* Plans */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, alignItems: 'start',
        }} className="plans-grid">
          {plans.map((plan, i) => (
            <PlanCard key={i} plan={plan} index={i} />
          ))}
        </div>

        {/* Bottom */}
        <div style={{
          marginTop: 60, textAlign: 'center',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.8s ease 0.5s',
        }}>
          <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.35)', marginBottom: 20 }}>
            All plans include free locker access · No joining fee currently · Cancel monthly anytime
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 28, flexWrap: 'wrap' }}>
            {[
              { icon: Shield, text: 'Secure Payment' },
              { icon: Zap, text: 'Instant Access' },
              { icon: Star, text: 'Money-back Guarantee' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon size={14} color="var(--accent-orange)" />
                <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(0,0,0,0.5)' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
