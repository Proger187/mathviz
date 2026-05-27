'use client'

import type { Locale } from '@mathviz/shared'

import { useTranslation } from '@/i18n/useTranslation'
import { cn } from '@/lib/cn'

/**
 * Always show language names in their own language (native form) so users can
 * identify their language regardless of the currently active UI locale.
 * Never use country flags for languages — flags represent countries, not languages.
 */
const NATIVE_NAMES: Record<Locale, string> = {
  en: 'English',
  ru: 'Русский',
  kg: 'Кыргызча',
}

// Ordered for the target audience (CIS / Kyrgyzstan): Kyrgyz first, then Russian, then English
const LOCALE_ORDER: Locale[] = ['kg', 'ru', 'en']

interface LanguageSwitcherProps {
  /**
   * 'pill'    — segmented pill with rounded background (sidebar footer, landing page)
   * 'compact' — flat bordered bar (app header, minimal layout)
   */
  variant?: 'pill' | 'compact'
}

export function LanguageSwitcher({ variant = 'pill' }: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useTranslation()
  const isCompact = variant === 'compact'

  return (
    <div
      className={cn(
        'flex',
        isCompact
          ? 'rounded-lg border border-slate-200 bg-white'
          : 'gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1',
      )}
      role="group"
      aria-label={t('nav.language')}
    >
      {LOCALE_ORDER.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => setLocale(loc)}
          aria-pressed={locale === loc}
          className={cn(
            'font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
            isCompact
              ? cn(
                  'px-2.5 py-1.5 text-xs first:rounded-l-lg last:rounded-r-lg',
                  locale === loc ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50',
                )
              : cn(
                  'flex-1 rounded-lg px-2 py-2 text-xs sm:text-sm',
                  locale === loc
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900',
                ),
          )}
        >
          {NATIVE_NAMES[loc]}
        </button>
      ))}
    </div>
  )
}
