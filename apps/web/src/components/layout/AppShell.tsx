'use client'

import { useEffect, useState, type ReactNode } from 'react'

import { useTranslation } from '@/i18n/useTranslation'
import { cn } from '@/lib/cn'

import { NavIcon } from '@/components/icons/NavIcons'

import { Footer } from './Footer'
import { MobileBottomNav } from './MobileBottomNav'
import { Sidebar } from './Sidebar'

export type AppShellVariant = 'default' | 'minimal'

interface AppShellProps {
  children: ReactNode
  variant?: AppShellVariant
}

export function AppShell({ children, variant = 'default' }: AppShellProps) {
  const { t } = useTranslation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const showSidebar = variant === 'default'

  useEffect(() => {
    if (!sidebarOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [sidebarOpen])

  useEffect(() => {
    setSidebarOpen(false)
  }, [children])

  return (
    <div className="min-h-screen bg-slate-50">
      {showSidebar && <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />}

      <div className={cn('flex min-h-screen flex-col', showSidebar && 'lg:ml-60')}>
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
          <div className="flex h-12 items-center gap-3 px-4 sm:h-14 sm:px-6">
            {showSidebar && (
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 lg:hidden"
                onClick={() => setSidebarOpen(true)}
                aria-label={t('nav.openMenu')}
                aria-controls="app-sidebar"
                aria-expanded={sidebarOpen}
              >
                <NavIcon name="menu" className="h-5 w-5" />
              </button>
            )}
            <div className="min-w-0 flex-1 lg:hidden">
              <p className="truncate text-sm font-bold text-indigo-600">{t('common.appName')}</p>
              <p className="truncate text-xs text-slate-500">{t('nav.tagline')}</p>
            </div>
            {variant === 'minimal' && (
              <div className="ml-auto flex items-center gap-3">
                <LanguageSwitcherCompact />
              </div>
            )}
          </div>
        </header>

        <main
          id="main-content"
          className={cn('flex-1 px-4 py-6 sm:px-6 sm:py-8', showSidebar && 'pb-24 lg:pb-8')}
        >
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>

        <Footer />
      </div>

      {showSidebar && <MobileBottomNav onOpenMenu={() => setSidebarOpen(true)} />}
    </div>
  )
}

function LanguageSwitcherCompact() {
  const { locale, setLocale, t } = useTranslation()
  const locales = [
    { code: 'en' as const, labelKey: 'nav.languages.en' },
    { code: 'ru' as const, labelKey: 'nav.languages.ru' },
    { code: 'kg' as const, labelKey: 'nav.languages.kg' },
  ]

  return (
    <div
      className="flex rounded-lg border border-slate-200 bg-white text-xs"
      role="group"
      aria-label={t('nav.language')}
    >
      {locales.map(({ code, labelKey }) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          aria-pressed={locale === code}
          className={cn(
            'px-2.5 py-1.5 font-medium first:rounded-l-lg last:rounded-r-lg',
            locale === code ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50',
          )}
        >
          {t(labelKey)}
        </button>
      ))}
    </div>
  )
}
