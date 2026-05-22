'use client'

import Link from 'next/link'
import { use, useState } from 'react'

import { DIFFICULTY, MODES } from '@mathviz/shared'
import type { Difficulty, ModeId } from '@mathviz/shared'

import { PageHeader } from '@/components/layout/PageHeader'
import { ROUTES } from '@/config/routes'
import { useTranslation } from '@/i18n/useTranslation'
import { cn } from '@/lib/cn'

const DIFFICULTIES = Object.values(DIFFICULTY) as Difficulty[]

export default function QuizPage({ params }: { params: Promise<{ mode: string }> }) {
  const { mode: modeParam } = use(params)
  const { t } = useTranslation()
  const modeId = modeParam as ModeId
  const mode = MODES[modeId]
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')

  if (!mode) {
    return (
      <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">
        {t('errors.NOT_FOUND')}
      </p>
    )
  }

  return (
    <>
      <PageHeader
        title={t(`modes.${modeId}.label`)}
        subtitle={t('quiz.pageSubtitle')}
        icon={mode.icon}
      />

      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card sm:p-6">
        <h2 className="text-base font-semibold text-slate-900">{t('quiz.pickDifficulty')}</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {DIFFICULTIES.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setDifficulty(level)}
              className={cn(
                'rounded-xl border px-4 py-4 text-left transition',
                difficulty === level
                  ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500/30'
                  : 'border-slate-200 hover:border-indigo-200 hover:bg-slate-50',
              )}
              aria-pressed={difficulty === level}
            >
              <span className="block text-sm font-bold text-slate-900">
                {t(`quiz.difficulty.${level}`)}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            disabled
            className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white opacity-60"
            title={t('quiz.comingSoon')}
          >
            {t('quiz.start')} ({t(`quiz.difficulty.${difficulty}`)})
          </button>
          <p className="text-sm text-slate-500">{t('quiz.comingSoon')}</p>
        </div>
      </section>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={ROUTES.CALCULATOR(modeId)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          ← {t('landing.tryIt')}
        </Link>
        <Link
          href={ROUTES.DASHBOARD}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          {t('nav.dashboard')}
        </Link>
      </div>
    </>
  )
}
