'use client'

function ZapSVG() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}

function InstagramSVG() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="rgba(255,255,255,0.5)" stroke="none" />
    </svg>
  )
}

function FacebookSVG() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function YoutubeSVG() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="rgba(255,255,255,0.5)" stroke="none" />
    </svg>
  )
}

function MapSVG() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,107,0,0.6)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function PhoneSVG() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,107,0,0.6)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.79a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function MailSVG() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,107,0,0.6)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
}

const footerLinks: Record<string, string[]> = {
  'Quick Links': ['About Us', 'Services', 'Membership Plans', 'Our Trainers', 'Gallery', 'Blog'],
  'Programs': ['Weight Training', 'Cardio', 'Personal Training', 'CrossFit & HIIT', 'Yoga', 'Nutrition'],
  'Support': ['FAQ', 'Contact Us', 'Terms of Service', 'Privacy Policy', 'Cancellation Policy'],
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer style={{ background: '#050505', borderTop: '1px solid rgba(255,107,0,0.1)', position: 'relative', overflow: 'hidden' }}>

      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, var(--accent-orange), transparent)', opacity: 0.5 }} />

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '80px 48px 40px' }} className="ft-wrap">

        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: 60, marginBottom: 64 }} className="ft-grid">

          {/* LEFT SECTION */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 46, height: 46, background: 'var(--accent-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ZapSVG />
              </div>
              <div>
                <div style={{ fontFamily: 'Bebas Neue', fontSize: 26, color: '#fff' }}>
                  FIT<span style={{ color: 'var(--accent-orange)' }}>NEST</span>
                </div>
                <div style={{ fontSize: 9, letterSpacing: '0.28em', color: 'rgba(255,255,255,0.3)' }}>
                  Health Club · Lahore
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              {[InstagramSVG, FacebookSVG, YoutubeSVG].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  style={{
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(255,255,255,0.07)',
                    background: 'rgba(255,255,255,0.02)',
                    textDecoration: 'none'
                  }}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* LINKS */}
          {Object.entries(footerLinks).map(([category, items]) => (
            <div key={category}>
              <div style={{ color: 'var(--accent-orange)', marginBottom: 20 }}>
                {category}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {items.map((item) => (
                  <a
                    key={item}
                    href="#"
                    style={{ color: 'rgba(255,255,255,0.32)', textDecoration: 'none' }}
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          ))}

        </div>

        {/* BOTTOM */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 20 }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
            © {year} Fitnest Health Club
          </span>
        </div>

      </div>
    </footer>
  )
}