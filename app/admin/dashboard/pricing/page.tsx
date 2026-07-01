'use client'
import { useEffect, useState, useCallback } from 'react'
import {
  CreditCard,
  Tag,
  Star,
  Zap,
  Eye,
  EyeOff,
  Plus,
  RefreshCw,
  Edit3,
  Trash2,
  X,
  Check,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  Calendar,
  Sparkles,
  Crown,
  Grip,
} from 'lucide-react'

/* ─── Types ─── */
type Plan = {
  _id: string
  name: string
  price: number
  period: string
  tag?: string
  featured: boolean
  features: string[]
  isActive: boolean
  createdAt?: string
}

type FormData = {
  name: string
  price: number
  period: string
  tag: string
  featured: boolean
  features: string[]
  isActive: boolean
}

const emptyForm: FormData = {
  name: '',
  price: 0,
  period: 'month',
  tag: '',
  featured: false,
  features: [''],
  isActive: true,
}

/* ─── Helpers ─── */
function formatCurrency(amount: number): string {
  return '₨' + amount.toLocaleString()
}

/* ─── Demo data for standalone mode ─── */
const DEMO_PLANS: Plan[] = [
  {
    _id: '1',
    name: 'Monthly',
    price: 3500,
    period: 'month',
    tag: 'Starter',
    featured: false,
    features: [
      'Full gym access',
      'Locker room access',
      'Free WiFi',
      'Basic fitness assessment',
    ],
    isActive: true,
  },
  {
    _id: '2',
    name: 'Quarterly',
    price: 9500,
    period: 'quarter',
    tag: 'Most Popular',
    featured: true,
    features: [
      'Full gym access',
      'Locker room access',
      'Free WiFi',
      'Personal trainer (2 sessions)',
      'Nutrition consultation',
      'Guest passes (2/month)',
    ],
    isActive: true,
  },
  {
    _id: '3',
    name: 'Annual',
    price: 36000,
    period: 'year',
    tag: 'Best Value',
    featured: false,
    features: [
      'Full gym access',
      'Locker room access',
      'Free WiFi',
      'Personal trainer (8 sessions)',
      'Nutrition consultation',
      'Guest passes (4/month)',
      'Free merchandise',
      'Priority booking',
    ],
    isActive: true,
  },
  {
    _id: '4',
    name: 'Student',
    price: 2500,
    period: 'month',
    tag: 'Student Special',
    featured: false,
    features: [
      'Full gym access',
      'Locker room access',
      'Free WiFi',
      'Valid student ID required',
    ],
    isActive: false,
  },
]

/* ─────────────────────────────────────────────── */
/* ─── MAIN COMPONENT ─── */
/* ─────────────────────────────────────────────── */
export default function PricingPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Plan | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm)
  const [refreshSpin, setRefreshSpin] = useState(false)
  const [notice, setNotice] = useState('')
  const [noticeType, setNoticeType] = useState<'success' | 'error'>('success')
  const [saving, setSaving] = useState(false)

  const showNotice = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setNotice(msg)
    setNoticeType(type)
    setTimeout(() => setNotice(''), 4000)
  }, [])

  /* ─── Load plans ─── */
  const load = useCallback(async () => {
    setLoading(true)
    setRefreshSpin(true)

    try {
      const res = await fetch('/api/admin/plans')
      const data = await res.json()
      setPlans(data.plans || [])
    } catch {
      // Fallback to demo data if API is not available
      setPlans(DEMO_PLANS)
    } finally {
      setLoading(false)
      setTimeout(() => setRefreshSpin(false), 600)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  /* ─── Modal handlers ─── */
  function openAdd() {
    setEditing(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  function openEdit(p: Plan) {
    setEditing(p)
    setForm({
      name: p.name,
      price: p.price,
      period: p.period,
      tag: p.tag || '',
      featured: p.featured,
      features: p.features.length > 0 ? p.features : [''],
      isActive: p.isActive,
    })
    setShowModal(true)
  }

  async function handleSave() {
    if (!form.name.trim()) {
      showNotice('Plan name is required.', 'error')
      return
    }

    // Filter out empty features
    const cleanedFeatures = form.features.filter(f => f.trim() !== '')

    setSaving(true)

    try {
      if (editing) {
        const res = await fetch('/api/admin/plans', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editing._id, ...form, features: cleanedFeatures }),
        })
        if (!res.ok) throw new Error('Failed to update')
        showNotice('Plan updated successfully.', 'success')
      } else {
        const res = await fetch('/api/admin/plans', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, features: cleanedFeatures }),
        })
        if (!res.ok) throw new Error('Failed to create')
        showNotice('Plan created successfully.', 'success')
      }
      setShowModal(false)
      load()
    } catch {
      // Demo mode fallback
      if (editing) {
        setPlans(prev =>
          prev.map(p =>
            p._id === editing._id ? { ...p, ...form, features: cleanedFeatures } : p
          )
        )
        showNotice('Plan updated (demo mode).', 'success')
      } else {
        const newPlan: Plan = {
          _id: Date.now().toString(),
          ...form,
          features: cleanedFeatures,
          createdAt: new Date().toISOString(),
        }
        setPlans(prev => [...prev, newPlan])
        showNotice('Plan created (demo mode).', 'success')
      }
      setShowModal(false)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this plan?')) return

    try {
      const res = await fetch('/api/admin/plans', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error('Failed to delete')
    } catch {
      // Demo mode — continue with local delete
    }

    setPlans(prev => prev.filter(p => p._id !== id))
    showNotice('Plan deleted.', 'success')
  }

  async function toggleActive(plan: Plan) {
    const newStatus = !plan.isActive

    try {
      await fetch('/api/admin/plans', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: plan._id, isActive: newStatus }),
      })
    } catch {
      // Demo mode fallback
    }

    setPlans(prev =>
      prev.map(p => (p._id === plan._id ? { ...p, isActive: newStatus } : p))
    )
    showNotice(newStatus ? 'Plan is now live.' : 'Plan is now hidden.', 'success')
  }

  /* ─── Feature handlers ─── */
  function updateFeature(i: number, val: string) {
    const arr = [...form.features]
    arr[i] = val
    setForm(f => ({ ...f, features: arr }))
  }

  function addFeature() {
    setForm(f => ({ ...f, features: [...f.features, ''] }))
  }

  function removeFeature(i: number) {
    setForm(f => ({ ...f, features: f.features.filter((_, idx) => idx !== i) }))
  }

  /* ─── Stats ─── */
  const activePlans = plans.filter(p => p.isActive).length
  const featuredPlans = plans.filter(p => p.featured).length
  const avgPrice = plans.length > 0 ? Math.round(plans.reduce((sum, p) => sum + p.price, 0) / plans.length) : 0

  const stats = [
    { label: 'Total Plans', value: plans.length, icon: <CreditCard size={18} />, color: '#3b82f6' },
    { label: 'Active Plans', value: activePlans, icon: <Eye size={18} />, color: '#22c55e' },
    { label: 'Featured', value: featuredPlans, icon: <Star size={18} />, color: '#FF6B00' },
    { label: 'Avg. Price', value: formatCurrency(avgPrice), icon: <DollarSign size={18} />, color: '#a855f7' },
  ]

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="mx-auto" style={{ padding: 'clamp(20px, 4vw, 48px)', maxWidth: 1500 }}>
        {/* ─── Header ─── */}
        <div className="animate-fade-in-up" style={{ marginBottom: 28 }}>
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
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              gap: 18,
              flexWrap: 'wrap',
            }}
          >
            <div>
              <h1
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 'clamp(32px, 5vw, 48px)',
                  color: '#fff',
                  letterSpacing: '0.05em',
                  margin: '0 0 4px',
                  lineHeight: 1,
                }}
              >
                Pricing Plans
              </h1>
              <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
                Manage membership plans, pricing tiers, and featured offerings.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <RefreshButton onClick={load} spinning={refreshSpin} />
              <AddButton onClick={openAdd} />
            </div>
          </div>
        </div>

        {/* ─── Stats Cards ─── */}
        <div
          className="pricing-stats-grid animate-fade-in-up delay-1"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 14,
            marginBottom: 24,
          }}
        >
          {stats.map((s, i) => (
            <StatCard key={s.label} stat={s} loading={loading} index={i} />
          ))}
        </div>

        {/* ─── Notice ─── */}
        {notice && (
          <div
            className="animate-fade-in-up"
            style={{
              marginBottom: 16,
              padding: '12px 16px',
              border: `1px solid ${noticeType === 'success' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
              background: noticeType === 'success' ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
              color: noticeType === 'success' ? '#86efac' : '#fca5a5',
              fontSize: 13,
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            {noticeType === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {notice}
          </div>
        )}

        {/* ─── Plans Grid ─── */}
        <div
          className="pricing-plans-grid animate-fade-in-up delay-2"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 20,
          }}
        >
          {loading ? (
            <>
              {[1, 2, 3].map(i => (
                <SkeletonCard key={i} />
              ))}
            </>
          ) : plans.length === 0 ? (
            <EmptyState onAdd={openAdd} />
          ) : (
            plans.map((plan, idx) => (
              <PlanCard
                key={plan._id}
                plan={plan}
                index={idx}
                onEdit={() => openEdit(plan)}
                onDelete={() => handleDelete(plan._id)}
                onToggleActive={() => toggleActive(plan)}
              />
            ))
          )}
        </div>
      </div>

      {/* ─── Modal ─── */}
      {showModal && (
        <PlanModal
          editing={editing}
          form={form}
          setForm={setForm}
          saving={saving}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
          updateFeature={updateFeature}
          addFeature={addFeature}
          removeFeature={removeFeature}
        />
      )}

      {/* ─── Responsive styles ─── */}
      <style>{`
        .pricing-stats-grid {
          grid-template-columns: repeat(4, 1fr) !important;
        }
        @media (max-width: 1024px) {
          .pricing-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 500px) {
          .pricing-stats-grid {
            grid-template-columns: 1fr !important;
          }
          .pricing-plans-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}

/* ─────────────────────────────────────────────── */
/* ─── SUB-COMPONENTS ─── */
/* ─────────────────────────────────────────────── */

/* ─── Refresh Button ─── */
function RefreshButton({ onClick, spinning }: { onClick: () => void; spinning: boolean }) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        height: 44,
        width: 44,
        border: `1px solid ${hovered ? 'rgba(255,107,0,0.3)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 0,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: hovered ? '#FF6B00' : 'rgba(255,255,255,0.6)',
        cursor: 'pointer',
        background: hovered ? 'rgba(255,107,0,0.06)' : 'rgba(255,255,255,0.03)',
        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
        clipPath:
          'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
      }}
    >
      <RefreshCw
        size={16}
        style={{
          transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)',
          transform: spinning ? 'rotate(360deg)' : 'rotate(0)',
        }}
      />
    </button>
  )
}

/* ─── Add Button ─── */
function AddButton({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        height: 44,
        border: 0,
        padding: '0 22px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        color: '#fff',
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        background: hovered ? '#ff8c33' : '#FF6B00',
        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hovered ? '0 6px 20px rgba(255,107,0,0.35)' : 'none',
        clipPath:
          'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Plus size={16} /> Add Plan
    </button>
  )
}

/* ─── Stat Card ─── */
function StatCard({
  stat,
  loading,
  index,
}: {
  stat: { label: string; value: string | number; icon: React.ReactNode; color: string }
  loading: boolean
  index: number
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(255,107,0,0.04)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${hovered ? 'rgba(255,107,0,0.2)' : 'rgba(255,255,255,0.06)'}`,
        padding: 'clamp(14px, 2vw, 20px)',
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        cursor: 'default',
        clipPath:
          'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
        position: 'relative',
        overflow: 'hidden',
        animation: `fadeInUp 0.4s cubic-bezier(0.16,1,0.3,1) ${index * 0.05}s both`,
      }}
    >
      {/* Top accent line */}
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
          marginBottom: 12,
        }}
      >
        <span
          style={{
            fontSize: 9,
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
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `${stat.color}15`,
            border: `1px solid ${stat.color}30`,
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
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(24px, 3vw, 36px)',
          color: '#fff',
          lineHeight: 1,
        }}
      >
        {loading ? (
          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>...</span>
        ) : (
          stat.value
        )}
      </div>
    </div>
  )
}

/* ─── Skeleton Card ─── */
function SkeletonCard() {
  return (
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
          background:
            'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
        }}
      />
      <div style={{ padding: 24 }}>
        <div
          style={{
            height: 24,
            width: '50%',
            borderRadius: 4,
            background:
              'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            marginBottom: 8,
          }}
        />
        <div
          style={{
            height: 36,
            width: '40%',
            borderRadius: 4,
            background:
              'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            animationDelay: '0.2s',
            marginBottom: 20,
          }}
        />
        {[1, 2, 3].map(i => (
          <div
            key={i}
            style={{
              height: 12,
              width: `${70 + i * 5}%`,
              borderRadius: 4,
              background:
                'linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
              animationDelay: `${i * 0.1}s`,
              marginBottom: 8,
            }}
          />
        ))}
      </div>
    </div>
  )
}

/* ─── Empty State ─── */
function EmptyState({ onAdd }: { onAdd: () => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{
        gridColumn: '1 / -1',
        background: 'rgba(255,255,255,0.02)',
        border: '1px dashed rgba(255,255,255,0.1)',
        padding: 60,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        clipPath:
          'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255,107,0,0.1)',
          border: '1px solid rgba(255,107,0,0.2)',
          clipPath:
            'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
        }}
      >
        <CreditCard size={28} style={{ color: '#FF6B00', opacity: 0.6 }} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>
          No pricing plans yet
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
          Create your first plan to start attracting members.
        </div>
      </div>
      <button
        onClick={onAdd}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          marginTop: 8,
          height: 44,
          border: 0,
          padding: '0 24px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          color: '#fff',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          background: hovered ? '#ff8c33' : '#FF6B00',
          transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
          transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
          clipPath:
            'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <Plus size={16} /> Create First Plan
      </button>
    </div>
  )
}

/* ─── Plan Card ─── */
function PlanCard({
  plan,
  index,
  onEdit,
  onDelete,
  onToggleActive,
}: {
  plan: Plan
  index: number
  onEdit: () => void
  onDelete: () => void
  onToggleActive: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(255,107,0,0.03)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${plan.featured ? 'rgba(255,107,0,0.3)' : hovered ? 'rgba(255,107,0,0.15)' : 'rgba(255,255,255,0.06)'}`,
        overflow: 'hidden',
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered ? '0 12px 40px rgba(0,0,0,0.3)' : 'none',
        clipPath:
          'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
        position: 'relative',
        opacity: plan.isActive ? 1 : 0.6,
        animation: `fadeInUp 0.4s cubic-bezier(0.16,1,0.3,1) ${index * 0.08}s both`,
      }}
    >
      {/* Top accent line */}
      <div
        style={{
          height: 2,
          background: plan.featured
            ? 'linear-gradient(90deg, var(--accent-orange), #ff9500)'
            : hovered
              ? 'linear-gradient(90deg, rgba(255,107,0,0.5), rgba(255,107,0,0.3))'
              : 'rgba(255,255,255,0.06)',
          transition: 'all 0.3s ease',
        }}
      />

      {/* Featured badge */}
      {plan.featured && (
        <div
          style={{
            position: 'absolute',
            top: 14,
            right: -30,
            background: 'var(--accent-orange)',
            color: '#fff',
            fontSize: 8,
            fontWeight: 800,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '4px 36px',
            transform: 'rotate(45deg)',
            boxShadow: '0 2px 8px rgba(255,107,0,0.4)',
          }}
        >
          Featured
        </div>
      )}

      <div style={{ padding: 24 }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: plan.featured ? 'rgba(255,107,0,0.15)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${plan.featured ? 'rgba(255,107,0,0.3)' : 'rgba(255,255,255,0.1)'}`,
                  clipPath:
                    'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
                  transition: 'all 0.3s ease',
                  transform: hovered ? 'rotate(-3deg)' : 'rotate(0)',
                }}
              >
                {plan.featured ? (
                  <Crown size={18} style={{ color: '#FF6B00' }} />
                ) : (
                  <CreditCard size={18} style={{ color: 'rgba(255,255,255,0.5)' }} />
                )}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: 26,
                    color: '#fff',
                    letterSpacing: '0.05em',
                    lineHeight: 1,
                  }}
                >
                  {plan.name}
                </div>
              </div>
            </div>
            {plan.tag && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: plan.featured ? '#FF6B00' : 'rgba(255,255,255,0.4)',
                  marginLeft: 46,
                }}
              >
                <Tag size={10} />
                {plan.tag}
              </div>
            )}
          </div>

          {/* Price */}
          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 36,
                color: plan.featured ? 'var(--accent-orange)' : '#fff',
                lineHeight: 1,
                transition: 'all 0.3s ease',
                transform: hovered ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              {formatCurrency(plan.price)}
            </div>
            <div
              style={{
                fontSize: 10,
                color: 'rgba(255,255,255,0.3)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 4,
              }}
            >
              <Calendar size={10} />
              per {plan.period}
            </div>
          </div>
        </div>

        {/* Features */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {plan.features.slice(0, 4).map((f, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                animation: `fadeInUp 0.3s ease ${0.1 + i * 0.05}s both`,
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: plan.featured ? 'rgba(255,107,0,0.1)' : 'rgba(255,255,255,0.04)',
                  borderRadius: 4,
                  flexShrink: 0,
                }}
              >
                <Check size={10} style={{ color: plan.featured ? '#FF6B00' : 'rgba(255,255,255,0.4)' }} />
              </div>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>
                {f}
              </span>
            </div>
          ))}
          {plan.features.length > 4 && (
            <div
              style={{
                fontSize: 11,
                color: 'rgba(255,107,0,0.7)',
                marginLeft: 28,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Sparkles size={11} />+{plan.features.length - 4} more features
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <ActionButton onClick={onEdit} variant="default" flex>
            <Edit3 size={13} /> Edit
          </ActionButton>
          <ActionButton onClick={onDelete} variant="danger">
            <Trash2 size={13} />
          </ActionButton>
          <ActionButton
            onClick={onToggleActive}
            variant={plan.isActive ? 'success' : 'muted'}
          >
            {plan.isActive ? <Eye size={13} /> : <EyeOff size={13} />}
          </ActionButton>
          <StatusBadge isActive={plan.isActive} />
        </div>
      </div>
    </div>
  )
}

/* ─── Action Button ─── */
function ActionButton({
  onClick,
  variant,
  flex,
  children,
}: {
  onClick: () => void
  variant: 'default' | 'danger' | 'success' | 'muted'
  flex?: boolean
  children: React.ReactNode
}) {
  const [hovered, setHovered] = useState(false)

  const styles = {
    default: {
      bg: hovered ? 'rgba(255,107,0,0.12)' : 'rgba(255,255,255,0.05)',
      border: hovered ? 'rgba(255,107,0,0.3)' : 'rgba(255,255,255,0.1)',
      color: hovered ? 'var(--accent-orange)' : 'rgba(255,255,255,0.6)',
    },
    danger: {
      bg: hovered ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.08)',
      border: 'rgba(239,68,68,0.2)',
      color: hovered ? '#ef4444' : 'rgba(239,68,68,0.7)',
    },
    success: {
      bg: hovered ? 'rgba(34,197,94,0.15)' : 'rgba(34,197,94,0.08)',
      border: 'rgba(34,197,94,0.2)',
      color: hovered ? '#22c55e' : 'rgba(34,197,94,0.7)',
    },
    muted: {
      bg: hovered ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
      border: 'rgba(255,255,255,0.1)',
      color: hovered ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.3)',
    },
  }

  const s = styles[variant]

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: flex ? 1 : undefined,
        background: s.bg,
        border: `1px solid ${s.border}`,
        color: s.color,
        padding: '9px 14px',
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        borderRadius: 3,
        transition: 'all 0.2s ease',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {children}
    </button>
  )
}

/* ─── Status Badge ─── */
function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      style={{
        fontSize: 9,
        fontWeight: 700,
        padding: '5px 10px',
        background: isActive ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
        color: isActive ? '#22c55e' : '#ef4444',
        border: `1px solid ${isActive ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        clipPath:
          'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: isActive ? '#22c55e' : '#ef4444',
          animation: isActive ? 'glow 2s ease infinite' : 'none',
        }}
      />
      {isActive ? 'Live' : 'Off'}
    </span>
  )
}

/* ─── Plan Modal ─── */
function PlanModal({
  editing,
  form,
  setForm,
  saving,
  onSave,
  onClose,
  updateFeature,
  addFeature,
  removeFeature,
}: {
  editing: Plan | null
  form: FormData
  setForm: React.Dispatch<React.SetStateAction<FormData>>
  saving: boolean
  onSave: () => void
  onClose: () => void
  updateFeature: (i: number, val: string) => void
  addFeature: () => void
  removeFeature: (i: number) => void
}) {
  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    padding: '12px 14px',
    fontSize: 13,
    borderRadius: 4,
    outline: 'none',
    fontFamily: "'Inter', sans-serif",
    boxSizing: 'border-box',
    transition: 'border-color 0.3s ease',
  }

  const labelStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 8,
  }

  return (
    <div
      className="animate-fade-in-up"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
      onClick={e => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="animate-scale-in"
        style={{
          background: '#0f0f0f',
          border: '1px solid rgba(255,107,0,0.2)',
          width: '100%',
          maxWidth: 560,
          maxHeight: '90vh',
          overflowY: 'auto',
          clipPath:
            'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
        }}
      >
        {/* Accent line */}
        <div
          style={{
            height: 2,
            background: 'linear-gradient(90deg, var(--accent-orange), #ff9500)',
          }}
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
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255,107,0,0.1)',
                border: '1px solid rgba(255,107,0,0.2)',
                color: '#FF6B00',
                clipPath:
                  'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
              }}
            >
              {editing ? <Edit3 size={18} /> : <Plus size={18} />}
            </div>
            <span
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 24,
                color: '#fff',
                letterSpacing: '0.05em',
              }}
            >
              {editing ? 'Edit Plan' : 'Create New Plan'}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.5)',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              borderRadius: 4,
              transition: 'all 0.2s ease',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Name & Tag */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={labelStyle}>
                <CreditCard size={12} /> Plan Name
              </label>
              <input
                type="text"
                placeholder="Monthly"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,107,0,0.4)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </div>
            <div>
              <label style={labelStyle}>
                <Tag size={12} /> Tag Line
              </label>
              <input
                type="text"
                placeholder="Best Value"
                value={form.tag}
                onChange={e => setForm(f => ({ ...f, tag: e.target.value }))}
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,107,0,0.4)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </div>
          </div>

          {/* Price & Period */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={labelStyle}>
                <DollarSign size={12} /> Price (₨)
              </label>
              <input
                type="number"
                placeholder="3500"
                value={form.price}
                onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,107,0,0.4)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </div>
            <div>
              <label style={labelStyle}>
                <Calendar size={12} /> Period
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={form.period}
                  onChange={e => setForm(f => ({ ...f, period: e.target.value }))}
                  style={{
                    ...inputStyle,
                    appearance: 'none',
                    paddingRight: 40,
                    cursor: 'pointer',
                  }}
                >
                  <option value="month">Month</option>
                  <option value="quarter">Quarter</option>
                  <option value="year">Year</option>
                  <option value="week">Week</option>
                </select>
                <ChevronDown
                  size={16}
                  style={{
                    position: 'absolute',
                    right: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'rgba(255,255,255,0.4)',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 12,
              }}
            >
              <label style={{ ...labelStyle, marginBottom: 0 }}>
                <Zap size={12} /> Features
              </label>
              <AddFeatureButton onClick={addFeature} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {form.features.map((f, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    gap: 8,
                    animation: `fadeInUp 0.2s ease ${i * 0.05}s both`,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 44,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'rgba(255,255,255,0.2)',
                      flexShrink: 0,
                    }}
                  >
                    <Grip size={14} />
                  </div>
                  <input
                    type="text"
                    value={f}
                    onChange={e => updateFeature(i, e.target.value)}
                    placeholder={`Feature ${i + 1}`}
                    style={{ ...inputStyle, flex: 1 }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,107,0,0.4)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                  />
                  <button
                    onClick={() => removeFeature(i)}
                    style={{
                      background: 'rgba(239,68,68,0.08)',
                      border: '1px solid rgba(239,68,68,0.2)',
                      color: '#ef4444',
                      width: 44,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      borderRadius: 4,
                      flexShrink: 0,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div
            style={{
              display: 'flex',
              gap: 20,
              padding: '16px 20px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 6,
            }}
          >
            <ToggleOption
              checked={form.featured}
              onChange={checked => setForm(f => ({ ...f, featured: checked }))}
              label="Featured Plan"
              icon={<Star size={14} />}
              color="#FF6B00"
            />
            <ToggleOption
              checked={form.isActive}
              onChange={checked => setForm(f => ({ ...f, isActive: checked }))}
              label="Active / Visible"
              icon={<Eye size={14} />}
              color="#22c55e"
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
            <SaveButton onClick={onSave} saving={saving} isEdit={!!editing} />
            <CancelButton onClick={onClose} />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Add Feature Button ─── */
function AddFeatureButton({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(255,107,0,0.15)' : 'rgba(255,107,0,0.1)',
        border: '1px solid rgba(255,107,0,0.2)',
        color: 'var(--accent-orange)',
        padding: '6px 14px',
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        borderRadius: 4,
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        transition: 'all 0.2s ease',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Plus size={12} /> Add
    </button>
  )
}

/* ─── Toggle Option ─── */
function ToggleOption({
  checked,
  onChange,
  label,
  icon,
  color,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  icon: React.ReactNode
  color: string
}) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        cursor: 'pointer',
        flex: 1,
      }}
    >
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 42,
          height: 24,
          borderRadius: 12,
          background: checked ? `${color}30` : 'rgba(255,255,255,0.08)',
          border: `1px solid ${checked ? `${color}50` : 'rgba(255,255,255,0.15)'}`,
          position: 'relative',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: checked ? color : 'rgba(255,255,255,0.3)',
            position: 'absolute',
            top: 2,
            left: checked ? 21 : 2,
            transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
            boxShadow: checked ? `0 2px 8px ${color}50` : 'none',
          }}
        />
      </div>
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 12,
          color: checked ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.5)',
          transition: 'color 0.2s ease',
        }}
      >
        <span style={{ color: checked ? color : 'rgba(255,255,255,0.4)', transition: 'color 0.2s ease' }}>
          {icon}
        </span>
        {label}
      </span>
    </label>
  )
}

/* ─── Save Button ─── */
function SaveButton({
  onClick,
  saving,
  isEdit,
}: {
  onClick: () => void
  saving: boolean
  isEdit: boolean
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      disabled={saving}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1,
        height: 48,
        border: 0,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        color: '#fff',
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        cursor: saving ? 'not-allowed' : 'pointer',
        background: hovered && !saving ? '#ff8c33' : '#FF6B00',
        opacity: saving ? 0.6 : 1,
        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
        transform: hovered && !saving ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hovered && !saving ? '0 6px 20px rgba(255,107,0,0.35)' : 'none',
        clipPath:
          'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {saving ? (
        <>
          <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} />
          Saving...
        </>
      ) : (
        <>
          <CheckCircle2 size={14} />
          {isEdit ? 'Save Changes' : 'Create Plan'}
        </>
      )}
    </button>
  )
}

/* ─── Cancel Button ─── */
function CancelButton({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
        color: hovered ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.5)',
        padding: '14px 28px',
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        borderRadius: 4,
        transition: 'all 0.25s ease',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      Cancel
    </button>
  )
}
