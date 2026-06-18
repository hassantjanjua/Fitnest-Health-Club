import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { generateOTP, storeOTP } from '@/app/lib/auth'
import { sendOTPEmail } from '@/app/lib/email'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    const adminEmail = process.env.ADMIN_EMAIL!
    const adminPassword = process.env.ADMIN_PASSWORD!

    if (email !== adminEmail) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    if (password !== adminPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const otp = generateOTP()
    storeOTP(email, otp)
    await sendOTPEmail(email, otp)

    return NextResponse.json({ success: true, message: 'OTP sent to your email' })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}