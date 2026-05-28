'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useState, useEffect } from 'react'

import type { FractionProblem } from '@mathviz/shared'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useReducedMotion } from '@/features/calculators/hooks/useReducedMotion'
import type { CalculatorProps } from '@/features/calculators/types'
import { useTranslation } from '@/i18n/useTranslation'
import { cn } from '@/lib/cn'

import { useFractionAnimation } from '../hooks/useFractionAnimation'
import { addFractions, equivalentFraction, lcm, subtractFractions, toMixed } from '../utils'

import { FractionDisplay } from './FractionDisplay'
import { PizzaSlice } from './PizzaSlice'

function isFractionProblem(p: CalculatorProps['problem']): p is FractionProblem {
  return p !== undefined && 'numeratorA' in p
}

type Operation = '+' | '-'

export default function FractionCalculator({
  problem,
  onAnswer,
  hideResult = false,
  onReveal,
}: CalculatorProps) {
  const { t } = useTranslation()
  const reducedMotion = useReducedMotion()

  const fp = isFractionProblem(problem) ? problem : undefined
  const isQuizMode = fp !== undefined

  const [a, setA] = useState(fp?.numeratorA ?? 1)
  const [b, setB] = useState(fp?.denominatorA ?? 2)
  const [c, setC] = useState(fp?.numeratorB ?? 1)
  const [d, setD] = useState(fp?.denominatorB ?? 3)
  const [operation, setOperation] = useState<Operation>(fp?.operation ?? '+')
  const [showResult, setShowResult] = useState(!hideResult)
  const [errA, setErrA] = useState(false)
  const [errB, setErrB] = useState(false)
  const [errC, setErrC] = useState(false)
  const [errD, setErrD] = useState(false)

  useEffect(() => {
    if (fp) {
      setA(fp.numeratorA)
      setB(fp.denominatorA)
      setC(fp.numeratorB)
      setD(fp.denominatorB)
      setOperation(fp.operation)
      setShowResult(!hideResult)
    }
  }, [fp, hideResult])

  const computedLcd = lcm(b, d)
  const eqA = equivalentFraction(a, b, computedLcd)
  const eqC = equivalentFraction(c, d, computedLcd)
  const result = operation === '+' ? addFractions(a, b, c, d) : subtractFractions(a, b, c, d)
  const mixed = toMixed(result.numerator, result.denominator)

  const { controller } = useFractionAnimation(a, b, c, d, operation)
  const { steps, currentStep, canGoBack, canGoForward, goBack, goForward, reset } = controller

  const dispDenA = currentStep >= 2 ? computedLcd : b
  const dispDenB = currentStep >= 2 ? computedLcd : d
  const dispNumA = currentStep >= 2 ? eqA.numerator : a
  const dispNumB = currentStep >= 2 ? eqC.numerator : c

  const colorA = currentStep >= 2 ? '#f46a6a' : '#f8a0a0'
  const colorB = currentStep >= 2 ? '#9acd4a' : '#c3e488'
  const highlightLcd = currentStep === 1 || currentStep === 2

  const currentStepData = steps[currentStep]
  const narrative = currentStepData
    ? t(currentStepData.narrativeKey, currentStepData.narrativeParams)
    : ''

  const rangeErr = t('validation.numberOutOfRange', { min: 1, max: 20 })
  const divZeroErr = t('validation.divideByZero')

  function validate(v: number): boolean {
    return Number.isInteger(v) && v >= 1 && v <= 20
  }

  function handleCalculate() {
    const bA = !validate(a)
    const bB = !validate(b) || b === 0
    const bC = !validate(c)
    const bD = !validate(d) || d === 0
    setErrA(bA)
    setErrB(bB)
    setErrC(bC)
    setErrD(bD)
    if (bA || bB || bC || bD) return
    reset()
    if (onAnswer) {
      onAnswer(`${result.numerator}/${result.denominator}`)
    }
  }

  function handleReveal() {
    setShowResult(true)
    if (onReveal) onReveal()
  }

  const fade = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.35 },
      }

  return (
    <div className="flex flex-col gap-6">
      {/* Inputs */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card sm:p-5">
        <p className="mb-4 text-sm font-medium text-slate-600">
          {t('calculator.fractions.enterValues')}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {t('calculator.fractions.first')}
            </span>
            <div className="flex items-end gap-1">
              <Input
                id="frac-a"
                label={t('calculator.numerator')}
                type="number"
                min={1}
                max={20}
                value={a}
                readOnly={isQuizMode}
                onChange={(e) => setA(Number(e.target.value))}
                className="w-16"
                {...(errA ? { error: rangeErr } : {})}
              />
              <span className="mb-8 font-mono text-slate-400">/</span>
              <Input
                id="frac-b"
                label={t('calculator.denominator')}
                type="number"
                min={1}
                max={20}
                value={b}
                readOnly={isQuizMode}
                onChange={(e) => setB(Number(e.target.value))}
                className="w-16"
                {...(errB ? { error: divZeroErr } : {})}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
              {t('calculator.operation')}
            </span>
            <div className="flex gap-1">
              {(['+', '-'] as const).map((op) => (
                <button
                  key={op}
                  type="button"
                  onClick={() => {
                    if (!isQuizMode) setOperation(op)
                  }}
                  aria-pressed={operation === op}
                  aria-label={
                    op === '+' ? t('calculator.fractions.add') : t('calculator.fractions.subtract')
                  }
                  className={cn(
                    'h-11 min-w-[3rem] rounded-xl font-mono text-xl font-bold transition-all',
                    operation === op
                      ? 'bg-indigo-500 text-white shadow-sm'
                      : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100',
                    isQuizMode && 'cursor-default',
                  )}
                >
                  {op}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {t('calculator.fractions.second')}
            </span>
            <div className="flex items-end gap-1">
              <Input
                id="frac-c"
                label={t('calculator.numerator')}
                type="number"
                min={1}
                max={20}
                value={c}
                readOnly={isQuizMode}
                onChange={(e) => setC(Number(e.target.value))}
                className="w-16"
                {...(errC ? { error: rangeErr } : {})}
              />
              <span className="mb-8 font-mono text-slate-400">/</span>
              <Input
                id="frac-d"
                label={t('calculator.denominator')}
                type="number"
                min={1}
                max={20}
                value={d}
                readOnly={isQuizMode}
                onChange={(e) => setD(Number(e.target.value))}
                className="w-16"
                {...(errD ? { error: divZeroErr } : {})}
              />
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-center">
          {isQuizMode ? (
            !showResult && <Button onClick={handleReveal}>{t('quiz.reveal')}</Button>
          ) : (
            <Button onClick={handleCalculate}>{t('calculator.calculate')}</Button>
          )}
        </div>
      </section>

      {/* Equation preview */}
      <div className="flex items-center justify-center gap-3 rounded-xl bg-slate-100/80 px-4 py-3 font-mono sm:gap-4">
        <FractionDisplay numerator={a} denominator={b} size="lg" />
        <span className="text-2xl font-bold text-slate-500">{operation}</span>
        <FractionDisplay numerator={c} denominator={d} size="lg" />
        {currentStep >= 4 && showResult && (
          <>
            <span className="text-2xl font-bold text-slate-500">=</span>
            <FractionDisplay
              numerator={result.numerator}
              denominator={result.denominator}
              size="lg"
            />
          </>
        )}
      </div>

      {/* Visualization */}
      <section
        className={cn(
          'rounded-2xl border bg-gradient-to-b from-slate-50 to-white p-5 transition-shadow sm:p-8',
          highlightLcd
            ? 'border-indigo-200 shadow-sm ring-2 ring-indigo-50'
            : 'border-slate-200/80',
        )}
      >
        <p className="mb-6 text-center text-sm font-medium text-slate-500">
          {t('calculator.fractions.visual')}
        </p>

        <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-center lg:gap-10">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
            <PizzaSlice
              numerator={dispNumA}
              denominator={dispDenA}
              color={colorA}
              label={`${dispNumA}/${dispDenA}`}
            />
            <span className="font-mono text-3xl font-bold text-slate-400" aria-hidden>
              {operation}
            </span>
            <PizzaSlice
              numerator={dispNumB}
              denominator={dispDenB}
              color={colorB}
              label={`${dispNumB}/${dispDenB}`}
            />
          </div>

          <AnimatePresence mode="wait">
            {currentStep >= 4 && (
              <motion.div
                key="result"
                {...fade}
                className="flex flex-col items-center gap-3 border-t border-slate-200/80 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0"
              >
                <span className="font-mono text-3xl font-bold text-slate-400">=</span>
                {showResult ? (
                  <>
                    <PizzaSlice
                      numerator={Math.abs(result.numerator)}
                      denominator={result.denominator}
                      color="#5ec0ea"
                      label={`${result.numerator}/${result.denominator}`}
                    />
                    <p className="text-center text-lg font-bold text-slate-900" aria-live="polite">
                      {result.numerator}/{result.denominator}
                      {mixed !== null &&
                        `  →  ${t('calculator.fractions.mixedResult', {
                          whole: mixed.whole,
                          n: mixed.numerator,
                          d: mixed.denominator,
                        })}`}
                    </p>
                  </>
                ) : (
                  <div className="flex h-[168px] w-[168px] items-center justify-center rounded-full border-2 border-dashed border-slate-300 text-sm text-slate-400">
                    {t('quiz.reveal')}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Step dots */}
        {steps.length > 0 && (
          <div
            className="mt-8 flex justify-center gap-2"
            role="tablist"
            aria-label={t('calculator.stepNavLabel')}
          >
            {steps.map((step, i) => (
              <button
                key={step.id}
                type="button"
                role="tab"
                aria-selected={i === currentStep}
                aria-label={t('calculator.step', { current: i + 1, total: steps.length })}
                onClick={() => {
                  if (i < currentStep) {
                    for (let k = currentStep; k > i; k--) goBack()
                  } else if (i > currentStep) {
                    for (let k = currentStep; k < i; k++) goForward()
                  }
                }}
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  i === currentStep ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-300 hover:bg-slate-400',
                )}
              />
            ))}
          </div>
        )}

        <motion.div
          key={currentStep}
          {...fade}
          className="mx-auto mt-6 max-w-lg rounded-xl bg-indigo-50/60 px-4 py-3 text-center"
        >
          <p
            aria-live="polite"
            aria-atomic="true"
            className="text-sm leading-relaxed text-indigo-800"
          >
            {narrative}
          </p>
        </motion.div>

        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={goBack}
            disabled={!canGoBack}
            aria-label={t('calculator.previousStep')}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
          >
            {t('common.back')}
          </button>
          <span className="text-sm tabular-nums text-slate-500">
            {t('calculator.step', { current: currentStep + 1, total: steps.length })}
          </span>
          <button
            type="button"
            onClick={goForward}
            disabled={!canGoForward}
            aria-label={t('calculator.nextStep')}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
          >
            {t('common.next')}
          </button>
        </div>
      </section>
    </div>
  )
}
