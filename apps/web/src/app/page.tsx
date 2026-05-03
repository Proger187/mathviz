// This file is superseded by app/(public)/page.tsx which takes priority
// at the "/" route. Kept as a fallback only.
import en from '@/i18n/en.json'
import { getTranslation } from '@/i18n/getTranslation'

function t(key: string): string {
  return getTranslation(en, en, key)
}

export default function RootFallbackPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold">{t('common.appName')}</h1>
      <p className="mt-4 text-lg text-gray-600">{t('landing.heroSubtitle')}</p>
    </main>
  )
}
