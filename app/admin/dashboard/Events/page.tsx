'use client'

import { useEffect, useState } from 'react'

const emptyForm = {
  title: '',
  description: '',
  category: 'Competition',
  day: '',
  month: '',
  year: '2025',
  isActive: true,
}

const categories = ['Competition', 'Event', 'Championship', 'Workshop', 'Special']
const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

const catColor: Record<string, string> = {
  Competition: '#ef4444',
  Event: '#3b82f6',
  Championship: '#FF6B00',
  Workshop: '#a855f7',
  Special: '#22c55e',
}

export default function EventsAdminPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/events')
      console.log('LOAD status:', res.status)
      const data = await res.json()
      console.log('LOAD data:', data)
      setEvents(data.events || [])
    } catch (err) {
      console.error('LOAD error:', err)
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  function openAdd() {
    setEditing(null)
    setForm(emptyForm)
    setErrorMsg('')
    setShowModal(true)
  }

  function openEdit(ev: any) {
    setEditing(ev)
    setForm({
      title: ev.title,
      description: ev.description,
      category: ev.category,
      day: ev.day,
      month: ev.month,
      year: ev.year,
      isActive: ev.isActive,
    })
    setErrorMsg('')
    setShowModal(true)
  }

  async function handleSave() {
    setSaving(true)
    setErrorMsg('')
    try {
      let res
      if (editing) {
        res = await fetch('/api/admin/events', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editing._id, ...form }),
        })
      } else {
        res = await fetch('/api/admin/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
      }

      console.log('SAVE status:', res.status)
      const data = await res.json().catch(() => ({}))
      console.log('SAVE response body:', data)

      if (!res.ok) {
        setErrorMsg(`Save failed (${res.status}): ${data.error || 'Unknown error'}`)
        setSaving(false)
        return
      }

      setShowModal(false)
      load()
    } catch (err: any) {
      console.error('SAVE exception:', err)
      setErrorMsg('Network error: ' + err.message)
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this event?')) return
    try {
      const res = await fetch('/api/admin/events', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      console.log('DELETE status:', res.status)
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        alert(`Delete failed (${res.status}): ${data.error || 'Unknown error'}`)
        return
      }
      load()
    } catch (err: any) {
      alert('Network error: ' + err.message)
    }
  }

  async function toggleActive(ev: any) {
    try {
      const res = await fetch('/api/admin/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ev._id, isActive: !ev.isActive }),
      })
      console.log('TOGGLE status:', res.status)
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        alert(`Toggle failed (${res.status}): ${data.error || 'Unknown error'}`)
        return
      }
      load()
    } catch (err: any) {
      alert('Network error: ' + err.message)
    }
  }

  const activeCount = events.filter((e) => e.isActive).length
  const hiddenCount = events.filter((e) => !e.isActive).length
  const categoriesCount = new Set(events.map((e) => e.category).filter(Boolean)).size

  const stats = [
    { label: 'Total Events', value: events.length, icon: '◉', color: '#FF6B00' },
    { label: 'Active', value: activeCount, icon: '◎', color: '#22c55e' },
    { label: 'Hidden', value: hiddenCount, icon: '◈', color: '#ef4444' },
    { label: 'Categories', value: categoriesCount, icon: '▤', color: '#a855f7' },
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
              Events
            </h1>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 8 }}>
              {events.length} event{events.length !== 1 ? 's' : ''} total. Manage competitions,
              workshops & special events.
            </p>
          </div>
          <button
            onClick={openAdd}
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
            + Add Event
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

      {/* Events Container */}
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
          style={{ height: 2, background: 'linear-gradient(90deg, var(--accent-orange), #ff9500)' }}
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
            <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>All Events</span>
            {events.length > 0 && (
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
                {events.length}
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
            {activeCount} Active · {hiddenCount} Hidden
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
            Loading events...
          </div>
        ) : events.length === 0 ? (
          <div
            style={{
              padding: 64,
              textAlign: 'center',
              color: 'rgba(255,255,255,0.25)',
              fontSize: 14,
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.3 }}>◉</div>
            <div style={{ marginBottom: 6 }}>No events yet</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.15)' }}>
              Click &quot;+ Add Event&quot; to create your first event.
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {events.map((ev, i) => (
              <EventCard
                key={ev._id}
                event={ev}
                index={i}
                onEdit={() => openEdit(ev)}
                onDelete={() => handleDelete(ev._id)}
                onToggle={() => toggleActive(ev)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <EventModal
          editing={editing}
          form={form}
          setForm={setForm}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
          saving={saving}
          errorMsg={errorMsg}
        />
      )}

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
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

/* ─── Event Card ─── */
function EventCard({
  event: ev,
  index,
  onEdit,
  onDelete,
  onToggle,
}: {
  event: any
  index: number
  onEdit: () => void
  onDelete: () => void
  onToggle: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const color = catColor[ev.category] || '#FF6B00'

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="event-card"
      style={{
        display: 'grid',
        gridTemplateColumns: '90px 1fr auto',
        gap: 24,
        alignItems: 'center',
        padding: '20px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        background: hovered ? 'rgba(255,107,0,0.03)' : 'transparent',
        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
        animation: `fadeIn 0.4s ease ${index * 0.05}s both`,
        position: 'relative',
        overflow: 'hidden',
        opacity: ev.isActive ? 1 : 0.6,
      }}
    >
      {/* Left accent bar on hover */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: 2,
          background: color,
          transform: hovered ? 'scaleY(1)' : 'scaleY(0)',
          transformOrigin: 'top',
          transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
        }}
      />

      {/* Date Block */}
      <div
        style={{
          textAlign: 'center',
          padding: '12px 8px',
          background: `${color}08`,
          border: `1px solid ${color}20`,
          clipPath:
            'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
          transition: 'all 0.3s ease',
          transform: hovered ? 'scale(1.02)' : 'scale(1)',
        }}
      >
        <div
          style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 32,
            color: '#fff',
            lineHeight: 1,
          }}
        >
          {ev.day}
        </div>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.15em',
            color: color,
            textTransform: 'uppercase',
            marginTop: 2,
          }}
        >
          {ev.month}
        </div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{ev.year}</div>
      </div>

      {/* Info */}
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              padding: '3px 10px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              background: `${color}18`,
              color: color,
              border: `1px solid ${color}33`,
              clipPath:
                'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
            }}
          >
            {ev.category}
          </span>
          <span
            style={{
              fontSize: 9,
              color: ev.isActive ? '#22c55e' : '#ef4444',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: ev.isActive ? '#22c55e' : '#ef4444',
                boxShadow: ev.isActive ? '0 0 6px rgba(34,197,94,0.5)' : 'none',
              }}
            />
            {ev.isActive ? 'Active' : 'Hidden'}
          </span>
        </div>
        <div
          style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 20,
            color: '#fff',
            letterSpacing: '0.04em',
            marginBottom: 4,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {ev.title}
        </div>
        <div
          style={{
            fontSize: 12,
            color: 'rgba(255,255,255,0.4)',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {ev.description}
        </div>
      </div>

      {/* Actions */}
      <div
        className="event-actions"
        style={{ display: 'flex', gap: 8, flexShrink: 0 }}
      >
        <button
          onClick={onToggle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
          }}
          style={{
            background: ev.isActive ? 'rgba(239,68,68,0.08)' : 'rgba(34,197,94,0.08)',
            border: `1px solid ${ev.isActive ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)'}`,
            color: ev.isActive ? '#ef4444' : '#22c55e',
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
          {ev.isActive ? 'Hide' : 'Show'}
        </button>
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

      <style>{`
        @media (max-width: 768px) {
          .event-card {
            grid-template-columns: 70px 1fr !important;
            gap: 16px !important;
          }
          .event-actions {
            grid-column: 1 / -1;
            justify-content: flex-start;
            padding-top: 12px;
            border-top: 1px solid rgba(255,255,255,0.04);
            margin-top: 4px;
          }
        }
      `}</style>
    </div>
  )
}

/* ─── Modal ─── */
function EventModal({
  editing,
  form,
  setForm,
  onSave,
  onClose,
  saving,
  errorMsg,
}: {
  editing: any
  form: typeof emptyForm
  setForm: React.Dispatch<React.SetStateAction<typeof emptyForm>>
  onSave: () => void
  onClose: () => void
  saving: boolean
  errorMsg: string
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

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        style={{
          background: '#0f0f0f',
          border: '1px solid rgba(255,107,0,0.2)',
          width: '100%',
          maxWidth: 520,
          maxHeight: '90vh',
          overflowY: 'auto',
          clipPath:
            'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
          animation: 'slideUp 0.35s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <div
          style={{ height: 2, background: 'linear-gradient(90deg, var(--accent-orange), #ff9500)' }}
        />

        {/* Header */}
        <div
          style={{
            padding: '20px 28px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255,107,0,0.1)',
                border: '1px solid rgba(255,107,0,0.2)',
                fontSize: 14,
                color: 'var(--accent-orange)',
                clipPath:
                  'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
              }}
            >
              {editing ? '✎' : '◉'}
            </div>
            <span
              style={{
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: 22,
                color: '#fff',
                letterSpacing: '0.05em',
              }}
            >
              {editing ? 'Edit Event' : 'Add Event'}
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
              fontSize: 18,
              cursor: 'pointer',
              width: 32,
              height: 32,
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
        <div
          style={{
            padding: '24px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {/* Error message */}
          {errorMsg && (
            <div
              style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                color: '#ef4444',
                padding: '12px 14px',
                fontSize: 12,
                clipPath:
                  'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
              }}
            >
              {errorMsg}
            </div>
          )}

          {/* Event Title */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.35)',
                marginBottom: 6,
              }}
            >
              Event Title
            </label>
            <input
              type="text"
              placeholder="Benchpress Hackathon"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,107,0,0.4)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
              }}
              style={inputStyle}
            />
          </div>

          {/* Description */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.35)',
                marginBottom: 6,
              }}
            >
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Event description..."
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,107,0,0.4)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
              }}
              style={{ ...inputStyle, resize: 'none' }}
            />
          </div>

          {/* Category */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.35)',
                marginBottom: 6,
              }}
            >
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,107,0,0.4)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
              }}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Date Fields */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.35)',
                marginBottom: 6,
              }}
            >
              Event Date
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div>
                <input
                  type="text"
                  placeholder="Day"
                  value={form.day}
                  onChange={(e) => setForm((f) => ({ ...f, day: e.target.value }))}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,107,0,0.4)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                  }}
                  style={inputStyle}
                />
              </div>
              <div>
                <select
                  value={form.month}
                  onChange={(e) => setForm((f) => ({ ...f, month: e.target.value }))}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,107,0,0.4)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                  }}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  <option value="">Month</option>
                  {months.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Year"
                  value={form.year}
                  onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,107,0,0.4)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                  }}
                  style={inputStyle}
                />
              </div>
            </div>
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
              onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
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
              Show on website
            </label>
            <span
              style={{
                marginLeft: 'auto',
                fontSize: 9,
                fontWeight: 700,
                padding: '3px 8px',
                background: form.isActive ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                color: form.isActive ? '#22c55e' : '#ef4444',
                border: `1px solid ${
                  form.isActive ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'
                }`,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              {form.isActive ? 'Active' : 'Hidden'}
            </span>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
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
                flex: 1,
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
              {saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Event'}
            </button>
            <button
              onClick={onClose}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
              }}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.5)',
                padding: '14px 24px',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                clipPath:
                  'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
