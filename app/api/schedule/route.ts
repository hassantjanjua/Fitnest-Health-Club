import { NextResponse } from 'next/server'
import { connectDB } from '@/app/lib/mongodb'
import ClassSchedule from '@/app/models/ClassSchedule'

export async function GET() {
  try {
    await connectDB()
    const schedule = await ClassSchedule.find({ isActive: true }).sort({ day: 1, time: 1 })
    return NextResponse.json({ schedule })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}