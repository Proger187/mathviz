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
  const [hasCalculated, setHasCalculated] = useState(false)

  useEffect(() => {
    if (mp) {
      setA(mp.a)
      setB(mp.b)
      setShowResult(!hideResult)
      setHasCalculated(false)
    }
  }, [mp, hideResult])

  const { controller, filledRows, showPartialProducts, togglePartialProducts } = useGridAnimation(
    a,
    b,
  )

  const { steps, currentStep, canGoBack, canGoForward, goBack, goForward, reset } = controller
  const result = multiply(a, b)
  const filledCells = filledRows * b
  const visibleLadderGroups = Math.min(a, 8)
  const hiddenLadderGroups = Math.max(a - visibleLadderGroups, 0)

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
    setHasCalculated(true)
    setShowResult(!hideResult)
  }

  const currentNarrative = steps[currentStep]
  const narrativeText = currentNarrative
    ? t(currentNarrative.narrativeKey, {
        ...currentNarrative.narrativeParams,
        filled: filledCells,
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
          className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card sm:p-5"
        >
          <p className="mb-3 text-sm font-medium text-slate-600">
            {t('calculator.multiplication.enterValues')}
          </p>
          <div className="flex flex-wrap items-end gap-3">
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
                setHasCalculated(false)
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
                setHasCalculated(false)
              }}
              {...(errB ? { error: t('validation.numberOutOfRange', { min: 1, max: 20 }) } : {})}
              className="w-24"
            />
            <Button onClick={handleCalculate}>{t('calculator.calculate')}</Button>
          </div>
        </motion.div>
      )}

      {/* Quiz mode — show problem */}
      {isQuizMode && (
        <div className="text-lg font-semibold text-gray-800">
          {a} × {b} = ?
        </div>
      )}

      {/* Group model visual */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card sm:p-5">
        <p className="mb-3 text-center text-sm font-medium text-slate-600">
          {t('calculator.multiplication.groupsTitle', { rows: a, cols: b })}
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: a }, (_, groupIndex) => {
            const isFilled = groupIndex < filledRows
            return (
              <div
                key={`group-${groupIndex}`}
                className={cn(
                  'rounded-xl border p-3 transition-colors',
                  isFilled ? 'border-indigo-200 bg-indigo-50' : 'border-slate-200 bg-white',
                )}
              >
                <p className="mb-2 text-xs font-medium text-slate-500">
                  {t('calculator.multiplication.groupLabel', { index: groupIndex + 1 })}
                </p>
                <div className="grid grid-cols-5 gap-1">
                  {Array.from({ length: b }, (_, itemIndex) => (
                    <span
                      key={`group-${groupIndex}-item-${itemIndex}`}
                      className={cn(
                        'h-4 w-4 rounded-full ring-1 transition-colors',
                        isFilled
                          ? 'bg-rose-400/90 ring-rose-500/40'
                          : 'bg-slate-100 ring-slate-200',
                      )}
                      aria-hidden
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
        <p className="mt-3 text-center text-sm font-semibold text-slate-700">
          {filledCells} / {result}
        </p>
      </div>

      {!isQuizMode && hasCalculated && (
        <div className="rounded-xl bg-indigo-50/70 px-4 py-3 text-center">
          <p className="text-sm text-indigo-700">{t('calculator.resultLabel')}</p>
          <p className="text-2xl font-bold text-indigo-900">
            {a} × {b} = {result}
          </p>
        </div>
      )}

      {!isQuizMode && (
        <div className="rounded-xl border border-slate-200/80 bg-white px-4 py-3">
          <p className="mb-2 text-sm font-semibold text-slate-700">
            {t('calculator.multiplication.kidTitle')}
          </p>
          <div className="flex flex-col gap-1 text-sm text-slate-600">
            <p>{t('calculator.multiplication.kidRows', { rows: a, cols: b })}</p>
            <p>
              {t('calculator.multiplication.kidProgress', { filled: filledCells, total: result })}
            </p>
            <p className="font-semibold text-slate-800">
              {t('calculator.multiplication.kidResult', { rows: a, cols: b, total: result })}
            </p>
          </div>
        </div>
      )}

      {!isQuizMode && (
        <div className="rounded-xl border border-slate-200/80 bg-amber-50/70 px-4 py-4">
          <p className="mb-3 text-sm font-semibold text-slate-700">
            {t('calculator.multiplication.repeatTitle')}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-lg font-semibold">
            {Array.from({ length: a }, (_, i) => (
              <span
                key={`sum-item-${i}`}
                className={cn(
                  'rounded-lg px-2 py-1 transition-colors',
                  i < filledRows ? 'bg-amber-200 text-amber-900' : 'bg-white text-slate-600',
                )}
              >
                {b}
                {i < a - 1 && <span className="ml-2 text-slate-400">+</span>}
              </span>
            ))}
            <span className="ml-1 text-slate-500">=</span>
            <span className="rounded-lg bg-indigo-100 px-3 py-1 text-indigo-900">{result}</span>
          </div>
          <p className="mt-2 text-sm text-slate-600">
            {t('calculator.multiplication.repeatHint', { groups: a, items: b, total: result })}
          </p>
        </div>
      )}

      {!isQuizMode && (
        <div className="rounded-xl border border-slate-200/80 bg-white px-4 py-4">
          <p className="mb-3 text-sm font-semibold text-slate-700">
            {t('calculator.multiplication.ladderTitle')}
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {Array.from({ length: visibleLadderGroups }, (_, idx) => {
              const groupsCount = idx + 1
              const subtotal = groupsCount * b
              const active = groupsCount <= filledRows
              return (
                <div
                  key={`ladder-${groupsCount}`}
                  className={cn(
                    'rounded-lg border px-3 py-2 text-sm transition-colors',
                    active
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                      : 'border-slate-200 bg-slate-50 text-slate-600',
                  )}
                >
                  {t('calculator.multiplication.ladderRow', {
                    groups: groupsCount,
                    items: b,
                    subtotal,
                  })}
                </div>
              )
            })}
          </div>
          {hiddenLadderGroups > 0 && (
            <p className="mt-2 text-xs text-slate-500">
              {t('calculator.multiplication.ladderLimit', { hidden: hiddenLadderGroups })}
            </p>
          )}
        </div>
      )}

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
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            reset()
            setHasCalculated(false)
          }}
        >
          {t('calculator.resetSteps')}
        </Button>
      </nav>

      {/* Extra controls */}
      <div className="flex flex-wrap justify-center gap-2">
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
