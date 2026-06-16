'use client'
import { useEffect, useRef, useState } from 'react'
import { Plus, Minus, ArrowRight } from 'lucide-react'

const faqs = [
  { q: 'What are your operating hours?', a: 'Fitnest is open 6AM to 11PM, seven days a week including public holidays.' },
  { q: 'Is there a joining fee?', a: 'We currently have no joining fee. You only pay your chosen membership plan.' },
  { q: 'Can I try before I commit?', a: 'Yes! We offer a completely free trial session for all new members. Just walk in or book online.' },
  { q: 'Do you offer personal training?', a: 'Absolutely. All plans include at least one trainer consultation, and dedicated personal training is available as an add-on or within our Quarterly and Annual plans.' },
  { q: 'What equipment do you have?', a: 'Our 10,000 sq ft facility includes full free weight areas, cable machines, cardio equipment, a dedicated CrossFit zone, a yoga studio, and a boxing corner.' },
  { q: 'Can I pause or cancel my membership?', a: 'Monthly plans can be cancelled anytime. Quarterly and Annual plans can be paused for medical reasons with documentation.' },
  { q: 'Do you have separate female workout areas?', a: 'Yes, we have dedicated female-only training zones and separate changing facilities for full privacy and comfort.' },
  { q: 'Is parking available?', a: 'Yes, free parking is available for all members directly outside the facility.' },
]

export default function FAQ() {
  const [visible, setVisible] = useState(false)
  const [open, setOpen] = useState<number | null>(0)
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
    <section id="faq" ref={ref} style={{
      padding: 'clamp(60px, 10vw, 120px) 0',
      background: '#080808',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '30%', left: '-10%',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,107,0,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 48px' }} className="faq-container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 80, alignItems: 'start' }} className="faq-grid">

          {/* Left */}
          <div className="faq-left" style={{ position: 'sticky', top: 120 }}>
            <div style={{ ...fade(0.1), display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 40, height: 2, background: 'var(--accent-orange)' }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--accent-orange)' }}>
                FAQ
              </span>
            </div>
            <h2 style={{
              ...fade(0.18),
              fontFamily: 'Bebas Neue', fontSize: 'clamp(48px, 6vw, 88px)',
              lineHeight: 0.9, color: '#fff', margin: '0 0 24px',
            }}>
              GOT<br />
              <span style={{ color: 'transparent', WebkitTextStroke: '2px rgba(255,255,255,0.15)' }}>QUESTIONS?</span><br />
              <span style={{ color: 'var(--accent-orange)' }}>WE DO.</span>
            </h2>
            <p style={{ ...fade(0.26), fontSize: 15, color: 'rgba(255,255,255,0.4)', lineHeight: 1.8, marginBottom: 32 }}>
              Everything you need to know before joining. Can&apos;t find your answer?
            </p>
            <button
              className="btn-primary"
              style={{
                ...fade(0.32),
                padding: '14px 28px',
                fontSize: 11,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              Contact Us <ArrowRight size={14} />
            </button>
          </div>

          {/* Right: accordion */}
          <div style={fade(0.2)}>
            {faqs.map((faq, i) => (
              <FAQItem
                key={faq.q}
                faq={faq}
                isOpen={open === i}
                onToggle={() => setOpen(open === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function FAQItem({ faq, isOpen, onToggle }: {
  faq: { q: string; a: string }
  isOpen: boolean
  onToggle: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        overflow: 'hidden',
      }}
    >
      <button
        onClick={onToggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: '100%',
          background: hovered ? 'rgba(255,107,0,0.03)' : 'transparent',
          border: 'none',
          padding: '24px 0',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
          textAlign: 'left',
          transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <span style={{
          fontSize: 16,
          fontWeight: 600,
          color: isOpen ? '#fff' : (hovered ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.7)'),
          lineHeight: 1.4,
          transition: 'color 0.3s ease',
        }}>
          {faq.q}
        </span>
        <div style={{
          width: 32, height: 32, flexShrink: 0,
          borderRadius: '50%',
          background: isOpen ? 'var(--accent-orange)' : (hovered ? 'rgba(255,107,0,0.15)' : 'rgba(255,255,255,0.04)'),
          border: `1px solid ${isOpen ? 'var(--accent-orange)' : (hovered ? 'rgba(255,107,0,0.3)' : 'rgba(255,255,255,0.1)')}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
          transform: hovered ? 'scale(1.1)' : 'scale(1)',
        }}>
          {isOpen
            ? <Minus size={14} color="#fff" />
            : <Plus size={14} color={hovered ? 'var(--accent-orange)' : 'rgba(255,255,255,0.5)'} />}
        </div>
      </button>
      <div style={{
        maxHeight: isOpen ? '200px' : '0px',
        overflow: 'hidden',
        transition: 'max-height 0.4s cubic-bezier(0.16,1,0.3,1)',
      }}>
        <p style={{
          fontSize: 15,
          color: 'rgba(255,255,255,0.45)',
          lineHeight: 1.8,
          paddingBottom: 24,
          margin: 0,
          paddingLeft: 4,
          borderLeft: '2px solid rgba(255,107,0,0.3)',
          marginLeft: 2,
        }}>
          {faq.a}
        </p>
      </div>
    </div>
  )
}
