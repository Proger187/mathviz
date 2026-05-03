'use client'

import { AnimatePresence, motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
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

import { PizzaSlice } from './PizzaSlice'

function isFractionProblem(p: CalculatorProps['problem']): p is FractionProblem {
  return p !== undefined && 'numeratorA' in p
}

type Operation = '+' | '-'

const SHAKE_VARIANTS: Variants = {
  idle: { x: 0 },
  shake: { x: [-8, 8, -8, 8, -4, 4, 0], transition: { duration: 0.4 } },
}

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
  const [pizzaAnim, setPizzaAnim] = useState<'idle' | 'shake'>('idle')

  // Sync quiz-mode prop changes
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

  // Derived values
  const computedLcd = lcm(b, d)
  const eqA = equivalentFraction(a, b, computedLcd)
  const eqC = equivalentFraction(c, d, computedLcd)
  const result =
    operation === '+' ? addFractions(a, b, c, d) : subtractFractions(a, b, c, d)
  const mixed = toMixed(result.numerator, result.denominator)

  const { controller } = useFractionAnimation(a, b, c, d, operation)
  const { steps, currentStep, canGoBack, canGoForward, goBack, goForward, reset } = controller

  // Trigger shake on step 1
  useEffect(() => {
    if (currentStep === 1 && !reducedMotion) {
      setPizzaAnim('shake')
      const tid = setTimeout(() => setPizzaAnim('idle'), 450)
      return () => clearTimeout(tid)
    }
    setPizzaAnim('idle')
    return undefined
  }, [currentStep, reducedMotion])

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

  // Which denominator / numerator to display at each step
  const dispDenA = currentStep >= 2 ? computedLcd : b
  const dispDenB = currentStep >= 2 ? computedLcd : d
  const dispNumA = currentStep >= 2 ? eqA.numerator : a
  const dispNumB = currentStep >= 2 ? eqC.numerator : c

  const currentStepData = steps[currentStep]
  const narrative = currentStepData
    ? t(currentStepData.narrativeKey, currentStepData.narrativeParams)
    : ''

  const rangeErr = t('validation.numberOutOfRange', { min: 1, max: 20 })
  const divZeroErr = t('validation.divideByZero')

  return (
    <div className="flex flex-col gap-6">
      {/* ── Input panel ───────────────────────────── */}
      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-gray-200 bg-white p-4">
        {/* a/b */}
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
          <span className="mb-2.5 text-xl text-gray-400">/</span>
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

        {/* Operation toggle */}
        <div className="mb-1 flex gap-1">
          {(['+', '-'] as const).map((op) => (
            <button
              key={op}
              type="button"
              onClick={() => { if (!isQuizMode) setOperation(op) }}
              aria-pressed={operation === op}
              className={cn(
                'h-10 w-10 rounded-lg font-mono text-lg font-bold transition-colors',
                operation === op
                  ? 'bg-indigo-600 text-white'
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
                isQuizMode && 'cursor-default',
              )}
            >
              {op}
            </button>
          ))}
        </div>

        {/* c/d */}
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
          <span className="mb-2.5 text-xl text-gray-400">/</span>
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

        {/* Action button */}
        {isQuizMode ? (
          !showResult ? (
            <Button onClick={handleReveal} className="mb-1">
              {t('quiz.reveal')}
            </Button>
          ) : null
        ) : (
          <Button onClick={handleCalculate} className="mb-1">
            {t('calculator.calculate')}
          </Button>
        )}
      </div>

      {/* ── Pizza visualiser ─────────────────────── */}
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-6">
          {/* Pizza A */}
          <motion.div variants={SHAKE_VARIANTS} animate={reducedMotion ? 'idle' : pizzaAnim}>
            <PizzaSlice numerator={dispNumA} denominator={dispDenA} />
          </motion.div>

          <span className="text-2xl font-bold text-gray-600" aria-hidden="true">
            {operation}
          </span>

          {/* Pizza B */}
          <motion.div variants={SHAKE_VARIANTS} animate={reducedMotion ? 'idle' : pizzaAnim}>
            <PizzaSlice numerator={dispNumB} denominator={dispDenB} />
          </motion.div>
        </div>

        {/* Result pizza — step 4+ */}
        <AnimatePresence>
          {currentStep >= 4 && (
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-xl font-bold text-gray-600" aria-hidden="true">
                =
              </span>
              {showResult ? (
                <>
                  <PizzaSlice
                    numerator={Math.abs(result.numerator) % result.denominator || Math.abs(result.numerator)}
                    denominator={result.denominator}
                    color="#27AE60"
                  />
                  <p className="text-lg font-bold text-gray-900" aria-live="polite">
                    {result.numerator}/{result.denominator}
                    {mixed !== null &&
                      ` = ${mixed.whole} ${mixed.numerator}/${mixed.denominator}`}
                  </p>
                </>
              ) : (
                <div className="flex h-40 w-40 items-center justify-center rounded-full border-2 border-dashed border-gray-300 text-sm text-gray-400">
                  {t('quiz.reveal')}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Step narration (aria-live) ─────────── */}
        <div className="w-full max-w-lg rounded-lg bg-indigo-50 p-4">
          <p aria-live="polite" aria-atomic="true" className="text-center text-sm text-indigo-800">
            {narrative}
          </p>
        </div>

        {/* ── Step navigation ───────────────────── */}
        {steps.length > 0 && (
          <div className="flex items-center gap-3" role="navigation" aria-label={t('calculator.stepNavLabel')}>
            <button
              type="button"
              onClick={goBack}
              disabled={!canGoBack}
              aria-label={t('calculator.previousStep')}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ‹ {t('common.back')}
            </button>
            <span className="text-sm text-gray-500">
              {t('calculator.step', { current: currentStep + 1, total: steps.length })}
            </span>
            <button
              type="button"
              onClick={goForward}
              disabled={!canGoForward}
              aria-label={t('calculator.nextStep')}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t('common.next')} ›
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

