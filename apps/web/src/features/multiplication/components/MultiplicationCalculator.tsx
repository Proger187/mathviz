'use client'

import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { useState, useEffect } from 'react'

import type { MultiplicationProblem } from '@mathviz/shared'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useReducedMotion } from '@/features/calculators/hooks/useReducedMotion'
import type { CalculatorProps } from '@/features/calculators/types'
import { useTranslation } from '@/i18n/useTranslation'
import { cn } from '@/lib/cn'

import { useGridAnimation } from '../hooks/useGridAnimation'
import { multiply, partialProducts } from '../utils'

import { AreaGrid } from './AreaGrid'

const SHAKE_VARIANTS: Variants = {
  idle: { x: 0 },
  shake: { x: [-8, 8, -8, 8, -4, 4, 0], transition: { duration: 0.4 } },
}

function isMultiplicationProblem(p: CalculatorProps['problem']): p is MultiplicationProblem {
  return (
    p !== undefined &&
    'a' in p &&
    'b' in p &&
    'expected' in p &&
    !('operation' in p) &&
    !('numeratorA' in p) &&
    !('dividend' in p)
  )
}

export default function MultiplicationCalculator({
  problem,
  onAnswer,
  hideResult = false,
  onReveal,
  showAdvancedMode = false,
}: CalculatorProps) {
  const { t } = useTranslation()
  const reducedMotion = useReducedMotion()

  const mp = isMultiplicationProblem(problem) ? problem : undefined
  const isQuizMode = mp !== undefined

  const [a, setA] = useState(mp?.a ?? 4)
  const [b, setB] = useState(mp?.b ?? 6)
  const [showResult, setShowResult] = useState(!hideResult)
  const [errA, setErrA] = useState(false)
  const [errB, setErrB] = useState(false)
  const [shakeAnim, setShakeAnim] = useState<'idle' | 'shake'>('idle')

  useEffect(() => {
    if (mp) {
      setA(mp.a)
      setB(mp.b)
      setShowResult(!hideResult)
    }
  }, [mp, hideResult])

  const {
    controller,
    filledRows,
    isFlipped,
    showPartialProducts,
    flipGrid,
    togglePartialProducts,
  } = useGridAnimation(a, b)

  const { steps, currentStep, canGoBack, canGoForward, goBack, goForward, reset } = controller
  const result = multiply(a, b)

  function validate(v: number): boolean {
    return Number.isInteger(v) && v >= 1 && v <= 20
  }

  function handleCalculate() {
    const badA = !validate(a)
    const badB = !validate(b)
    setErrA(badA)
    setErrB(badB)
    if (badA || badB) {
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
    ? t(currentNarrative.narrativeKey, {
        ...currentNarrative.narrativeParams,
        filled: filledRows * b,
        total: a * b,
      })
    : ''

  const showBreakdown = showAdvancedMode && (a > 9 || b > 9)
  const breakdown = showBreakdown && showPartialProducts ? partialProducts(a, b) : []

  return (
    <div className="flex flex-col gap-6">
      {/* Inputs — explorer mode only */}
      {!isQuizMode && (
        <motion.div
          variants={SHAKE_VARIANTS}
          animate={reducedMotion ? 'idle' : shakeAnim}
          className="flex flex-wrap items-end gap-3"
        >
          <Input
            id="mul-a"
            label={t('calculator.rows')}
            type="number"
            min={1}
            max={20}
            value={a}
            onChange={(e) => {
              setA(Number(e.target.value))
              setErrA(false)
            }}
            {...(errA ? { error: t('validation.numberOutOfRange', { min: 1, max: 20 }) } : {})}
            className="w-24"
          />
          <span className="pb-2 text-xl font-bold text-gray-500">×</span>
          <Input
            id="mul-b"
            label={t('calculator.columns')}
            type="number"
            min={1}
            max={20}
            value={b}
            onChange={(e) => {
              setB(Number(e.target.value))
              setErrB(false)
            }}
            {...(errB ? { error: t('validation.numberOutOfRange', { min: 1, max: 20 }) } : {})}
            className="w-24"
          />
          <Button onClick={handleCalculate}>{t('calculator.calculate')}</Button>
        </motion.div>
      )}

      {/* Quiz mode — show problem */}
      {isQuizMode && (
        <div className="text-lg font-semibold text-gray-800">
          {a} × {b} = ?
        </div>
      )}

      {/* Area grid */}
      <div
        className="overflow-x-auto rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100"
        style={
          isFlipped && !reducedMotion
            ? { transform: 'rotate(90deg)', transformOrigin: 'center' }
            : undefined
        }
      >
        <AreaGrid
          a={isFlipped ? b : a}
          b={isFlipped ? a : b}
          filledRows={isFlipped ? b : filledRows}
          showPartialProducts={showPartialProducts}
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

      {/* Extra controls */}
      <div className="flex flex-wrap justify-center gap-2">
        <Button variant="secondary" size="sm" onClick={flipGrid}>
          {t('calculator.flipGrid')}
        </Button>
        {showBreakdown && (
          <Button variant="secondary" size="sm" onClick={togglePartialProducts}>
            {showPartialProducts ? t('calculator.hideBreakdown') : t('calculator.showBreakdown')}
          </Button>
        )}
      </div>

      {/* Partial products breakdown */}
      {showPartialProducts && breakdown.length > 0 && (
        <div className="rounded-lg bg-blue-50 px-4 py-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
            {t('calculator.distributiveProperty')}
          </p>
          <div className="flex flex-wrap gap-2 text-sm">
            {breakdown.map((pp, i) => (
              <span
                key={i}
                className={cn('rounded px-2 py-0.5 font-mono font-medium', pp.colorClass)}
              >
                {pp.rowFactor} × {pp.colFactor} = {pp.product}
              </span>
            ))}
          </div>
          <p className="mt-2 text-sm font-semibold text-blue-800">
            {breakdown.map((pp) => pp.product).join(' + ')} = {result}
          </p>
        </div>
      )}

      {/* Quiz result reveal */}
      {isQuizMode && (
        <div className="mt-2 text-center">
          {showResult ? (
            <p
              className={cn(
                'text-2xl font-bold',
                result === mp.expected ? 'text-green-600' : 'text-red-600',
              )}
            >
              {result}
            </p>
          ) : (
            <Button
              onClick={() => {
                setShowResult(true)
                onReveal?.()
                onAnswer?.(String(result))
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
