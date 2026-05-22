import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { MODES } from '@mathviz/shared'
import type { ModeId } from '@mathviz/shared'

import { ROUTES } from '@/config/routes'
import { CalculatorShell } from '@/features/calculators/components/CalculatorShell'
import en from '@/i18n/en.json'
import { getTranslation } from '@/i18n/getTranslation'

function t(key: string, params?: Record<string, string>): string {
  return getTranslation(en, en, key, params)
}

const VALID_MODE_IDS = Object.keys(MODES) as ModeId[]

interface Props {
  params: Promise<{ mode: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { mode } = await params
  if (!VALID_MODE_IDS.includes(mode as ModeId)) return {}
  const modeId = mode as ModeId
  return {
    title: t(`modes.${modeId}.label`),
    description: t(`modes.${modeId}.description`),
  }
}

export default async function CalculatorPage({ params }: Props) {
  const { mode } = await params

  if (!VALID_MODE_IDS.includes(mode as ModeId)) {
    notFound()
  }

  const modeId = mode as ModeId

  return (
    <>
      <div className="mb-4 flex justify-end sm:mb-6">
        <Link
          href={ROUTES.QUIZ(modeId)}
          className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
        >
          {t('quiz.start')} →
        </Link>
      </div>

      <CalculatorShell modeId={modeId} />

      <div className="mt-8 rounded-2xl border border-indigo-100 bg-indigo-50/80 px-5 py-4 text-sm leading-relaxed text-indigo-900">
        {t('landing.guestPrompt')}{' '}
        <Link href={ROUTES.REGISTER} className="font-semibold underline hover:text-indigo-950">
          {t('landing.primaryCta')}
        </Link>
      </div>
    </>
  )
}
