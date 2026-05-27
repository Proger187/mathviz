'use client'

import Link from 'next/link'

import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { ROUTES } from '@/config/routes'
import { useTranslation } from '@/i18n/useTranslation'
import { useAuthStore } from '@/store/auth.store'

export function TopNav() {
  const { t } = useTranslation()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href={ROUTES.HOME} className="flex items-center gap-2 font-semibold text-slate-900">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              ∑
            </span>
            <span className="hidden text-sm sm:inline">AiMath</span>
          </Link>

          {/* Language Switcher — native language names, no flags */}
          <LanguageSwitcher variant="compact" />

          {/* Auth Buttons */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <Link
                href={ROUTES.DASHBOARD}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                {t('nav.dashboard')}
              </Link>
            ) : (
              <>
                <Link
                  href={ROUTES.LOGIN}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  href={ROUTES.REGISTER}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  {t('nav.register')}
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
