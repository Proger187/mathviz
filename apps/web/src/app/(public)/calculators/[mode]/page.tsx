import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { MODES } from '@mathviz/shared'
import type { ModeId } from '@mathviz/shared'

import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
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
      <Header />
      <main id="main-content" className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {MODES[modeId].icon} {t(`modes.${modeId}.label`)}
          </h1>
          <p className="mt-1 text-gray-500">{t(`modes.${modeId}.description`)}</p>
        </div>

        <CalculatorShell modeId={modeId} />

        {/* Soft guest prompt — not a blocking modal */}
        <div className="mt-8 rounded-xl border border-indigo-100 bg-indigo-50 px-6 py-4 text-sm">
          <p className="text-indigo-700">
            {t('landing.guestPrompt')}{' '}
            <Link
              href={ROUTES.REGISTER}
              className="font-semibold underline hover:text-indigo-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              {t('landing.primaryCta')}
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
