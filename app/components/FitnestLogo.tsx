type FitnestLogoProps = {
  size?: 'sm' | 'md' | 'lg'
  showSubtitle?: boolean
  subtitle?: string
  compact?: boolean
}

const logoSizes = {
  sm: { mark: 42, word: 86, subtitle: 9 },
  md: { mark: 58, word: 124, subtitle: 11 },
  lg: { mark: 74, word: 168, subtitle: 13 },
}

export default function FitnestLogo({
  size = 'md',
  showSubtitle = true,
  subtitle = 'Health Club',
  compact = false,
}: FitnestLogoProps) {
  const scale = logoSizes[size]

  return (
    <span
      className="fitnest-logo"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: compact ? 8 : 10,
        color: '#fff',
        lineHeight: 1,
        maxWidth: '100%',
      }}
    >
      <svg
        width={scale.mark}
        height={scale.mark}
        viewBox="0 0 96 82"
        aria-hidden="true"
        style={{ flex: '0 0 auto', display: 'block' }}
      >
        <g fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 38h68" strokeWidth="10" />
          <path d="M7 28v20M17 21v34M27 17v42M69 17v42M79 21v34M89 28v20" strokeWidth="6" />
          <path d="M36 28c2-9 12-13 21-8 7 4 9 11 5 18l-7 13c-2 4-8 5-11 1l-12-15c-2-3 0-7 4-9Z" fill="#050505" strokeWidth="4" />
          <path d="M40 29v20M47 25v28M54 27v23" strokeWidth="3" />
        </g>
      </svg>

      {!compact && (
        <span style={{ display: 'inline-flex', flexDirection: 'column', minWidth: 0 }}>
          <span
            style={{
              fontFamily: 'Bebas Neue, Impact, sans-serif',
              fontSize: scale.word / 2.65,
              letterSpacing: 0,
              color: '#fff',
              whiteSpace: 'nowrap',
            }}
          >
            FIT<span style={{ color: 'var(--accent-orange)' }}>NEST</span>
          </span>
          {showSubtitle && (
            <span
              style={{
                fontSize: scale.subtitle,
                letterSpacing: '0.24em',
                color: 'rgba(255,255,255,0.62)',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                marginTop: 2,
              }}
            >
              {subtitle}
            </span>
          )}
        </span>
      )}
    </span>
  )
}
