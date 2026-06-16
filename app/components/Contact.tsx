'use client'

import { useEffect, useRef, useState } from 'react'

function MapPinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-orange)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-orange)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.79a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-orange)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-orange)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}

const contactItems = [
  { Icon: MapPinIcon, label: 'Location', value: 'Model Town, Lahore, Punjab, Pakistan' },
  { Icon: PhoneIcon, label: 'Phone', value: '+92 300 1234567' },
  { Icon: MailIcon, label: 'Email', value: 'info@fitnestlahore.com' },
  { Icon: ClockIcon, label: 'Hours', value: 'Mon–Sun: 6:00 AM – 11:00 PM' },
]

export default function Contact() {
  const [visible, setVisible] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true)
    }, { threshold: 0.05 })

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  function fade(delay: number): React.CSSProperties {
    return {
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(40px)',
      transition: `opacity 0.9s ease ${delay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
    }
  }

  async function handleSubmit() {
    if (!name || !email) return
    setSending(true)

    await new Promise((r) => setTimeout(r, 1500))

    setSending(false)
    setSent(true)

    setName('')
    setPhone('')
    setEmail('')
    setMessage('')

    setTimeout(() => setSent(false), 4000)
  }

  const base: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#fff',
    padding: '14px 18px',
    fontSize: 14,
    borderRadius: 2,
    outline: 'none',
  }

  return (
    <section id="contact" ref={ref} style={{ padding: '120px 0', background: '#050505' }}>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 48px' }} className="cnt-wrap">

        {/* LEFT SIDE */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 80 }} className="cnt-grid">

          <div>

            {contactItems.map((item, i) => (
              <div key={item.label} style={{ ...fade(0.2 + i * 0.07), display: 'flex', gap: 18, marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <item.Icon />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'rgba(255,107,0,0.7)' }}>{item.label}</div>
                  <div style={{ color: 'rgba(255,255,255,0.65)' }}>{item.value}</div>
                </div>
              </div>
            ))}

            {/* FIXED MAP LINK BLOCK */}
            <div style={{ marginTop: 30, textAlign: 'center' }}>
              <MapPinIcon />
              <div style={{ fontSize: 12, marginTop: 8, color: 'rgba(255,255,255,0.3)' }}>
                MODEL TOWN, LAHORE
              </div>

              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  marginTop: 10,
                  fontSize: 11,
                  color: 'var(--accent-orange)',
                  textDecoration: 'none',
                  borderBottom: '1px solid rgba(255,107,0,0.3)',
                  paddingBottom: 2,
                }}
              >
                Open in Google Maps
              </a>
            </div>

          </div>

          {/* FORM */}
          <div style={fade(0.25)}>

            <div>

              <input
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={base}
              />

              <input
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ ...base, marginTop: 12 }}
              />

              <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ ...base, marginTop: 12 }}
              />

              <textarea
                placeholder="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                style={{ ...base, marginTop: 12, resize: 'none' }}
              />

              <button
                onClick={handleSubmit}
                disabled={sending || sent}
                style={{
                  width: '100%',
                  marginTop: 16,
                  padding: 14,
                  background: sent ? '#22c55e' : 'var(--accent-orange)',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {sent ? 'Message Sent' : sending ? 'Sending...' : (
                  <span style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                    <SendIcon /> Send Message
                  </span>
                )}
              </button>

            </div>

          </div>

        </div>

      </div>
    </section>
  )
}