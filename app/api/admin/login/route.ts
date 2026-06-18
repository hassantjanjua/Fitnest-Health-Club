import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { generateOTP, storeOTP } from '@/app/lib/auth'
import { connectDB } from '@/app/lib/mongodb'
import { sendOTPEmail } from '@/app/lib/email'
import Admin from '@/app/models/Admin'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    const normalizedEmail = String(email || '').trim().toLowerCase()

    if (!normalizedEmail || !password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    await connectDB()
    const admin = await Admin.findOne({ email: normalizedEmail, isActive: true }).select('+passwordHash')

    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const passwordMatches = await bcrypt.compare(String(password), admin.passwordHash)
    if (!passwordMatches) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const otp = generateOTP()
    storeOTP(normalizedEmail, otp)
    await sendOTPEmail(normalizedEmail, otp)

    return NextResponse.json({ success: true, message: 'OTP sent to your email' })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
