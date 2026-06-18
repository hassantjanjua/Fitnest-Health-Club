'use client'

import { useEffect, useState } from 'react'

const emptyForm = {
  id: '',
  name: '',
  email: '',
  password: '',
  role: 'manager',
  assignmentScope: 'assigned-control',
  assignedTo: '',
  sessionDuration: '1d',
  isActive: true,
}

const roles = [
  { value: 'owner', label: 'Owner' },
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
]

const assignmentScopes = [
  { value: 'full-control', label: 'Full control' },
  { value: 'assigned-control', label: 'Assigned control' },
  { value: 'handover-control', label: 'Handover control' },
]

const sessionDurations = [
  { value: '1d', label: '1 day' },
  { value: '1w', label: '1 week' },
  { value: '1m', label: '1 month' },
]

type AdminUser = typeof emptyForm & {
  _id: string
  lastLoginAt?: string | null
}

export default function SettingsPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function loadUsers() {
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/users')
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Unable to load users')
        return
      }

      setUsers(data.users || [])
    } catch {
      setError('Unable to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void Promise.resolve().then(loadUsers)
  }, [])

  function editUser(user: AdminUser) {
    setForm({
      id: user._id,
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      assignmentScope: user.assignmentScope,
      assignedTo: user.assignedTo || '',
      sessionDuration: user.sessionDuration || '1d',
      isActive: user.isActive,
    })
    setMessage('')
    setError('')
  }

  async function saveUser(handoverControl = false) {
    setSaving(true)
    setMessage('')
    setError('')

    try {
      const res = await fetch('/api/admin/users', {
        method: form.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, handoverControl }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Unable to save user')
        return
      }

      setForm(emptyForm)
      setMessage(handoverControl ? 'Control handed over' : 'User saved')
      await loadUsers()
    } catch {
      setError('Unable to save user')
    } finally {
      setSaving(false)
    }
  }

  async function deleteUser(id: string) {
    if (!confirm('Delete this admin user?')) return

    setMessage('')
    setError('')

    const res = await fetch('/api/admin/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Unable to delete user')
      return
    }

    setMessage('User deleted')
    await loadUsers()
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

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 7,
  }

  if (loading) {
    return <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14 }}>Loading users...</div>
  }

  return (
    <div>
      <div className="admin-page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 36, color: '#fff', letterSpacing: '0.05em', margin: 0 }}>User Access</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>Create users, assign control, hand over ownership, and configure automatic logout timing</p>
        </div>
        <button
          onClick={() => setForm(emptyForm)}
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '12px 18px', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 4 }}
        >
          New User
        </button>
      </div>

      {(error || message) && (
        <div style={{ marginBottom: 20, padding: '12px 16px', borderRadius: 4, fontSize: 13, color: error ? '#ef4444' : '#22c55e', background: error ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)', border: `1px solid ${error ? 'rgba(239,68,68,0.25)' : 'rgba(34,197,94,0.25)'}` }}>
          {error || message}
        </div>
      )}

      <div className="admin-settings-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(320px, 420px)', gap: 24 }}>
        <div style={{ display: 'grid', gap: 12 }}>
          {users.map(user => (
            <div className="admin-user-row" key={user._id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: 18, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: 16, alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
                  <h2 style={{ color: '#fff', fontSize: 17, margin: 0 }}>{user.name}</h2>
                  <span style={{ color: user.isActive ? '#22c55e' : '#ef4444', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase' }}>{user.isActive ? 'Active' : 'Disabled'}</span>
                </div>
                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, marginBottom: 10 }}>{user.email}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {[user.role, user.assignmentScope, sessionDurations.find(item => item.value === user.sessionDuration)?.label || '1 day'].map(item => (
                    <span key={item} style={{ background: 'rgba(255,107,0,0.1)', border: '1px solid rgba(255,107,0,0.18)', color: 'rgba(255,255,255,0.72)', borderRadius: 4, padding: '5px 8px', fontSize: 11, textTransform: 'capitalize' }}>
                      {String(item).replaceAll('-', ' ')}
                    </span>
                  ))}
                </div>
                {user.assignedTo && <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 10 }}>Assigned: {user.assignedTo}</div>}
              </div>
              <div className="admin-row-actions" style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => editUser(user)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '9px 12px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>Edit</button>
                <button onClick={() => deleteUser(user._id)} style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '9px 12px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>Delete</button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: 24, alignSelf: 'start' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent-orange)', marginBottom: 18 }}>{form.id ? 'Update User' : 'Create User'}</div>
          <div style={{ display: 'grid', gap: 15 }}>
            <div>
              <label style={labelStyle}>Name</label>
              <input value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input type="email" value={form.email} onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>{form.id ? 'New Password' : 'Password'}</label>
              <input type="password" value={form.password} placeholder={form.id ? 'Leave blank to keep current password' : 'Minimum 8 characters'} onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))} style={inputStyle} />
            </div>
            <div className="admin-form-pair" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={labelStyle}>Role</label>
                <select value={form.role} onChange={e => setForm(prev => ({ ...prev, role: e.target.value }))} style={inputStyle}>
                  {roles.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Token Expiry</label>
                <select value={form.sessionDuration} onChange={e => setForm(prev => ({ ...prev, sessionDuration: e.target.value }))} style={inputStyle}>
                  {sessionDurations.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Assignment</label>
              <select value={form.assignmentScope} onChange={e => setForm(prev => ({ ...prev, assignmentScope: e.target.value }))} style={inputStyle}>
                {assignmentScopes.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Assigned To / Notes</label>
              <textarea value={form.assignedTo} rows={3} onChange={e => setForm(prev => ({ ...prev, assignedTo: e.target.value }))} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.65)', fontSize: 13, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.isActive} onChange={e => setForm(prev => ({ ...prev, isActive: e.target.checked }))} style={{ width: 16, height: 16, accentColor: 'var(--accent-orange)' }} />
              User can log in
            </label>
            <button onClick={() => saveUser(false)} disabled={saving} style={{ background: saving ? 'rgba(255,107,0,0.45)' : 'var(--accent-orange)', border: 'none', color: '#fff', padding: '12px 20px', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: saving ? 'not-allowed' : 'pointer', borderRadius: 4 }}>
              {saving ? 'Saving...' : 'Save User'}
            </button>
            {form.id && (
              <button onClick={() => saveUser(true)} disabled={saving} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '12px 20px', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: saving ? 'not-allowed' : 'pointer', borderRadius: 4 }}>
                Handover Control
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
