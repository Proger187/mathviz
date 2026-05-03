'use client'

import { MODES } from '@mathviz/shared'
import type { ModeId } from '@mathviz/shared'

import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { useTranslation } from '@/i18n/useTranslation'

export default function QuizPage({ params }: { params: { mode: string } }) {
  const { t } = useTranslation()
  const modeId = params.mode as ModeId
  const mode = MODES[modeId]

  return (
    <>
      <Header />
      <main id="main-content" className="flex flex-col items-center gap-6 px-4 py-16 text-center">
        <p className="text-3xl">{mode?.icon ?? '🧮'}</p>
        <h1 className="text-3xl font-bold text-gray-900">{t(`modes.${modeId}.label`)}</h1>
        <button className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2">
          {t('quiz.start')}
        </button>
      </main>
      <Footer />
    </>
  )
}
