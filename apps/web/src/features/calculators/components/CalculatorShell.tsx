'use client'

import React, { Suspense, useState } from 'react'
import type { ComponentType } from 'react'

import type { ModeId } from '@mathviz/shared'

import { Spinner } from '@/components/ui/Spinner'
import { MODES } from '@/config/modes'
import { useTranslation } from '@/i18n/useTranslation'
import { cn } from '@/lib/cn'

import type { CalculatorProps, StepController } from '../types'

interface CalculatorShellProps {
  modeId: ModeId
}

/**
 * Module-level cache: lazily create React.lazy wrappers once per mode so the
 * component identity is stable across re-renders (avoids remount on each render).
 */
const lazyComponentCache = new Map<ModeId, React.LazyExoticComponent<ComponentType<CalculatorProps>>>()

function getLazyComponent(modeId: ModeId): React.LazyExoticComponent<ComponentType<CalculatorProps>> {
  const cached = lazyComponentCache.get(modeId)
  if (cached) return cached

  const lazy = React.lazy(
    MODES[modeId].component as () => Promise<{ default: ComponentType<CalculatorProps> }>,
  )
  lazyComponentCache.set(modeId, lazy)
  return lazy
}

/** Step indicator shown above the mode component. Populated by the mode via context (future). */
function StepIndicator({ controller }: { controller: StepController | null }) {
  const { t } = useTranslation()
  if (!controller || controller.steps.length === 0) return null

  const total = controller.steps.length
  const current = controller.currentStep + 1

  return (
    <div className="flex items-center gap-2 text-sm text-gray-500" aria-live="polite">
      <button
        onClick={controller.goBack}
        disabled={!controller.canGoBack}
        aria-label={t('calculator.previousStep')}
        className="rounded p-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        ‹
      </button>
      <span>{t('calculator.step', { current, total })}</span>
      <button
        onClick={controller.goForward}
        disabled={!controller.canGoForward}
        aria-label={t('calculator.nextStep')}
        className="rounded p-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        ›
      </button>
    </div>
  )
}

export function CalculatorShell({ modeId }: CalculatorShellProps) {
  const { t } = useTranslation()
  const [textSummary, setTextSummary] = useState(false)

  const ModeComponent = getLazyComponent(modeId)
  const mode = MODES[modeId]

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl" aria-hidden="true">{mode.icon}</span>
          <h1 className="text-2xl font-bold text-gray-900">{t(`modes.${modeId}.label`)}</h1>
        </div>

        {/* Text-summary toggle — always visible and keyboard focusable */}
        <button
          type="button"
          onClick={() => setTextSummary((v) => !v)}
          aria-pressed={textSummary}
          className={cn(
            'rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1',
            textSummary
              ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
              : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50',
          )}
        >
          {textSummary ? t('calculator.textSummaryHide') : t('calculator.textSummary')}
        </button>
      </div>

      {/* Step indicator (populated when a mode calls back with its controller) */}
      <StepIndicator controller={null} />

      {/* Mode component — lazy-loaded with Suspense */}
      <Suspense fallback={<div className="flex justify-center py-16"><Spinner label={t('common.loading')} /></div>}>
        <ModeComponent showAdvancedMode={false} />
      </Suspense>
    </div>
  )
}
