import type { Metadata } from 'next'
import Link from 'next/link'

import { MODES } from '@mathviz/shared'
import type { ModeId } from '@mathviz/shared'

import { ROUTES } from '@/config/routes'
import en from '@/i18n/en.json'
import { getTranslation } from '@/i18n/getTranslation'

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
    <div className="-mx-4 -mt-6 sm:-mx-6 sm:-mt-8">
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700 text-white">
        <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 sm:px-6 sm:py-16 md:grid-cols-2 md:items-center lg:py-20">
          <div className="flex flex-col gap-6">
            <p className="inline-flex w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
              {t('nav.tagline')}
            </p>
            <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {t('landing.heroTitle')}
            </h1>
            <p className="max-w-md text-base leading-relaxed text-indigo-100 sm:text-lg">
              {t('landing.heroSubtitle')}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href={ROUTES.REGISTER}
                className="rounded-xl bg-white px-5 py-3 text-center text-sm font-bold text-indigo-700 shadow-lg hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {t('landing.primaryCta')}
              </Link>
              <Link
                href={ROUTES.CALCULATOR('fractions')}
                className="rounded-xl border border-white/40 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {t('landing.secondaryCta')}
              </Link>
            </div>
          </div>

          <div
            aria-hidden
            className="grid grid-cols-2 gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur sm:gap-4 sm:p-6"
          >
            {(Object.values(MODES) as { id: ModeId; icon: string }[]).map((mode) => (
              <Link
                key={mode.id}
                href={ROUTES.CALCULATOR(mode.id)}
                className="flex flex-col items-center gap-2 rounded-xl bg-white/15 p-4 transition hover:bg-white/25"
              >
                <span className="text-3xl sm:text-4xl">{mode.icon}</span>
                <span className="text-center text-xs font-semibold leading-tight sm:text-sm">
                  {t(`modes.${mode.id}.label`)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">{t('landing.modesTitle')}</h2>
        <p className="mt-2 max-w-2xl text-slate-600">{t('landing.modesSubtitle')}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {(Object.values(MODES) as { id: ModeId; icon: string }[]).map((mode) => (
            <article
              key={mode.id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card transition hover:shadow-card-hover sm:p-6"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-2xl">
                  {mode.icon}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {t(`modes.${mode.id}.label`)}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    {t(`modes.${mode.id}.description`)}
                  </p>
                </div>
              </div>
              <div className="mt-auto flex flex-wrap gap-2">
                <Link
                  href={ROUTES.CALCULATOR(mode.id)}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  {t('landing.tryIt')}
                </Link>
                <Link
                  href={ROUTES.QUIZ(mode.id)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  {t('quiz.start')}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-slate-100/80 py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-slate-900">{t('landing.gamificationTitle')}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {GAMIFICATION_CARDS.map((card) => (
              <div
                key={card.titleKey}
                className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card sm:p-6"
              >
                <span className="text-3xl">{card.icon}</span>
                <h3 className="mt-3 font-semibold text-slate-900">{t(card.titleKey)}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{t(card.bodyKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 text-center sm:py-20">
        <div className="mx-auto max-w-lg px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-slate-900">{t('landing.ctaTitle')}</h2>
          <p className="mt-3 text-slate-600">{t('landing.ctaBody')}</p>
          <Link
            href={ROUTES.REGISTER}
            className="mt-6 inline-block rounded-xl bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-lg hover:bg-indigo-700"
          >
            {t('landing.ctaButton')}
          </Link>
        </div>
      </section>
    </div>
  )
}
