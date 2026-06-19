import { NextRequest, NextResponse } from 'next/server'
import { requireAdminPage } from '@/app/lib/admin-authz'
import { connectDB } from '@/app/lib/mongodb'
import Customer from '@/app/models/Customer'

export async function GET(req: NextRequest) {
  const guard = requireAdminPage(req, 'customers')
  if (guard.response) return guard.response
  await connectDB()
  const customers = await Customer.find({}).sort({ createdAt: -1 })
  return NextResponse.json({ customers })
}

export async function POST(req: NextRequest) {
  const guard = requireAdminPage(req, 'customers')
  if (guard.response) return guard.response
  await connectDB()
  const body = await req.json()
  const customer = await Customer.create(body)
  return NextResponse.json({ customer })
}

export async function PUT(req: NextRequest) {
  const guard = requireAdminPage(req, 'customers')
  if (guard.response) return guard.response
  await connectDB()
  const { id, ...data } = await req.json()
  const customer = await Customer.findByIdAndUpdate(id, data, { new: true })
  return NextResponse.json({ customer })
}

export async function DELETE(req: NextRequest) {
  const guard = requireAdminPage(req, 'customers')
  if (guard.response) return guard.response
  await connectDB()
  const { id } = await req.json()
  await Customer.findByIdAndDelete(id)
  return NextResponse.json({ success: true })
}
