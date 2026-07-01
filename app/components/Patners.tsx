'use client'

export default function Partners() {
  const partners = [
    { name: 'Nike', abbr: 'NK' },
    { name: 'Adidas', abbr: 'AD' },
    { name: 'Under Armour', abbr: 'UA' },
    { name: 'MyProtein', abbr: 'MP' },
    { name: 'Reebok', abbr: 'RB' },
    { name: 'Optimum Nutrition', abbr: 'ON' },
    { name: 'Puma', abbr: 'PM' },
    { name: 'GNC', abbr: 'GN' },
  ]

  return (
    <div style={{
      padding: '48px 0',
      borderTop: '1px solid rgba(255,255,255,0.04)',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
      background: 'rgba(255,255,255,0.01)',
      overflow: 'hidden', position: 'relative',
    }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)' }}>
          Partners & Sponsors
        </span>
      </div>

      <div style={{ overflow: 'hidden' }}>
        <div style={{
          display: 'flex', gap: 0,
          animation: 'partnerScroll 18s linear infinite',
          width: 'max-content',
        }}>
          {[...partners, ...partners, ...partners].map((p, i) => (
            <div key={i} style={{
              padding: '0 48px',
              display: 'flex', alignItems: 'center', gap: 16,
              opacity: 0.3, transition: 'opacity 0.3s ease', cursor: 'default',
            }}
              onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.opacity = '0.8')}
              onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.opacity = '0.3')}
            >
              <div style={{
                width: 48, height: 48, background: 'rgba(255,107,0,0.1)',
                border: '1px solid rgba(255,107,0,0.2)', borderRadius: 4,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Bebas Neue', fontSize: 14, color: 'var(--accent-orange)', letterSpacing: '0.1em',
              }}>
                {p.abbr}
              </div>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                {p.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes partnerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
    </div>
  )
}