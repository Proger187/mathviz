'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { NavIcon } from '@/components/icons/NavIcons'
import {
  ACCOUNT_NAV,
  CALCULATOR_NAV,
  MAIN_NAV,
  QUIZ_NAV,
  sectionHasActive,
  type NavItem,
} from '@/config/navigation'
import { ROUTES } from '@/config/routes'
import { useTranslation } from '@/i18n/useTranslation'
import { apiFetch } from '@/lib/api-client'
import { cn } from '@/lib/cn'
import { useAuthStore } from '@/store/auth.store'

import { LanguageSwitcher } from './LanguageSwitcher'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

function NavLink({
  item,
  pathname,
  onNavigate,
}: {
  item: NavItem
  pathname: string
  onNavigate: () => void
}) {
  const { t } = useTranslation()
  const isActive = item.match ? item.match(pathname) : pathname === item.href

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
        isActive ? 'bg-indigo-600 text-white' : 'text-slate-700 hover:bg-slate-100',
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      <NavIcon name={item.icon} className={isActive ? 'text-white' : 'text-indigo-600'} />
      <span className="truncate text-sm font-medium">{t(item.labelKey)}</span>
    </Link>
  )
}

function CollapsibleGroup({
  titleKey,
  groupIcon,
  items,
  pathname,
  onNavigate,
}: {
  titleKey: string
  groupIcon: 'calculator' | 'quiz'
  items: NavItem[]
  pathname: string
  onNavigate: () => void
}) {
  const { t } = useTranslation()
  const isGroupActive = sectionHasActive(items, pathname)
  const [expanded, setExpanded] = useState(isGroupActive)

  useEffect(() => {
    if (isGroupActive) setExpanded(true)
  }, [isGroupActive])

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className={cn(
          'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
          isGroupActive && !expanded
            ? 'bg-indigo-50 text-indigo-800'
            : 'text-slate-800 hover:bg-slate-100',
        )}
        aria-expanded={expanded}
      >
        <NavIcon name={groupIcon} className="text-indigo-600" />
        <span className="flex-1 truncate text-sm font-semibold">{t(titleKey)}</span>
        <NavIcon
          name="chevron"
          className={cn('h-4 w-4 text-slate-400 transition-transform', expanded && 'rotate-90')}
        />
      </button>
      {expanded && (
        <div className="space-y-0.5">
          {items.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} onNavigate={onNavigate} />
          ))}
        </div>
      )}
    </div>
  )
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { t } = useTranslation()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const user = useAuthStore((s) => s.user)
  const signOut = useAuthStore((s) => s.signOut)

  async function handleLogout() {
    try {
      await apiFetch('/api/v1/auth/logout', { method: 'POST' })
    } catch {
      // still clear local session
    }
    signOut()
    onClose()
    window.location.href = ROUTES.HOME
  }

  const panel = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-slate-200/80 px-4 py-3.5">
        <Link
          href={ROUTES.HOME}
          onClick={onClose}
          className="text-lg font-bold text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md"
        >
          {t('common.appName')}
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
          aria-label={t('nav.closeMenu')}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            aria-hidden
            className="text-slate-500"
          >
            <path
              d="M2 2L16 16M16 2L2 16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {isAuthenticated && user && (
        <Link
          href={ROUTES.DASHBOARD}
          onClick={onClose}
          className="mx-3 mt-3 flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700 hover:bg-slate-200"
        >
          <NavIcon name="user" className="text-indigo-600" />
          <span className="truncate font-medium">{user.username}</span>
          <span className="ml-auto text-xs text-slate-500">{user.xp} XP</span>
        </Link>
      )}

      <nav
        className="flex-1 space-y-1 overflow-y-auto px-3 py-3"
        aria-label={t('nav.mainNavigation')}
      >
        {MAIN_NAV.map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname} onNavigate={onClose} />
        ))}

        <CollapsibleGroup
          titleKey="nav.calculators"
          groupIcon="calculator"
          items={CALCULATOR_NAV}
          pathname={pathname}
          onNavigate={onClose}
        />

        <CollapsibleGroup
          titleKey="nav.quizzes"
          groupIcon="quiz"
          items={QUIZ_NAV}
          pathname={pathname}
          onNavigate={onClose}
        />

        {isAuthenticated &&
          ACCOUNT_NAV.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} onNavigate={onClose} />
          ))}
      </nav>

      <div className="space-y-3 border-t border-slate-200/80 p-3">
        <LanguageSwitcher />

        {isAuthenticated ? (
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <NavIcon name="logout" className="h-4 w-4" />
            {t('nav.logout')}
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <Link
              href={ROUTES.LOGIN}
              onClick={onClose}
              className="rounded-lg border border-slate-200 py-2 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {t('nav.login')}
            </Link>
            <Link
              href={ROUTES.REGISTER}
              onClick={onClose}
              className="rounded-lg bg-indigo-600 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-700"
            >
              {t('nav.register')}
            </Link>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        aria-hidden={!open}
        onClick={onClose}
      />

      <aside
        id="app-sidebar"
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[min(100vw-3rem,16rem)] flex-col border-r border-slate-200/80 bg-white shadow-xl transition-transform duration-200 ease-out',
          'lg:fixed lg:z-auto lg:w-60 lg:translate-x-0 lg:shadow-none lg:inset-y-0 lg:left-0',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
        aria-label={t('nav.mainNavigation')}
      >
        {panel}
      </aside>
    </>
  )
}
