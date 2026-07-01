'use client'
import { useEffect, useState, useMemo, useCallback } from 'react'
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Search,
  Plus,
  RefreshCw,
  Edit3,
  Trash2,
  X,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  FileText,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  DollarSign,
} from 'lucide-react'

/* ─── Types ─── */
type CustomerStatus = 'active' | 'expired' | 'cancelled'

type Customer = {
  _id: string
  name: string
  email: string
  phone: string
  plan: string
  startDate: string
  endDate: string
  status: CustomerStatus
  totalPaid: number
  notes?: string
  createdAt?: string
}

type FormData = {
  name: string
  email: string
  phone: string
  plan: string
  startDate: string
  endDate: string
  status: string
  totalPaid: number
  notes: string
}

const emptyForm: FormData = {
  name: '',
  email: '',
  phone: '',
  plan: 'Monthly',
  startDate: '',
  endDate: '',
  status: 'active',
  totalPaid: 0,
  notes: '',
}

/* ─── Status metadata ─── */
const statusMeta: Record<CustomerStatus, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  active: {
    label: 'Active',
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.12)',
    border: 'rgba(34,197,94,0.25)',
    icon: <UserCheck size={12} />,
  },
  expired: {
    label: 'Expired',
    color: '#eab308',
    bg: 'rgba(234,179,8,0.12)',
    border: 'rgba(234,179,8,0.25)',
    icon: <Clock size={12} />,
  },
  cancelled: {
    label: 'Cancelled',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.12)',
    border: 'rgba(239,68,68,0.25)',
    icon: <UserX size={12} />,
  },
}

/* ─── Helpers ─── */
function formatDate(value?: string | null): string {
  if (!value) return '—'
  return new Intl.DateTimeFormat('en-PK', { dateStyle: 'medium' }).format(new Date(value))
}

function formatCurrency(amount: number): string {
  return '₨' + amount.toLocaleString()
}

function getStatus(status?: string): CustomerStatus {
  if (status === 'active' || status === 'expired' || status === 'cancelled') return status
  return 'active'
}

/* ─── Demo data for standalone mode ─── */
const DEMO_CUSTOMERS: Customer[] = [
  {
    _id: '1',
    name: 'Ahmed Khan',
    email: 'ahmed.khan@gmail.com',
    phone: '+92 300 1234567',
    plan: 'Annual',
    startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 275 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    totalPaid: 36000,
    notes: 'VIP member, personal training included',
  },
  {
    _id: '2',
    name: 'Sara Ali',
    email: 'sara.ali@outlook.com',
    phone: '+92 321 9876543',
    plan: 'Monthly',
    startDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'expired',
    totalPaid: 3500,
  },
  {
    _id: '3',
    name: 'Hassan Raza',
    email: 'hassan.raza@yahoo.com',
    phone: '+92 333 5551234',
    plan: 'Quarterly',
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    totalPaid: 9500,
    notes: 'Referred by Ahmed Khan',
  },
  {
    _id: '4',
    name: 'Fatima Zahra',
    email: 'fatima.z@gmail.com',
    phone: '+92 345 6789012',
    plan: 'Monthly',
    startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'cancelled',
    totalPaid: 3500,
    notes: 'Relocated to another city',
  },
  {
    _id: '5',
    name: 'Omar Farooq',
    email: 'omar.farooq@hotmail.com',
    phone: '+92 312 3456789',
    plan: 'Annual',
    startDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 185 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    totalPaid: 36000,
  },
  {
    _id: '6',
    name: 'Ayesha Siddiqui',
    email: 'ayesha.s@gmail.com',
    phone: '+92 300 9871234',
    plan: 'Quarterly',
    startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 80 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    totalPaid: 9500,
  },
]

/* ─────────────────────────────────────────────── */
/* ─── MAIN COMPONENT ─── */
/* ─────────────────────────────────────────────── */
export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Customer | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | CustomerStatus>('all')
  const [refreshSpin, setRefreshSpin] = useState(false)
  const [notice, setNotice] = useState('')
  const [noticeType, setNoticeType] = useState<'success' | 'error'>('success')
  const [saving, setSaving] = useState(false)

  const showNotice = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setNotice(msg)
    setNoticeType(type)
    setTimeout(() => setNotice(''), 4000)
  }, [])

  /* ─── Load customers ─── */
  const load = useCallback(async () => {
    setLoading(true)
    setRefreshSpin(true)

    try {
      const res = await fetch('/api/admin/customers')
      const data = await res.json()
      setCustomers(data.customers || [])
    } catch {
      // Fallback to demo data if API is not available
      setCustomers(DEMO_CUSTOMERS)
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

  function openEdit(c: Customer) {
    setEditing(c)
    setForm({
      name: c.name,
      email: c.email,
      phone: c.phone,
      plan: c.plan,
      startDate: c.startDate?.slice(0, 10) || '',
      endDate: c.endDate?.slice(0, 10) || '',
      status: c.status,
      totalPaid: c.totalPaid,
      notes: c.notes || '',
    })
    setShowModal(true)
  }

  async function handleSave() {
    if (!form.name.trim() || !form.email.trim()) {
      showNotice('Name and email are required.', 'error')
      return
    }

    setSaving(true)

    try {
      if (editing) {
        const res = await fetch('/api/admin/customers', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editing._id, ...form }),
        })
        if (!res.ok) throw new Error('Failed to update')
        showNotice('Customer updated successfully.', 'success')
      } else {
        const res = await fetch('/api/admin/customers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (!res.ok) throw new Error('Failed to create')
        showNotice('Customer added successfully.', 'success')
      }
      setShowModal(false)
      load()
    } catch {
      // Demo mode fallback
      if (editing) {
        setCustomers(prev =>
          prev.map(c =>
            c._id === editing._id ? { ...c, ...form, status: form.status as CustomerStatus } : c
          )
        )
        showNotice('Customer updated (demo mode).', 'success')
      } else {
        const newCustomer: Customer = {
          _id: Date.now().toString(),
          ...form,
          status: form.status as CustomerStatus,
          createdAt: new Date().toISOString(),
        }
        setCustomers(prev => [newCustomer, ...prev])
        showNotice('Customer added (demo mode).', 'success')
      }
      setShowModal(false)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this customer?')) return

    try {
      const res = await fetch('/api/admin/customers', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error('Failed to delete')
    } catch {
      // Demo mode — continue with local delete
    }

    setCustomers(prev => prev.filter(c => c._id !== id))
    showNotice('Customer deleted.', 'success')
  }

  /* ─── Filtered data ─── */
  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase()
    return customers.filter(c => {
      const matchSearch =
        !needle ||
        c.name.toLowerCase().includes(needle) ||
        c.email.toLowerCase().includes(needle) ||
        c.phone.toLowerCase().includes(needle)
      const matchFilter = filter === 'all' || c.status === filter
      return matchSearch && matchFilter
    })
  }, [customers, search, filter])

  /* ─── Stats ─── */
  const activeCount = customers.filter(c => c.status === 'active').length
  const expiredCount = customers.filter(c => c.status === 'expired').length
  const cancelledCount = customers.filter(c => c.status === 'cancelled').length
  const totalRevenue = customers.reduce((sum, c) => sum + (c.totalPaid || 0), 0)

  const stats = [
    { label: 'Total Members', value: customers.length, icon: <Users size={18} />, color: '#3b82f6' },
    { label: 'Active', value: activeCount, icon: <UserCheck size={18} />, color: '#22c55e' },
    { label: 'Expired', value: expiredCount, icon: <Clock size={18} />, color: '#eab308' },
    { label: 'Cancelled', value: cancelledCount, icon: <UserX size={18} />, color: '#ef4444' },
    { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: <DollarSign size={18} />, color: '#FF6B00' },
  ]

  /* ─── Filter buttons ─── */
  const filters: Array<{ value: 'all' | CustomerStatus; label: string; count: number; color: string }> = [
    { value: 'all', label: 'All', count: customers.length, color: '#3b82f6' },
    { value: 'active', label: 'Active', count: activeCount, color: '#22c55e' },
    { value: 'expired', label: 'Expired', count: expiredCount, color: '#eab308' },
    { value: 'cancelled', label: 'Cancelled', count: cancelledCount, color: '#ef4444' },
  ]

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="mx-auto" style={{ padding: 'clamp(20px, 4vw, 48px)', maxWidth: 1600 }}>
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
                Customers
              </h1>
              <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
                Manage gym memberships, track payments, and monitor member status.
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
          className="customers-stats-grid animate-fade-in-up delay-1"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 14,
            marginBottom: 24,
          }}
        >
          {stats.map((s, i) => (
            <StatCard key={s.label} stat={s} loading={loading} index={i} />
          ))}
        </div>

        {/* ─── Filters & Search ─── */}
        <div
          className="animate-fade-in-up delay-2"
          style={{
            display: 'flex',
            gap: 12,
            marginBottom: 20,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          {/* Search */}
          <div
            className="search-input-wrap"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 4,
              padding: '0 14px',
              height: 44,
              minWidth: 280,
              flex: '1 1 280px',
              maxWidth: 360,
              transition: 'border-color 0.3s ease',
            }}
          >
            <Search size={15} style={{ color: 'rgba(255,255,255,0.35)', flexShrink: 0 }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email, or phone..."
              style={{
                flex: 1,
                height: '100%',
                background: 'transparent',
                border: 0,
                outline: 'none',
                color: '#fff',
                fontSize: 13,
                fontFamily: "'Inter', sans-serif",
              }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'rgba(255,255,255,0.4)',
                  padding: 2,
                  display: 'flex',
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter buttons */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {filters.map(item => (
              <FilterButton
                key={item.value}
                item={item}
                active={filter === item.value}
                onClick={() => setFilter(item.value)}
              />
            ))}
          </div>
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

        {/* ─── Table ─── */}
        <div
          className="animate-fade-in-up delay-3"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            overflow: 'hidden',
            clipPath:
              'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
          }}
        >
          {/* Accent line */}
          <div
            style={{
              height: 2,
              background: 'linear-gradient(90deg, var(--accent-orange), #ff9500)',
            }}
          />

          {loading ? (
            <div style={{ padding: 24 }}>
              {[1, 2, 3, 4, 5].map(i => (
                <SkeletonRow key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState search={search} />
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
                <thead>
                  <tr
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                      background: 'rgba(255,255,255,0.02)',
                    }}
                  >
                    {['Member', 'Contact', 'Plan', 'Duration', 'Paid', 'Status', 'Actions'].map(h => (
                      <th
                        key={h}
                        style={{
                          padding: '14px 20px',
                          textAlign: 'left',
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: '0.15em',
                          textTransform: 'uppercase',
                          color: 'rgba(255,255,255,0.3)',
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c, idx) => (
                    <CustomerRow
                      key={c._id}
                      customer={c}
                      index={idx}
                      onEdit={() => openEdit(c)}
                      onDelete={() => handleDelete(c._id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer count */}
          <div
            style={{
              padding: '12px 20px',
              borderTop: '1px solid rgba(255,255,255,0.05)',
              fontSize: 11,
              color: 'rgba(255,255,255,0.3)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>
              Showing {filtered.length} of {customers.length} member{customers.length !== 1 ? 's' : ''}
            </span>
            <span style={{ color: 'var(--accent-orange)' }}>
              Total Revenue: {formatCurrency(totalRevenue)}
            </span>
          </div>
        </div>
      </div>

      {/* ─── Modal ─── */}
      {showModal && (
        <CustomerModal
          editing={editing}
          form={form}
          setForm={setForm}
          saving={saving}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* ─── Responsive styles ─── */}
      <style>{`
        .customers-stats-grid {
          grid-template-columns: repeat(5, 1fr) !important;
        }
        @media (max-width: 1200px) {
          .customers-stats-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .customers-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 500px) {
          .customers-stats-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .search-input-wrap:focus-within {
          border-color: rgba(255, 107, 0, 0.4) !important;
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
      <Plus size={16} /> Add Member
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

/* ─── Filter Button ─── */
function FilterButton({
  item,
  active,
  onClick,
}: {
  item: { value: string; label: string; count: number; color: string }
  active: boolean
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: `1px solid ${active ? 'rgba(255,107,0,0.35)' : hovered ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.08)'}`,
        background: active ? 'rgba(255,107,0,0.12)' : hovered ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.03)',
        color: active ? '#FF6B00' : 'rgba(255,255,255,0.55)',
        borderRadius: 4,
        padding: '10px 16px',
        fontSize: 10,
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        transition: 'all 0.25s ease',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: item.color,
          opacity: active ? 1 : 0.5,
        }}
      />
      {item.label}
      <span
        style={{
          background: active ? 'rgba(255,107,0,0.2)' : 'rgba(255,255,255,0.06)',
          padding: '2px 7px',
          borderRadius: 3,
          fontSize: 9,
          fontWeight: 700,
        }}
      >
        {item.count}
      </span>
    </button>
  )
}

/* ─── Skeleton Row ─── */
function SkeletonRow() {
  return (
    <div
      style={{
        display: 'flex',
        gap: 20,
        padding: '16px 0',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      {[140, 180, 80, 120, 80, 70, 100].map((w, i) => (
        <div
          key={i}
          style={{
            height: 14,
            width: w,
            borderRadius: 4,
            background:
              'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  )
}

/* ─── Empty State ─── */
function EmptyState({ search }: { search: string }) {
  return (
    <div
      style={{
        padding: 60,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
        color: 'rgba(255,255,255,0.3)',
      }}
    >
      <Users size={40} strokeWidth={1} style={{ opacity: 0.4 }} />
      <span style={{ fontSize: 14 }}>
        {search ? 'No customers match your search.' : 'No customers found.'}
      </span>
      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
        {search ? 'Try a different search term.' : 'Add your first member to get started.'}
      </span>
    </div>
  )
}

/* ─── Customer Row ─── */
function CustomerRow({
  customer,
  index,
  onEdit,
  onDelete,
}: {
  customer: Customer
  index: number
  onEdit: () => void
  onDelete: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const status = getStatus(customer.status)
  const meta = statusMeta[status]

  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        background: hovered ? 'rgba(255,107,0,0.03)' : 'transparent',
        transition: 'background 0.2s ease',
        animation: `fadeInUp 0.35s cubic-bezier(0.16,1,0.3,1) ${index * 0.03}s both`,
      }}
    >
      {/* Member */}
      <td style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Avatar */}
          <div
            style={{
              width: 38,
              height: 38,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `${meta.color}15`,
              border: `1px solid ${meta.color}30`,
              fontSize: 14,
              fontWeight: 700,
              color: meta.color,
              textTransform: 'uppercase',
              clipPath:
                'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
              flexShrink: 0,
            }}
          >
            {customer.name.charAt(0)}
          </div>
          <div>
            <div style={{ fontSize: 14, color: '#fff', fontWeight: 500 }}>{customer.name}</div>
            {customer.notes && (
              <div
                style={{
                  fontSize: 10,
                  color: 'rgba(255,255,255,0.3)',
                  marginTop: 2,
                  maxWidth: 150,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {customer.notes}
              </div>
            )}
          </div>
        </div>
      </td>

      {/* Contact */}
      <td style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 3 }}>
          <Mail size={11} style={{ opacity: 0.6 }} />
          {customer.email}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
          <Phone size={11} style={{ opacity: 0.6 }} />
          {customer.phone || '—'}
        </div>
      </td>

      {/* Plan */}
      <td style={{ padding: '16px 20px' }}>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: 'var(--accent-orange)',
            background: 'rgba(255,107,0,0.1)',
            padding: '4px 10px',
            border: '1px solid rgba(255,107,0,0.2)',
            clipPath:
              'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          {customer.plan}
        </span>
      </td>

      {/* Duration */}
      <td style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 3 }}>
          <Calendar size={11} style={{ opacity: 0.6 }} />
          Start: {formatDate(customer.startDate)}
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', paddingLeft: 17 }}>
          End: {formatDate(customer.endDate)}
        </div>
      </td>

      {/* Paid */}
      <td style={{ padding: '16px 20px' }}>
        <span
          style={{
            fontSize: 14,
            color: 'var(--accent-orange)',
            fontWeight: 600,
            fontFamily: "'Bebas Neue', sans-serif",
            letterSpacing: '0.02em',
          }}
        >
          {formatCurrency(customer.totalPaid || 0)}
        </span>
      </td>

      {/* Status */}
      <td style={{ padding: '16px 20px' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '4px 10px',
            background: meta.bg,
            color: meta.color,
            border: `1px solid ${meta.border}`,
            clipPath:
              'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
          }}
        >
          {meta.icon}
          {meta.label}
        </span>
      </td>

      {/* Actions */}
      <td style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <ActionButton onClick={onEdit} variant="default">
            <Edit3 size={13} /> Edit
          </ActionButton>
          <ActionButton onClick={onDelete} variant="danger">
            <Trash2 size={13} />
          </ActionButton>
        </div>
      </td>
    </tr>
  )
}

/* ─── Action Button ─── */
function ActionButton({
  onClick,
  variant,
  children,
}: {
  onClick: () => void
  variant: 'default' | 'danger'
  children: React.ReactNode
}) {
  const [hovered, setHovered] = useState(false)

  const styles =
    variant === 'danger'
      ? {
          bg: hovered ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.08)',
          border: 'rgba(239,68,68,0.2)',
          color: hovered ? '#ef4444' : 'rgba(239,68,68,0.7)',
        }
      : {
          bg: hovered ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
          border: 'rgba(255,255,255,0.1)',
          color: hovered ? '#fff' : 'rgba(255,255,255,0.6)',
        }

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: styles.bg,
        border: `1px solid ${styles.border}`,
        color: styles.color,
        padding: '6px 12px',
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        borderRadius: 3,
        transition: 'all 0.2s ease',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {children}
    </button>
  )
}

/* ─── Customer Modal ─── */
function CustomerModal({
  editing,
  form,
  setForm,
  saving,
  onSave,
  onClose,
}: {
  editing: Customer | null
  form: FormData
  setForm: React.Dispatch<React.SetStateAction<FormData>>
  saving: boolean
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
    borderRadius: 4,
    outline: 'none',
    fontFamily: "'Inter', sans-serif",
    boxSizing: 'border-box',
    transition: 'border-color 0.3s ease',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 8,
  }

  const fields = [
    { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Ahmed Khan', icon: <Users size={14} /> },
    { key: 'email', label: 'Email', type: 'email', placeholder: 'ahmed@example.com', icon: <Mail size={14} /> },
    { key: 'phone', label: 'Phone', type: 'tel', placeholder: '+92 300 0000000', icon: <Phone size={14} /> },
    { key: 'totalPaid', label: 'Total Paid (₨)', type: 'number', placeholder: '3500', icon: <CreditCard size={14} /> },
    { key: 'startDate', label: 'Start Date', type: 'date', placeholder: '', icon: <Calendar size={14} /> },
    { key: 'endDate', label: 'End Date', type: 'date', placeholder: '', icon: <Calendar size={14} /> },
  ]

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
          maxWidth: 580,
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
              {editing ? 'Edit Member' : 'Add New Member'}
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
          {/* Two columns for some fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {fields.slice(0, 2).map(field => (
              <div key={field.key}>
                <label style={labelStyle}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {field.icon} {field.label}
                  </span>
                </label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={(form as any)[field.key]}
                  onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,107,0,0.4)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {fields.slice(2, 4).map(field => (
              <div key={field.key}>
                <label style={labelStyle}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {field.icon} {field.label}
                  </span>
                </label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={(form as any)[field.key]}
                  onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,107,0,0.4)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {fields.slice(4, 6).map(field => (
              <div key={field.key}>
                <label style={labelStyle}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {field.icon} {field.label}
                  </span>
                </label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={(form as any)[field.key]}
                  onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,107,0,0.4)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
              </div>
            ))}
          </div>

          {/* Plan & Status selects */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={labelStyle}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CreditCard size={14} /> Plan
                </span>
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={form.plan}
                  onChange={e => setForm(f => ({ ...f, plan: e.target.value }))}
                  style={{
                    ...inputStyle,
                    appearance: 'none',
                    paddingRight: 40,
                    cursor: 'pointer',
                  }}
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Annual">Annual</option>
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
            <div>
              <label style={labelStyle}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <UserCheck size={14} /> Status
                </span>
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  style={{
                    ...inputStyle,
                    appearance: 'none',
                    paddingRight: 40,
                    cursor: 'pointer',
                  }}
                >
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="cancelled">Cancelled</option>
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

          {/* Notes */}
          <div>
            <label style={labelStyle}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <FileText size={14} /> Notes
              </span>
            </label>
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={3}
              style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }}
              placeholder="Any notes about this member..."
              onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,107,0,0.4)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
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
          {isEdit ? 'Save Changes' : 'Add Member'}
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
