import { NextResponse } from 'next/server'
import { connectDB } from '@/app/lib/mongodb'
import Trainer from '@/app/models/Trainer'

export async function GET() {
  try {
    await connectDB()
    const trainers = await Trainer.find({ isActive: true }).sort({ createdAt: -1 })
    return NextResponse.json({ trainers })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Unable to load trainers' }, { status: 500 })
  }
}
