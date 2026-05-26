'use client'

import React, { Suspense, useState } from 'react'
import type { ComponentType } from 'react'

import type { ModeId } from '@mathviz/shared'

import { NavIcon } from '@/components/icons/NavIcons'
import { Spinner } from '@/components/ui/Spinner'
import { MODES } from '@/config/modes'
import { useTranslation } from '@/i18n/useTranslation'
import { cn } from '@/lib/cn'

import type { CalculatorProps } from '../types'

interface CalculatorShellProps {
  modeId: ModeId
}

const lazyComponentCache = new Map<
  ModeId,
  React.LazyExoticComponent<ComponentType<CalculatorProps>>
>()

function getLazyComponent(
  modeId: ModeId,
): React.LazyExoticComponent<ComponentType<CalculatorProps>> {
  const cached = lazyComponentCache.get(modeId)
  if (cached) return cached

  const lazy = React.lazy(
    MODES[modeId].component as () => Promise<{ default: ComponentType<CalculatorProps> }>,
  )
  lazyComponentCache.set(modeId, lazy)
  return lazy
}

export function CalculatorShell({ modeId }: CalculatorShellProps) {
  const { t } = useTranslation()
  const [textSummary, setTextSummary] = useState(false)

  const ModeComponent = getLazyComponent(modeId)

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-100">
            <NavIcon name={modeId} className="text-indigo-600" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              {t(`modes.${modeId}.label`)}
            </h2>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-600">
              {t(`modes.${modeId}.description`)}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setTextSummary((v) => !v)}
          aria-pressed={textSummary}
          className={cn(
            'shrink-0 rounded-xl border px-3 py-2 text-sm font-medium transition-colors',
            textSummary
              ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
          )}
        >
          {textSummary ? t('calculator.textSummaryHide') : t('calculator.textSummary')}
        </button>
      </div>

      <Suspense
        fallback={
          <div className="flex justify-center py-16">
            <Spinner label={t('common.loading')} />
          </div>
        }
      >
        <ModeComponent showAdvancedMode={textSummary} />
      </Suspense>
    </div>
  )
}
