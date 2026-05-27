'use client'

import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { useState, useEffect } from 'react'

import type { DivisionProblem } from '@mathviz/shared'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useReducedMotion } from '@/features/calculators/hooks/useReducedMotion'
import type { CalculatorProps } from '@/features/calculators/types'
import { useTranslation } from '@/i18n/useTranslation'
import { cn } from '@/lib/cn'

import { useDivisionAnimation } from '../hooks/useDivisionAnimation'
import { groupItems } from '../utils'

import { FairShareVisual } from './FairShareVisual'

const SHAKE_VARIANTS: Variants = {
  idle: { x: 0 },
  shake: { x: [-8, 8, -8, 8, -4, 4, 0], transition: { duration: 0.4 } },
}

function isDivisionProblem(p: CalculatorProps['problem']): p is DivisionProblem {
  return p !== undefined && 'dividend' in p && 'divisor' in p
}

export default function DivisionCalculator({
  problem,
  onAnswer,
  hideResult = false,
  onReveal,
  showAdvancedMode = false,
}: CalculatorProps) {
  const { t } = useTranslation()
  const reducedMotion = useReducedMotion()

  const dp = isDivisionProblem(problem) ? problem : undefined
  const isQuizMode = dp !== undefined

  const [total, setTotal] = useState(dp?.dividend ?? 12)
  const [groups, setGroups] = useState(dp?.divisor ?? 3)
  const [showResult, setShowResult] = useState(!hideResult)
  const [errTotal, setErrTotal] = useState(false)
  const [errGroups, setErrGroups] = useState(false)
  const [shakeAnim, setShakeAnim] = useState<'idle' | 'shake'>('idle')

  useEffect(() => {
    if (dp) {
      setTotal(dp.dividend)
      setGroups(dp.divisor)
      setShowResult(!hideResult)
    }
  }, [dp, hideResult])

  const { controller, distributedSoFar, showAdvancedAnnotation, toggleAdvanced } =
    useDivisionAnimation(total, groups, showAdvancedMode)
  const { steps, currentStep, canGoBack, canGoForward, goBack, goForward, reset } = controller

  const dist = groupItems(total, groups)

  function validateInputs(): boolean {
    const totalOk = Number.isInteger(total) && total >= 1 && total <= 100
    const groupsOk = Number.isInteger(groups) && groups >= 1 && groups <= 20
    setErrTotal(!totalOk)
    setErrGroups(!groupsOk)
    return totalOk && groupsOk
  }

  function handleCalculate() {
    if (!validateInputs()) {
      if (!reducedMotion) {
        setShakeAnim('shake')
        setTimeout(() => setShakeAnim('idle'), 450)
      }
      return
    }
    reset()
    setShowResult(!hideResult)
  }

  const currentNarrative = steps[currentStep]
  const narrativeText = currentNarrative
    ? t(currentNarrative.narrativeKey, currentNarrative.narrativeParams)
    : ''

  return (
    <div className="flex flex-col gap-6">
      {/* Explorer inputs */}
      {!isQuizMode && (
        <motion.div
          variants={SHAKE_VARIANTS}
          animate={reducedMotion ? 'idle' : shakeAnim}
          className="flex flex-wrap items-end gap-3"
        >
          <Input
            id="div-total"
            label={t('calculator.totalItems')}
            type="number"
            min={1}
            max={100}
            value={total}
            onChange={(e) => {
              setTotal(Number(e.target.value))
              setErrTotal(false)
            }}
            {...(errTotal ? { error: t('validation.numberOutOfRange', { min: 1, max: 100 }) } : {})}
            className="w-28"
          />
          <span className="pb-2 text-xl font-bold text-gray-400">÷</span>
          <div className="flex flex-col gap-1">
            <Input
              id="div-groups"
              label={t('calculator.groups')}
              type="number"
              min={1}
              max={20}
              value={groups}
              onChange={(e) => {
                const v = Number(e.target.value)
                setGroups(v)
                setErrGroups(false)
              }}
              {...(errGroups
                ? {
                    error:
                      groups === 0
                        ? t('validation.divideByZero')
                        : t('validation.numberOutOfRange', { min: 1, max: 20 }),
                  }
                : {})}
              className="w-24"
            />
          </div>
          <Button onClick={handleCalculate}>{t('calculator.calculate')}</Button>
        </motion.div>
      )}

      {/* Quiz mode: read-only problem */}
      {isQuizMode && (
        <div className="text-lg font-semibold text-gray-800">
          {total} ÷ {groups} = ?
        </div>
      )}

      {/* Visual */}
      <div className="overflow-x-auto rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
        <FairShareVisual
          total={total}
          groups={groups}
          distributedSoFar={distributedSoFar}
          remainder={dist.remainder}
        />
      </div>

      {/* Step narration */}
      <p
        aria-live="polite"
        aria-atomic="true"
        className="min-h-[1.5rem] text-center text-sm text-gray-700"
      >
        {narrativeText}
      </p>

      {/* Step navigation */}
      <nav
        aria-label={t('calculator.stepNavLabel')}
        className="flex flex-wrap items-center justify-center gap-3"
      >
        <Button variant="secondary" size="sm" onClick={goBack} disabled={!canGoBack}>
          {t('calculator.previousStep')}
        </Button>
        <span className="text-sm text-gray-500">
          {t('calculator.step', { current: currentStep + 1, total: steps.length })}
        </span>
        <Button variant="secondary" size="sm" onClick={goForward} disabled={!canGoForward}>
          {t('calculator.nextStep')}
        </Button>
        <Button variant="ghost" size="sm" onClick={reset}>
          {t('calculator.resetSteps')}
        </Button>
      </nav>

      {/* Answer panel — visible at step 3 */}
      {currentStep >= 3 && (
        <div className="rounded-lg bg-green-50 px-4 py-3 text-center">
          <p className="text-xl font-bold text-green-800">
            {total} ÷ {groups} = {dist.itemsPerGroup}
            {dist.remainder > 0 && (
              <span className="ml-2 text-amber-700"> remainder {dist.remainder}</span>
            )}
          </p>
          {showAdvancedMode && (
            <Button variant="ghost" size="sm" className="mt-2" onClick={toggleAdvanced}>
              {showAdvancedAnnotation ? 'Hide' : 'Show'} multiplication connection
            </Button>
          )}
          {showAdvancedAnnotation && (
            <p className="mt-2 text-sm text-blue-700">
              {groups} × {dist.itemsPerGroup} = {groups * dist.itemsPerGroup}
            </p>
          )}
        </div>
      )}

      {/* Quiz result reveal */}
      {isQuizMode && (
        <div className="mt-2 text-center">
          {showResult ? (
            <p
              className={cn(
                'text-2xl font-bold',
                dist.itemsPerGroup === dp.expectedQuotient ? 'text-green-600' : 'text-red-600',
              )}
            >
              {dist.itemsPerGroup}
              {dist.remainder > 0 && (
                <span className="ml-2 text-base text-amber-600">r {dist.remainder}</span>
              )}
            </p>
          ) : (
            <Button
              onClick={() => {
                setShowResult(true)
                onReveal?.()
                onAnswer?.(String(dist.itemsPerGroup))
              }}
            >
              {t('quiz.reveal')}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
