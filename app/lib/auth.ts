import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET!

export function signToken(payload: object) {
  return jwt.sign(payload, SECRET, { expiresIn: '8h' })
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET) as any
  } catch {
    return null
  }
}

// In-memory OTP store (fine for single admin)
const otpStore = new Map<string, { otp: string; expires: number }>()

export function storeOTP(email: string, otp: string) {
  otpStore.set(email, {
    otp,
    expires: Date.now() + 10 * 60 * 1000, // 10 min
  })
}

export function verifyOTP(email: string, otp: string): boolean {
  const entry = otpStore.get(email)
  if (!entry) return false
  if (Date.now() > entry.expires) {
    otpStore.delete(email)
    return false
  }
  if (entry.otp !== otp) return false
  otpStore.delete(email)
  return true
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}