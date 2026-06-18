'use client'

import { useEffect, useState } from 'react'

const emptyForm = { name: '', price: 0, period: 'month', tag: '', featured: false, features: [''], isActive: true }

export default function PricingPage() {
  const [plans, setPlans] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState<any>(emptyForm)

  async function load() {
    const res = await fetch('/api/admin/plans')
    const data = await res.json()
    setPlans(data.plans || [])
  }

  useEffect(() => { load() }, [])

  function openAdd() { setEditing(null); setForm(emptyForm); setShowModal(true) }
  function openEdit(p: any) {
    setEditing(p)
    setForm({ name: p.name, price: p.price, period: p.period, tag: p.tag, featured: p.featured, features: p.features, isActive: p.isActive })
    setShowModal(true)
  }

  async function handleSave() {
    if (editing) {
      await fetch('/api/admin/plans', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editing._id, ...form }) })
    } else {
      await fetch('/api/admin/plans', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    }
    setShowModal(false)
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this plan?')) return
    await fetch('/api/admin/plans', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    load()
  }

  function updateFeature(i: number, val: string) {
    const arr = [...form.features]
    arr[i] = val
    setForm((f: any) => ({ ...f, features: arr }))
  }

  function addFeature() { setForm((f: any) => ({ ...f, features: [...f.features, ''] })) }
  function removeFeature(i: number) { setForm((f: any) => ({ ...f, features: f.features.filter((_: any, idx: number) => idx !== i) })) }

  const inp: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '11px 14px', fontSize: 13, borderRadius: 4, outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 36, color: '#fff', letterSpacing: '0.05em', margin: 0 }}>Pricing Plans</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{plans.length} plans configured</p>
        </div>
        <button onClick={openAdd} style={{ background: 'var(--accent-orange)', border: 'none', color: '#fff', padding: '12px 24px', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer', clipPath: 'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))' }}>
          + Add Plan
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {plans.map(p => (
          <div key={p._id} style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${p.featured ? 'rgba(255,107,0,0.3)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 8, overflow: 'hidden' }}>
            {p.featured && <div style={{ height: 2, background: 'linear-gradient(90deg, var(--accent-orange), #ff9500)' }} />}
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 24, color: '#fff', letterSpacing: '0.05em' }}>{p.name}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{p.tag}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 32, color: p.featured ? 'var(--accent-orange)' : '#fff', lineHeight: 1 }}>₨{p.price.toLocaleString()}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>per {p.period}</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
                {p.features.slice(0, 4).map((f: string, i: number) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--accent-orange)', flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{f}</span>
                  </div>
                ))}
                {p.features.length > 4 && <span style={{ fontSize: 11, color: 'rgba(255,107,0,0.6)', marginLeft: 12 }}>+{p.features.length - 4} more</span>}
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button onClick={() => openEdit(p)} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', padding: '9px', fontSize: 11, cursor: 'pointer', borderRadius: 3 }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,107,0,0.1)'; e.currentTarget.style.color = 'var(--accent-orange)'; e.currentTarget.style.borderColor = 'rgba(255,107,0,0.3)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(p._id)} style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: 'rgba(239,68,68,0.7)', padding: '9px 14px', fontSize: 11, cursor: 'pointer', borderRadius: 3 }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}>
                  ✕
                </button>
                <span style={{ fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 2, background: p.isActive ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: p.isActive ? '#22c55e' : '#ef4444', border: `1px solid ${p.isActive ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {p.isActive ? 'Live' : 'Off'}
                </span>
              </div>
            </div>
          </div>
        ))}
        {plans.length === 0 && (
          <div style={{ gridColumn: '1/-1', padding: 48, textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: 14 }}>No plans yet. Create your first plan!</div>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={e => { if (e.target === e.currentTarget) setShowModal(false) }}>
          <div style={{ background: '#111', border: '1px solid rgba(255,107,0,0.2)', width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto', borderRadius: 8 }}>
            <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, color: '#fff', letterSpacing: '0.05em' }}>{editing ? 'Edit Plan' : 'Add Plan'}</span>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { key: 'name', label: 'Plan Name', placeholder: 'Monthly' },
                { key: 'tag', label: 'Tag Line', placeholder: 'Best Value' },
                { key: 'period', label: 'Period', placeholder: 'month' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>{f.label}</label>
                  <input type="text" placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm((prev: any) => ({ ...prev, [f.key]: e.target.value }))} style={inp} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>Price (₨)</label>
                <input type="number" value={form.price} onChange={e => setForm((f: any) => ({ ...f, price: Number(e.target.value) }))} style={inp} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>Features</label>
                  <button onClick={addFeature} style={{ background: 'rgba(255,107,0,0.1)', border: '1px solid rgba(255,107,0,0.2)', color: 'var(--accent-orange)', padding: '4px 12px', fontSize: 11, cursor: 'pointer', borderRadius: 3 }}>+ Add</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {form.features.map((f: string, i: number) => (
                    <div key={i} style={{ display: 'flex', gap: 8 }}>
                      <input type="text" value={f} onChange={e => updateFeature(i, e.target.value)} placeholder={`Feature ${i + 1}`} style={{ ...inp, flex: 1 }} />
                      <button onClick={() => removeFeature(i)} style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '0 12px', cursor: 'pointer', borderRadius: 4, flexShrink: 0 }}>✕</button>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 24 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.featured} onChange={e => setForm((f: any) => ({ ...f, featured: e.target.checked }))} style={{ accentColor: 'var(--accent-orange)', width: 16, height: 16 }} />
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Featured Plan</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm((f: any) => ({ ...f, isActive: e.target.checked }))} style={{ accentColor: 'var(--accent-orange)', width: 16, height: 16 }} />
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Active / Visible</span>
                </label>
              </div>
              <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
                <button onClick={handleSave} style={{ flex: 1, background: 'var(--accent-orange)', border: 'none', color: '#fff', padding: '14px', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer', clipPath: 'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))' }}>
                  {editing ? 'Save Changes' : 'Create Plan'}
                </button>
                <button onClick={() => setShowModal(false)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', padding: '14px 24px', fontSize: 11, cursor: 'pointer', borderRadius: 4 }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}