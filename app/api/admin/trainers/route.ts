import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/app/lib/auth'
import { connectDB } from '@/app/lib/mongodb'
import Trainer from '@/app/models/Trainer'

function getToken(req: NextRequest) {
  return req.cookies.get('admin_token')?.value
}

function checkAuth(req: NextRequest) {
  const token = getToken(req)
  if (!token) return false
  return verifyToken(token)
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const trainers = await Trainer.find({}).sort({ createdAt: -1 })
  return NextResponse.json({ trainers })
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const body = await req.json()
  const trainer = await Trainer.create(body)
  return NextResponse.json({ trainer })
}

export async function PUT(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const { id, ...data } = await req.json()
  const trainer = await Trainer.findByIdAndUpdate(id, data, { new: true })
  return NextResponse.json({ trainer })
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const { id } = await req.json()
  await Trainer.findByIdAndDelete(id)
  return NextResponse.json({ success: true })
}