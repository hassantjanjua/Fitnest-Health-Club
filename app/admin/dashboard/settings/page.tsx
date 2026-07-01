'use client'

import { useEffect, useState } from 'react'

// Simulated admin permissions (replace with your actual import)
type AdminPageKey = 'overview' | 'messages' | 'customers' | 'trainers' | 'gallery' | 'events' | 'schedule' | 'settings'

const ADMIN_PAGES: { key: AdminPageKey; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'messages', label: 'Messages' },
  { key: 'customers', label: 'Customers' },
  { key: 'trainers', label: 'Trainers' },
  { key: 'gallery', label: 'Gallery' },
  { key: 'events', label: 'Events' },
  { key: 'schedule', label: 'Schedule' },
  { key: 'settings', label: 'Settings' },
]

function normalizeAllowedPages(role: string, pages: AdminPageKey[]): AdminPageKey[] {
  if (role === 'owner') return ADMIN_PAGES.map(p => p.key)
  return pages
}

const emptyForm = {
  id: '',
  name: '',
  email: '',
  password: '',
  role: 'manager',
  assignmentScope: 'assigned-control',
  assignedTo: '',
  allowedPages: ['overview', 'messages', 'customers'] as AdminPageKey[],
  sessionDuration: '1d',
  isActive: true,
}

const roles = [
  { value: 'owner', label: 'Owner', color: '#FF6B00' },
  { value: 'admin', label: 'Admin', color: '#3b82f6' },
  { value: 'manager', label: 'Manager', color: '#a855f7' },
  { value: 'front-desk', label: 'Front Desk', color: '#22c55e' },
  { value: 'content-manager', label: 'Content Manager', color: '#ec4899' },
]

const sessionDurations = [
  { value: '1d', label: '1 day' },
  { value: '1w', label: '1 week' },
  { value: '1m', label: '1 month' },
]

type AdminUser = typeof emptyForm & {
  _id: string
  lastLoginAt?: string | null
  createdAt?: string
  updatedAt?: string
}

export default function SettingsPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
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
      allowedPages: normalizeAllowedPages(user.role, user.allowedPages),
      sessionDuration: user.sessionDuration || '1d',
      isActive: user.isActive,
    })
    setShowForm(true)
    setMessage('')
    setError('')
  }

  function startNewUser() {
    setForm(emptyForm)
    setShowForm(true)
    setMessage('')
    setError('')
  }

  function closeForm() {
    setForm(emptyForm)
    setShowForm(false)
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
      setShowForm(false)
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

  function setRole(role: string) {
    setForm((prev) => ({
      ...prev,
      role,
      allowedPages: normalizeAllowedPages(role, prev.allowedPages),
      assignmentScope: role === 'owner' ? 'full-control' : 'assigned-control',
      assignedTo: '',
    }))
  }

  function togglePage(page: AdminPageKey) {
    setForm((prev) => {
      if (prev.role === 'owner') return prev

      const exists = prev.allowedPages.includes(page)
      const next = exists
        ? prev.allowedPages.filter((item) => item !== page)
        : [...prev.allowedPages, page]

      return { ...prev, allowedPages: normalizeAllowedPages(prev.role, next) }
    })
  }

  const activeCount = users.filter((u) => u.isActive).length
  const inactiveCount = users.filter((u) => !u.isActive).length
  const rolesCount = new Set(users.map((u) => u.role).filter(Boolean)).size

  const stats = [
    { label: 'Total Users', value: users.length, icon: '◉', color: '#FF6B00' },
    { label: 'Active', value: activeCount, icon: '◎', color: '#22c55e' },
    { label: 'Inactive', value: inactiveCount, icon: '◈', color: '#ef4444' },
    { label: 'Roles', value: rolesCount, icon: '▤', color: '#a855f7' },
  ]

  return (
    <div
      style={{
        padding: 'clamp(24px, 4vw, 48px)',
        maxWidth: 1400,
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <div style={{ width: 36, height: 2, background: 'var(--accent-orange)' }} />
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'var(--accent-orange)',
            }}
          >
            Admin Panel
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: 'clamp(32px, 5vw, 48px)',
                color: '#fff',
                letterSpacing: '0.05em',
                margin: 0,
                lineHeight: 1,
              }}
            >
              User Access
            </h1>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 8 }}>
              Create users, assign roles, choose page access, and configure automatic logout timing.
            </p>
          </div>
          <button
            onClick={startNewUser}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#e05e00'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--accent-orange)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
            style={{
              background: 'var(--accent-orange)',
              border: 'none',
              color: '#fff',
              padding: '14px 28px',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              clipPath:
                'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))',
              transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
              flexShrink: 0,
            }}
          >
            + New User
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div
        className="stats-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          marginBottom: 36,
        }}
      >
        {stats.map((s) => (
          <StatCard key={s.label} stat={s} loading={loading} />
        ))}
      </div>

      {/* Messages */}
      {(error || message) && (
        <div
          style={{
            marginBottom: 20,
            padding: '14px 18px',
            fontSize: 12,
            fontWeight: 600,
            color: error ? '#ef4444' : '#22c55e',
            background: error ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)',
            border: `1px solid ${error ? 'rgba(239,68,68,0.25)' : 'rgba(34,197,94,0.25)'}`,
            clipPath:
              'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <span style={{ fontSize: 14 }}>{error ? '⚠' : '✓'}</span>
          {error || message}
        </div>
      )}

      {/* Main Content Grid */}
      <div
        className="settings-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: showForm ? '1fr 400px' : '1fr',
          gap: 24,
        }}
      >
        {/* Users List Container */}
        <div
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            overflow: 'hidden',
            clipPath:
              'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
          }}
        >
          <div
            style={{
              height: 2,
              background: 'linear-gradient(90deg, var(--accent-orange), #ff9500)',
            }}
          />
          <div
            style={{
              padding: '18px 24px',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>All Users</span>
              {users.length > 0 && (
                <div
                  style={{
                    background: 'var(--accent-orange)',
                    color: '#fff',
                    minWidth: 22,
                    height: 22,
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '0 6px',
                    clipPath:
                      'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
                  }}
                >
                  {users.length}
                </div>
              )}
            </div>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: 'rgba(255,255,255,0.3)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              {activeCount} Active · {inactiveCount} Inactive
            </span>
          </div>

          {loading ? (
            <div
              style={{
                padding: 48,
                textAlign: 'center',
                color: 'rgba(255,255,255,0.25)',
                fontSize: 13,
              }}
            >
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <div
              style={{
                padding: 64,
                textAlign: 'center',
                color: 'rgba(255,255,255,0.25)',
                fontSize: 14,
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.3 }}>◉</div>
              <div style={{ marginBottom: 6 }}>No users yet</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.15)' }}>
                Click &quot;+ New User&quot; to create an admin user.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {users.map((user, i) => (
                <UserCard
                  key={user._id}
                  user={user}
                  index={i}
                  onEdit={() => editUser(user)}
                  onDelete={() => deleteUser(user._id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Form Panel */}
        {showForm && (
          <UserFormPanel
            form={form}
            setForm={setForm}
            setRole={setRole}
            togglePage={togglePage}
            onSave={() => saveUser(false)}
            onClose={closeForm}
            saving={saving}
          />
        )}
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .settings-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

/* ─── Stat Card ─── */
function StatCard({
  stat,
  loading,
}: {
  stat: { label: string; value: string | number; icon: string; color: string }
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
        clipPath:
          'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: stat.color,
          transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
          transformOrigin: 'left',
          transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
        }}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 16,
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.35)',
          }}
        >
          {stat.label}
        </span>
        <div
          style={{
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `${stat.color}15`,
            border: `1px solid ${stat.color}30`,
            fontSize: 18,
            color: stat.color,
            transition: 'all 0.3s ease',
            transform: hovered ? 'scale(1.1) rotate(-3deg)' : 'scale(1)',
            clipPath:
              'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
          }}
        >
          {stat.icon}
        </div>
      </div>
      <div
        style={{
          fontFamily: 'Bebas Neue, sans-serif',
          fontSize: 'clamp(32px, 4vw, 44px)',
          color: '#fff',
          lineHeight: 1,
        }}
      >
        {loading ? (
          <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.3)' }}>Loading...</span>
        ) : (
          stat.value
        )}
      </div>
    </div>
  )
}

/* ─── User Card ─── */
function UserCard({
  user,
  index,
  onEdit,
  onDelete,
}: {
  user: AdminUser
  index: number
  onEdit: () => void
  onDelete: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const roleData = roles.find((r) => r.value === user.role)
  const roleColor = roleData?.color || '#FF6B00'

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '20px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        background: hovered ? 'rgba(255,107,0,0.03)' : 'transparent',
        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
        animation: `fadeIn 0.4s ease ${index * 0.05}s both`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Left accent bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: 2,
          background: roleColor,
          transform: hovered ? 'scaleY(1)' : 'scaleY(0)',
          transformOrigin: 'top',
          transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
        }}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ flex: 1, minWidth: 200 }}>
          {/* Name & Status */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 6,
              flexWrap: 'wrap',
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>{user.name}</span>
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                padding: '3px 8px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                background: user.isActive ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                color: user.isActive ? '#22c55e' : '#ef4444',
                border: `1px solid ${user.isActive ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`,
                clipPath:
                  'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
              }}
            >
              {user.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>

          {/* Email */}
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>
            {user.email}
          </div>

          {/* Role & Session badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: '4px 10px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                background: `${roleColor}18`,
                color: roleColor,
                border: `1px solid ${roleColor}33`,
                clipPath:
                  'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
              }}
            >
              {user.role.replace(/-/g, ' ')}
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                padding: '4px 10px',
                background: 'rgba(255,255,255,0.04)',
                color: 'rgba(255,255,255,0.5)',
                border: '1px solid rgba(255,255,255,0.08)',
                clipPath:
                  'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
              }}
            >
              {sessionDurations.find((s) => s.value === user.sessionDuration)?.label || '1 day'}
            </span>
          </div>

          {/* Allowed Pages */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {normalizeAllowedPages(user.role, user.allowedPages).map((page) => (
              <span
                key={page}
                style={{
                  fontSize: 9,
                  padding: '3px 6px',
                  background: 'rgba(255,255,255,0.03)',
                  color: 'rgba(255,255,255,0.4)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 2,
                }}
              >
                {ADMIN_PAGES.find((p) => p.key === page)?.label || page}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button
            onClick={onEdit}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,107,0,0.1)'
              e.currentTarget.style.color = 'var(--accent-orange)'
              e.currentTarget.style.borderColor = 'rgba(255,107,0,0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
              e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
            }}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.6)',
              padding: '8px 14px',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              clipPath:
                'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
            }}
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.15)'
              e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.08)'
              e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)'
            }}
            style={{
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              color: 'rgba(239,68,68,0.7)',
              padding: '8px 14px',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              clipPath:
                'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── User Form Panel ─── */
function UserFormPanel({
  form,
  setForm,
  setRole,
  togglePage,
  onSave,
  onClose,
  saving,
}: {
  form: typeof emptyForm
  setForm: React.Dispatch<React.SetStateAction<typeof emptyForm>>
  setRole: (role: string) => void
  togglePage: (page: AdminPageKey) => void
  onSave: () => void
  onClose: () => void
  saving: boolean
}) {
  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    padding: '12px 14px',
    fontSize: 13,
    borderRadius: 0,
    outline: 'none',
    fontFamily: 'Inter, sans-serif',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
    clipPath:
      'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.35)',
    marginBottom: 6,
  }

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        overflow: 'hidden',
        clipPath:
          'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
        alignSelf: 'start',
        animation: 'slideIn 0.3s ease',
      }}
    >
      <div
        style={{
          height: 2,
          background: form.id
            ? 'linear-gradient(90deg, #3b82f6, #60a5fa)'
            : 'linear-gradient(90deg, var(--accent-orange), #ff9500)',
        }}
      />

      {/* Header */}
      <div
        style={{
          padding: '18px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: form.id ? 'rgba(59,130,246,0.1)' : 'rgba(255,107,0,0.1)',
              border: `1px solid ${form.id ? 'rgba(59,130,246,0.2)' : 'rgba(255,107,0,0.2)'}`,
              fontSize: 12,
              color: form.id ? '#3b82f6' : 'var(--accent-orange)',
              clipPath:
                'polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))',
            }}
          >
            {form.id ? '✎' : '+'}
          </div>
          <span
            style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 20,
              color: '#fff',
              letterSpacing: '0.05em',
            }}
          >
            {form.id ? 'Update User' : 'Create User'}
          </span>
        </div>
        <button
          onClick={onClose}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#ef4444'
            e.currentTarget.style.background = 'rgba(239,68,68,0.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.4)'
            e.currentTarget.style.background = 'transparent'
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'rgba(255,255,255,0.4)',
            fontSize: 16,
            cursor: 'pointer',
            width: 28,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            borderRadius: 4,
          }}
        >
          ✕
        </button>
      </div>

      {/* Form */}
      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Name */}
        <div>
          <label style={labelStyle}>Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,107,0,0.4)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
            }}
            style={inputStyle}
          />
        </div>

        {/* Email */}
        <div>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,107,0,0.4)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
            }}
            style={inputStyle}
          />
        </div>

        {/* Password */}
        <div>
          <label style={labelStyle}>{form.id ? 'New Password' : 'Password'}</label>
          <input
            type="password"
            value={form.password}
            placeholder={form.id ? 'Leave blank to keep current' : 'Minimum 8 characters'}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,107,0,0.4)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
            }}
            style={inputStyle}
          />
        </div>

        {/* Role & Session Duration */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={labelStyle}>Role</label>
            <select
              value={roles.some((r) => r.value === form.role) ? form.role : 'custom'}
              onChange={(e) => setRole(e.target.value === 'custom' ? '' : e.target.value)}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,107,0,0.4)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
              }}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              {roles.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
              <option value="custom">Custom role</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Token Expiry</label>
            <select
              value={form.sessionDuration}
              onChange={(e) => setForm((prev) => ({ ...prev, sessionDuration: e.target.value }))}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,107,0,0.4)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
              }}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              {sessionDurations.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Custom Role Input */}
        {!roles.some((r) => r.value === form.role) && (
          <div>
            <label style={labelStyle}>Custom Role Name</label>
            <input
              value={form.role}
              placeholder="sales-lead"
              onChange={(e) => setRole(e.target.value)}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,107,0,0.4)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
              }}
              style={inputStyle}
            />
          </div>
        )}

        {/* Page Access */}
        <div>
          <label style={labelStyle}>Page Access</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {ADMIN_PAGES.map((page) => {
              const checked = form.role === 'owner' || form.allowedPages.includes(page.key)
              return (
                <label
                  key={page.key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    background: checked ? 'rgba(255,107,0,0.08)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${checked ? 'rgba(255,107,0,0.2)' : 'rgba(255,255,255,0.06)'}`,
                    padding: '10px 12px',
                    cursor: form.role === 'owner' ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    clipPath:
                      'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
                  }}
                >
                  <span style={{ color: checked ? '#fff' : 'rgba(255,255,255,0.5)', fontSize: 12 }}>
                    {page.label}
                  </span>
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={form.role === 'owner'}
                    onChange={() => togglePage(page.key)}
                    style={{ width: 14, height: 14, accentColor: 'var(--accent-orange)' }}
                  />
                </label>
              )
            })}
          </div>
          {form.role === 'owner' && (
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 8 }}>
              Owners always have access to every dashboard page.
            </div>
          )}
        </div>

        {/* Active toggle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '10px 14px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <input
            type="checkbox"
            id="isActive"
            checked={form.isActive}
            onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
            style={{ width: 16, height: 16, accentColor: 'var(--accent-orange)' }}
          />
          <label
            htmlFor="isActive"
            style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.6)',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            User can log in
          </label>
          <span
            style={{
              marginLeft: 'auto',
              fontSize: 9,
              fontWeight: 700,
              padding: '3px 8px',
              background: form.isActive ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
              color: form.isActive ? '#22c55e' : '#ef4444',
              border: `1px solid ${form.isActive ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            {form.isActive ? 'Enabled' : 'Disabled'}
          </span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 8 }}>
          <button
            onClick={onSave}
            disabled={saving}
            onMouseEnter={(e) => {
              if (!saving) {
                e.currentTarget.style.background = '#e05e00'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = saving
                ? 'rgba(255,107,0,0.5)'
                : 'var(--accent-orange)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
            style={{
              background: saving ? 'rgba(255,107,0,0.5)' : 'var(--accent-orange)',
              border: 'none',
              color: '#fff',
              padding: '14px',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              cursor: saving ? 'not-allowed' : 'pointer',
              clipPath:
                'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))',
              transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? 'Saving...' : 'Save User'}
          </button>
          <button
            onClick={onClose}
            disabled={saving}
            onMouseEnter={(e) => {
              if (!saving) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
            }}
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.5)',
              padding: '12px',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: saving ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              clipPath:
                'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))',
            }}
          >
            Cancel
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}
