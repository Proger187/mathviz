'use client'

import { useEffect } from 'react'

import { useTranslation } from './useTranslation'

const LANG_MAP: Record<string, string> = {
  en: 'en',
  ru: 'ru',
  kg: 'ky',
}

export function HtmlLangSync() {
  const { locale } = useTranslation()

  useEffect(() => {
    document.documentElement.lang = LANG_MAP[locale] ?? locale
  }, [locale])

  return null
}
