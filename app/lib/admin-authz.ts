import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/app/lib/auth'
import { canAccessPage, type AdminPageKey } from '@/app/lib/admin-permissions'

export function getSessionFromRequest(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value
  return token ? verifyToken(token) : null
}

export function requireAdminPage(req: NextRequest, page: AdminPageKey) {
  const session = getSessionFromRequest(req)

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
