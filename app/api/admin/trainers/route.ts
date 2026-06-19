import { NextRequest, NextResponse } from 'next/server'
import { requireAdminPage } from '@/app/lib/admin-authz'
import { connectDB } from '@/app/lib/mongodb'
import Trainer from '@/app/models/Trainer'

export async function GET(req: NextRequest) {
  const guard = requireAdminPage(req, 'trainers')
  if (guard.response) return guard.response
  await connectDB()
  const trainers = await Trainer.find({}).sort({ createdAt: -1 })
  return NextResponse.json({ trainers })
}

export async function POST(req: NextRequest) {
  const guard = requireAdminPage(req, 'trainers')
  if (guard.response) return guard.response
  await connectDB()
  const body = await req.json()
  const trainer = await Trainer.create(body)
  return NextResponse.json({ trainer })
}

export async function PUT(req: NextRequest) {
  const guard = requireAdminPage(req, 'trainers')
  if (guard.response) return guard.response
  await connectDB()
  const { id, ...data } = await req.json()
  const trainer = await Trainer.findByIdAndUpdate(id, data, { new: true })
  return NextResponse.json({ trainer })
}

export async function DELETE(req: NextRequest) {
  const guard = requireAdminPage(req, 'trainers')
  if (guard.response) return guard.response
  await connectDB()
  const { id } = await req.json()
  await Trainer.findByIdAndDelete(id)
  return NextResponse.json({ success: true })
}
