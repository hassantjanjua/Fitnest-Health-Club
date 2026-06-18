import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/app/lib/auth'
import { connectDB } from '@/app/lib/mongodb'
import Plan from '@/app/models/Plans'

function checkAuth(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value
  if (!token) return false
  return verifyToken(token)
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const plans = await Plan.find({}).sort({ createdAt: 1 })
  return NextResponse.json({ plans })
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const body = await req.json()
  const plan = await Plan.create(body)
  return NextResponse.json({ plan })
}

export async function PUT(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const { id, ...data } = await req.json()
  const plan = await Plan.findByIdAndUpdate(id, data, { new: true })
  return NextResponse.json({ plan })
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const { id } = await req.json()
  await Plan.findByIdAndDelete(id)
  return NextResponse.json({ success: true })
}