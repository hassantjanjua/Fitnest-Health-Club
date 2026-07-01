'use client'
import { useEffect, useState } from 'react'

type Customer = {
  _id?: string
  name?: string
  email?: string
  phone?: string
  status?: string
  totalPaid?: number
  joinDate?: string
}

type Message = {
  _id: string
  name: string
  email: string
  phone?: string
  message?: string
  status?: string
  createdAt?: string
}

export default function DashboardOverview() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)
  const [membersCollapsed, setMembersCollapsed] = useState(false)
  const [messagesCollapsed, setMessagesCollapsed] = useState(false)

  // Fetch from database
  useEffect(() => {
    Promise.all([
      fetch('/api/admin/customers').then(r => r.json()).then(d => setCustomers(d.customers || [])),
      fetch('/api/admin/messages').then(r => r.json()).then(d => setMessages(d.messages || [])),
    ]).finally(() => setLoading(false))
  }, [])

  async function handleLogout() {
    if (loggingOut) return
    setLoggingOut(true)
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
    } catch {
      // continue even if the call fails
    }
    window.location.href = '/admin'
  }

  const activeCount = customers.filter(c => c.status === 'active').length
  const revenue = customers.reduce((sum, c) => sum + (c.totalPaid || 0), 0)
  const notRepliedCount = messages.filter(m => m.status !== 'replied').length
  const recentMessages = messages.slice(0, 4)
  const recentCustomers = customers.slice(0, 5)

  const stats = [
    { label: 'Total Members', value: customers.length, icon: '◉', color: '#FF6B00' },
    { label: 'Active Members', value: activeCount, icon: '◎', color: '#22c55e' },
    { label: 'Total Revenue', value: '₨' + revenue.toLocaleString(), icon: '◈', color: '#3b82f6' },
    { label: 'Not Replied', value: notRepliedCount, icon: '✉', color: '#a855f7' },
  ]

  return (
    <div style={{ padding: 'clamp(24px, 4vw, 48px)', maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <div style={{ width: 36, height: 2, background: 'var(--accent-orange)' }} />
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.28em',
            textTransform: 'uppercase', color: 'var(--accent-orange)',
          }}>
            Admin Panel
          </span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <div>
            <h1 style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(32px, 5vw, 48px)',
              color: '#fff',
              letterSpacing: '0.05em',
              margin: 0, lineHeight: 1,
            }}>
              Dashboard
            </h1>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 8 }}>
              Welcome back, Admin. Here&apos;s what&apos;s happening at Fitnest today.
            </p>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            onMouseEnter={(e) => {
              if (!loggingOut) {
                e.currentTarget.style.background = 'rgba(239,68,68,0.15)'
                e.currentTarget.style.borderColor = 'rgba(239,68,68,0.5)'
                e.currentTarget.style.color = '#ef4444'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.08)'
              e.currentTarget.style.borderColor = 'rgba(239,68,68,0.25)'
              e.currentTarget.style.color = 'rgba(239,68,68,0.8)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
            style={{
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.25)',
              color: 'rgba(239,68,68,0.8)',
              padding: '12px 22px',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              cursor: loggingOut ? 'not-allowed' : 'pointer',
              clipPath: 'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))',
              transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
              flexShrink: 0,
              opacity: loggingOut ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span style={{ fontSize: 14, lineHeight: 1 }}>⏻</span>
            {loggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16,
        marginBottom: 36,
      }} className="dashboard-stats-grid">
        {stats.map(s => (
          <StatCard key={s.label} stat={s} notRepliedCount={notRepliedCount} loading={loading} />
        ))}
      </div>

      {/* Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }} className="dashboard-content-grid">

        {/* Recent Members */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          overflow: 'hidden',
          clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
        }}>
          <div style={{ height: 2, background: 'linear-gradient(90deg, var(--accent-orange), #ff9500)' }} />
          <div style={{
            padding: '18px 24px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>
                Recent Members
              </span>
              {recentCustomers.length > 0 && (
                <div style={{
                  background: 'var(--accent-orange)',
                  color: '#fff',
                  minWidth: 22, height: 22,
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10, fontWeight: 700,
                  padding: '0 6px',
                  clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
                }}>
                  {customers.length}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <a
                href="/admin/dashboard/customers"
                style={{
                  fontSize: 10, fontWeight: 700,
                  color: 'var(--accent-orange)',
                  textDecoration: 'none',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  transition: 'opacity 0.3s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.7' }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
              >
                View All →
              </a>
              <CollapseButton collapsed={membersCollapsed} onClick={() => setMembersCollapsed(p => !p)} />
            </div>
          </div>

          <div style={{
            maxHeight: membersCollapsed ? 0 : 600,
            overflow: 'hidden',
            transition: 'max-height 0.4s cubic-bezier(0.16,1,0.3,1)',
          }}>
            {loading ? (
              <div style={{ padding: 48, textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>
                Loading members...
              </div>
            ) : recentCustomers.length === 0 ? (
              <div style={{ padding: 48, textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: 14 }}>
                <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.3 }}>◉</div>
                No members yet
              </div>
            ) : (
              <>
                {/* Table header */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr 80px',
                  padding: '10px 24px',
                  background: 'rgba(255,255,255,0.02)',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                }}>
                  {['Name', 'Email', 'Status'].map(h => (
                    <span key={h} style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: '0.15em',
                      textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)',
                    }}>{h}</span>
                  ))}
                </div>
                {recentCustomers.map((c, i) => (
                  <CustomerRow key={c._id || c.email} customer={c} index={i} />
                ))}
              </>
            )}
          </div>
        </div>

        {/* Recent Messages */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          overflow: 'hidden',
          clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
        }}>
          <div style={{ height: 2, background: 'linear-gradient(90deg, #a855f7, #7c3aed)' }} />
          <div style={{
            padding: '18px 24px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>
                Recent Messages
              </span>
              {notRepliedCount > 0 && (
                <div style={{
                  background: 'var(--accent-orange)',
                  color: '#fff',
                  minWidth: 22, height: 22,
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10, fontWeight: 700,
                  padding: '0 6px',
                  clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
                }}>
                  {notRepliedCount}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <a
                href="/admin/dashboard/messages"
                style={{
                  fontSize: 10, fontWeight: 700,
                  color: 'var(--accent-orange)',
                  textDecoration: 'none',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  transition: 'opacity 0.3s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.7' }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
              >
                View All →
              </a>
              <CollapseButton collapsed={messagesCollapsed} onClick={() => setMessagesCollapsed(p => !p)} />
            </div>
          </div>

          <div style={{
            maxHeight: messagesCollapsed ? 0 : 600,
            overflow: 'hidden',
            transition: 'max-height 0.4s cubic-bezier(0.16,1,0.3,1)',
          }}>
            <div>
              {loading ? (
                <div style={{ padding: 48, textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>
                  Loading messages...
                </div>
              ) : recentMessages.length === 0 ? (
                <div style={{ padding: 48, textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: 14 }}>
                  <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.3 }}>✉</div>
                  No messages yet
                </div>
              ) : (
                recentMessages.map((msg, i) => (
                  <MessageRow key={msg._id} msg={msg} index={i} />
                ))
              )}
            </div>

            <a
              href="/admin/dashboard/messages"
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(168,85,247,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(168,85,247,0.03)' }}
              style={{
                display: 'block',
                padding: '14px',
                textAlign: 'center',
                fontSize: 11, fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#a855f7',
                textDecoration: 'none',
                borderTop: '1px solid rgba(255,255,255,0.04)',
                background: 'rgba(168,85,247,0.03)',
                transition: 'background 0.3s ease',
              }}
            >
              View All Messages →
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes glow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @media (max-width: 1024px) {
          .dashboard-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .dashboard-content-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .dashboard-stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

function StatCard({ stat, notRepliedCount, loading }: {
  stat: { label: string; value: string | number; icon: string; color: string }
  notRepliedCount: number
  loading: boolean
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(255,107,0,0.04)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${hovered ? 'rgba(255,107,0,0.2)' : 'rgba(255,255,255,0.06)'}`,
        padding: 24,
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        cursor: 'default',
        clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: stat.color,
        transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin: 'left',
        transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
      }} />

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
      }}>
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '0.15em',
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)',
        }}>
          {stat.label}
        </span>
        <div style={{
          width: 36, height: 36,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `${stat.color}15`,
          border: `1px solid ${stat.color}30`,
          fontSize: 18, color: stat.color,
          transition: 'all 0.3s ease',
          transform: hovered ? 'scale(1.1) rotate(-3deg)' : 'scale(1)',
          clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
        }}>
          {stat.icon}
        </div>
      </div>

      <div style={{
        fontFamily: 'Bebas Neue, sans-serif',
        fontSize: 'clamp(32px, 4vw, 44px)',
        color: '#fff',
        lineHeight: 1,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        {loading ? (
          <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.3)' }}>Loading...</span>
        ) : (
          <>
            {stat.value}
            {stat.label === 'Not Replied' && notRepliedCount > 0 && (
              <span style={{
                width: 10, height: 10, borderRadius: '50%',
                background: '#a855f7',
                display: 'inline-block',
                boxShadow: '0 0 8px rgba(168,85,247,0.6)',
                animation: 'glow 2s ease infinite',
              }} />
            )}
          </>
        )}
      </div>
    </div>
  )
}

function CustomerRow({ customer, index }: { customer: Customer; index: number }) {
  const [hovered, setHovered] = useState(false)
  const isActive = customer.status === 'active'

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 80px',
        padding: '14px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        background: hovered ? 'rgba(255,107,0,0.03)' : 'transparent',
        transition: 'all 0.2s ease',
        cursor: 'default',
        animation: `fadeIn 0.4s ease ${index * 0.05}s both`,
        position: 'relative',
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, bottom: 0, width: 2,
        background: 'var(--accent-orange)',
        transform: hovered ? 'scaleY(1)' : 'scaleY(0)',
        transformOrigin: 'top',
        transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
      }} />
      <div style={{ color: '#fff', fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {customer.name || '—'}
      </div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {customer.email || '—'}
      </div>
      <div>
        <span style={{
          fontSize: 9, fontWeight: 700, letterSpacing: '0.1em',
          textTransform: 'uppercase',
          padding: '3px 10px',
          background: isActive ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.05)',
          color: isActive ? '#22c55e' : 'rgba(255,255,255,0.4)',
          border: `1px solid ${isActive ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.08)'}`,
          clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
        }}>
          {customer.status || 'pending'}
        </span>
      </div>
    </div>
  )
}

function MessageRow({ msg, index }: { msg: Message; index: number }) {
  const [hovered, setHovered] = useState(false)
  const isReplied = msg.status === 'replied'

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '14px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        background: hovered ? 'rgba(168,85,247,0.03)' : 'transparent',
        transition: 'all 0.2s ease',
        cursor: 'default',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        animation: `fadeIn 0.4s ease ${index * 0.05}s both`,
        position: 'relative',
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, bottom: 0, width: 2,
        background: isReplied ? '#22c55e' : '#a855f7',
        transform: hovered ? 'scaleY(1)' : 'scaleY(0)',
        transformOrigin: 'top',
        transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
      }} />
      <div>
        <div style={{ color: '#fff', fontSize: 13, fontWeight: 500, marginBottom: 3 }}>
          {msg.name}
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
          {msg.email}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {isReplied ? (
          <span style={{
            fontSize: 9, fontWeight: 700, padding: '3px 8px',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            background: 'rgba(34,197,94,0.12)', color: '#22c55e',
            border: '1px solid rgba(34,197,94,0.25)',
            clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
          }}>
            Replied
          </span>
        ) : (
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: 'var(--accent-orange)',
            boxShadow: '0 0 8px rgba(255,107,0,0.5)',
            flexShrink: 0,
            animation: 'glow 2s ease infinite',
          }} />
        )}
      </div>
    </div>
  )
}

function CollapseButton({ collapsed, onClick }: { collapsed: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={collapsed ? 'Expand' : 'Collapse'}
      style={{
        width: 28,
        height: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: hovered ? 'rgba(255,107,0,0.12)' : 'rgba(255,255,255,0.05)',
        border: `1px solid ${hovered ? 'rgba(255,107,0,0.3)' : 'rgba(255,255,255,0.1)'}`,
        color: hovered ? 'var(--accent-orange)' : 'rgba(255,255,255,0.5)',
        fontSize: 12,
        cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
        clipPath: 'polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))',
        flexShrink: 0,
        padding: 0,
        lineHeight: 1,
      }}
    >
      <span style={{
        display: 'inline-block',
        transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1)',
        transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
      }}>
        ▾
      </span>
    </button>
  )
}
