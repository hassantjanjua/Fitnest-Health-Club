'use client'

import { useEffect, useState } from 'react'

const emptyForm = { name: '', email: '', phone: '', plan: 'Monthly', startDate: '', endDate: '', status: 'active', totalPaid: 0, notes: '' }

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState(emptyForm)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/customers')
    const data = await res.json()
    setCustomers(data.customers || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openAdd() { setEditing(null); setForm(emptyForm); setShowModal(true) }
  function openEdit(c: any) {
    setEditing(c)
    setForm({ name: c.name, email: c.email, phone: c.phone, plan: c.plan, startDate: c.startDate?.slice(0, 10), endDate: c.endDate?.slice(0, 10), status: c.status, totalPaid: c.totalPaid, notes: c.notes || '' })
    setShowModal(true)
  }

  async function handleSave() {
    if (editing) {
      await fetch('/api/admin/customers', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editing._id, ...form }) })
    } else {
      await fetch('/api/admin/customers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    }
    setShowModal(false)
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this customer?')) return
    await fetch('/api/admin/customers', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    load()
  }

  const filtered = customers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || c.status === filter
    return matchSearch && matchFilter
  })

  const inp: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '11px 14px', fontSize: 13, borderRadius: 4, outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 36, color: '#fff', letterSpacing: '0.05em', margin: 0 }}>Customers</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{customers.length} total members</p>
        </div>
        <button onClick={openAdd} style={{ background: 'var(--accent-orange)', border: 'none', color: '#fff', padding: '12px 24px', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer', clipPath: 'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))' }}>
          + Add Member
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <input
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ ...inp, width: 280 }}
        />
        {['all', 'active', 'expired', 'cancelled'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ background: filter === f ? 'rgba(255,107,0,0.12)' : 'rgba(255,255,255,0.03)', border: `1px solid ${filter === f ? 'rgba(255,107,0,0.3)' : 'rgba(255,255,255,0.08)'}`, color: filter === f ? 'var(--accent-orange)' : 'rgba(255,255,255,0.4)', padding: '10px 18px', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 4 }}>
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: 14 }}>No customers found</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                  {['Name', 'Contact', 'Plan', 'Dates', 'Paid', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '13px 20px', textAlign: 'left', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c: any) => (
                  <tr key={c._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontSize: 14, color: '#fff', fontWeight: 500 }}>{c.name}</div>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{c.email}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{c.phone}</div>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-orange)', background: 'rgba(255,107,0,0.1)', padding: '3px 10px', borderRadius: 2, border: '1px solid rgba(255,107,0,0.2)' }}>{c.plan}</span>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Start: {new Date(c.startDate).toLocaleDateString()}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>End: {new Date(c.endDate).toLocaleDateString()}</div>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: 14, color: 'var(--accent-orange)', fontWeight: 600 }}>
                      ₨{(c.totalPaid || 0).toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: 2, background: c.status === 'active' ? 'rgba(34,197,94,0.12)' : c.status === 'expired' ? 'rgba(234,179,8,0.12)' : 'rgba(239,68,68,0.12)', color: c.status === 'active' ? '#22c55e' : c.status === 'expired' ? '#eab308' : '#ef4444', border: `1px solid ${c.status === 'active' ? 'rgba(34,197,94,0.2)' : c.status === 'expired' ? 'rgba(234,179,8,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
                        {c.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => openEdit(c)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', padding: '6px 12px', fontSize: 11, cursor: 'pointer', borderRadius: 3, transition: 'all 0.15s' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}>
                          Edit
                        </button>
                        <button onClick={() => handleDelete(c._id)} style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: 'rgba(239,68,68,0.7)', padding: '6px 12px', fontSize: 11, cursor: 'pointer', borderRadius: 3, transition: 'all 0.15s' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#ef4444' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = 'rgba(239,68,68,0.7)' }}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={e => { if (e.target === e.currentTarget) setShowModal(false) }}>
          <div style={{ background: '#111', border: '1px solid rgba(255,107,0,0.2)', width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', borderRadius: 8 }}>
            <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, color: '#fff', letterSpacing: '0.05em' }}>{editing ? 'Edit Member' : 'Add New Member'}</span>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Ahmed Khan' },
                { key: 'email', label: 'Email', type: 'email', placeholder: 'ahmed@example.com' },
                { key: 'phone', label: 'Phone', type: 'tel', placeholder: '+92 300 0000000' },
                { key: 'totalPaid', label: 'Total Paid (₨)', type: 'number', placeholder: '3500' },
                { key: 'startDate', label: 'Start Date', type: 'date', placeholder: '' },
                { key: 'endDate', label: 'End Date', type: 'date', placeholder: '' },
              ].map(field => (
                <div key={field.key}>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>{field.label}</label>
                  <input type={field.type} placeholder={field.placeholder} value={(form as any)[field.key]} onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))} style={inp} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>Plan</label>
                <select value={form.plan} onChange={e => setForm(f => ({ ...f, plan: e.target.value }))} style={{ ...inp }}>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Annual">Annual</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} style={{ ...inp }}>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>Notes</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3} style={{ ...inp, resize: 'none' }} placeholder="Any notes about this member..." />
              </div>
              <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
                <button onClick={handleSave} style={{ flex: 1, background: 'var(--accent-orange)', border: 'none', color: '#fff', padding: '14px', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer', clipPath: 'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))' }}>
                  {editing ? 'Save Changes' : 'Add Member'}
                </button>
                <button onClick={() => setShowModal(false)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', padding: '14px 24px', fontSize: 11, cursor: 'pointer', borderRadius: 4 }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}