'use client'
import { useEffect, useRef, useState } from 'react'
import { ChevronDown, MessageCircle, ArrowRight, Phone } from 'lucide-react'

const faqs = [
  { question: 'What are the gym operating hours?', answer: 'Fitnest is open 6AM to 11PM, seven days a week including public holidays.' },
  { question: 'Is there a joining fee?', answer: 'We currently have no joining fee. You only pay your chosen membership plan.' },
  { question: 'Can I try before I commit?', answer: 'Yes! We offer a completely free trial session for all new members. Just walk in or book online.' },
  { question: 'Do you offer personal training?', answer: 'Absolutely. All plans include at least one trainer consultation, and dedicated personal training is available as an add-on or within our Quarterly and Annual plans.' },
  { question: 'What equipment do you have?', answer: 'Our 10,000 sq ft facility includes full free weight areas, cable machines, cardio equipment, a dedicated CrossFit zone, a yoga studio, and a boxing corner.' },
  { question: 'Can I cancel my membership?', answer: 'Monthly plans can be cancelled anytime. Quarterly and Annual plans can be paused for medical reasons with documentation.' },
  { question: 'Is there a female-only section?', answer: 'Yes, we have dedicated female-only training zones and separate changing facilities for full privacy and comfort.' },
  { question: 'Is parking available?', answer: 'Yes, free parking is available for all members directly outside the facility.' },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
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
    <section id="faq" style={{
      padding: 'clamp(60px, 10vw, 120px) 0',
      background: '#080808',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glows */}
      <div style={{
        position: 'absolute', top: '50%', right: 0,
        width: '50vw', height: '50vw', maxWidth: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,107,0,0.05) 0%, transparent 65%)',
        pointerEvents: 'none', transform: 'translate(30%, -50%)',
      }} />
      <div style={{
        position: 'absolute', bottom: '-10%', left: '-10%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,107,0,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Diagonal lines */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute', top: '-50%',
            right: `${i * 140 - 80}px`,
            width: '1px', height: '200%',
            background: 'rgba(255,107,0,0.035)',
            transform: 'rotate(-20deg)',
          }} />
        ))}
      </div>

      <div ref={ref} style={{ maxWidth: 1400, margin: '0 auto', padding: '0 48px', position: 'relative', zIndex: 1 }} className="hero-container">
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 60, alignItems: 'start' }} className="hero-bottom-grid">

          {/* Left — Sticky sidebar */}
          <div style={{
            position: 'sticky', top: 100,
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateX(0)' : 'translateX(-30px)',
            transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 36, height: 2, background: 'var(--accent-orange)' }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--accent-orange)' }}>
                FAQ
              </span>
            </div>
            <h2 style={{
              fontFamily: 'Bebas Neue',
              fontSize: 'clamp(40px, 5vw, 64px)',
              lineHeight: 0.95,
              letterSpacing: '0.02em',
              marginBottom: 16,
            }}>
              <span style={{ color: '#fff' }}>GOT</span><br />
              <span style={{ color: 'var(--accent-orange)' }}>QUESTIONS?</span><br />
              <span style={{ color: 'rgba(255,255,255,0.1)' }}>WE DO.</span>
            </h2>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: 'rgba(255,255,255,0.4)', marginBottom: 28 }}>
              Everything you need to know before joining.
            </p>

            {/* Contact CTA card */}
            <div style={{
              background: 'rgba(255,107,0,0.04)',
              border: '1px solid rgba(255,107,0,0.15)',
              padding: '24px 20px',
              clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                background: 'linear-gradient(90deg, var(--accent-orange), #ff9500)',
              }} />
              <MessageCircle size={20} color="var(--accent-orange)" style={{ marginBottom: 12 }} />
              <h4 style={{ fontFamily: 'Bebas Neue', fontSize: 18, color: '#fff', marginBottom: 6, letterSpacing: '0.03em' }}>
                Still Have Questions?
              </h4>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 14, lineHeight: 1.5 }}>
                Our team is here to help.
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <SidebarCTA href="#contact" primary>
                  Message Us <ArrowRight size={10} />
                </SidebarCTA>
                <SidebarCTA href="tel:+923001234567">
                  <Phone size={10} /> Call
                </SidebarCTA>
              </div>
            </div>
          </div>

          {/* Right — FAQ items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {faqs.map((faq, i) => (
              <FAQItem
                key={i}
                faq={faq}
                index={i}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function FAQItem({ faq, index, isOpen, onToggle }: {
  faq: typeof faqs[0]; index: number; isOpen: boolean; onToggle: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true)
    }, { threshold: 0.1 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (contentRef.current) setContentHeight(contentRef.current.scrollHeight)
  }, [isOpen])

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.5s ease ${index * 0.05}s, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${index * 0.05}s`,
        background: isOpen
          ? 'rgba(255,107,0,0.05)'
          : hovered ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.01)',
        border: `1px solid ${isOpen ? 'rgba(255,107,0,0.25)' : hovered ? 'rgba(255,107,0,0.12)' : 'rgba(255,255,255,0.06)'}`,
        overflow: 'hidden',
        clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',

      }}
    >
      {/* Top accent line when open */}
      {isOpen && (
        <div style={{ height: 2, background: 'linear-gradient(90deg, var(--accent-orange), #ff9500)' }} />
      )}

      <button
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 22px',
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          gap: 14,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{
            fontSize: 11, fontWeight: 800,
            color: isOpen ? 'var(--accent-orange)' : 'rgba(255,255,255,0.2)',
            minWidth: 22,
            fontFamily: 'Bebas Neue',
            letterSpacing: '0.05em',
            transition: 'color 0.3s ease',
          }}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <span style={{
            fontSize: 14, fontWeight: 700,
            color: isOpen ? 'var(--accent-orange)' : hovered ? '#fff' : 'rgba(255,255,255,0.75)',
            transition: 'color 0.3s ease',
          }}>
            {faq.question}
          </span>
        </div>
        <div style={{
          width: 28, height: 28, flexShrink: 0,
          background: isOpen ? 'rgba(255,107,0,0.15)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${isOpen ? 'rgba(255,107,0,0.3)' : 'rgba(255,255,255,0.08)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.3s ease',
          clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
        }}>
          <ChevronDown
            size={13}
            color={isOpen ? 'var(--accent-orange)' : 'rgba(255,255,255,0.4)'}
            style={{
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform 0.3s ease',
            }}
          />
        </div>
      </button>

      <div
        ref={contentRef}
        style={{
          maxHeight: isOpen ? contentHeight : 0,
          overflow: 'hidden',
          transition: 'max-height 0.4s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <div style={{ padding: '0 22px 18px 58px' }}>
          <p style={{
            fontSize: 14, lineHeight: 1.8,
            color: 'rgba(255,255,255,0.5)',
            margin: 0,
          }}>
            {faq.answer}
          </p>
        </div>
      </div>
    </div>
  )
}

function SidebarCTA({ href, primary = false, children }: {
  href: string; primary?: boolean; children: React.ReactNode
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '10px 16px',
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        textDecoration: 'none',
        background: primary
          ? (hovered ? 'var(--accent-orange-hover)' : 'var(--accent-orange)')
          : (hovered ? 'rgba(255,107,0,0.15)' : 'transparent'),
        border: primary
          ? 'none'
          : `1px solid ${hovered ? 'rgba(255,107,0,0.4)' : 'rgba(255,255,255,0.15)'}`,
        color: '#fff',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hovered && primary ? '0 8px 24px rgba(255,107,0,0.3)' : 'none',
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
      }}
    >
      {children}
    </a>
  )
}
