'use client'

import { useContext } from 'react'

import { I18nContext } from './I18nProvider'
import type { I18nContextValue } from './I18nProvider'

export function useTranslation(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (ctx === null) {
    throw new Error('useTranslation must be used inside <I18nProvider>')
  }
  return ctx
}
