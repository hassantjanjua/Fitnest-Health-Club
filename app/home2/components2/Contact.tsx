'use client'
import { useEffect, useRef, useState } from 'react'
import { Send, MapPin, Phone, Mail, Clock, Check } from 'lucide-react'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true)
    }, { threshold: 0.1 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '14px 18px',
    background: '#fafafa', border: '1px solid rgba(0,0,0,0.08)',
    color: '#111', fontSize: 13, fontFamily: 'Inter, sans-serif',
    transition: 'all 0.3s ease', outline: 'none',
    clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
  }

  const focusHandler = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = 'rgba(255,107,0,0.4)'
    e.currentTarget.style.background = '#fff'
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255,107,0,0.06)'
  }

  const blurHandler = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)'
    e.currentTarget.style.background = '#fafafa'
    e.currentTarget.style.boxShadow = 'none'
  }

  return (
    <section id="contact" style={{
      padding: '120px 0', background: '#fff',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', bottom: 0, left: 0,
        width: '60vw', height: '60vw', maxWidth: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,107,0,0.04) 0%, transparent 65%)',
        pointerEvents: 'none', transform: 'translate(-30%, 30%)',
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
            }}>Contact Us</span>
            <div style={{ width: 44, height: 2, background: 'var(--accent-orange)' }} />
          </div>
          <h2 style={{
            fontFamily: 'Bebas Neue', fontSize: 'clamp(48px, 8vw, 96px)',
            lineHeight: 0.95, letterSpacing: '0.02em', color: '#111',
          }}>
            LET'S <span style={{ color: 'var(--accent-orange)' }}>CONNECT</span>
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(0,0,0,0.4)', marginTop: 16, maxWidth: 500, margin: '16px auto 0' }}>
            Ready to transform? Get in touch and we'll help you start your fitness journey.
          </p>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: '380px 1fr', gap: 24,
        }} className="contact-grid">
          {/* Left - Info */}
          <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateX(0)' : 'translateX(-30px)',
            transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s',
          }}>
            <div style={{
              background: '#111', padding: '36px 32px',
              position: 'relative', overflow: 'hidden',
              clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--accent-orange)' }} />

              <h3 style={{
                fontFamily: 'Bebas Neue', fontSize: 28, color: '#fff',
                letterSpacing: '0.02em', marginBottom: 28,
              }}>GET IN TOUCH</h3>

              {[
                { icon: MapPin, label: 'Location', value: 'Model Town, Lahore, Pakistan' },
                { icon: Phone, label: 'Phone', value: '+92 300 123 4567' },
                { icon: Mail, label: 'Email', value: 'info@fitnest.pk' },
                { icon: Clock, label: 'Hours', value: '6:00 AM – 11:00 PM', sub: 'Open 7 days a week' },
              ].map(({ icon: Icon, label, value, sub }) => (
                <div key={label} style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                  <div style={{
                    width: 42, height: 42, flexShrink: 0,
                    background: 'rgba(255,107,0,0.1)', border: '1px solid rgba(255,107,0,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
                  }}>
                    <Icon size={16} color="var(--accent-orange)" />
                  </div>
                  <div>
                    <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>
                      {label}
                    </p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{value}</p>
                    {sub && <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{sub}</p>}
                  </div>
                </div>
              ))}

              {/* Socials */}
              <div style={{
                borderTop: '1px solid rgba(255,255,255,0.08)',
                paddingTop: 24, marginTop: 8,
              }}>
                <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>
                  Follow Us
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['IG', 'FB', 'WA'].map(label => (
                    <SocialButton key={label} label={label} />
                  ))}
                </div>
              </div>
            </div>

            {/* Map */}
            <div style={{
              marginTop: 16, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.06)',
              clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
            }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27211.11936!2d74.3157!3d31.4849!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39190483e58107d9%3A0xc23abe6ccc7e2462!2sModel%20Town%2C%20Lahore%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1"
                width="100%" height="200"
                style={{ border: 0, display: 'block' }}
                allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Fitnest Location"
              />
            </div>
          </div>

          {/* Right - Form */}
          <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateX(0)' : 'translateX(30px)',
            transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s',
          }}>
            <div style={{
              background: '#fff', border: '1px solid rgba(0,0,0,0.06)',
              padding: '40px 36px', position: 'relative', overflow: 'hidden',
              clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'rgba(255,107,0,0.2)' }} />

              <h3 style={{
                fontFamily: 'Bebas Neue', fontSize: 28, color: '#111',
                letterSpacing: '0.02em', marginBottom: 6,
              }}>SEND US A MESSAGE</h3>
              <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.4)', marginBottom: 32 }}>
                Fill out the form and we'll get back to you within 24 hours.
              </p>

              {submitted ? (
                <div style={{
                  textAlign: 'center', padding: '60px 0',
                  animation: 'scaleIn 0.4s cubic-bezier(0.16,1,0.3,1)',
                }}>
                  <div style={{
                    width: 64, height: 64, margin: '0 auto 20px',
                    background: 'rgba(34,197,94,0.08)', border: '2px solid rgba(34,197,94,0.2)',
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Check size={28} color="#22c55e" />
                  </div>
                  <h4 style={{ fontFamily: 'Bebas Neue', fontSize: 28, color: '#111', marginBottom: 8 }}>
                    Message Sent!
                  </h4>
                  <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.4)' }}>We'll get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                    <div>
                      <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', display: 'block', marginBottom: 8 }}>
                        First Name
                      </label>
                      <input type="text" required placeholder="John" style={inputStyle} onFocus={focusHandler} onBlur={blurHandler} />
                    </div>
                    <div>
                      <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', display: 'block', marginBottom: 8 }}>
                        Last Name
                      </label>
                      <input type="text" required placeholder="Doe" style={inputStyle} onFocus={focusHandler} onBlur={blurHandler} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                    <div>
                      <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', display: 'block', marginBottom: 8 }}>
                        Email
                      </label>
                      <input type="email" required placeholder="john@example.com" style={inputStyle} onFocus={focusHandler} onBlur={blurHandler} />
                    </div>
                    <div>
                      <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', display: 'block', marginBottom: 8 }}>
                        Phone
                      </label>
                      <input type="tel" placeholder="+92 300 XXX XXXX" style={inputStyle} onFocus={focusHandler} onBlur={blurHandler} />
                    </div>
                  </div>

                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', display: 'block', marginBottom: 8 }}>
                      Interested In
                    </label>
                    <select style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }} onFocus={focusHandler as any} onBlur={blurHandler as any}>
                      <option value="">Select a program</option>
                      <option>Weight Training</option>
                      <option>Cardio Training</option>
                      <option>Personal Training</option>
                      <option>Group Classes</option>
                      <option>Nutrition Coaching</option>
                      <option>CrossFit &amp; HIIT</option>
                      <option>General Inquiry</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: 24 }}>
                    <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', display: 'block', marginBottom: 8 }}>
                      Message
                    </label>
                    <textarea
                      rows={4} required
                      placeholder="Tell us about your fitness goals..."
                      style={{ ...inputStyle, resize: 'none' }}
                      onFocus={focusHandler as any}
                      onBlur={blurHandler as any}
                    />
                  </div>

                  <button type="submit" className="btn-primary" style={{
                    width: '100%', padding: '16px', fontSize: 11, gap: 8,
                    clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
                  }}>
                    Send Message <Send size={13} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function SocialButton({ label }: { label: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href="#"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 40, height: 40,
        background: hovered ? 'var(--accent-orange)' : 'rgba(255,255,255,0.05)',
        border: `1px solid ${hovered ? 'var(--accent-orange)' : 'rgba(255,255,255,0.08)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        textDecoration: 'none',
        fontSize: 11, fontWeight: 800, color: '#fff',
        transition: 'all 0.3s ease',
        clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
      }}
    >
      {label}
    </a>
  )
}
