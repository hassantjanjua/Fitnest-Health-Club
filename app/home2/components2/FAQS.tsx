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

function FAQItem({ faq, index, isOpen, onToggle }: { faq: typeof faqs[0]; index: number; isOpen: boolean; onToggle: () => void }) {
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

  useEffect(() => { if (contentRef.current) setContentHeight(contentRef.current.scrollHeight) }, [isOpen])

  return (
    <div ref={ref} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.5s ease ${index * 0.05}s, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${index * 0.05}s`,
        background: isOpen ? '#fff' : hovered ? '#fff' : 'transparent',
        border: `1px solid ${isOpen ? 'rgba(255,107,0,0.2)' : hovered ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.05)'}`,
        overflow: 'hidden',
        clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
      }}
    >
      {isOpen && <div style={{ height: 2, background: 'var(--accent-orange)' }} />}
      <button onClick={onToggle} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 9, fontWeight: 800, color: isOpen ? 'var(--accent-orange)' : 'rgba(0,0,0,0.2)', minWidth: 20, fontFamily: 'Bebas Neue', letterSpacing: '0.05em', transition: 'color 0.3s ease' }}>{String(index + 1).padStart(2, '0')}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: isOpen ? 'var(--accent-orange)' : '#111', transition: 'color 0.3s ease' }}>{faq.question}</span>
        </div>
        <div style={{ width: 26, height: 26, flexShrink: 0, background: isOpen ? 'rgba(255,107,0,0.1)' : 'rgba(0,0,0,0.04)', border: `1px solid ${isOpen ? 'rgba(255,107,0,0.2)' : 'rgba(0,0,0,0.06)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease', clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))' }}>
          <ChevronDown size={12} color={isOpen ? 'var(--accent-orange)' : 'rgba(0,0,0,0.3)'} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s ease' }} />
        </div>
      </button>
      <div ref={contentRef} style={{ maxHeight: isOpen ? contentHeight : 0, overflow: 'hidden', transition: 'max-height 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
        <div style={{ padding: '0 20px 16px 54px' }}>
          <p style={{ fontSize: 13, lineHeight: 1.8, color: 'rgba(0,0,0,0.45)' }}>{faq.answer}</p>
        </div>
      </div>
    </div>
  )
}

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
    <section id="faq" style={{ padding: '100px 0', background: '#fafafa', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '50%', right: 0, width: '50vw', height: '50vw', maxWidth: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,0,0.04) 0%, transparent 65%)', pointerEvents: 'none', transform: 'translate(30%, -50%)' }} />

      <div ref={ref} style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 60, alignItems: 'start' }} className="faq-layout">
          {/* Left */}
          <div style={{ position: 'sticky', top: 100, opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(-30px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 36, height: 2, background: 'var(--accent-orange)' }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--accent-orange)' }}>FAQ</span>
            </div>
            <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(40px, 5vw, 64px)', lineHeight: 0.95, letterSpacing: '0.02em', marginBottom: 16 }}>
              <span style={{ color: '#111' }}>GOT</span><br />
              <span style={{ color: 'var(--accent-orange)' }}>QUESTIONS?</span><br />
              <span style={{ color: 'rgba(0,0,0,0.12)' }}>WE DO.</span>
            </h2>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: 'rgba(0,0,0,0.4)', marginBottom: 28 }}>Everything you need to know before joining.</p>

            {/* Contact CTA */}
            <div style={{ background: '#111', padding: '24px 20px', clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}>
              <MessageCircle size={20} color="var(--accent-orange)" style={{ marginBottom: 12 }} />
              <h4 style={{ fontFamily: 'Bebas Neue', fontSize: 18, color: '#fff', marginBottom: 6 }}>Still Have Questions?</h4>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 14, lineHeight: 1.5 }}>Our team is here to help.</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <CTAButton href="#contact" small>Message Us <ArrowRight size={10} /></CTAButton>
                <CTAButton href="tel:+923001234567" small outline><Phone size={10} /> Call</CTAButton>
              </div>
            </div>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {faqs.map((faq, i) => <FAQItem key={i} faq={faq} index={i} isOpen={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? null : i)} />)}
          </div>
        </div>
      </div>
    </section>
  )
}

function CTAButton({ href, small = false, outline = false, children }: { href: string; small?: boolean; outline?: boolean; children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a href={href} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, padding: small ? '10px 16px' : '14px 32px',
        fontSize: small ? 9 : 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none',
        background: outline ? (hovered ? 'var(--accent-orange)' : 'transparent') : (hovered ? '#e55f00' : 'var(--accent-orange)'),
        border: outline ? `1px solid ${hovered ? 'var(--accent-orange)' : 'rgba(255,255,255,0.2)'}` : 'none',
        color: '#fff',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hovered && !outline ? '0 10px 30px rgba(255,107,0,0.3)' : 'none',
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
      }}
    >{children}</a>
  )
}
