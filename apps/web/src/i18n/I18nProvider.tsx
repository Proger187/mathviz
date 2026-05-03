'use client'

import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import { DEFAULT_LOCALE, LOCALES } from '@mathviz/shared'
import type { Locale } from '@mathviz/shared'

import type { TranslateParams } from './types'

import { getTranslation, translations } from './index'

const STORAGE_KEY = 'mathviz_locale'

function detectBrowserLocale(): Locale {
  if (typeof navigator === 'undefined') return DEFAULT_LOCALE

  const raw = navigator.language ?? ''
  const lower = raw.toLowerCase()

  if (lower.startsWith('ky')) return 'kg'
  if (lower.startsWith('ru')) return 'ru'
  if (lower.startsWith('en')) return 'en'
  return DEFAULT_LOCALE
}

function readStoredLocale(): Locale | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && (LOCALES as readonly string[]).includes(stored)) {
      return stored as Locale
    }
  } catch {
    // localStorage unavailable (e.g. SSR or private browsing restrictions)
  }
  return null
}

export type I18nContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, params?: TranslateParams) => string
}

export const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)

  // Initialise locale from localStorage or browser on mount (client only)
  useEffect(() => {
    const resolved = readStoredLocale() ?? detectBrowserLocale()
    setLocaleState(resolved)
  }, [])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // ignore write failures
    }
  }, [])

  const t = useCallback(
    (key: string, params?: TranslateParams) => {
      const dict = translations[locale]
      const fallback = translations[DEFAULT_LOCALE]
      return getTranslation(dict, fallback, key, params)
    },
    [locale],
  )

  const value = useMemo<I18nContextValue>(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
