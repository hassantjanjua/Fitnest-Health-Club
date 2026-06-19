'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import FitnestLogo from '@/app/components/FitnestLogo'

const navItems = [
  { label: 'Overview',      href: '/admin/dashboard',           icon: '□' },
  { label: 'Messages',      href: '/admin/dashboard/messages',  icon: '✉' },
  { label: 'Customers',     href: '/admin/dashboard/customers', icon: '◎' },
  { label: 'Pricing Plans', href: '/admin/dashboard/pricing',   icon: '◆' },
  { label: 'Trainers',      href: '/admin/dashboard/trainers',  icon: '●' },
  { label: 'Gallery',       href: '/admin/dashboard/gallery',   icon: '▧' },
  { label: 'User Access',   href: '/admin/dashboard/settings',  icon: '○' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  const handleLogout = useCallback(async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }, [router])

  // Fetch unread message count for sidebar badge
  useEffect(() => {
    async function loadUnread() {
      try {
        const res = await fetch('/api/admin/messages')
        const data = await res.json()
        const count = (data.messages || []).filter((m: any) => m.status === 'new').length
        setUnreadCount(count)
      } catch {
        setUnreadCount(0)
      }
    }
    loadUnread()
    // Refresh every 60 seconds
    const interval = setInterval(loadUnread, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let logoutTimer: ReturnType<typeof setTimeout> | undefined

    async function syncSessionExpiry() {
      try {
        const res = await fetch('/api/admin/session')
        if (!res.ok) {
          router.push('/admin/login')
          return
        }
        const data = await res.json()
        const expiresAt = Number(data.session?.expiresAt || 0)
        const delay = expiresAt - Date.now()
        if (delay <= 0) {
          await handleLogout()
          return
        }
        logoutTimer = setTimeout(handleLogout, delay)
      } catch {
        router.push('/admin/login')
      }
    }

    syncSessionExpiry()
    return () => { if (logoutTimer) clearTimeout(logoutTimer) }
  }, [handleLogout, router])

  return (
    <div
      className="dashboard-shell"
      style={{ display: 'flex', minHeight: '100vh', background: '#080808', fontFamily: 'Inter, sans-serif' }}
    >

      {/* Sidebar */}
      <div
        className="dashboard-sidebar"
        style={{
          width: sidebarOpen ? 240 : 64, flexShrink: 0,
          background: '#0c0c0c', borderRight: '1px solid rgba(255,107,0,0.1)',
          display: 'flex', flexDirection: 'column',
          transition: 'width 0.3s cubic-bezier(0.16,1,0.3,1)',
          overflow: 'hidden', position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 100,
        }}
      >
        {/* Logo */}
        <div style={{
          padding: '20px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <FitnestLogo size="sm" compact={!sidebarOpen} />
          {sidebarOpen && (
            <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              Admin Panel
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map(item => {
            const active = pathname === item.href
            const isMessages = item.href === '/admin/dashboard/messages'
            const showBadge = isMessages && unreadCount > 0

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
                  position: 'relative',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'
                    ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)'
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background = 'transparent'
                    ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)'
                  }
                }}
              >
                {/* Icon */}
                <span style={{ fontSize: 16, flexShrink: 0, position: 'relative' }}>
                  {item.icon}
                  {/* Unread dot when sidebar is collapsed */}
                  {showBadge && !sidebarOpen && (
                    <span style={{
                      position: 'absolute', top: -2, right: -4,
                      width: 7, height: 7, borderRadius: '50%',
                      background: 'var(--accent-orange)',
                      boxShadow: '0 0 5px rgba(255,107,0,0.7)',
                    }} />
                  )}
                </span>

                {/* Label + badge when sidebar is open */}
                {sidebarOpen && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                    {item.label}
                    {showBadge && (
                      <span style={{
                        background: 'var(--accent-orange)', color: '#fff',
                        fontSize: 10, fontWeight: 700,
                        minWidth: 18, height: 18, borderRadius: 9,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '0 4px',
                      }}>
                        {unreadCount}
                      </span>
                    )}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom buttons */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button
            onClick={() => setSidebarOpen(v => !v)}
            style={{
              width: '100%', background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.4)', padding: '9px',
              borderRadius: 4, cursor: 'pointer', fontSize: 12,
              marginBottom: 8, transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
              e.currentTarget.style.color = '#fff'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
              e.currentTarget.style.color = 'rgba(255,255,255,0.4)'
            }}
          >
            {sidebarOpen ? '< Collapse' : '>'}
          </button>
          <button
            onClick={handleLogout}
            style={{
              width: '100%', background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              color: 'rgba(239,68,68,0.7)', padding: '9px',
              borderRadius: 4, cursor: 'pointer', fontSize: 12,
              transition: 'all 0.2s ease', whiteSpace: 'nowrap', overflow: 'hidden',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.15)'
              e.currentTarget.style.color = '#ef4444'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.08)'
              e.currentTarget.style.color = 'rgba(239,68,68,0.7)'
            }}
          >
            {sidebarOpen ? 'Logout' : 'X'}
          </button>
        </div>
      </div>

      {/* Main area */}
      <div
        className="dashboard-main"
        style={{
          flex: 1,
          marginLeft: sidebarOpen ? 240 : 64,
          transition: 'margin-left 0.3s cubic-bezier(0.16,1,0.3,1)',
          minHeight: '100vh',
        }}
      >
        {/* Top bar */}
        <div
          className="dashboard-topbar"
          style={{
            height: 64, borderBottom: '1px solid rgba(255,255,255,0.05)',
            background: 'rgba(12,12,12,0.8)', backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 32px', position: 'sticky', top: 0, zIndex: 50,
          }}
        >
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
            {navItems.find(n => n.href === pathname)?.label || 'Dashboard'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Unread messages indicator in top bar */}
            {unreadCount > 0 && (
              <Link
                href="/admin/dashboard/messages"
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  textDecoration: 'none',
                  background: 'rgba(255,107,0,0.08)',
                  border: '1px solid rgba(255,107,0,0.2)',
                  padding: '5px 12px', borderRadius: 4,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,107,0,0.14)'}
                onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,107,0,0.08)'}
              >
                <span style={{ fontSize: 12 }}>✉</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-orange)' }}>
                  {unreadCount} new
                </span>
              </Link>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: '#22c55e', boxShadow: '0 0 8px rgba(34,197,94,0.6)',
              }} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Admin Online</span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="dashboard-content" style={{ padding: '32px' }}>
          {children}
        </div>
      </div>
    </div>
  )
}