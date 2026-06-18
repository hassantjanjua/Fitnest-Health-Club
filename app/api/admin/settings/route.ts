import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/app/lib/auth'
import { connectDB } from '@/app/lib/mongodb'
import SiteSettings from '@/app/models/SiteSettings'

function checkAuth(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value
  if (!token) return false
  return verifyToken(token)
}

async function getSettings() {
  await connectDB()
  const settings = await SiteSettings.findOneAndUpdate(
    {},
    { $setOnInsert: {} },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )
  return settings
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const settings = await getSettings()
  return NextResponse.json({ settings })
}

export async function PUT(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const body = await req.json()
  const settings = await SiteSettings.findOneAndUpdate(
    {},
    { $set: body },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )

  return NextResponse.json({ settings })
}
