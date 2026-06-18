'use client'

import { useEffect, useState } from 'react'

const emptyForm = {
  heroSlogan: '',
  heroSubtext: '',
  gymPhone: '',
  gymEmail: '',
  gymAddress: '',
  gymHours: '',
  announcementBar: '',
  announcementActive: false,
}

export default function SettingsPage() {
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError('')

      try {
        const res = await fetch('/api/admin/settings')
        const data = await res.json()

        if (!res.ok) {
          setError(data.error || 'Unable to load settings')
          return
        }

        setForm({ ...emptyForm, ...data.settings })
      } catch {
        setError('Unable to load settings')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  async function handleSave() {
    setSaving(true)
    setMessage('')
    setError('')

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Unable to save settings')
        return
      }

      setForm({ ...emptyForm, ...data.settings })
      setMessage('Settings saved')
    } catch {
      setError('Unable to save settings')
    } finally {
      setSaving(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    padding: '12px 14px',
    fontSize: 13,
    borderRadius: 4,
    outline: 'none',
    fontFamily: 'Inter, sans-serif',
    boxSizing: 'border-box',
  }

  const fields = [
    { key: 'heroSlogan', label: 'Hero Slogan', placeholder: 'BUILD YOUR STRENGTH' },
    { key: 'heroSubtext', label: 'Hero Subtext', placeholder: "Pakistan's most driven fitness community." },
    { key: 'gymPhone', label: 'Phone', placeholder: '+92 300 1234567' },
    { key: 'gymEmail', label: 'Email', placeholder: 'info@fitnestlahore.com' },
    { key: 'gymAddress', label: 'Address', placeholder: 'Model Town, Lahore' },
    { key: 'gymHours', label: 'Hours', placeholder: '6AM - 11PM' },
  ] as const

  if (loading) {
    return <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14 }}>Loading settings...</div>
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 36, color: '#fff', letterSpacing: '0.05em', margin: 0 }}>Settings</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>Manage gym contact details and homepage messaging</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{ background: saving ? 'rgba(255,107,0,0.45)' : 'var(--accent-orange)', border: 'none', color: '#fff', padding: '12px 24px', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: saving ? 'not-allowed' : 'pointer', clipPath: 'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))' }}
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {(error || message) && (
        <div style={{ marginBottom: 20, padding: '12px 16px', borderRadius: 4, fontSize: 13, color: error ? '#ef4444' : '#22c55e', background: error ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)', border: `1px solid ${error ? 'rgba(239,68,68,0.25)' : 'rgba(34,197,94,0.25)'}` }}>
          {error || message}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(280px, 420px)', gap: 24 }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: 24 }}>
          <div style={{ display: 'grid', gap: 16 }}>
            {fields.map(field => (
              <div key={field.key}>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 7 }}>
                  {field.label}
                </label>
                <input
                  value={form[field.key]}
                  placeholder={field.placeholder}
                  onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                  style={inputStyle}
                />
              </div>
            ))}

            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 7 }}>
                Announcement Bar
              </label>
              <textarea
                value={form.announcementBar}
                placeholder="Limited-time offer or announcement"
                onChange={e => setForm(prev => ({ ...prev, announcementBar: e.target.value }))}
                rows={3}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.65)', fontSize: 13, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={form.announcementActive}
                onChange={e => setForm(prev => ({ ...prev, announcementActive: e.target.checked }))}
                style={{ width: 16, height: 16, accentColor: 'var(--accent-orange)' }}
              />
              Show announcement on the website
            </label>
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: 24, alignSelf: 'start' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent-orange)', marginBottom: 18 }}>Preview</div>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 34, color: '#fff', lineHeight: 1, marginBottom: 10 }}>{form.heroSlogan || 'BUILD YOUR STRENGTH'}</div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, margin: '0 0 22px' }}>{form.heroSubtext || "Pakistan's most driven fitness community."}</p>

          {[
            ['Phone', form.gymPhone],
            ['Email', form.gymEmail],
            ['Address', form.gymAddress],
            ['Hours', form.gymHours],
          ].map(([label, value]) => (
            <div key={label} style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '12px 0' }}>
              <div style={{ fontSize: 10, color: 'rgba(255,107,0,0.7)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>{value || '-'}</div>
            </div>
          ))}

          {form.announcementActive && form.announcementBar && (
            <div style={{ marginTop: 12, padding: 12, borderRadius: 4, background: 'rgba(255,107,0,0.1)', border: '1px solid rgba(255,107,0,0.22)', color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>
              {form.announcementBar}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
