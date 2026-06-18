import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/app/lib/auth'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value
  const session = token ? verifyToken(token) : null

  if (!session) {
    const res = NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    res.cookies.delete('admin_token')
    return res
  }

  return NextResponse.json({
    session: {
      id: session.id,
      email: session.email,
      name: session.name,
      role: session.role,
      assignmentScope: session.assignmentScope,
      assignedTo: session.assignedTo,
      sessionDuration: session.sessionDuration,
      expiresAt: session.exp ? session.exp * 1000 : null,
    },
  })
}
