'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleLogin() {
    if (!email || !password) { setError('Fill in all fields'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      localStorage.setItem('admin_email', email)
      router.push('/admin/otp')
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const inp: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)', color: '#fff',
    padding: '14px 18px', fontSize: 14, outline: 'none',
    fontFamily: 'Inter, sans-serif', borderRadius: 2,
    boxSizing: 'border-box', transition: 'all 0.2s ease',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', padding: 20 }}>

      {/* Background glow */}
      <div style={{ position: 'fixed', top: '20%', left: '30%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,0,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>

        {/* Logo */}
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

        {/* Card */}
        <div style={{ border: '1px solid rgba(255,107,0,0.2)', background: 'rgba(255,255,255,0.02)', padding: '40px 36px', clipPath: 'polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,16px 100%,0 calc(100% - 16px))' }}>
          <div style={{ height: 2, background: 'linear-gradient(90deg, var(--accent-orange), #ff9500)', margin: '-40px -36px 36px' }} />

          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, color: '#fff', letterSpacing: '0.05em', margin: '0 0 6px' }}>
            Admin Login
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 32 }}>
            Enter your credentials to receive an OTP
          </p>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '12px 16px', fontSize: 13, borderRadius: 2, marginBottom: 20 }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="admin@fitnestlahore.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={inp}
              onFocus={e => { e.target.style.borderColor = 'rgba(255,107,0,0.5)'; e.target.style.background = 'rgba(255,107,0,0.04)' }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.04)' }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={inp}
              onFocus={e => { e.target.style.borderColor = 'rgba(255,107,0,0.5)'; e.target.style.background = 'rgba(255,107,0,0.04)' }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.04)' }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{ width: '100%', background: loading ? 'rgba(255,107,0,0.6)' : 'var(--accent-orange)', border: 'none', color: '#fff', padding: '15px', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', clipPath: 'polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px))', transition: 'all 0.2s ease' }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#ff7a00' }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = 'var(--accent-orange)' }}
          >
            {loading ? 'Sending OTP...' : 'Send OTP →'}
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.2)', marginTop: 24 }}>
          This portal is restricted to authorized administrators only.
        </p>
      </div>
    </div>
  )
}