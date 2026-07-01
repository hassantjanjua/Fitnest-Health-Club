import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { verifyToken } from '@/app/lib/auth'
import { connectDB } from '@/app/lib/mongodb'
import Event from '@/app/models/Event'

function checkAuth(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value
  if (!token) return false
  return verifyToken(token)
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const events = await Event.find({}).sort({ createdAt: -1 })
  return NextResponse.json({ events })
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const body = await req.json()
  const event = await Event.create(body)
  revalidatePath('/')
  revalidatePath('/api/events')
  return NextResponse.json({ event })
}

export async function PUT(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const { id, ...data } = await req.json()
  const event = await Event.findByIdAndUpdate(id, data, { new: true })
  revalidatePath('/')
  revalidatePath('/api/events')
  return NextResponse.json({ event })
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const { id } = await req.json()
  await Event.findByIdAndDelete(id)
  revalidatePath('/')
  revalidatePath('/api/events')
  return NextResponse.json({ success: true })
}