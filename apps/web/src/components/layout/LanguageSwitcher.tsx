'use client'

import type { Locale } from '@mathviz/shared'
import { LOCALES } from '@mathviz/shared'

import { useTranslation } from '@/i18n/useTranslation'
import { cn } from '@/lib/cn'

const LOCALE_CODES: Locale[] = [...LOCALES]

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useTranslation()

  return (
    <div
      className="grid grid-cols-3 gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1"
      role="group"
      aria-label={t('nav.language')}
    >
      {LOCALE_CODES.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => setLocale(loc)}
          aria-pressed={locale === loc}
          className={cn(
            'rounded-lg px-2 py-2 text-xs font-semibold transition-colors sm:text-sm',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
            locale === loc
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900',
          )}
        >
          {t(`nav.languages.${loc}`)}
        </button>
      ))}
    </div>
  )
}
