import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/app/lib/auth'

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/admin')) {
    const isAuthPage = pathname === '/admin/login' || pathname === '/admin/otp'
    if (isAuthPage) return NextResponse.next()

    const token = req.cookies.get('admin_token')?.value
    if (!token || !verifyToken(token)) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
