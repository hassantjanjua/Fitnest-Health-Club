import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/app/lib/auth'
import { ADMIN_PAGES, canAccessPage, pageKeyFromPath } from '@/app/lib/admin-permissions'

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/admin')) {
    const isAuthPage = pathname === '/admin/login' || pathname === '/admin/otp'
    if (isAuthPage) return NextResponse.next()

    const token = req.cookies.get('admin_token')?.value
    const session = token ? verifyToken(token) : null
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }

    const pageKey = pageKeyFromPath(pathname)
    if (pageKey && !canAccessPage(session, pageKey)) {
      const fallback = ADMIN_PAGES.find(page => canAccessPage(session, page.key))?.href || '/admin/login'
      return NextResponse.redirect(new URL(fallback, req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
