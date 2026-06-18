import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/app/lib/auth'
import { connectDB } from '@/app/lib/mongodb'
import { sendContactReplyEmail } from '@/app/lib/email'
import ContactMessage from '@/app/models/ContactMessage'

function checkAuth(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value
  return token ? verifyToken(token) : null
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const messages = await ContactMessage.find({}).sort({ createdAt: -1 })
  return NextResponse.json({ messages })
}

export async function PUT(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, reply } = await req.json()
  const messageId = String(id || '')
  const replyText = String(reply || '').trim()

  if (!messageId || !replyText) {
    return NextResponse.json({ error: 'Message id and reply are required' }, { status: 400 })
  }

  await connectDB()
  const message = await ContactMessage.findById(messageId)
  if (!message) {
    return NextResponse.json({ error: 'Message not found' }, { status: 404 })
  }

  await sendContactReplyEmail(message.email, replyText)

  message.reply = replyText
  message.status = 'replied'
  message.repliedAt = new Date()
  await message.save()

  return NextResponse.json({ message })
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await req.json()
  const messageId = String(id || '')

  if (!messageId) {
    return NextResponse.json({ error: 'Message id is required' }, { status: 400 })
  }

  await connectDB()
  await ContactMessage.findByIdAndDelete(messageId)
  return NextResponse.json({ success: true })
}
