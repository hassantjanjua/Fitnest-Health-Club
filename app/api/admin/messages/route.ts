import { NextRequest, NextResponse } from 'next/server'
import { requireAdminPage } from '@/app/lib/admin-authz'
import { connectDB } from '@/app/lib/mongodb'
import ContactMessage from '@/app/models/ContactMessage'
import { sendContactReplyEmail } from '@/app/lib/email'

// GET all messages
export async function GET(req: NextRequest) {
  const guard = await requireAdminPage(req, 'messages')
  if (guard.response) return guard.response
  await connectDB()
  const messages = await ContactMessage.find({}).sort({ createdAt: -1 })
  return NextResponse.json({ messages })
}

// PUT — mark status or send reply
export async function PUT(req: NextRequest) {
  const guard = await requireAdminPage(req, 'messages')
  if (guard.response) return guard.response
  await connectDB()
  const { id, status, reply } = await req.json()

  const updateData: {
    status?: 'new' | 'replied'
    reply?: string
    repliedAt?: Date
  } = {}

  if (status) {
    if (!['new', 'replied'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }
    updateData.status = status
  }

  // If admin is sending a reply
  if (typeof reply === 'string' && reply.trim()) {
    updateData.reply = reply.trim()
    updateData.status = 'replied'
    updateData.repliedAt = new Date()

    // Get the message to find user email
    const msg = await ContactMessage.findById(id)
    if (msg) {
      try {
        await sendContactReplyEmail(msg.email, reply.trim())
      } catch (err) {
        console.error('Reply email failed:', err)
      }
    }
  }

  const updated = await ContactMessage.findByIdAndUpdate(id, updateData, { new: true })
  return NextResponse.json({ message: updated })
}

// DELETE message
export async function DELETE(req: NextRequest) {
  const guard = await requireAdminPage(req, 'messages')
  if (guard.response) return guard.response
  await connectDB()
  const { id } = await req.json()
  await ContactMessage.findByIdAndDelete(id)
  return NextResponse.json({ success: true })
}
