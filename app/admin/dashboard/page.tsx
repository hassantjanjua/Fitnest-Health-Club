'use client'

import { useEffect, useState } from 'react'

type Customer = {
  status?: string
  totalPaid?: number
}

type Message = {
  _id: string
  name: string
  email: string
  status?: string
}

export default function DashboardOverview() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    fetch('/api/admin/customers')
      .then(r => r.json())
      .then(d => setCustomers(d.customers || []))

    fetch('/api/admin/messages')
      .then(r => r.json())
      .then(d => setMessages(d.messages || []))
  }, [])

  const activeCount = customers.filter(c => c.status === 'active').length
  const revenue = customers.reduce((sum, c) => sum + (c.totalPaid || 0), 0)
  const notRepliedCount = messages.filter(m => m.status !== 'replied').length
  const recentMessages = messages.slice(0, 4)

  const stats = [
    { label: 'Total Members', value: customers.length, icon: '◉', color: '#FF6B00' },
    { label: 'Active Members', value: activeCount, icon: '◎', color: '#22c55e' },
    { label: 'Total Revenue', value: '₨' + revenue.toLocaleString(), icon: '◈', color: '#3b82f6' },
    { label: 'Not Replied', value: notRepliedCount, icon: '✉', color: '#a855f7' },
  ]

  return (
    <div>
      <h1 style={{
        fontFamily: 'Bebas Neue, sans-serif',
        fontSize: 36,
        color: '#fff',
        letterSpacing: '0.05em',
        marginBottom: 8,
      }}>
        Dashboard
      </h1>

      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 32 }}>
        Welcome back, Admin. Here is what is happening at Fitnest today.
      </p>

      {/* STATS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4,1fr)',
        gap: 16,
        marginBottom: 32,
      }}>
        {stats.map(s => (
          <div
            key={s.label}
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              padding: 24,
              borderRadius: 8,
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}>
              <span style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.35)',
              }}>
                {s.label}
              </span>
              <span style={{ fontSize: 20, color: s.color }}>{s.icon}</span>
            </div>

            <div style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 40,
              color: '#fff',
            }}>
              {s.value}
              {s.label === 'Not Replied' && notRepliedCount > 0 && (
                <span style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#a855f7',
                  display: 'inline-block',
                  marginLeft: 8,
                }} />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>

        {/* MEMBERS */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 8,
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '18px 24px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>
              Recent Members
            </span>

            {/* FIXED LINK */}
            <a
              href="/admin/dashboard/customers"
              style={{
                fontSize: 11,
                color: 'var(--accent-orange)',
                textDecoration: 'none',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              View All
            </a>
          </div>
        </div>

        {/* MESSAGES */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 8,
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '18px 24px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>
                Recent Messages
              </span>

              {notRepliedCount > 0 && (
                <div style={{
                  background: 'var(--accent-orange)',
                  color: '#fff',
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                }}>
                  {notRepliedCount}
                </div>
              )}
            </div>

            {/* FIXED LINK */}
            <a
              href="/admin/dashboard/messages"
              style={{
                fontSize: 11,
                color: 'var(--accent-orange)',
                textDecoration: 'none',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              View All
            </a>
          </div>

          <div>
            {recentMessages.length === 0 ? (
              <div style={{ padding: 30, color: 'rgba(255,255,255,0.3)' }}>
                No messages yet
              </div>
            ) : (
              recentMessages.map((msg) => (
                <div
                  key={msg._id}
                  style={{
                    padding: 14,
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                  }}
                >
                  <div style={{ color: '#fff', fontSize: 13 }}>
                    {msg.name}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                    {msg.email}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* FIXED FINAL LINK */}
          <a
            href="/admin/dashboard/messages"
            style={{
              display: 'block',
              padding: 12,
              textAlign: 'center',
              fontSize: 11,
              color: 'var(--accent-orange)',
              textDecoration: 'none',
              borderTop: '1px solid rgba(255,255,255,0.04)',
            }}
          >
            View All Messages
          </a>
        </div>
      </div>
    </div>
  )
}
