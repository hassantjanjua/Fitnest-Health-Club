'use client'

import { useEffect, useState } from 'react'

const emptyForm = { url: '', caption: '', category: 'general', order: 0, isActive: true }

export default function GalleryPage() {
  const [images, setImages] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState(emptyForm)

  async function load() {
    const res = await fetch('/api/admin/gallery')
    const data = await res.json()
    setImages(data.images || [])
  }

  useEffect(() => { load() }, [])

  function openAdd() { setEditing(null); setForm(emptyForm); setShowModal(true) }
  function openEdit(img: any) {
    setEditing(img)
    setForm({ url: img.url, caption: img.caption, category: img.category, order: img.order, isActive: img.isActive })
    setShowModal(true)
  }

  async function handleSave() {
    if (editing) {
      await fetch('/api/admin/gallery', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editing._id, ...form }) })
    } else {
      await fetch('/api/admin/gallery', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    }
    setShowModal(false)
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this image?')) return
    await fetch('/api/admin/gallery', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    load()
  }

  const inp: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '11px 14px', fontSize: 13, borderRadius: 4, outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 36, color: '#fff', letterSpacing: '0.05em', margin: 0 }}>Gallery</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{images.length} images</p>
        </div>
        <button onClick={openAdd} style={{ background: 'var(--accent-orange)', border: 'none', color: '#fff', padding: '12px 24px', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer', clipPath: 'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))' }}>
          + Add Image
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
        {images.map(img => (
          <div key={img._id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, overflow: 'hidden', transition: 'all 0.2s ease', position: 'relative' }}
            onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,107,0,0.25)'}
            onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.06)'}
          >
            <div style={{ height: 160, background: 'rgba(255,255,255,0.03)', position: 'relative', overflow: 'hidden' }}>
              {img.url ? (
                <img src={img.url} alt={img.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 32 }}>◧</div>
              )}
              {!img.isActive && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#ef4444', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Hidden</span>
                </div>
              )}
            </div>
            <div style={{ padding: '12px 14px' }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{img.caption || 'No caption'}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 9, color: 'rgba(255,107,0,0.6)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{img.category}</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => openEdit(img)} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.5)', padding: '4px 10px', fontSize: 10, cursor: 'pointer', borderRadius: 2 }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(img._id)} style={{ background: 'rgba(239,68,68,0.08)', border: 'none', color: 'rgba(239,68,68,0.6)', padding: '4px 8px', fontSize: 10, cursor: 'pointer', borderRadius: 2 }}>✕</button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {images.length === 0 && (
          <div style={{ gridColumn: '1/-1', padding: 48, textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: 14 }}>No images yet. Add gallery images!</div>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={e => { if (e.target === e.currentTarget) setShowModal(false) }}>
          <div style={{ background: '#111', border: '1px solid rgba(255,107,0,0.2)', width: '100%', maxWidth: 480, borderRadius: 8 }}>
            <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, color: '#fff', letterSpacing: '0.05em' }}>{editing ? 'Edit Image' : 'Add Image'}</span>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>Image URL</label>
                <input type="url" placeholder="https://example.com/image.jpg" value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} style={inp} />
                {form.url && <img src={form.url} alt="" style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 4, marginTop: 8 }} onError={e => (e.target as HTMLImageElement).style.display = 'none'} />}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>Caption</label>
                <input type="text" placeholder="Weight training area" value={form.caption} onChange={e => setForm(f => ({ ...f, caption: e.target.value }))} style={inp} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={inp}>
                  <option value="general">General</option>
                  <option value="equipment">Equipment</option>
                  <option value="classes">Classes</option>
                  <option value="trainers">Trainers</option>
                  <option value="events">Events</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>Display Order</label>
                <input type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))} style={inp} />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} style={{ accentColor: 'var(--accent-orange)', width: 16, height: 16 }} />
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Show on website</span>
              </label>
              <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
                <button onClick={handleSave} style={{ flex: 1, background: 'var(--accent-orange)', border: 'none', color: '#fff', padding: '14px', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer', clipPath: 'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))' }}>
                  {editing ? 'Save Changes' : 'Add Image'}
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