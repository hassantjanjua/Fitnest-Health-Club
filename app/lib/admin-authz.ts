import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/app/lib/auth'
import { canAccessPage, normalizeAllowedPages, type AdminPageKey } from '@/app/lib/admin-permissions'
import { connectDB } from '@/app/lib/mongodb'
import Admin from '@/app/models/Admin'

export function getSessionFromRequest(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value
  return token ? verifyToken(token) : null
}

export async function getFreshSessionFromRequest(req: NextRequest) {
  const session = getSessionFromRequest(req)
  if (!session?.id) return session

  await connectDB()
  const user = await Admin.findOne({ _id: session.id, isActive: true })
  if (!user) return null

  return {
    ...session,
    email: user.email,
    name: user.name,
    role: user.role,
    assignmentScope: user.assignmentScope,
    assignedTo: user.assignedTo,
    allowedPages: normalizeAllowedPages(user.role, user.allowedPages),
    sessionDuration: user.sessionDuration,
  }
}

export async function requireAdminPage(req: NextRequest, page: AdminPageKey) {
  const session = await getFreshSessionFromRequest(req)

  if (!session) {
    return {
      session: null,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    }
  }

  if (!canAccessPage(session, page)) {
    return {
      session,
      response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
    }
  }

  return { session, response: null }
}
