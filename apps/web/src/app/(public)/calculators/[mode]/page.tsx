import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { MODES } from '@mathviz/shared'
import type { ModeId } from '@mathviz/shared'

import { CalculatorShell } from '@/features/calculators/components/CalculatorShell'
import { ModeSelector } from '@/components/calculators/ModeSelector'
import { QuizButtonClient } from '@/components/calculators/QuizButtonClient'
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
      <ModeSelector activeModeId={modeId} />

      <QuizButtonClient modeId={modeId} />

      <CalculatorShell modeId={modeId} />
    </>
  )
}
