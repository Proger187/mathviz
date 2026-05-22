'use client'

import { useTranslation } from '@/i18n/useTranslation'

export function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white/80 py-6 safe-bottom">
      <div className="mx-auto max-w-5xl px-4 text-center text-sm text-slate-500 sm:px-6">
        <p>
          © {year} {t('common.appName')} — {t('nav.tagline')}
        </p>
      </div>
    </footer>
  )
}
