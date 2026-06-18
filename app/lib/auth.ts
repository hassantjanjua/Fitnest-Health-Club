import jwt from 'jsonwebtoken'
import type { JwtPayload } from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET!

export const SESSION_DURATIONS = {
  '1d': { label: '1 day', seconds: 60 * 60 * 24 },
  '1w': { label: '1 week', seconds: 60 * 60 * 24 * 7 },
  '1m': { label: '1 month', seconds: 60 * 60 * 24 * 30 },
} as const

export type SessionDuration = keyof typeof SESSION_DURATIONS

export type AdminTokenPayload = JwtPayload & {
  id?: string
  email?: string
  name?: string
  role?: string
  assignmentScope?: string
  assignedTo?: string
  sessionDuration?: SessionDuration
}

export function normalizeSessionDuration(value: unknown): SessionDuration {
  return value === '1w' || value === '1m' ? value : '1d'
}

export function getSessionMaxAge(value: unknown) {
  return SESSION_DURATIONS[normalizeSessionDuration(value)].seconds
}

export function signToken(payload: object, sessionDuration: unknown = '1d') {
  return jwt.sign(payload, SECRET, { expiresIn: getSessionMaxAge(sessionDuration) })
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET) as AdminTokenPayload
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
