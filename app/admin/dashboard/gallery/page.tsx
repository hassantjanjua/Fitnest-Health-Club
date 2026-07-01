'use client'

import { useEffect, useState } from 'react'

const emptyForm = { url: '', caption: '', category: 'general', order: 0, isActive: true }

export default function GalleryPage() {
  const [images, setImages] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/gallery')
    const data = await res.json()
    setImages(data.images || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  function openAdd() {
    setEditing(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  function openEdit(img: any) {
    setEditing(img)
    setForm({
      url: img.url,
      caption: img.caption,
      category: img.category,
      order: img.order,
      isActive: img.isActive,
    })
    setShowModal(true)
  }

  async function handleSave() {
    if (editing) {
      await fetch('/api/admin/gallery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editing._id, ...form }),
      })
    } else {
      await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
    }
    setShowModal(false)
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this image?')) return
    await fetch('/api/admin/gallery', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    load()
  }

  const activeCount = images.filter((img) => img.isActive).length
  const hiddenCount = images.filter((img) => !img.isActive).length
  const categoriesCount = new Set(images.map((img) => img.category).filter(Boolean)).size

  const stats = [
    { label: 'Total Images', value: images.length, icon: '◧', color: '#FF6B00' },
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
              Gallery
            </h1>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 8 }}>
              {images.length} image{images.length !== 1 ? 's' : ''} in gallery. Manage your visual
              content here.
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
            + Add Image
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

      {/* Gallery Container */}
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
            <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>All Images</span>
            {images.length > 0 && (
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
                {images.length}
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
            Loading images...
          </div>
        ) : images.length === 0 ? (
          <div
            style={{
              padding: 64,
              textAlign: 'center',
              color: 'rgba(255,255,255,0.25)',
              fontSize: 14,
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.3 }}>◧</div>
            <div style={{ marginBottom: 6 }}>No images yet</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.15)' }}>
              Click &quot;+ Add Image&quot; to add gallery images.
            </div>
          </div>
        ) : (
          <div
            className="gallery-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: 0,
            }}
          >
            {images.map((img, i) => (
              <GalleryCard
                key={img._id}
                image={img}
                index={i}
                onEdit={() => openEdit(img)}
                onDelete={() => handleDelete(img._id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <GalleryModal
          editing={editing}
          form={form}
          setForm={setForm}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: 1fr !important; }
          .gallery-grid { grid-template-columns: 1fr !important; }
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

/* ─── Gallery Card ─── */
function GalleryCard({
  image: img,
  index,
  onEdit,
  onDelete,
}: {
  image: any
  index: number
  onEdit: () => void
  onDelete: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const [imgError, setImgError] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        borderRight: '1px solid rgba(255,255,255,0.04)',
        background: hovered ? 'rgba(255,107,0,0.03)' : 'transparent',
        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
        animation: `fadeIn 0.4s ease ${index * 0.03}s both`,
        position: 'relative',
        overflow: 'hidden',
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
          background: 'var(--accent-orange)',
          transform: hovered ? 'scaleY(1)' : 'scaleY(0)',
          transformOrigin: 'top',
          transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
          zIndex: 2,
        }}
      />

      {/* Image Preview */}
      <div
        style={{
          height: 160,
          background: 'rgba(255,255,255,0.03)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {img.url && !imgError ? (
          <img
            src={img.url}
            alt={img.caption}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s ease',
              transform: hovered ? 'scale(1.05)' : 'scale(1)',
            }}
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255,255,255,0.15)',
              fontSize: 40,
            }}
          >
            ◧
          </div>
        )}

        {/* Hidden overlay */}
        {!img.isActive && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(2px)',
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: '#ef4444',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                padding: '6px 12px',
                background: 'rgba(239,68,68,0.15)',
                border: '1px solid rgba(239,68,68,0.3)',
                clipPath:
                  'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
              }}
            >
              Hidden
            </span>
          </div>
        )}

        {/* Category badge */}
        <div
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            fontSize: 8,
            fontWeight: 700,
            color: 'var(--accent-orange)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            padding: '4px 8px',
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255,107,0,0.3)',
            clipPath:
              'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
          }}
        >
          {img.category}
        </div>

        {/* Order badge */}
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            fontSize: 10,
            fontWeight: 700,
            color: '#fff',
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '50%',
          }}
        >
          {img.order}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '14px 16px' }}>
        <div
          style={{
            fontSize: 13,
            color: 'rgba(255,255,255,0.7)',
            marginBottom: 12,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontWeight: 500,
          }}
        >
          {img.caption || 'No caption'}
        </div>

        {/* Actions */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            paddingTop: 10,
            borderTop: '1px solid rgba(255,255,255,0.04)',
          }}
        >
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
              flex: 1,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.6)',
              padding: '9px',
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
              padding: '9px 14px',
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
      </div>
    </div>
  )
}

/* ─── Modal ─── */
function GalleryModal({
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
  const [imgError, setImgError] = useState(false)

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
              {editing ? '✎' : '◧'}
            </div>
            <span
              style={{
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: 22,
                color: '#fff',
                letterSpacing: '0.05em',
              }}
            >
              {editing ? 'Edit Image' : 'Add Image'}
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
          {/* Image URL */}
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
              Image URL
            </label>
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={form.url}
              onChange={(e) => {
                setForm((f) => ({ ...f, url: e.target.value }))
                setImgError(false)
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,107,0,0.4)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
              }}
              style={inputStyle}
            />
            {form.url && !imgError && (
              <div
                style={{
                  marginTop: 12,
                  borderRadius: 0,
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.1)',
                  clipPath:
                    'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                }}
              >
                <img
                  src={form.url}
                  alt="Preview"
                  style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }}
                  onError={() => setImgError(true)}
                />
              </div>
            )}
            {imgError && (
              <div
                style={{
                  marginTop: 8,
                  padding: '8px 12px',
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  color: '#ef4444',
                  fontSize: 11,
                }}
              >
                Failed to load image preview
              </div>
            )}
          </div>

          {/* Caption */}
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
              Caption
            </label>
            <input
              type="text"
              placeholder="Weight training area"
              value={form.caption}
              onChange={(e) => setForm((f) => ({ ...f, caption: e.target.value }))}
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
              <option value="general">General</option>
              <option value="equipment">Equipment</option>
              <option value="classes">Classes</option>
              <option value="trainers">Trainers</option>
              <option value="events">Events</option>
            </select>
          </div>

          {/* Display Order */}
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
              Display Order
            </label>
            <input
              type="number"
              value={form.order}
              onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,107,0,0.4)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
              }}
              style={inputStyle}
            />
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
              {form.isActive ? 'Visible' : 'Hidden'}
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
              {editing ? 'Save Changes' : 'Add Image'}
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
