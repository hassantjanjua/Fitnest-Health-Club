import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/app/lib/auth'
import { connectDB } from '@/app/lib/mongodb'
import Customer from '@/app/models/Customer'

function checkAuth(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value
  if (!token) return false
  return verifyToken(token)
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const customers = await Customer.find({}).sort({ createdAt: -1 })
  return NextResponse.json({ customers })
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const body = await req.json()
  const customer = await Customer.create(body)
  return NextResponse.json({ customer })
}

export async function PUT(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const { id, ...data } = await req.json()
  const customer = await Customer.findByIdAndUpdate(id, data, { new: true })
  return NextResponse.json({ customer })
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const { id } = await req.json()
  await Customer.findByIdAndDelete(id)
  return NextResponse.json({ success: true })
}