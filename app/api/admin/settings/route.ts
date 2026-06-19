import { NextRequest, NextResponse } from 'next/server'
import { requireAdminPage } from '@/app/lib/admin-authz'
import { connectDB } from '@/app/lib/mongodb'
import SiteSettings from '@/app/models/SiteSettings'

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
  const guard = requireAdminPage(req, 'settings')
  if (guard.response) return guard.response

  const settings = await getSettings()
  return NextResponse.json({ settings })
}

export async function PUT(req: NextRequest) {
  const guard = requireAdminPage(req, 'settings')
  if (guard.response) return guard.response

  await connectDB()
  const body = await req.json()
  const settings = await SiteSettings.findOneAndUpdate(
    {},
    { $set: body },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )

  return NextResponse.json({ settings })
}
