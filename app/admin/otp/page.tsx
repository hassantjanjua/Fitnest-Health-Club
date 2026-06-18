'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminOTP() {
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [timer, setTimer] = useState(600)
  const refs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()

  useEffect(() => {
    const t = setInterval(() => setTimer(v => v > 0 ? v - 1 : 0), 1000)
    return () => clearInterval(t)
  }, [])

  const minutes = Math.floor(timer / 60).toString().padStart(2, '0')
  const seconds = (timer % 60).toString().padStart(2, '0')

  function handleDigit(i: number, val: string) {
    if (!/^\d*$/.test(val)) return
    const next = [...digits]
    next[i] = val.slice(-1)
    setDigits(next)
    if (val && i < 5) refs.current[i + 1]?.focus()
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      refs.current[i - 1]?.focus()
    }
  }

  async function handleVerify() {
    const otp = digits.join('')
    if (otp.length !== 6) { setError('Enter all 6 digits'); return }
    setLoading(true)
    setError('')
    try {
      const email = localStorage.getItem('admin_email') || ''
      const res = await fetch('/api/admin/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      router.push('/admin/dashboard')
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', padding: 20 }}>
      <div style={{ position: 'fixed', top: '20%', left: '30%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,0,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>

        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, background: 'var(--accent-orange)', clipPath: 'polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px))', marginBottom: 16 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 32, letterSpacing: '0.1em', color: '#fff' }}>
            FIT<span style={{ color: 'var(--accent-orange)' }}>NEST</span>
          </div>
          <div style={{ fontSize: 10, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginTop: 4 }}>
            Admin Portal
          </div>
        </div>

        <div style={{ border: '1px solid rgba(255,107,0,0.2)', background: 'rgba(255,255,255,0.02)', padding: '40px 36px', clipPath: 'polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,16px 100%,0 calc(100% - 16px))' }}>
          <div style={{ height: 2, background: 'linear-gradient(90deg, var(--accent-orange), #ff9500)', margin: '-40px -36px 36px' }} />

          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,107,0,0.1)', border: '1px solid rgba(255,107,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-orange)" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, color: '#fff', letterSpacing: '0.05em', margin: '0 0 8px' }}>
              Verify OTP
            </h1>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', margin: 0 }}>
              Enter the 6-digit code sent to your email
            </p>
          </div>

          {/* Timer */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <span style={{ fontSize: 11, letterSpacing: '0.2em', color: timer < 60 ? '#ef4444' : 'rgba(255,107,0,0.7)', fontWeight: 700 }}>
              {minutes}:{seconds}
            </span>
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '12px 16px', fontSize: 13, borderRadius: 2, marginBottom: 20, textAlign: 'center' }}>
              {error}
            </div>
          )}

          {/* OTP inputs */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 28 }}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={el => { refs.current[i] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={e => handleDigit(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                style={{
                  width: 52, height: 60, textAlign: 'center',
                  background: d ? 'rgba(255,107,0,0.08)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${d ? 'rgba(255,107,0,0.5)' : 'rgba(255,255,255,0.1)'}`,
                  color: '#fff', fontSize: 24, fontWeight: 700,
                  outline: 'none', borderRadius: 4,
                  transition: 'all 0.2s ease',
                }}
                onFocus={e => { e.target.style.borderColor = 'var(--accent-orange)'; e.target.style.background = 'rgba(255,107,0,0.08)' }}
                onBlur={e => { if (!d) { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.04)' }}}
              />
            ))}
          </div>

          <button
            onClick={handleVerify}
            disabled={loading || digits.join('').length !== 6}
            style={{ width: '100%', background: digits.join('').length === 6 && !loading ? 'var(--accent-orange)' : 'rgba(255,107,0,0.3)', border: 'none', color: '#fff', padding: '15px', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', cursor: digits.join('').length === 6 ? 'pointer' : 'not-allowed', clipPath: 'polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px))', transition: 'all 0.2s ease' }}
          >
            {loading ? 'Verifying...' : 'Access Dashboard →'}
          </button>

          <button
            onClick={() => router.push('/admin/login')}
            style={{ width: '100%', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: 12, marginTop: 16, cursor: 'pointer', padding: '8px', transition: 'color 0.2s ease' }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  )
}