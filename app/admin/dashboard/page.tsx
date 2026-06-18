'use client'

import { useEffect, useState } from 'react'

export default function DashboardOverview() {
  const [customers, setCustomers] = useState<any[]>([])
  const [trainers, setTrainers] = useState<any[]>([])
  const [plans, setPlans] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/admin/customers').then(r => r.json()).then(d => setCustomers(d.customers || []))
    fetch('/api/admin/trainers').then(r => r.json()).then(d => setTrainers(d.trainers || []))
    fetch('/api/admin/plans').then(r => r.json()).then(d => setPlans(d.plans || []))
  }, [])

  const active = customers.filter(c => c.status === 'active').length
  const revenue = customers.reduce((sum: number, c: any) => sum + (c.totalPaid || 0), 0)

  const stats = [
    { label: 'Total Members', value: customers.length, icon: '◉', color: '#FF6B00' },
    { label: 'Active Members', value: active, icon: '◎', color: '#22c55e' },
    { label: 'Total Revenue', value: '₨' + revenue.toLocaleString(), icon: '◈', color: '#3b82f6' },
    { label: 'Trainers', value: trainers.length, icon: '◧', color: '#a855f7' },
  ]

  const recentCustomers = customers.slice(0, 5)

  return (
    <div>
      <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 36, color: '#fff', letterSpacing: '0.05em', marginBottom: 8 }}>
        Dashboard
      </h1>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 32 }}>
        Welcome back, Admin. Here's what's happening at Fitnest today.
      </p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 40 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: 24, borderRadius: 8, transition: 'all 0.2s ease' }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,107,0,0.25)'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,107,0,0.04)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>{s.label}</span>
              <span style={{ fontSize: 20, color: s.color }}>{s.icon}</span>
            </div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 40, color: '#fff', lineHeight: 1 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Recent customers */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Recent Members</span>
          <a href="/admin/dashboard/customers" style={{ fontSize: 11, color: 'var(--accent-orange)', textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            View All →
          </a>
        </div>
        {recentCustomers.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: 14 }}>
            No customers yet. Add your first member!
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {['Name', 'Plan', 'Start Date', 'Status', 'Paid'].map(h => (
                  <th key={h} style={{ padding: '12px 24px', textAlign: 'left', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentCustomers.map((c: any) => (
                <tr key={c._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '14px 24px', fontSize: 13, color: '#fff' }}>{c.name}</td>
                  <td style={{ padding: '14px 24px', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{c.plan}</td>
                  <td style={{ padding: '14px 24px', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{new Date(c.startDate).toLocaleDateString()}</td>
                  <td style={{ padding: '14px 24px' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: 2, background: c.status === 'active' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)', color: c.status === 'active' ? '#22c55e' : '#ef4444', border: `1px solid ${c.status === 'active' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
                      {c.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 24px', fontSize: 13, color: 'var(--accent-orange)', fontWeight: 600 }}>₨{(c.totalPaid || 0).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}