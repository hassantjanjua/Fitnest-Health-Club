import { NextResponse } from 'next/server'
import { connectDB } from '@/app/lib/mongodb'
import Plan from '@/app/models/Plans'

export async function GET() {
  try {
    await connectDB()
    const plans = await Plan.find({ isActive: true }).sort({ featured: -1, createdAt: 1 })
    return NextResponse.json({ plans })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Unable to load plans' }, { status: 500 })
  }
}
