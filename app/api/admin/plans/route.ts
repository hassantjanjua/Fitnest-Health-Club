import { NextRequest, NextResponse } from 'next/server'
import { requireAdminPage } from '@/app/lib/admin-authz'
import { connectDB } from '@/app/lib/mongodb'
import Plan from '@/app/models/Plans'

export async function GET(req: NextRequest) {
  const guard = await requireAdminPage(req, 'pricing')
  if (guard.response) return guard.response
  await connectDB()
  const plans = await Plan.find({}).sort({ createdAt: 1 })
  return NextResponse.json({ plans })
}

export async function POST(req: NextRequest) {
  const guard = await requireAdminPage(req, 'pricing')
  if (guard.response) return guard.response
  await connectDB()
  const body = await req.json()
  const plan = await Plan.create(body)
  return NextResponse.json({ plan })
}

export async function PUT(req: NextRequest) {
  const guard = await requireAdminPage(req, 'pricing')
  if (guard.response) return guard.response
  await connectDB()
  const { id, ...data } = await req.json()
  const plan = await Plan.findByIdAndUpdate(id, data, { new: true })
  return NextResponse.json({ plan })
}

export async function DELETE(req: NextRequest) {
  const guard = await requireAdminPage(req, 'pricing')
  if (guard.response) return guard.response
  await connectDB()
  const { id } = await req.json()
  await Plan.findByIdAndDelete(id)
  return NextResponse.json({ success: true })
}
