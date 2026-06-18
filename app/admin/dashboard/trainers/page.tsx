'use client'

import { useEffect, useState } from 'react'

const emptyForm = { name: '', role: '', speciality: '', experience: '', certifications: '', initials: '', color: '#FF6B00', instagram: '', isActive: true }

export default function TrainersPage() {
  const [trainers, setTrainers] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState(emptyForm)

  async function load() {
    const res = await fetch('/api/admin/trainers')
    const data = await res.json()
    setTrainers(data.trainers || [])
  }

  useEffect(() => { load() }, [])

  function openAdd() { setEditing(null); setForm(emptyForm); setShowModal(true) }
  function openEdit(t: any) {
    setEditing(t)
    setForm({ name: t.name, role: t.role, speciality: t.speciality, experience: t.experience, certifications: t.certifications, initials: t.initials, color: t.color, instagram: t.instagram || '', isActive: t.isActive })
    setShowModal(true)
  }

  async function handleSave() {
    if (editing) {
      await fetch('/api/admin/trainers', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editing._id, ...form }) })
    } else {
      await fetch('/api/admin/trainers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    }
    setShowModal(false)
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this trainer?')) return
    await fetch('/api/admin/trainers', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    load()
  }

  const inp: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '11px 14px', fontSize: 13, borderRadius: 4, outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 36, color: '#fff', letterSpacing: '0.05em', margin: 0 }}>Trainers</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{trainers.length} trainers on team</p>
        </div>
        <button onClick={openAdd} style={{ background: 'var(--accent-orange)', border: 'none', color: '#fff', padding: '12px 24px', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer', clipPath: 'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))' }}>
          + Add Trainer
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {trainers.map(t => (
          <div key={t._id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, overflow: 'hidden', transition: 'all 0.2s ease' }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,107,0,0.25)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.06)' }}
          >
            <div style={{ height: 80, background: `${t.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: `${t.color}25`, border: `2px solid ${t.color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, color: t.color }}>{t.initials}</span>
              </div>
              <span style={{ position: 'absolute', top: 12, right: 12, fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 2, background: t.isActive ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)', color: t.isActive ? '#22c55e' : '#ef4444', border: `1px solid ${t.isActive ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {t.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div style={{ padding: '16px 20px' }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 3 }}>{t.name}</div>
              <div style={{ fontSize: 11, color: 'var(--accent-orange)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>{t.role}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>
                <span style={{ color: 'rgba(255,255,255,0.6)' }}>Exp:</span> {t.experience}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 16, lineHeight: 1.5 }}>
                <span style={{ color: 'rgba(255,255,255,0.6)' }}>Cert:</span> {t.certifications}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => openEdit(t)} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', padding: '8px', fontSize: 11, cursor: 'pointer', borderRadius: 3, transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,107,0,0.1)'; e.currentTarget.style.color = 'var(--accent-orange)'; e.currentTarget.style.borderColor = 'rgba(255,107,0,0.3)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(t._id)} style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: 'rgba(239,68,68,0.7)', padding: '8px 14px', fontSize: 11, cursor: 'pointer', borderRadius: 3, transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)' }}>
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}
        {trainers.length === 0 && (
          <div style={{ gridColumn: '1/-1', padding: 48, textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: 14 }}>
            No trainers yet. Add your first trainer!
          </div>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={e => { if (e.target === e.currentTarget) setShowModal(false) }}>
          <div style={{ background: '#111', border: '1px solid rgba(255,107,0,0.2)', width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto', borderRadius: 8 }}>
            <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, color: '#fff', letterSpacing: '0.05em' }}>{editing ? 'Edit Trainer' : 'Add Trainer'}</span>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { key: 'name', label: 'Full Name', placeholder: 'Ahmed Raza' },
                { key: 'role', label: 'Role / Title', placeholder: 'Head Strength Coach' },
                { key: 'speciality', label: 'Speciality', placeholder: 'Powerlifting & Hypertrophy' },
                { key: 'experience', label: 'Experience', placeholder: '10 Years' },
                { key: 'certifications', label: 'Certifications', placeholder: 'NASM-CPT, CSCS' },
                { key: 'initials', label: 'Initials (2 letters)', placeholder: 'AR' },
                { key: 'instagram', label: 'Instagram Handle', placeholder: '@ahmedraza' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>{f.label}</label>
                  <input type="text" placeholder={f.placeholder} value={(form as any)[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} style={inp} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>Card Color</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} style={{ width: 48, height: 40, background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, cursor: 'pointer', padding: 2 }} />
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{form.color}</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} style={{ width: 16, height: 16, accentColor: 'var(--accent-orange)' }} />
                <label htmlFor="isActive" style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>Active Trainer</label>
              </div>
              <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
                <button onClick={handleSave} style={{ flex: 1, background: 'var(--accent-orange)', border: 'none', color: '#fff', padding: '14px', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer', clipPath: 'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))' }}>
                  {editing ? 'Save Changes' : 'Add Trainer'}
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