import { NextRequest, NextResponse } from 'next/server'
import { verifyOTP, signToken } from '@/app/lib/auth'
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

    const token = signToken({ email: normalizedEmail, role: 'admin' })

    const res = NextResponse.json({ success: true })
    res.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8, // 8 hours
      path: '/',
    })

    return res
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
