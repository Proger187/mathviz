'use client'

import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { useState, useEffect } from 'react'

import type { NegativeProblem } from '@mathviz/shared'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useReducedMotion } from '@/features/calculators/hooks/useReducedMotion'
import type { CalculatorProps } from '@/features/calculators/types'
import { useTranslation } from '@/i18n/useTranslation'
import { cn } from '@/lib/cn'

import { useNumberLineAnimation } from '../hooks/useNumberLineAnimation'
import { addIntegers, subtractIntegers } from '../utils'

import { NumberLine } from './NumberLine'

const SHAKE_VARIANTS: Variants = {
  idle: { x: 0 },
  shake: { x: [-8, 8, -8, 8, -4, 4, 0], transition: { duration: 0.4 } },
}

function isNegativeProblem(p: CalculatorProps['problem']): p is NegativeProblem {
  return (
    p !== undefined && 'a' in p && 'operation' in p && !('numeratorA' in p) && !('dividend' in p)
  )
}

type Operation = '+' | '-'

export default function NegativeNumberCalculator({
  problem,
  onAnswer,
  hideResult = false,
  onReveal,
  showAdvancedMode = false,
}: CalculatorProps) {
  const { t } = useTranslation()
  const reducedMotion = useReducedMotion()

  const np = isNegativeProblem(problem) ? problem : undefined
  const isQuizMode = np !== undefined

  const [a, setA] = useState(np?.a ?? 3)
  const [b, setB] = useState(np?.b ?? 5)
  const [operation, setOperation] = useState<Operation>(np?.operation ?? '+')
  const [showResult, setShowResult] = useState(!hideResult)
  const [errA, setErrA] = useState(false)
  const [errB, setErrB] = useState(false)
  const [errResult, setErrResult] = useState(false)
  const [shakeAnim, setShakeAnim] = useState<'idle' | 'shake'>('idle')
  const [showAdvanced, setShowAdvanced] = useState(showAdvancedMode)

  useEffect(() => {
    if (np) {
      setA(np.a)
      setB(np.b)
      setOperation(np.operation)
      setShowResult(!hideResult)
    }
  }, [np, hideResult])

  const { controller, currentPosition, result } = useNumberLineAnimation(a, b, operation)
  const { steps, currentStep, canGoBack, canGoForward, goBack, goForward, reset } = controller

  function validateInputs(): boolean {
    const aValid = Number.isInteger(a) && a >= -50 && a <= 50
    const bValid = Number.isInteger(b) && b >= -50 && b <= 50
    const resultValue = operation === '+' ? addIntegers(a, b) : subtractIntegers(a, b)
    const resultValid = resultValue >= -50 && resultValue <= 50
    setErrA(!aValid)
    setErrB(!bValid)
    setErrResult(!resultValid)
    return aValid && bValid && resultValid
  }

  function handleCalculate() {
    if (!validateInputs()) {
      if (!reducedMotion) {
        setShakeAnim('shake')
        setTimeout(() => setShakeAnim('idle'), 450)
      }
      return
    }
    setErrA(false)
    setErrB(false)
    setErrResult(false)
    reset()
    setShowResult(!hideResult)
  }

  const currentNarrative = steps[currentStep]
  const narrativeText = currentNarrative
    ? t(currentNarrative.narrativeKey, currentNarrative.narrativeParams)
    : ''

  const showEndDot = currentStep >= 3

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
            id="neg-a"
            label={t('calculator.firstNumber')}
            type="number"
            value={a}
            onChange={(e) => {
              setA(Number(e.target.value))
              setErrA(false)
            }}
            {...(errA ? { error: t('validation.numberOutOfRange', { min: -50, max: 50 }) } : {})}
            className="w-28"
          />
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-700">{t('calculator.operation')}</span>
            <select
              value={operation}
              onChange={(e) => setOperation(e.target.value as Operation)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
            >
              <option value="+">+</option>
              <option value="-">−</option>
            </select>
          </div>
          <Input
            id="neg-b"
            label={t('calculator.secondNumber')}
            type="number"
            value={b}
            onChange={(e) => {
              setB(Number(e.target.value))
              setErrB(false)
            }}
            {...(errB ? { error: t('validation.numberOutOfRange', { min: -50, max: 50 }) } : {})}
            className="w-28"
          />
          <Button onClick={handleCalculate}>{t('calculator.calculate')}</Button>
        </motion.div>
      )}

      {/* Quiz mode — show problem statement */}
      {isQuizMode && (
        <div className="text-lg font-semibold text-gray-800">
          {a} {operation} {b} = ?
        </div>
      )}

      {/* Result out-of-range error */}
      {errResult && (
        <p className="text-sm text-red-600" role="alert">
          {t('validation.numberOutOfRange', { min: -50, max: 50 })}
        </p>
      )}

      {/* Advanced mode: additive inverse rewrite */}
      {showAdvancedMode && operation === '-' && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="neg-advanced"
            checked={showAdvanced}
            onChange={(e) => setShowAdvanced(e.target.checked)}
            className="rounded"
          />
          <label htmlFor="neg-advanced" className="text-sm text-gray-700">
            {t('calculator.showAdditiveInverse')}
          </label>
        </div>
      )}

      {showAdvanced && operation === '-' && (
        <div className="rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-800">
          {a} − {b} = {a} + (−{b})
        </div>
      )}

      {/* Number line */}
      <div className="overflow-x-auto rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
        <NumberLine
          a={a}
          b={b}
          operation={operation}
          currentPosition={currentPosition}
          showEndDot={showEndDot}
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
        className="flex items-center justify-center gap-3"
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

      {/* Quiz result reveal */}
      {isQuizMode && (
        <div className="mt-2 text-center">
          {showResult ? (
            <p
              className={cn(
                'text-2xl font-bold',
                result === np.expected ? 'text-green-600' : 'text-red-600',
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
