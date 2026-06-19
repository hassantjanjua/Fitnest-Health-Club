import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/app/lib/auth'
import { normalizeAllowedPages } from '@/app/lib/admin-permissions'
import { connectDB } from '@/app/lib/mongodb'
import Admin from '@/app/models/Admin'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value
  const session = token ? verifyToken(token) : null

  if (!session) {
    const res = NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    res.cookies.delete('admin_token')
    return res
  }

  await connectDB()
  const user = session.id ? await Admin.findOne({ _id: session.id, isActive: true }) : null

  if (!user) {
    const res = NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    res.cookies.delete('admin_token')
    return res
  }

  return NextResponse.json({
    session: {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      assignmentScope: user.assignmentScope,
      assignedTo: user.assignedTo,
      allowedPages: normalizeAllowedPages(user.role, user.allowedPages),
      sessionDuration: user.sessionDuration,
      expiresAt: session.exp ? session.exp * 1000 : null,
    },
  })
}
