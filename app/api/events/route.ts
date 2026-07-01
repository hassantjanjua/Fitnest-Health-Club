import { NextResponse } from 'next/server'
import { connectDB } from '@/app/lib/mongodb'
import Event from '@/app/models/Event'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await connectDB()
    const events = await Event.find({ isActive: true }).sort({ createdAt: -1 })
    return NextResponse.json({ events })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}