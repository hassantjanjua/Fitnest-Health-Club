'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const navItems = [
  { label: 'Overview', href: '/admin/dashboard', icon: '▦' },
  { label: 'Customers', href: '/admin/dashboard/customers', icon: '◉' },
  { label: 'Pricing Plans', href: '/admin/dashboard/pricing', icon: '◈' },
  { label: 'Trainers', href: '/admin/dashboard/trainers', icon: '◎' },
  { label: 'Gallery', href: '/admin/dashboard/gallery', icon: '◧' },
  { label: 'Settings', href: '/admin/dashboard/settings', icon: '◌' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#080808', fontFamily: 'Inter, sans-serif' }}>

      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? 240 : 64, flexShrink: 0,
        background: '#0c0c0c', borderRight: '1px solid rgba(255,107,0,0.1)',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.3s cubic-bezier(0.16,1,0.3,1)',
        overflow: 'hidden', position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, background: 'var(--accent-orange)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', clipPath: 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          {sidebarOpen && (
            <div>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 18, color: '#fff', letterSpacing: '0.08em', lineHeight: 1 }}>
                FIT<span style={{ color: 'var(--accent-orange)' }}>NEST</span>
              </div>
              <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Admin Panel</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map(item => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '11px 12px', borderRadius: 4, textDecoration: 'none',
                  background: active ? 'rgba(255,107,0,0.12)' : 'transparent',
                  border: `1px solid ${active ? 'rgba(255,107,0,0.25)' : 'transparent'}`,
                  color: active ? 'var(--accent-orange)' : 'rgba(255,255,255,0.45)',
                  fontSize: 13, fontWeight: active ? 600 : 400,
                  transition: 'all 0.2s ease', whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)' }}}
                onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)' }}}
              >
                <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                {sidebarOpen && item.label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button
            onClick={() => setSidebarOpen(v => !v)}
            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', padding: '9px', borderRadius: 4, cursor: 'pointer', fontSize: 12, marginBottom: 8, transition: 'all 0.2s ease' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}
          >
            {sidebarOpen ? '← Collapse' : '→'}
          </button>
          <button
            onClick={handleLogout}
            style={{ width: '100%', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: 'rgba(239,68,68,0.7)', padding: '9px', borderRadius: 4, cursor: 'pointer', fontSize: 12, transition: 'all 0.2s ease', whiteSpace: 'nowrap', overflow: 'hidden' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#ef4444' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = 'rgba(239,68,68,0.7)' }}
          >
            {sidebarOpen ? '⏻ Logout' : '⏻'}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, marginLeft: sidebarOpen ? 240 : 64, transition: 'margin-left 0.3s cubic-bezier(0.16,1,0.3,1)', minHeight: '100vh' }}>
        {/* Top bar */}
        <div style={{ height: 64, borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(12,12,12,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
            {navItems.find(n => n.href === pathname)?.label || 'Dashboard'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px rgba(34,197,94,0.6)' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Admin Online</span>
          </div>
        </div>

        {/* Page content */}
        <div style={{ padding: '32px' }}>
          {children}
        </div>
      </div>
    </div>
  )
}