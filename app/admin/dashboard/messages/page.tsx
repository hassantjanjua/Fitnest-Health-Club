'use client'
import { useEffect, useMemo, useState, useCallback } from 'react'
import {
  CheckCircle2,
  Clock3,
  Mail,
  MessageSquareReply,
  Phone,
  RefreshCw,
  Search,
  Send,
  Trash2,
  Inbox,
  MessageCircle,
  MailCheck,
  MailX,
  ChevronRight,
  X,
} from 'lucide-react'

/* ─── Types ─── */
type MessageStatus = 'new' | 'replied'

type Message = {
  _id: string
  name: string
  email: string
  phone?: string
  message: string
  status?: string
  reply?: string
  repliedAt?: string | null
  createdAt: string
  updatedAt?: string
}

/* ─── Status metadata ─── */
const statusMeta: Record<MessageStatus, { label: string; color: string; bg: string; border: string }> = {
  new: {
    label: 'Not replied',
    color: '#FF6B00',
    bg: 'rgba(255,107,0,0.12)',
    border: 'rgba(255,107,0,0.34)',
  },
  replied: {
    label: 'Replied',
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.12)',
    border: 'rgba(34,197,94,0.32)',
  },
}

/* ─── Helpers ─── */
function formatDateTime(value?: string | null) {
  if (!value) return 'Not available'
  return new Intl.DateTimeFormat('en-PK', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function getMessageStatus(status?: string): MessageStatus {
  return status === 'replied' ? 'replied' : 'new'
}

function getStatusLabel(status?: string) {
  return statusMeta[getMessageStatus(status)].label
}

function getTimeAgo(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = now - then
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return formatDateTime(dateStr)
}

/* ─── Demo data for standalone mode ─── */
const DEMO_MESSAGES: Message[] = [
  {
    _id: '1',
    name: 'Ahmed Khan',
    email: 'ahmed.khan@gmail.com',
    phone: '+92 300 1234567',
    message: 'Hi, I wanted to inquire about the monthly membership plans. Do you offer any discounts for students or early-bird sign-ups? I\'m particularly interested in the premium plan that includes access to the swimming pool and personal training sessions.',
    status: 'new',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    _id: '2',
    name: 'Sara Ali',
    email: 'sara.ali@outlook.com',
    phone: '+92 321 9876543',
    message: 'I would like to know about the ladies-only gym timings and if there are any female trainers available for personal training sessions. Also, do you have a daycare facility?',
    status: 'replied',
    reply: 'Hi Sara! Our ladies-only hours are Mon-Fri 10am-2pm. Yes, we have 3 certified female trainers available. No daycare currently, but we\'re working on it!',
    repliedAt: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    _id: '3',
    name: 'Hassan Raza',
    email: 'hassan.raza@yahoo.com',
    message: 'Can I get a trial session before committing to a full membership? I\'ve never been to a gym before and would like to see if it\'s the right fit for me.',
    status: 'new',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    _id: '4',
    name: 'Fatima Zahra',
    email: 'fatima.z@gmail.com',
    phone: '+92 333 5551234',
    message: 'I noticed your website mentions group fitness classes. Could you share the weekly schedule? I\'m interested in yoga, spinning, and HIIT classes.',
    status: 'replied',
    reply: 'Hello Fatima! The weekly schedule is: Yoga (Mon/Wed/Fri 7am), Spinning (Tue/Thu 6pm), HIIT (Mon/Wed/Sat 5pm). You can also check our app for real-time updates!',
    repliedAt: new Date(Date.now() - 43200000).toISOString(),
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    _id: '5',
    name: 'Omar Farooq',
    email: 'omar.farooq@hotmail.com',
    phone: '+92 345 6789012',
    message: 'Is there parking available at the gym? Also, what are the opening hours on weekends?',
    status: 'new',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    _id: '6',
    name: 'Ayesha Siddiqui',
    email: 'ayesha.s@gmail.com',
    message: 'I\'m a nutritionist and would love to collaborate with your gym. Could we set up a meeting to discuss potential partnership opportunities?',
    status: 'new',
    createdAt: new Date(Date.now() - 14400000).toISOString(),
    updatedAt: new Date(Date.now() - 14400000).toISOString(),
  },
]

/* ─────────────────────────────────────────────── */
/* ─── MAIN COMPONENT ─── */
/* ─────────────────────────────────────────────── */
export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | MessageStatus>('all')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const [notice, setNotice] = useState('')
  const [noticeType, setNoticeType] = useState<'success' | 'error' | 'info'>('info')
  const [refreshSpin, setRefreshSpin] = useState(false)
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false)

  const showNotice = useCallback((msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotice(msg)
    setNoticeType(type)
    if (type !== 'error') {
      setTimeout(() => setNotice(''), 4000)
    }
  }, [])

  /* ─── Load messages ─── */
  const load = useCallback(async () => {
    setLoading(true)
    setNotice('')
    setRefreshSpin(true)

    try {
      const res = await fetch('/api/admin/messages')
      const data = await res.json()
      const nextMessages = data.messages || []
      setMessages(nextMessages)
      setSelectedId(current => current || nextMessages[0]?._id || null)
    } catch {
      // Fallback to demo data if API is not available
      setMessages(DEMO_MESSAGES)
      setSelectedId(current => current || DEMO_MESSAGES[0]?._id || null)
    } finally {
      setLoading(false)
      setTimeout(() => setRefreshSpin(false), 600)
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => load(), 0)
    return () => window.clearTimeout(timer)
  }, [load])

  /* ─── Derived data ─── */
  const selected = messages.find(m => m._id === selectedId) || null

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return messages.filter(m => {
      const status = getMessageStatus(m.status)
      const matchesStatus = filter === 'all' || status === filter
      const matchesQuery =
        !needle ||
        m.name.toLowerCase().includes(needle) ||
        m.email.toLowerCase().includes(needle) ||
        (m.phone || '').toLowerCase().includes(needle) ||
        m.message.toLowerCase().includes(needle)
      return matchesStatus && matchesQuery
    })
  }, [filter, messages, query])

  const notRepliedCount = messages.filter(m => getMessageStatus(m.status) !== 'replied').length
  const repliedCount = messages.filter(m => getMessageStatus(m.status) === 'replied').length

  /* ─── Actions ─── */
  async function updateStatus(id: string, status: MessageStatus) {
    try {
      const res = await fetch('/api/admin/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      const data = await res.json()
      if (!res.ok) {
        showNotice(data.error || 'Unable to update message status.', 'error')
        return
      }
      setMessages(prev => prev.map(m => (m._id === id ? data.message : m)))
      showNotice(status === 'replied' ? 'Marked as replied.' : 'Marked as not replied.', 'success')
    } catch {
      // Demo mode fallback
      setMessages(prev =>
        prev.map(m =>
          m._id === id ? { ...m, status, updatedAt: new Date().toISOString() } : m
        )
      )
      showNotice(status === 'replied' ? 'Marked as replied.' : 'Marked as not replied.', 'success')
    }
  }

  async function sendReply() {
    if (!reply.trim() || !selected) return
    setSending(true)
    setNotice('')

    try {
      const res = await fetch('/api/admin/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selected._id, reply }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send reply.')
      setReply('')
      setMessages(prev => prev.map(m => (m._id === selected._id ? data.message : m)))
      showNotice('Reply saved and email sent to the customer.', 'success')
    } catch {
      // Demo mode fallback
      setMessages(prev =>
        prev.map(m =>
          m._id === selected._id
            ? {
                ...m,
                reply,
                status: 'replied',
                repliedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }
            : m
        )
      )
      setReply('')
      showNotice('Reply saved (demo mode).', 'success')
    } finally {
      setSending(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this message?')) return

    try {
      const res = await fetch('/api/admin/messages', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) {
        showNotice('Unable to delete message.', 'error')
        return
      }
    } catch {
      // Demo mode — continue with local delete
    }

    setMessages(prev => prev.filter(m => m._id !== id))
    if (selectedId === id) {
      const next = messages.find(m => m._id !== id)
      setSelectedId(next?._id || null)
    }
    setMobileDetailOpen(false)
    showNotice('Message deleted.', 'success')
  }

  /* ─── Filter config ─── */
  const filters: Array<{ value: 'all' | MessageStatus; label: string; count: number; icon: React.ReactNode; color: string }> = [
    { value: 'all', label: 'All', count: messages.length, icon: <Inbox size={14} />, color: '#3b82f6' },
    { value: 'new', label: 'Unreplied', count: notRepliedCount, icon: <MailX size={14} />, color: '#FF6B00' },
    { value: 'replied', label: 'Replied', count: repliedCount, icon: <MailCheck size={14} />, color: '#22c55e' },
  ]

  /* ─── Stats ─── */
  const stats = [
    { label: 'Total Messages', value: messages.length, icon: <MessageCircle size={18} />, color: '#3b82f6' },
    { label: 'Unreplied', value: notRepliedCount, icon: <MailX size={18} />, color: '#FF6B00' },
    { label: 'Replied', value: repliedCount, icon: <MailCheck size={18} />, color: '#22c55e' },
  ]

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div
        className="mx-auto"
        style={{ padding: 'clamp(20px, 4vw, 48px)', maxWidth: 1500 }}
      >
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
            className="messages-header-row"
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
                Messages
              </h1>
              <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
                Track contact form submissions, reply status, and customer follow-ups.
              </p>
            </div>
            <RefreshButton onClick={load} spinning={refreshSpin} />
          </div>
        </div>

        {/* ─── Stats Cards ─── */}
        <div
          className="messages-stats-grid animate-fade-in-up delay-1"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
            marginBottom: 24,
          }}
        >
          {stats.map((s, i) => (
            <StatCard key={s.label} stat={s} loading={loading} index={i} />
          ))}
        </div>

        {/* ─── Main Content Grid ─── */}
        <div
          className="messages-content-grid animate-fade-in-up delay-2"
          style={{
            display: 'grid',
            gridTemplateColumns: '400px minmax(0,1fr)',
            gap: 20,
            minHeight: 'calc(100vh - 320px)',
          }}
        >
          {/* ─── Sidebar ─── */}
          <aside
            className="animate-slide-in-left delay-3"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0,
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

            {/* Search + Filters */}
            <div
              style={{
                padding: 16,
                borderBottom: '1px solid var(--border-subtle)',
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
                  padding: '0 12px',
                  height: 42,
                  marginBottom: 14,
                  transition: 'border-color 0.3s ease',
                }}
              >
                <Search size={15} style={{ color: 'rgba(255,255,255,0.35)', flexShrink: 0 }} />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search messages..."
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
                {query && (
                  <button
                    onClick={() => setQuery('')}
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
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

            {/* Message list */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {loading ? (
                <div style={{ padding: 24 }}>
                  {[1, 2, 3, 4].map(i => (
                    <SkeletonRow key={i} />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <EmptyState query={query} />
              ) : (
                filtered.map((msg, idx) => (
                  <MessageListItem
                    key={msg._id}
                    message={msg}
                    isSelected={selectedId === msg._id}
                    index={idx}
                    onClick={() => {
                      setSelectedId(msg._id)
                      setReply('')
                      setNotice('')
                      setMobileDetailOpen(true)
                    }}
                  />
                ))
              )}
            </div>

            {/* Footer count */}
            <div
              style={{
                padding: '12px 16px',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: 11,
                color: 'rgba(255,255,255,0.3)',
                textAlign: 'center',
                letterSpacing: '0.06em',
              }}
            >
              {filtered.length} of {messages.length} message{messages.length !== 1 ? 's' : ''}
            </div>
          </aside>

          {/* ─── Detail Panel ─── */}
          <main
            className={`animate-slide-in-right delay-4 ${mobileDetailOpen ? 'mobile-detail-open' : ''}`}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              minWidth: 0,
              overflow: 'hidden',
              clipPath:
                'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
            }}
          >
            {!selected ? (
              <div
                style={{
                  minHeight: 480,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 16,
                  color: 'rgba(255,255,255,0.3)',
                }}
              >
                <Inbox size={48} strokeWidth={1} style={{ opacity: 0.4 }} />
                <span style={{ fontSize: 14 }}>Select a message to view details</span>
              </div>
            ) : (
              <MessageDetail
                key={selected._id}
                selected={selected}
                reply={reply}
                setReply={setReply}
                sending={sending}
                notice={notice}
                noticeType={noticeType}
                onSendReply={sendReply}
                onUpdateStatus={updateStatus}
                onDelete={handleDelete}
                onClose={() => setMobileDetailOpen(false)}
              />
            )}
          </main>
        </div>
      </div>

      {/* ─── Responsive styles ─── */}
      <style>{`
        .messages-stats-grid {
          grid-template-columns: repeat(3, 1fr) !important;
        }
        .messages-content-grid {
          grid-template-columns: 400px minmax(0,1fr) !important;
        }
        @media (max-width: 1100px) {
          .messages-content-grid {
            grid-template-columns: 340px minmax(0,1fr) !important;
          }
        }
        @media (max-width: 900px) {
          .messages-stats-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .messages-content-grid {
            grid-template-columns: 1fr !important;
          }
          .messages-content-grid > main {
            display: none;
          }
          .messages-content-grid > main.mobile-detail-open {
            display: block;
            position: fixed;
            inset: 0;
            z-index: 50;
            clip-path: none !important;
            border: none !important;
            border-radius: 0 !important;
            background: var(--bg-primary) !important;
            overflow-y: auto;
          }
        }
        @media (max-width: 600px) {
          .messages-stats-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .search-input-wrap:focus-within {
          border-color: rgba(255, 107, 0, 0.4) !important;
        }
        .detail-grid-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(280px, 0.9fr);
          gap: 24px;
        }
        @media (max-width: 800px) {
          .detail-grid-layout {
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
        height: 42,
        border: `1px solid ${hovered ? 'rgba(255,107,0,0.3)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 0,
        padding: '0 18px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        color: hovered ? '#FF6B00' : '#fff',
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        background: hovered ? 'rgba(255,107,0,0.06)' : 'rgba(255,255,255,0.03)',
        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
        clipPath:
          'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
      }}
    >
      <RefreshCw
        size={14}
        style={{
          transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)',
          transform: spinning ? 'rotate(360deg)' : 'rotate(0)',
        }}
      />
      Refresh
    </button>
  )
}

/* ─── Stat Card ─── */
function StatCard({
  stat,
  loading,
  index,
}: {
  stat: { label: string; value: number; icon: React.ReactNode; color: string }
  loading: boolean
  index: number
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`delay-${index + 1}`}
      style={{
        background: hovered ? 'rgba(255,107,0,0.04)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${hovered ? 'rgba(255,107,0,0.2)' : 'rgba(255,255,255,0.06)'}`,
        padding: 'clamp(16px, 2vw, 24px)',
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        cursor: 'default',
        clipPath:
          'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
        position: 'relative',
        overflow: 'hidden',
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
          marginBottom: 14,
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
          fontSize: 'clamp(32px, 4vw, 44px)',
          color: '#fff',
          lineHeight: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        {loading ? (
          <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.3)' }}>Loading...</span>
        ) : (
          <>
            {stat.value}
            {stat.label === 'Unreplied' && stat.value > 0 && (
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: '#FF6B00',
                  display: 'inline-block',
                  animation: 'glow 2s ease infinite',
                }}
              />
            )}
          </>
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
  item: { value: string; label: string; count: number; icon: React.ReactNode; color: string }
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
        padding: '10px 6px',
        fontSize: 10,
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        transition: 'all 0.25s ease',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {item.icon}
      {item.label}
      <span
        style={{
          background: active ? 'rgba(255,107,0,0.2)' : 'rgba(255,255,255,0.06)',
          padding: '1px 6px',
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

/* ─── Skeleton Loading Row ─── */
function SkeletonRow() {
  return (
    <div
      style={{
        padding: '16px 0',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      <div
        style={{
          height: 14,
          width: '60%',
          borderRadius: 4,
          background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
          marginBottom: 8,
        }}
      />
      <div
        style={{
          height: 10,
          width: '80%',
          borderRadius: 4,
          background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
          animationDelay: '0.2s',
          marginBottom: 6,
        }}
      />
      <div
        style={{
          height: 10,
          width: '40%',
          borderRadius: 4,
          background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
          animationDelay: '0.4s',
        }}
      />
    </div>
  )
}

/* ─── Empty state ─── */
function EmptyState({ query }: { query: string }) {
  return (
    <div
      style={{
        padding: 40,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        color: 'rgba(255,255,255,0.3)',
      }}
    >
      <Search size={32} strokeWidth={1} style={{ opacity: 0.4 }} />
      <span style={{ fontSize: 13 }}>
        {query ? 'No messages match your search.' : 'No messages found.'}
      </span>
    </div>
  )
}

/* ─── Message List Item ─── */
function MessageListItem({
  message,
  isSelected,
  index,
  onClick,
}: {
  message: Message
  isSelected: boolean
  index: number
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const status = getMessageStatus(message.status)
  const meta = statusMeta[status]

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%',
        display: 'block',
        textAlign: 'left',
        border: 0,
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        background: isSelected
          ? 'rgba(255,107,0,0.08)'
          : hovered
            ? 'rgba(255,255,255,0.03)'
            : 'transparent',
        padding: '15px 18px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative',
        fontFamily: "'Inter', sans-serif",
        animation: `fadeInUp 0.35s cubic-bezier(0.16,1,0.3,1) ${index * 0.04}s both`,
      }}
    >
      {/* Left accent bar for selected */}
      {isSelected && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 3,
            background: 'var(--accent-orange)',
            borderRadius: '0 2px 2px 0',
          }}
        />
      )}

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          {/* Avatar circle */}
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: isSelected
                ? 'rgba(255,107,0,0.15)'
                : `${meta.color}15`,
              border: `1px solid ${isSelected ? 'rgba(255,107,0,0.3)' : `${meta.color}30`}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 700,
              color: isSelected ? '#FF6B00' : meta.color,
              flexShrink: 0,
              textTransform: 'uppercase',
            }}
          >
            {message.name.charAt(0)}
          </div>
          <strong style={{ color: '#fff', fontSize: 13, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {message.name}
          </strong>
        </div>

        {/* Status dot */}
        {status === 'new' && (
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#FF6B00',
              flexShrink: 0,
              boxShadow: '0 0 8px rgba(255,107,0,0.5)',
              animation: 'glow 2s ease infinite',
              marginTop: 4,
            }}
          />
        )}
        {status === 'replied' && (
          <CheckCircle2
            size={14}
            style={{ color: '#22c55e', flexShrink: 0, marginTop: 2, opacity: 0.7 }}
          />
        )}
      </div>

      {/* Email */}
      <div
        style={{
          color: 'rgba(255,255,255,0.4)',
          fontSize: 11,
          marginBottom: 6,
          paddingLeft: 40,
        }}
      >
        {message.email}
      </div>

      {/* Message preview */}
      <div
        style={{
          color: 'rgba(255,255,255,0.3)',
          fontSize: 12,
          lineHeight: 1.45,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          marginBottom: 8,
          paddingLeft: 40,
        }}
      >
        {message.message}
      </div>

      {/* Footer: time + arrow */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingLeft: 40,
        }}
      >
        <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10, letterSpacing: '0.04em' }}>
          {getTimeAgo(message.createdAt)}
        </span>
        <ChevronRight
          size={14}
          style={{
            color: isSelected ? '#FF6B00' : 'rgba(255,255,255,0.15)',
            transition: 'all 0.2s ease',
            transform: hovered ? 'translateX(2px)' : 'translateX(0)',
            opacity: hovered || isSelected ? 1 : 0,
          }}
        />
      </div>
    </button>
  )
}

/* ─── Message Detail Panel ─── */
function MessageDetail({
  selected,
  reply,
  setReply,
  sending,
  notice,
  noticeType,
  onSendReply,
  onUpdateStatus,
  onDelete,
  onClose,
}: {
  selected: Message
  reply: string
  setReply: (v: string) => void
  sending: boolean
  notice: string
  noticeType: 'success' | 'error' | 'info'
  onSendReply: () => void
  onUpdateStatus: (id: string, status: MessageStatus) => void
  onDelete: (id: string) => void
  onClose: () => void
}) {
  const status = getMessageStatus(selected.status)
  const meta = statusMeta[status]

  const noticeColors = {
    success: { bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)', color: '#86efac' },
    error: { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', color: '#fca5a5' },
    info: { bg: 'rgba(255,255,255,0.035)', border: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.68)' },
  }

  return (
    <div className="animate-scale-in" style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      {/* Top accent line */}
      <div
        style={{
          height: 2,
          background: `linear-gradient(90deg, ${meta.color}, ${status === 'replied' ? '#86efac' : '#ff9500'})`,
        }}
      />

      {/* Header */}
      <div
        style={{
          padding: 'clamp(16px, 2vw, 24px)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div
              style={{
                width: 44,
                height: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `${meta.color}15`,
                border: `1px solid ${meta.color}30`,
                fontSize: 20,
                fontWeight: 700,
                color: meta.color,
                textTransform: 'uppercase',
                clipPath:
                  'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                flexShrink: 0,
              }}
            >
              {selected.name.charAt(0)}
            </div>
            <div>
              <h2 style={{ color: '#fff', fontSize: 'clamp(18px, 2vw, 24px)', margin: 0, lineHeight: 1.2 }}>
                {selected.name}
              </h2>
            </div>
            {/* Status badge */}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 9,
                fontWeight: 800,
                padding: '4px 10px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                background: meta.bg,
                color: meta.color,
                border: `1px solid ${meta.border}`,
                clipPath:
                  'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
              }}
            >
              {status === 'replied' ? <CheckCircle2 size={10} /> : <Clock3 size={10} />}
              {getStatusLabel(selected.status)}
            </span>
          </div>

          {/* Contact details */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px 18px',
              color: 'rgba(255,255,255,0.4)',
              fontSize: 12,
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Mail size={13} style={{ opacity: 0.6 }} /> {selected.email}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Phone size={13} style={{ opacity: 0.6 }} /> {selected.phone || 'No phone'}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Clock3 size={13} style={{ opacity: 0.6 }} /> {formatDateTime(selected.createdAt)}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          {/* Close button (mobile) */}
          <ActionButton
            onClick={onClose}
            color="rgba(255,255,255,0.08)"
            hoverColor="rgba(255,255,255,0.12)"
            textColor="rgba(255,255,255,0.5)"
            className="mobile-close-btn"
          >
            <X size={16} />
          </ActionButton>

          <ActionButton
            onClick={() => onDelete(selected._id)}
            color="rgba(239,68,68,0.1)"
            hoverColor="rgba(239,68,68,0.2)"
            textColor="#fca5a5"
            title="Delete message"
          >
            <Trash2 size={16} />
          </ActionButton>
        </div>
      </div>

      {/* Content */}
      <div className="detail-grid-layout" style={{ padding: 'clamp(16px, 2vw, 24px)', flex: 1 }}>
        {/* Left: Message content */}
        <section>
          <SectionLabel>Customer Message</SectionLabel>
          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 6,
              padding: 'clamp(14px, 2vw, 20px)',
              color: 'rgba(255,255,255,0.78)',
              lineHeight: 1.75,
              whiteSpace: 'pre-wrap',
              minHeight: 160,
              fontSize: 13,
            }}
          >
            {selected.message}
          </div>

          {/* Details grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: 10,
              marginTop: 14,
            }}
          >
            <DetailCard label="Submitted" value={formatDateTime(selected.createdAt)} />
            <DetailCard label="Last Updated" value={formatDateTime(selected.updatedAt || selected.createdAt)} />
            <DetailCard label="Reply Sent" value={selected.repliedAt ? formatDateTime(selected.repliedAt) : 'Not replied yet'} />
            <DetailCard label="Message ID" value={selected._id} />
          </div>
        </section>

        {/* Right: Reply section */}
        <section>
          <SectionLabel>Admin Reply</SectionLabel>

          {/* Existing reply */}
          {selected.reply ? (
            <div
              style={{
                background: 'rgba(34,197,94,0.06)',
                border: '1px solid rgba(34,197,94,0.18)',
                borderRadius: 6,
                padding: 16,
                color: 'rgba(255,255,255,0.78)',
                lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
                marginBottom: 14,
                fontSize: 13,
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 3,
                  height: '100%',
                  background: '#22c55e',
                  borderRadius: '6px 0 0 6px',
                }}
              />
              {selected.reply}
            </div>
          ) : (
            <div
              style={{
                border: '1px dashed rgba(255,255,255,0.12)',
                borderRadius: 6,
                padding: 20,
                color: 'rgba(255,255,255,0.3)',
                marginBottom: 14,
                textAlign: 'center',
                fontSize: 12,
              }}
            >
              <MessageSquareReply size={20} style={{ opacity: 0.4, marginBottom: 6 }} />
              <br />
              No reply has been sent yet.
            </div>
          )}

          {/* Reply textarea */}
          <textarea
            value={reply}
            onChange={e => setReply(e.target.value)}
            rows={6}
            placeholder="Write a reply to email the customer..."
            style={{
              width: '100%',
              boxSizing: 'border-box',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#fff',
              padding: '13px 14px',
              fontSize: 13,
              borderRadius: 4,
              outline: 'none',
              fontFamily: "'Inter', sans-serif",
              resize: 'vertical',
              lineHeight: 1.6,
              transition: 'border-color 0.3s ease',
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = 'rgba(255,107,0,0.3)'
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
            }}
          />

          {/* Notice */}
          {notice && (
            <div
              className="animate-fade-in-up"
              style={{
                marginTop: 12,
                padding: '10px 14px',
                border: `1px solid ${noticeColors[noticeType].border}`,
                background: noticeColors[noticeType].bg,
                color: noticeColors[noticeType].color,
                fontSize: 12,
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {noticeType === 'success' && <CheckCircle2 size={14} />}
              {notice}
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
            <PrimaryButton
              onClick={onSendReply}
              disabled={sending || !reply.trim()}
            >
              <Send size={14} /> {sending ? 'Sending...' : 'Send Reply'}
            </PrimaryButton>

            <SecondaryButton
              onClick={() =>
                onUpdateStatus(
                  selected._id,
                  status === 'replied' ? 'new' : 'replied'
                )
              }
            >
              {status === 'replied' ? (
                <>
                  <MessageSquareReply size={14} /> Mark Unreplied
                </>
              ) : (
                <>
                  <CheckCircle2 size={14} /> Mark Replied
                </>
              )}
            </SecondaryButton>

            <a
              href={`mailto:${selected.email}?subject=${encodeURIComponent('Re: Your message to Fitnest Health Club')}&body=${encodeURIComponent(`Hi ${selected.name},\n\n${reply}`)}`}
              style={{ textDecoration: 'none' }}
            >
              <SecondaryButton onClick={() => {}}>
                <Mail size={14} /> Email App
              </SecondaryButton>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}

/* ─── Section Label ─── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        color: 'rgba(255,255,255,0.35)',
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        marginBottom: 12,
      }}
    >
      <div style={{ width: 16, height: 1, background: 'var(--accent-orange)', opacity: 0.6 }} />
      {children}
    </div>
  )
}

/* ─── Detail Card ─── */
function DetailCard({ label, value }: { label: string; value: string }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${hovered ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)'}`,
        borderRadius: 4,
        padding: 12,
        minWidth: 0,
        transition: 'all 0.25s ease',
        clipPath:
          'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
      }}
    >
      <div
        style={{
          color: 'rgba(255,255,255,0.3)',
          fontSize: 9,
          fontWeight: 800,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, overflowWrap: 'anywhere', lineHeight: 1.4 }}>
        {value}
      </div>
    </div>
  )
}

/* ─── Action Button (icon only) ─── */
function ActionButton({
  onClick,
  color,
  hoverColor,
  textColor,
  title,
  className,
  children,
}: {
  onClick: () => void
  color: string
  hoverColor: string
  textColor: string
  title?: string
  className?: string
  children: React.ReactNode
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={title}
      className={className}
      style={{
        width: 40,
        height: 40,
        border: 0,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: textColor,
        cursor: 'pointer',
        background: hovered ? hoverColor : color,
        transition: 'all 0.25s ease',
        clipPath:
          'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
      }}
    >
      {children}
    </button>
  )
}

/* ─── Primary Button ─── */
function PrimaryButton({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        height: 40,
        border: 0,
        padding: '0 18px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        color: '#fff',
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        cursor: disabled ? 'not-allowed' : 'pointer',
        background: hovered && !disabled ? '#ff8c33' : '#FF6B00',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
        transform: hovered && !disabled ? 'translateY(-1px)' : 'translateY(0)',
        boxShadow: hovered && !disabled ? '0 4px 16px rgba(255,107,0,0.3)' : 'none',
        clipPath:
          'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {children}
    </button>
  )
}

/* ─── Secondary Button ─── */
function SecondaryButton({
  onClick,
  children,
}: {
  onClick: () => void
  children: React.ReactNode
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        height: 40,
        border: `1px solid ${hovered ? 'rgba(255,107,0,0.25)' : 'rgba(255,255,255,0.08)'}`,
        padding: '0 16px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        color: hovered ? '#FF6B00' : 'rgba(255,255,255,0.7)',
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        background: hovered ? 'rgba(255,107,0,0.06)' : 'rgba(255,255,255,0.03)',
        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
        clipPath:
          'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {children}
    </button>
  )
}
