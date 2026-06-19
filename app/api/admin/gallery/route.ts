import { NextRequest, NextResponse } from 'next/server'
import { requireAdminPage } from '@/app/lib/admin-authz'
import { connectDB } from '@/app/lib/mongodb'
import GalleryImage from '@/app/models/GalleryImage'

export async function GET(req: NextRequest) {
  const guard = await requireAdminPage(req, 'gallery')
  if (guard.response) return guard.response
  await connectDB()
  const images = await GalleryImage.find({}).sort({ order: 1 })
  return NextResponse.json({ images })
}

export async function POST(req: NextRequest) {
  const guard = await requireAdminPage(req, 'gallery')
  if (guard.response) return guard.response
  await connectDB()
  const body = await req.json()
  const image = await GalleryImage.create(body)
  return NextResponse.json({ image })
}

export async function PUT(req: NextRequest) {
  const guard = await requireAdminPage(req, 'gallery')
  if (guard.response) return guard.response
  await connectDB()
  const { id, ...data } = await req.json()
  const image = await GalleryImage.findByIdAndUpdate(id, data, { new: true })
  return NextResponse.json({ image })
}

export async function DELETE(req: NextRequest) {
  const guard = await requireAdminPage(req, 'gallery')
  if (guard.response) return guard.response
  await connectDB()
  const { id } = await req.json()
  await GalleryImage.findByIdAndDelete(id)
  return NextResponse.json({ success: true })
}
