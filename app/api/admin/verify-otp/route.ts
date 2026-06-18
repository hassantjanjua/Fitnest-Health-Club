import { NextRequest, NextResponse } from 'next/server'
import { verifyOTP, signToken } from '@/app/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json()

    const isValid = verifyOTP(email, otp)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 401 })
    }

    const token = signToken({ email, role: 'admin' })

    const res = NextResponse.json({ success: true })
    res.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8, // 8 hours
      path: '/',
    })

    return res
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}