'use client'

import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'

type Message = {
  _id: string
  name: string
  email: string
  phone: string
  message: string
  status: 'new' | 'read' | 'replied'
  reply: string
  repliedAt: string | null
  createdAt: string
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState<Message | null>(null)
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const [replySent, setReplySent] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/messages')
      const data = await res.json()
      setMessages(data.messages || [])
    } catch {
      setMessages([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function markStatus(id: string, status: string) {
    await fetch('/api/admin/messages', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })

    setMessages(prev =>
      prev.map(m =>
        m._id === id ? { ...m, status: status as Message['status'] } : m
      )
    )

    if (selected?._id === id) {
      setSelected(prev =>
        prev ? { ...prev, status: status as Message['status'] } : null
      )
    }
  }

  async function sendReply() {
    if (!reply.trim() || !selected) return
    setSending(true)

    try {
      const res = await fetch('/api/admin/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selected._id, reply }),
      })

      const data = await res.json()

      setReplySent(true)
      setReply('')
      setSelected(data.message)

      setMessages(prev =>
        prev.map(m =>
          m._id === selected._id ? data.message : m
        )
      )

      setTimeout(() => setReplySent(false), 3000)
    } catch {
      alert('Failed to send reply')
    } finally {
      setSending(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this message?')) return

    await fetch('/api/admin/messages', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })

    setMessages(prev => prev.filter(m => m._id !== id))
    if (selected?._id === id) setSelected(null)
  }

  function selectMessage(msg: Message) {
    setSelected(msg)
    setReply('')
    setReplySent(false)
    if (msg.status === 'new') markStatus(msg._id, 'read')
  }

  const filtered =
    filter === 'all'
      ? messages
      : messages.filter(m => m.status === filter)

  const newCount = messages.filter(m => m.status === 'new').length

  function badge(status: string): CSSProperties {
    const map: Record<
      string,
      { bg: string; color: string; border: string }
    > = {
      new: {
        bg: 'rgba(255,107,0,0.12)',
        color: '#FF6B00',
        border: 'rgba(255,107,0,0.3)',
      },
      read: {
        bg: 'rgba(59,130,246,0.12)',
        color: '#3b82f6',
        border: 'rgba(59,130,246,0.3)',
      },
      replied: {
        bg: 'rgba(34,197,94,0.12)',
        color: '#22c55e',
        border: 'rgba(34,197,94,0.3)',
      },
    }

    const s = map[status] ?? map.read

    return {
      fontSize: 9,
      fontWeight: 700,
      padding: '2px 8px',
      borderRadius: 2,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      background: s.bg,
      color: s.color,
      border: `1px solid ${s.border}`,
    }
  }

  const inp: CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    padding: '12px 16px',
    fontSize: 13,
    borderRadius: 4,
    outline: 'none',
    fontFamily: 'Inter, sans-serif',
    boxSizing: 'border-box',
    resize: 'none',
  }

  return (
    <div style={{ display: 'flex', gap: 20, height: 'calc(100vh - 130px)' }}>
      {/* LEFT PANEL */}
      <div style={{
        width: 360,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 8,
        overflow: 'hidden',
      }}>
        <div style={{ padding: '20px 20px 16px' }}>
          <h1 style={{ color: '#fff' }}>Messages</h1>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: 20 }}>Loading...</div>
          ) : (
            filtered.map(msg => (
              <div
                key={msg._id}
                onClick={() => selectMessage(msg)}
                style={{ padding: 12, cursor: 'pointer' }}
              >
                <div style={{ color: '#fff' }}>{msg.name}</div>
                <div style={{ fontSize: 12 }}>{msg.email}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ flex: 1 }}>
        {!selected ? (
          <div style={{ color: '#fff' }}>Select a message</div>
        ) : (
          <>
            <h2 style={{ color: '#fff' }}>{selected.name}</h2>

            <div style={{ color: '#ccc' }}>{selected.message}</div>

            <textarea
              value={reply}
              onChange={e => setReply(e.target.value)}
              style={inp}
              rows={5}
              placeholder="Write reply..."
            />

            <button
              onClick={sendReply}
              disabled={sending}
            >
              Send Reply
            </button>

            {/* FIXED EMAIL LINK */}
            <a
              href={`mailto:${selected.email}?subject=Re: Your message to Fitnest Health Club&body=Hi ${selected.name},%0A%0A`}
              style={{
                display: 'inline-block',
                marginTop: 10,
                color: '#fff',
                textDecoration: 'underline',
              }}
            >
              Open in Email App
            </a>
          </>
        )}
      </div>
    </div>
  )
}