import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/app/lib/mongodb'
import { sendContactNotificationEmail } from '@/app/lib/email'
import ContactMessage from '@/app/models/ContactMessage'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const name = String(body.name || '').trim()
    const email = String(body.email || '').trim().toLowerCase()
    const phone = String(body.phone || '').trim()
    const message = String(body.message || '').trim()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 })
    }

    await connectDB()
    const contactMessage = await ContactMessage.create({ name, email, phone, message })

    try {
      await sendContactNotificationEmail({ name, email, phone, message })
    } catch (error) {
      console.error('Contact notification failed:', error)
    }

    return NextResponse.json({ message: contactMessage }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Unable to send message' }, { status: 500 })
  }
}
