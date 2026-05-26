'use client'

import Link from 'next/link'
import { useTranslation } from '@/i18n/useTranslation'
import { ROUTES } from '@/config/routes'

export function TopNav() {
  const { t, currentLocale, setLocale } = useTranslation()

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'kg', name: 'Кыргызча', flag: '🇰🇬' },
  ] as const

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

          {/* Language Switcher */}
          <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLocale(lang.code as 'en' | 'ru' | 'kg')}
                className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                  currentLocale === lang.code
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title={lang.name}
              >
                <span className="mr-1">{lang.flag}</span>
                {lang.code.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Auth Buttons - change based on auth state */}
          <div className="flex items-center gap-2">
            {/* Note: Auth state check - adjust based on your auth implementation */}
            {false ? (
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
