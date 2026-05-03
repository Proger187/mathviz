'use client'

import type { Locale } from '@mathviz/shared'
import { LOCALES } from '@mathviz/shared'

import { useTranslation } from '@/i18n/useTranslation'

const LOCALE_LABELS: Record<Locale, string> = {
  en: 'EN',
  ru: 'RU',
  kg: 'КЫР',
}

export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation()

  return (
    <div className="flex rounded-md border border-gray-200 bg-white" role="group" aria-label="Language">
      {LOCALES.map((loc) => (
        <button
          key={loc}
          onClick={() => setLocale(loc)}
          aria-pressed={locale === loc}
          className={`px-2.5 py-1 text-xs font-medium transition-colors first:rounded-l-md last:rounded-r-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
            locale === loc
              ? 'bg-indigo-600 text-white'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          {LOCALE_LABELS[loc]}
        </button>
      ))}
    </div>
  )
}
