import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { verifyToken, normalizeSessionDuration } from '@/app/lib/auth'
import { connectDB } from '@/app/lib/mongodb'
import Admin from '@/app/models/Admin'

const roles = ['owner', 'admin', 'manager']
const assignmentScopes = ['full-control', 'assigned-control', 'handover-control']

type AdminDocument = {
  _id: { toString(): string }
  email: string
  name: string
  role: string
  assignmentScope: string
  assignedTo?: string
  sessionDuration?: string
  isActive: boolean
  lastLoginAt?: Date | string | null
  createdAt?: Date | string
  updatedAt?: Date | string
}

function getSession(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value
  return token ? verifyToken(token) : null
}

function cleanUser(user: AdminDocument) {
  return {
    _id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
    assignmentScope: user.assignmentScope,
    assignedTo: user.assignedTo || '',
    sessionDuration: user.sessionDuration || '1d',
    isActive: user.isActive,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

function normalizeBody(body: Record<string, unknown>) {
  const requestedRole = String(body.role || '')
  const requestedAssignmentScope = String(body.assignmentScope || '')
  const role = roles.includes(requestedRole) ? requestedRole : 'manager'
  const assignmentScope = assignmentScopes.includes(requestedAssignmentScope) ? requestedAssignmentScope : 'assigned-control'

  return {
    email: String(body.email || '').trim().toLowerCase(),
    name: String(body.name || '').trim() || 'Admin User',
    role,
    assignmentScope,
    assignedTo: String(body.assignedTo || '').trim(),
    sessionDuration: normalizeSessionDuration(body.sessionDuration),
    isActive: body.isActive === undefined ? true : Boolean(body.isActive),
  }
}

export async function GET(req: NextRequest) {
  if (!getSession(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const users = await Admin.find({}).sort({ role: 1, name: 1 })
  return NextResponse.json({ users: users.map(cleanUser) })
}

export async function POST(req: NextRequest) {
  if (!getSession(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const nextUser = normalizeBody(body)
  const password = String(body.password || '')

  if (!nextUser.email || password.length < 8) {
    return NextResponse.json({ error: 'Email and an 8+ character password are required' }, { status: 400 })
  }

  await connectDB()
  const existing = await Admin.findOne({ email: nextUser.email })
  if (existing) {
    return NextResponse.json({ error: 'A user with this email already exists' }, { status: 409 })
  }

  const user = await Admin.create({
    ...nextUser,
    passwordHash: await bcrypt.hash(password, 12),
  })

  return NextResponse.json({ user: cleanUser(user) }, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const session = getSession(req)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const id = String(body.id || '')
  const nextUser = normalizeBody(body)

  if (!id || !nextUser.email) {
    return NextResponse.json({ error: 'User id and email are required' }, { status: 400 })
  }

  await connectDB()
  const duplicate = await Admin.findOne({ email: nextUser.email, _id: { $ne: id } })
  if (duplicate) {
    return NextResponse.json({ error: 'A user with this email already exists' }, { status: 409 })
  }

  const update: Record<string, unknown> = { ...nextUser }
  if (String(body.password || '').length > 0) {
    if (String(body.password).length < 8) {
      return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 })
    }
    update.passwordHash = await bcrypt.hash(String(body.password), 12)
  }

  if (body.handoverControl) {
    update.role = 'owner'
    update.assignmentScope = 'full-control'
    update.assignedTo = ''

    if (session.id && session.id !== id) {
      await Admin.findByIdAndUpdate(session.id, {
        $set: {
          role: 'admin',
          assignmentScope: 'handover-control',
          assignedTo: `Control handed over to ${nextUser.email}`,
        },
      })
    }
  }

  const user = await Admin.findByIdAndUpdate(id, { $set: update }, { new: true })
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json({ user: cleanUser(user) })
}

export async function DELETE(req: NextRequest) {
  const session = getSession(req)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await req.json()
  const targetId = String(id || '')

  if (!targetId) {
    return NextResponse.json({ error: 'User id is required' }, { status: 400 })
  }

  if (session.id === targetId) {
    return NextResponse.json({ error: 'You cannot delete your own active account' }, { status: 400 })
  }

  await connectDB()
  const owners = await Admin.countDocuments({ role: 'owner', isActive: true })
  const target = await Admin.findById(targetId)

  if (!target) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  if (target.role === 'owner' && owners <= 1) {
    return NextResponse.json({ error: 'Create or hand over to another owner before deleting this one' }, { status: 400 })
  }

  await target.deleteOne()
  return NextResponse.json({ success: true })
}
