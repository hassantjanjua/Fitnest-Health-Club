import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/app/lib/auth'
import { connectDB } from '@/app/lib/mongodb'
import ContactMessage from '@/app/models/ContactMessage'
import { sendContactReplyEmail } from '@/app/lib/email'

function checkAuth(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value
  if (!token) return false
  return verifyToken(token)
}

// GET all messages
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const messages = await ContactMessage.find({}).sort({ createdAt: -1 })
  return NextResponse.json({ messages })
}

// PUT — mark status or send reply
export async function PUT(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const { id, status, reply } = await req.json()

  const updateData: any = {}
  if (status) updateData.status = status

  // If admin is sending a reply
  if (reply) {
    updateData.reply = reply
    updateData.status = 'replied'
    updateData.repliedAt = new Date()

    // Get the message to find user email
    const msg = await ContactMessage.findById(id)
    if (msg) {
      try {
        await sendContactReplyEmail(msg.email, reply)
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
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const { id } = await req.json()
  await ContactMessage.findByIdAndDelete(id)
  return NextResponse.json({ success: true })
}