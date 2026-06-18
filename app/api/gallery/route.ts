import { NextResponse } from 'next/server'
import { connectDB } from '@/app/lib/mongodb'
import GalleryImage from '@/app/models/GalleryImage'

export async function GET() {
  try {
    await connectDB()
    const images = await GalleryImage.find({ isActive: true }).sort({ order: 1, createdAt: -1 })
    return NextResponse.json({ images })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Unable to load gallery' }, { status: 500 })
  }
}
