'use client'

import { useEffect, useState } from 'react'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const times = [
  '6:00 AM',
  '7:00 AM',
  '8:00 AM',
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '5:00 PM',
  '6:00 PM',
  '7:00 PM',
  '8:00 PM',
]
const categories = ['Cardio', 'Strength', 'Yoga', 'CrossFit', 'Cycling', 'HIIT', 'Boxing', 'Pilates']

const emptyForm = {
  day: 'Monday',
  time: '6:00 AM',
  className: '',
  trainer: '',
  category: 'Cardio',
  isActive: true,
}

const catColor: Record<string, string> = {
  Cardio: '#ef4444',
  Strength: '#FF6B00',
  Yoga: '#a855f7',
  CrossFit: '#3b82f6',
  Cycling: '#22c55e',
  HIIT: '#eab308',
  Boxing: '#f97316',
  Pilates: '#ec4899',
}

export default function ScheduleAdminPage() {
  const [schedule, setSchedule] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState(emptyForm)
  const [activeDay, setActiveDay] = useState('Monday')

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/schedule')
    const data = await res.json()
    setSchedule(data.schedule || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  function openAdd() {
    setEditing(null)
    setForm({ ...emptyForm, day: activeDay })
    setShowModal(true)
  }

  function openEdit(cls: any) {
    setEditing(cls)
    setForm({
      day: cls.day,
      time: cls.time,
      className: cls.className,
      trainer: cls.trainer,
      category: cls.category,
      isActive: cls.isActive,
    })
    setShowModal(true)
  }

  async function handleSave() {
    if (editing) {
      await fetch('/api/admin/schedule', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editing._id, ...form }),
      })
    } else {
      await fetch('/api/admin/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
    }
    setShowModal(false)
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this class?')) return
    await fetch('/api/admin/schedule', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    load()
  }

  const filteredByDay = schedule.filter((s) => s.day === activeDay)
  const activeCount = schedule.filter((s) => s.isActive).length
  const hiddenCount = schedule.filter((s) => !s.isActive).length
  const categoriesCount = new Set(schedule.map((s) => s.category).filter(Boolean)).size

  const stats = [
    { label: 'Total Classes', value: schedule.length, icon: '◉', color: '#FF6B00' },
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
              Class Schedule
            </h1>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 8 }}>
              {schedule.length} class{schedule.length !== 1 ? 'es' : ''} total. Manage your weekly
              fitness schedule.
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
            + Add Class
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

      {/* Day Tabs */}
      <div
        style={{
          display: 'flex',
          gap: 6,
          marginBottom: 20,
          flexWrap: 'wrap',
          padding: '4px',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          clipPath:
            'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
        }}
      >
        {days.map((day) => {
          const dayCount = schedule.filter((s) => s.day === day).length
          const isActive = activeDay === day
          return (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,107,0,0.1)'
                  e.currentTarget.style.color = 'var(--accent-orange)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.4)'
                }
              }}
              style={{
                padding: '10px 16px',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                background: isActive ? 'var(--accent-orange)' : 'transparent',
                border: 'none',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.4)',
                transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
                clipPath:
                  'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {day.slice(0, 3)}
              {dayCount > 0 && (
                <span
                  style={{
                    fontSize: 9,
                    padding: '2px 6px',
                    background: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)',
                    borderRadius: 3,
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.4)',
                  }}
                >
                  {dayCount}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Schedule Container */}
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
            <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{activeDay}</span>
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
              {filteredByDay.length}
            </div>
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
            {filteredByDay.filter((c) => c.isActive).length} Active ·{' '}
            {filteredByDay.filter((c) => !c.isActive).length} Hidden
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
            Loading schedule...
          </div>
        ) : filteredByDay.length === 0 ? (
          <div
            style={{
              padding: 64,
              textAlign: 'center',
              color: 'rgba(255,255,255,0.25)',
              fontSize: 14,
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.3 }}>◉</div>
            <div style={{ marginBottom: 6 }}>No classes on {activeDay}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.15)' }}>
              Click &quot;+ Add Class&quot; to schedule one.
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {times.map((time, idx) => {
              const cls = filteredByDay.find((s) => s.time === time)
              if (!cls) return null
              return (
                <ClassCard
                  key={cls._id}
                  cls={cls}
                  index={idx}
                  onEdit={() => openEdit(cls)}
                  onDelete={() => handleDelete(cls._id)}
                />
              )
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <ScheduleModal
          editing={editing}
          form={form}
          setForm={setForm}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Responsive + Animation Styles */}
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

/* ─── Class Card ─── */
function ClassCard({
  cls,
  index,
  onEdit,
  onDelete,
}: {
  cls: any
  index: number
  onEdit: () => void
  onDelete: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const color = catColor[cls.category] || '#FF6B00'

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="class-card"
      style={{
        display: 'grid',
        gridTemplateColumns: '90px 1fr auto',
        gap: 20,
        alignItems: 'center',
        padding: '18px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        background: hovered ? 'rgba(255,107,0,0.03)' : 'transparent',
        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
        animation: `fadeIn 0.4s ease ${index * 0.05}s both`,
        position: 'relative',
        overflow: 'hidden',
        opacity: cls.isActive ? 1 : 0.5,
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
          background: color,
          transform: hovered ? 'scaleY(1)' : 'scaleY(0)',
          transformOrigin: 'top',
          transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
        }}
      />

      {/* Time */}
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: 'rgba(255,255,255,0.4)',
          letterSpacing: '0.08em',
          padding: '8px 12px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          textAlign: 'center',
          clipPath:
            'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
        }}
      >
        {cls.time}
      </div>

      {/* Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 0 }}>
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            flexShrink: 0,
            background: color,
            boxShadow: `0 0 10px ${color}80`,
            transition: 'all 0.3s ease',
            transform: hovered ? 'scale(1.2)' : 'scale(1)',
          }}
        />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: '#fff',
              marginBottom: 3,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {cls.className}
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>with {cls.trainer}</div>
        </div>
        <span
          style={{
            fontSize: 9,
            fontWeight: 700,
            padding: '4px 12px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            background: `${color}18`,
            color: color,
            border: `1px solid ${color}33`,
            flexShrink: 0,
            clipPath:
              'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
          }}
        >
          {cls.category}
        </span>
        {!cls.isActive && (
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              padding: '4px 10px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              background: 'rgba(239,68,68,0.12)',
              color: '#ef4444',
              border: '1px solid rgba(239,68,68,0.25)',
              flexShrink: 0,
            }}
          >
            Hidden
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="class-actions" style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
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
          ✕
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .class-card {
            grid-template-columns: 70px 1fr !important;
            gap: 12px !important;
          }
          .class-actions {
            grid-column: 1 / -1;
            justify-content: flex-start;
            padding-top: 10px;
            border-top: 1px solid rgba(255,255,255,0.04);
            margin-top: 4px;
          }
        }
      `}</style>
    </div>
  )
}

/* ─── Modal ─── */
function ScheduleModal({
  editing,
  form,
  setForm,
  onSave,
  onClose,
}: {
  editing: any
  form: typeof emptyForm
  setForm: React.Dispatch<React.SetStateAction<typeof emptyForm>>
  onSave: () => void
  onClose: () => void
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
              {editing ? 'Edit Class' : 'Add Class'}
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
          {/* Day & Time */}
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
              Day & Time
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <select
                value={form.day}
                onChange={(e) => setForm((f) => ({ ...f, day: e.target.value }))}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,107,0,0.4)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                }}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                {days.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <select
                value={form.time}
                onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,107,0,0.4)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                }}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                {times.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Class Name */}
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
              Class Name
            </label>
            <input
              type="text"
              placeholder="Cardio Blast"
              value={form.className}
              onChange={(e) => setForm((f) => ({ ...f, className: e.target.value }))}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,107,0,0.4)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
              }}
              style={inputStyle}
            />
          </div>

          {/* Trainer */}
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
              Trainer
            </label>
            <input
              type="text"
              placeholder="Ahmed R."
              value={form.trainer}
              onChange={(e) => setForm((f) => ({ ...f, trainer: e.target.value }))}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,107,0,0.4)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
              }}
              style={inputStyle}
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

          {/* Category Preview */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 14px',
              background: `${catColor[form.category] || '#FF6B00'}08`,
              border: `1px solid ${catColor[form.category] || '#FF6B00'}20`,
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: catColor[form.category] || '#FF6B00',
                boxShadow: `0 0 8px ${catColor[form.category] || '#FF6B00'}60`,
              }}
            />
            <span
              style={{
                fontSize: 12,
                color: catColor[form.category] || '#FF6B00',
                fontWeight: 600,
              }}
            >
              {form.category}
            </span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginLeft: 'auto' }}>
              Preview
            </span>
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
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#e05e00'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--accent-orange)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
              style={{
                flex: 1,
                background: 'var(--accent-orange)',
                border: 'none',
                color: '#fff',
                padding: '14px',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                clipPath:
                  'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))',
                transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              {editing ? 'Save Changes' : 'Add Class'}
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
