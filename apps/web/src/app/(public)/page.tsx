import type { Metadata } from 'next'
import Link from 'next/link'

import { MODES } from '@mathviz/shared'
import type { ModeId } from '@mathviz/shared'

import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { ROUTES } from '@/config/routes'
import en from '@/i18n/en.json'
import { getTranslation } from '@/i18n/getTranslation'

// Server-side translation helper — always uses English for RSC render.
// Client components (Header, LanguageSwitcher) handle locale switching.
function t(key: string, params?: Record<string, string>): string {
  return getTranslation(en, en, key, params)
}

export const metadata: Metadata = {
  title: t('landing.heroTitle'),
  description: t('landing.heroSubtitle'),
}

const GAMIFICATION_CARDS = [
  { icon: '⭐', titleKey: 'landing.xpTitle', bodyKey: 'landing.xpBody' },
  { icon: '🔥', titleKey: 'landing.streakTitle', bodyKey: 'landing.streakBody' },
  { icon: '🏅', titleKey: 'landing.badgesTitle', bodyKey: 'landing.badgesBody' },
] as const

export default function LandingPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex flex-col">
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="bg-gradient-to-br from-indigo-50 to-white">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 md:grid-cols-2 md:items-center">
            {/* Left: text + CTAs */}
            <div className="flex flex-col gap-6">
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 md:text-5xl">
                {t('landing.heroTitle')}
              </h1>
              <p className="max-w-md text-lg text-gray-600">{t('landing.heroSubtitle')}</p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={ROUTES.REGISTER}
                  className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  {t('landing.primaryCta')}
                </Link>
                <Link
                  href={ROUTES.CALCULATOR('fractions')}
                  className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  {t('landing.secondaryCta')}
                </Link>
              </div>
            </div>

            {/* Right: visual preview placeholder */}
            <div
              aria-hidden="true"
              className="hidden rounded-2xl border border-indigo-100 bg-white p-8 shadow-md md:flex md:flex-col md:items-center md:justify-center md:gap-4"
            >
              <div className="grid grid-cols-2 gap-4">
                {(Object.values(MODES) as { id: ModeId; icon: string }[]).map((mode) => (
                  <div
                    key={mode.id}
                    className="flex flex-col items-center gap-1 rounded-xl bg-indigo-50 p-4"
                  >
                    <span className="text-4xl">{mode.icon}</span>
                    <span className="text-xs font-medium capitalize text-indigo-600">{mode.id}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Mode highlights ──────────────────────────────────── */}
        <section className="mx-auto w-full max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-bold text-gray-900">{t('landing.modesTitle')}</h2>
          <p className="mt-2 text-gray-500">{t('landing.modesSubtitle')}</p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {(Object.values(MODES) as { id: ModeId; icon: string }[]).map((mode) => (
              <div
                key={mode.id}
                className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{mode.icon}</span>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t(`modes.${mode.id}.label`)}
                  </h3>
                </div>
                <p className="text-sm text-gray-500">{t(`modes.${mode.id}.description`)}</p>
                <Link
                  href={ROUTES.CALCULATOR(mode.id)}
                  className="mt-auto w-fit rounded-md bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  {t('landing.tryIt')}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ── Gamification ─────────────────────────────────────── */}
        <section className="bg-gray-50 py-16">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-2xl font-bold text-gray-900">{t('landing.gamificationTitle')}</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {GAMIFICATION_CARDS.map((card) => (
                <div key={card.titleKey} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <span className="text-3xl">{card.icon}</span>
                  <h3 className="mt-3 text-base font-semibold text-gray-900">{t(card.titleKey)}</h3>
                  <p className="mt-1 text-sm text-gray-500">{t(card.bodyKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Account CTA ──────────────────────────────────────── */}
        <section className="py-20 text-center">
          <div className="mx-auto max-w-xl px-4">
            <h2 className="text-2xl font-bold text-gray-900">{t('landing.ctaTitle')}</h2>
            <p className="mt-3 text-gray-500">{t('landing.ctaBody')}</p>
            <Link
              href={ROUTES.REGISTER}
              className="mt-6 inline-block rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              {t('landing.ctaButton')}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
