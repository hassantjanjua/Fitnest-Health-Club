'use client'

import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { CheckCircle2, Clock3, Mail, MessageSquareReply, Phone, RefreshCw, Search, Send, Trash2 } from 'lucide-react'

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

function badge(status?: string): CSSProperties {
  const s = statusMeta[getMessageStatus(status)]

  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 10,
    fontWeight: 800,
    padding: '5px 9px',
    borderRadius: 4,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    background: s.bg,
    color: s.color,
    border: `1px solid ${s.border}`,
    whiteSpace: 'nowrap',
  }
}

const panel: CSSProperties = {
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: 8,
}

const buttonBase: CSSProperties = {
  height: 38,
  border: 0,
  borderRadius: 4,
  padding: '0 13px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  color: '#fff',
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  cursor: 'pointer',
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | MessageStatus>('all')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const [notice, setNotice] = useState('')

  async function load() {
    setLoading(true)
    setNotice('')

    try {
      const res = await fetch('/api/admin/messages')
      const data = await res.json()
      const nextMessages = data.messages || []

      setMessages(nextMessages)
      setSelectedId(current => current || nextMessages[0]?._id || null)
    } catch {
      setMessages([])
      setNotice('Unable to load messages.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      load()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [])

  const selected = messages.find(message => message._id === selectedId) || null

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()

    return messages.filter(message => {
      const status = getMessageStatus(message.status)
      const matchesStatus = filter === 'all' || status === filter
      const matchesQuery =
        !needle ||
        message.name.toLowerCase().includes(needle) ||
        message.email.toLowerCase().includes(needle) ||
        (message.phone || '').toLowerCase().includes(needle) ||
        message.message.toLowerCase().includes(needle)

      return matchesStatus && matchesQuery
    })
  }, [filter, messages, query])

  const notRepliedCount = messages.filter(message => getMessageStatus(message.status) !== 'replied').length
  const repliedCount = messages.filter(message => getMessageStatus(message.status) === 'replied').length

  async function updateStatus(id: string, status: MessageStatus) {
    const res = await fetch('/api/admin/messages', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })

    const data = await res.json()
    if (!res.ok) {
      setNotice(data.error || 'Unable to update message status.')
      return
    }

    setMessages(prev => prev.map(message => (message._id === id ? data.message : message)))
    setNotice(status === 'replied' ? 'Marked as replied.' : 'Marked as not replied.')
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

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send reply.')
      }

      setReply('')
      setMessages(prev => prev.map(message => (message._id === selected._id ? data.message : message)))
      setNotice('Reply saved and email sent to the customer.')
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Failed to send reply.')
    } finally {
      setSending(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this message?')) return

    const res = await fetch('/api/admin/messages', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })

    if (!res.ok) {
      setNotice('Unable to delete message.')
      return
    }

    setMessages(prev => prev.filter(message => message._id !== id))
    if (selectedId === id) {
      const next = messages.find(message => message._id !== id)
      setSelectedId(next?._id || null)
    }
  }

  const filters: Array<{ value: 'all' | MessageStatus; label: string; count: number }> = [
    { value: 'all', label: 'All', count: messages.length },
    { value: 'new', label: 'Not replied', count: notRepliedCount },
    { value: 'replied', label: 'Replied', count: repliedCount },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, minHeight: 'calc(100vh - 130px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 18, alignItems: 'flex-end' }}>
        <div>
          <h1 style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 38,
            color: '#fff',
            letterSpacing: '0.05em',
            margin: '0 0 6px',
          }}>
            Messages
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.38)' }}>
            Track contact form submissions, reply status, and customer follow-ups.
          </p>
        </div>

        <button onClick={load} style={{ ...buttonBase, background: 'rgba(255,255,255,0.08)' }}>
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '380px minmax(0,1fr)', gap: 20, flex: 1 }}>
        <aside style={{ ...panel, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
          <div style={{ padding: 16, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 4,
              padding: '0 12px',
              height: 42,
              marginBottom: 12,
            }}>
              <Search size={15} color="rgba(255,255,255,0.35)" />
              <input
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder="Search messages"
                style={{
                  flex: 1,
                  height: '100%',
                  background: 'transparent',
                  border: 0,
                  outline: 'none',
                  color: '#fff',
                  fontSize: 13,
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
              {filters.map(item => (
                <button
                  key={item.value}
                  onClick={() => setFilter(item.value)}
                  style={{
                    border: `1px solid ${filter === item.value ? 'rgba(255,107,0,0.35)' : 'rgba(255,255,255,0.08)'}`,
                    background: filter === item.value ? 'rgba(255,107,0,0.12)' : 'rgba(255,255,255,0.03)',
                    color: filter === item.value ? '#FF6B00' : 'rgba(255,255,255,0.62)',
                    borderRadius: 4,
                    padding: '9px 6px',
                    fontSize: 10,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    cursor: 'pointer',
                  }}
                >
                  {item.label} ({item.count})
                </button>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: 20, color: 'rgba(255,255,255,0.42)' }}>Loading messages...</div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: 20, color: 'rgba(255,255,255,0.42)' }}>No messages found.</div>
            ) : (
              filtered.map(message => (
                <button
                  key={message._id}
                  onClick={() => {
                    setSelectedId(message._id)
                    setReply('')
                    setNotice('')
                  }}
                  style={{
                    width: '100%',
                    display: 'block',
                    textAlign: 'left',
                    border: 0,
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    background: selectedId === message._id ? 'rgba(255,107,0,0.08)' : 'transparent',
                    padding: 15,
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
                    <strong style={{ color: '#fff', fontSize: 14, minWidth: 0 }}>{message.name}</strong>
                    <span style={badge(message.status)}>{getStatusLabel(message.status)}</span>
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, marginBottom: 8 }}>
                    {message.email}
                  </div>
                  <div style={{
                    color: 'rgba(255,255,255,0.35)',
                    fontSize: 12,
                    lineHeight: 1.45,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    marginBottom: 10,
                  }}>
                    {message.message}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.32)', fontSize: 11 }}>
                    {formatDateTime(message.createdAt)}
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        <main style={{ ...panel, minWidth: 0, overflow: 'hidden' }}>
          {!selected ? (
            <div style={{
              minHeight: 420,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255,255,255,0.42)',
            }}>
              Select a message to view details.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
              <div style={{
                padding: 24,
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                justifyContent: 'space-between',
                gap: 18,
              }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 9 }}>
                    <h2 style={{ color: '#fff', fontSize: 24, margin: 0 }}>{selected.name}</h2>
                    <span style={badge(selected.status)}>{getStatusLabel(selected.status)}</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 18px', color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}><Mail size={14} /> {selected.email}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}><Phone size={14} /> {selected.phone || 'No phone provided'}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}><Clock3 size={14} /> {formatDateTime(selected.createdAt)}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(selected._id)}
                  title="Delete message"
                  style={{ ...buttonBase, width: 38, padding: 0, background: 'rgba(239,68,68,0.12)', color: '#fca5a5' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div style={{ padding: 24, display: 'grid', gridTemplateColumns: 'minmax(0,1.1fr) minmax(280px,0.9fr)', gap: 20 }}>
                <section>
                  <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10 }}>
                    User Response
                  </div>
                  <div style={{
                    background: 'rgba(255,255,255,0.035)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 6,
                    padding: 18,
                    color: 'rgba(255,255,255,0.78)',
                    lineHeight: 1.75,
                    whiteSpace: 'pre-wrap',
                    minHeight: 180,
                  }}>
                    {selected.message}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 12, marginTop: 14 }}>
                    <Detail label="Submitted" value={formatDateTime(selected.createdAt)} />
                    <Detail label="Last Updated" value={formatDateTime(selected.updatedAt || selected.createdAt)} />
                    <Detail label="Reply Sent" value={selected.repliedAt ? formatDateTime(selected.repliedAt) : 'Not replied yet'} />
                    <Detail label="Message ID" value={selected._id} />
                  </div>
                </section>

                <section>
                  <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10 }}>
                    Admin Reply
                  </div>

                  {selected.reply ? (
                    <div style={{
                      background: 'rgba(34,197,94,0.06)',
                      border: '1px solid rgba(34,197,94,0.18)',
                      borderRadius: 6,
                      padding: 16,
                      color: 'rgba(255,255,255,0.78)',
                      lineHeight: 1.7,
                      whiteSpace: 'pre-wrap',
                      marginBottom: 14,
                    }}>
                      {selected.reply}
                    </div>
                  ) : (
                    <div style={{
                      border: '1px dashed rgba(255,255,255,0.14)',
                      borderRadius: 6,
                      padding: 16,
                      color: 'rgba(255,255,255,0.38)',
                      marginBottom: 14,
                    }}>
                      No reply has been sent yet.
                    </div>
                  )}

                  <textarea
                    value={reply}
                    onChange={event => setReply(event.target.value)}
                    rows={7}
                    placeholder="Write a reply to email the customer..."
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff',
                      padding: '13px 14px',
                      fontSize: 13,
                      borderRadius: 4,
                      outline: 'none',
                      fontFamily: 'Inter, sans-serif',
                      resize: 'vertical',
                      lineHeight: 1.6,
                    }}
                  />

                  {notice && (
                    <div style={{
                      marginTop: 12,
                      padding: '10px 12px',
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'rgba(255,255,255,0.035)',
                      color: 'rgba(255,255,255,0.68)',
                      fontSize: 12,
                      borderRadius: 4,
                    }}>
                      {notice}
                    </div>
                  )}

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 14 }}>
                    <button
                      onClick={sendReply}
                      disabled={sending || !reply.trim()}
                      style={{
                        ...buttonBase,
                        background: 'var(--accent-orange)',
                        opacity: sending || !reply.trim() ? 0.58 : 1,
                        cursor: sending || !reply.trim() ? 'not-allowed' : 'pointer',
                      }}
                    >
                      <Send size={15} /> {sending ? 'Sending' : 'Send Reply'}
                    </button>

                    <button
                      onClick={() => updateStatus(selected._id, getMessageStatus(selected.status) === 'replied' ? 'new' : 'replied')}
                      style={{ ...buttonBase, background: 'rgba(255,255,255,0.08)' }}
                    >
                      {getMessageStatus(selected.status) === 'replied' ? <MessageSquareReply size={15} /> : <CheckCircle2 size={15} />}
                      {getMessageStatus(selected.status) === 'replied' ? 'Mark Not Replied' : 'Mark Replied'}
                    </button>

                    <a
                      href={`mailto:${selected.email}?subject=${encodeURIComponent('Re: Your message to Fitnest Health Club')}&body=${encodeURIComponent(`Hi ${selected.name},\n\n${reply}`)}`}
                      style={{
                        ...buttonBase,
                        background: 'rgba(255,255,255,0.08)',
                        textDecoration: 'none',
                      }}
                    >
                      <Mail size={15} /> Email App
                    </a>
                  </div>
                </section>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 6,
      padding: 12,
      minWidth: 0,
    }}>
      <div style={{ color: 'rgba(255,255,255,0.34)', fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ color: 'rgba(255,255,255,0.74)', fontSize: 12, overflowWrap: 'anywhere' }}>
        {value}
      </div>
    </div>
  )
}
