'use client'

import { useTranslation } from '@/i18n/useTranslation'
import en from '@/i18n/en.json'
import { getTranslation } from '@/i18n/getTranslation'

function t(key: string, params?: Record<string, string>): string {
  return getTranslation(en, en, key, params)
}

export function LanguageBanner() {
  const { setLocale } = useTranslation()

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧', description: 'Learn in English' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺', description: 'Учитесь на русском' },
    { code: 'kg', name: 'Кыргызча', flag: '🇰🇬', description: 'Кыргызча окуңуз' },
  ] as const

  return (
    <section className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            {t('landing.languageBannerTitle')}
          </h2>
          <p className="mt-4 text-lg text-indigo-100">{t('landing.languageBannerSubtitle')}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLocale(lang.code as 'en' | 'ru' | 'kg')}
              className="group relative flex flex-col items-center gap-4 rounded-2xl border-2 border-white/20 bg-white/10 p-8 backdrop-blur transition hover:border-white hover:bg-white/20"
            >
              <div className="text-6xl">{lang.flag}</div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-white">{lang.name}</h3>
                <p className="mt-1 text-sm text-indigo-100">{lang.description}</p>
              </div>
              <button className="rounded-lg bg-white px-6 py-2 font-semibold text-indigo-600 shadow-lg transition group-hover:shadow-xl">
                {t('landing.languageSwitchButton')}
              </button>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
