'use client'

import { useTranslation } from '@/i18n/useTranslation'

export function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-100 bg-white py-6">
      <div className="mx-auto max-w-6xl px-4 text-center text-sm text-gray-400">
        © {year} {t('common.appName')}
      </div>
    </footer>
  )
}
