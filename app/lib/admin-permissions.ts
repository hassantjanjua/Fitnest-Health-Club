import type { AdminTokenPayload } from '@/app/lib/auth'

export const ADMIN_PAGES = [
  { key: 'overview', label: 'Overview', href: '/admin/dashboard' },
  { key: 'messages', label: 'Messages', href: '/admin/dashboard/messages' },
  { key: 'customers', label: 'Customers', href: '/admin/dashboard/customers' },
  { key: 'pricing', label: 'Pricing Plans', href: '/admin/dashboard/pricing' },
  { key: 'trainers', label: 'Trainers', href: '/admin/dashboard/trainers' },
  { key: 'gallery', label: 'Gallery', href: '/admin/dashboard/gallery' },
  { key: 'settings', label: 'User Access', href: '/admin/dashboard/settings' },
] as const

export type AdminPageKey = (typeof ADMIN_PAGES)[number]['key']

export const ALL_ADMIN_PAGE_KEYS = ADMIN_PAGES.map(page => page.key) as AdminPageKey[]

export const DEFAULT_ROLE_PAGES: Record<string, AdminPageKey[]> = {
  owner: ALL_ADMIN_PAGE_KEYS,
  admin: ['overview', 'messages', 'customers', 'pricing', 'trainers', 'gallery'],
  manager: ['overview', 'messages', 'customers'],
}

const pageByHref = new Map<string, AdminPageKey>(ADMIN_PAGES.map(page => [page.href, page.key]))

export function normalizeAllowedPages(role: string | undefined, allowedPages: unknown): AdminPageKey[] {
  if (role === 'owner') return ALL_ADMIN_PAGE_KEYS

  const fallback = DEFAULT_ROLE_PAGES[role || 'manager'] || DEFAULT_ROLE_PAGES.manager
  const requested = Array.isArray(allowedPages) ? allowedPages : fallback
  const normalized = requested.filter((page): page is AdminPageKey =>
    typeof page === 'string' && ALL_ADMIN_PAGE_KEYS.includes(page as AdminPageKey)
  )

  return normalized.length > 0 ? normalized : fallback
}

export function canAccessPage(session: AdminTokenPayload | null, page: AdminPageKey) {
  if (!session) return false
  if (session.role === 'owner') return true
  return normalizeAllowedPages(session.role, session.allowedPages).includes(page)
}

export function pageKeyFromPath(pathname: string): AdminPageKey | null {
  if (pathname === '/admin/dashboard') return 'overview'

  const direct = pageByHref.get(pathname)
  if (direct) return direct

  const match = ADMIN_PAGES.find(page => page.href !== '/admin/dashboard' && pathname.startsWith(`${page.href}/`))
  return match?.key || null
}
