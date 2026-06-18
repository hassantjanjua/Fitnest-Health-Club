import { NextRequest, NextResponse } from 'next/server'
import { getSessionMaxAge, normalizeSessionDuration, verifyOTP, signToken } from '@/app/lib/auth'
import { connectDB } from '@/app/lib/mongodb'
import Admin from '@/app/models/Admin'

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json()
    const normalizedEmail = String(email || '').trim().toLowerCase()

    const isValid = verifyOTP(normalizedEmail, otp)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 401 })
    }

    await connectDB()
    const admin = await Admin.findOneAndUpdate(
      { email: normalizedEmail, isActive: true },
      { $set: { lastLoginAt: new Date() } },
      { new: true }
    )

    if (!admin) {
      return NextResponse.json({ error: 'Admin account is disabled' }, { status: 401 })
    }

    const sessionDuration = normalizeSessionDuration(admin.sessionDuration)
    const token = signToken({
      id: admin._id.toString(),
      email: normalizedEmail,
      name: admin.name,
      role: admin.role,
      assignmentScope: admin.assignmentScope,
      assignedTo: admin.assignedTo,
      sessionDuration,
    }, sessionDuration)

    const res = NextResponse.json({ success: true })
    res.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: getSessionMaxAge(sessionDuration),
      path: '/',
    })

    return res
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
