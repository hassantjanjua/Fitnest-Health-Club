'use client'
import { useEffect, useRef, useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send, ArrowRight } from 'lucide-react'

const contactItems = [
  { Icon: MapPin, label: 'Location', value: 'Model Town, Lahore, Punjab, Pakistan' },
  { Icon: Phone, label: 'Phone', value: '+92 300 1234567' },
  { Icon: Mail, label: 'Email', value: 'info@fitnestlahore.com' },
  { Icon: Clock, label: 'Hours', value: 'Mon–Sun: 6:00 AM – 11:00 PM' },
]

export default function Contact() {
  const [visible, setVisible] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true)
    }, { threshold: 0.05 })

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const fade = (delay: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(40px)',
    transition: `opacity 0.9s ease ${delay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill your name, email, and message.')
      return
    }

    setSending(true)
    setError('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, message }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Unable to send message right now.')
      }

      setSent(true)
      setName('')
      setPhone('')
      setEmail('')
      setMessage('')
      setTimeout(() => setSent(false), 4000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send message right now.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="contact" ref={ref} style={{
      padding: 'clamp(60px, 10vw, 120px) 0',
      background: 'linear-gradient(180deg, #080808 0%, #050505 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background accent */}
      <div style={{
        position: 'absolute', bottom: '-20%', right: '-10%',
        width: 700, height: 700, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,107,0,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 48px' }} className="contact-container">

        {/* Header */}
        <div style={{ marginBottom: 'clamp(40px, 5vw, 64px)' }}>
          <div style={{ ...fade(0.1), display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 40, height: 2, background: 'var(--accent-orange)' }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--accent-orange)' }}>
              Get In Touch
            </span>
          </div>
          <h2 style={{
            ...fade(0.18),
            fontFamily: 'Bebas Neue', fontSize: 'clamp(48px, 7vw, 100px)',
            lineHeight: 0.9, color: '#fff', margin: 0,
          }}>
            START YOUR<br />
            <span style={{ color: 'transparent', WebkitTextStroke: '2px rgba(255,255,255,0.15)' }}>FITNESS</span>{' '}
            <span style={{ color: 'var(--accent-orange)' }}>JOURNEY.</span>
          </h2>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 80 }} className="contact-grid">

          {/* Left: Contact Info */}
          <div>
            <p style={{ ...fade(0.22), fontSize: 16, color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, marginBottom: 40 }}>
              Ready to transform? Visit us, call us, or drop a message. Our team typically responds within 2 hours during operating hours.
            </p>

            {contactItems.map((item, i) => (
              <ContactItem key={item.label} item={item} fadeStyle={fade(0.25 + i * 0.07)} />
            ))}

            {/* Map Link */}
            <div style={{ ...fade(0.5), marginTop: 40, textAlign: 'center' }}>
              <div style={{
                width: 56, height: 56, margin: '0 auto 16px',
                background: 'rgba(255,107,0,0.1)',
                border: '1px solid rgba(255,107,0,0.2)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <MapPin size={24} color="var(--accent-orange)" />
              </div>
              <div style={{ fontSize: 12, marginBottom: 8, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                Model Town, Lahore
              </div>
              <a
                href="https://maps.google.com/?q=Model+Town+Lahore"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--accent-orange)',
                  textDecoration: 'none',
                  borderBottom: '1px solid rgba(255,107,0,0.3)',
                  paddingBottom: 2,
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--accent-orange)'
                  e.currentTarget.style.gap = '10px'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,107,0,0.3)'
                  e.currentTarget.style.gap = '6px'
                }}
              >
                Open in Google Maps <ArrowRight size={12} />
              </a>
            </div>
          </div>

          {/* Right: Form */}
          <div style={fade(0.3)}>
            <form onSubmit={handleSubmit} style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              padding: 'clamp(24px, 3vw, 40px)',
              clipPath: 'polygon(0 0,calc(100% - 20px) 0,100% 20px,100% 100%,20px 100%,0 calc(100% - 20px))',
            }}>
              <div style={{ fontFamily: 'Bebas Neue', fontSize: 11, letterSpacing: '0.28em', color: 'var(--accent-orange)', marginBottom: 24, textTransform: 'uppercase' }}>
                Send Us a Message
              </div>

              <FormInput placeholder="Full Name *" value={name} onChange={setName} />
              <FormInput placeholder="Phone Number" value={phone} onChange={setPhone} style={{ marginTop: 12 }} />
              <FormInput placeholder="Email Address *" value={email} onChange={setEmail} type="email" style={{ marginTop: 12 }} />
              <FormTextarea placeholder="Your Message *" value={message} onChange={setMessage} style={{ marginTop: 12 }} />

              {error && (
                <div style={{
                  marginTop: 14,
                  padding: '10px 12px',
                  border: '1px solid rgba(239,68,68,0.28)',
                  background: 'rgba(239,68,68,0.08)',
                  color: '#fca5a5',
                  fontSize: 12,
                  lineHeight: 1.5,
                }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={sending || sent}
                className="btn-primary"
                style={{
                  width: '100%',
                  marginTop: 20,
                  padding: '16px',
                  fontSize: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  background: sent ? '#22c55e' : undefined,
                  opacity: sending ? 0.7 : 1,
                  cursor: 'pointer',
                }}
              >
                {sent ? (
                  <>✓ Message Sent!</>
                ) : sending ? (
                  <>Sending...</>
                ) : (
                  <><Send size={14} /> Send Message</>
                )}
              </button>

              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 16, textAlign: 'center' }}>
                We&apos;ll get back to you within 2 hours during operating hours
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

function ContactItem({ item, fadeStyle }: {
  item: typeof contactItems[0]
  fadeStyle: React.CSSProperties
}) {
  const [hovered, setHovered] = useState(false)
  const Icon = item.Icon

  return (
    <div
      style={{
        ...fadeStyle,
        display: 'flex',
        gap: 18,
        marginBottom: 20,
        padding: '16px',
        background: hovered ? 'rgba(255,107,0,0.04)' : 'transparent',
        border: `1px solid ${hovered ? 'rgba(255,107,0,0.15)' : 'transparent'}`,
        borderRadius: 4,
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        cursor: 'default',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        width: 44, height: 44,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(255,107,0,0.1)',
        border: '1px solid rgba(255,107,0,0.2)',
        clipPath: 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))',
        transition: 'all 0.35s ease',
        transform: hovered ? 'scale(1.1)' : 'scale(1)',
      }}>
        <Icon size={18} color="var(--accent-orange)" />
      </div>
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,107,0,0.7)', marginBottom: 4 }}>
          {item.label}
        </div>
        <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15 }}>
          {item.value}
        </div>
      </div>
    </div>
  )
}

function FormInput({ placeholder, value, onChange, type = 'text', style = {} }: {
  placeholder: string
  value: string
  onChange: (val: string) => void
  type?: string
  style?: React.CSSProperties
}) {
  const [focused, setFocused] = useState(false)

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: '100%',
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${focused ? 'rgba(255,107,0,0.4)' : 'rgba(255,255,255,0.08)'}`,
        color: '#fff',
        padding: '14px 18px',
        fontSize: 14,
        borderRadius: 2,
        outline: 'none',
        transition: 'all 0.3s ease',
        ...style,
      }}
    />
  )
}

function FormTextarea({ placeholder, value, onChange, style = {} }: {
  placeholder: string
  value: string
  onChange: (val: string) => void
  style?: React.CSSProperties
}) {
  const [focused, setFocused] = useState(false)

  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      rows={4}
      style={{
        width: '100%',
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${focused ? 'rgba(255,107,0,0.4)' : 'rgba(255,255,255,0.08)'}`,
        color: '#fff',
        padding: '14px 18px',
        fontSize: 14,
        borderRadius: 2,
        outline: 'none',
        resize: 'none',
        transition: 'all 0.3s ease',
        fontFamily: 'inherit',
        ...style,
      }}
    />
  )
}
