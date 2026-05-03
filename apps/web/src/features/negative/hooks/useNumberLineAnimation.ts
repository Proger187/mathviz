'use client'

import { animate } from 'framer-motion'
import { useMemo, useEffect, useState } from 'react'

import { useReducedMotion } from '@/features/calculators/hooks/useReducedMotion'
import { useStepController } from '@/features/calculators/hooks/useStepController'
import type { AnimationStep, StepController } from '@/features/calculators/types'

import { addIntegers, subtractIntegers } from '../utils'

export interface NumberLineAnimationResult {
  controller: StepController
  currentPosition: number
  result: number
}

export function useNumberLineAnimation(
  a: number,
  b: number,
  operation: '+' | '-',
): NumberLineAnimationResult {
  const reducedMotion = useReducedMotion()
  const result = operation === '+' ? addIntegers(a, b) : subtractIntegers(a, b)

  const direction = (() => {
    if (operation === '+') return b >= 0 ? 'right' : 'left'
    return b >= 0 ? 'left' : 'right'
  })()

  const steps: AnimationStep[] = useMemo(
    () => [
      {
        id: 'step0',
        narrativeKey: 'modes.negative.step0',
        narrativeParams: { a },
      },
      {
        id: 'step1',
        narrativeKey: 'modes.negative.step1',
        narrativeParams: { direction, b: Math.abs(b) },
      },
      {
        id: 'step2',
        narrativeKey: 'modes.negative.step2',
        narrativeParams: { direction },
      },
      {
        id: 'step3',
        narrativeKey: 'modes.negative.step3',
        narrativeParams: { result },
      },
    ],
    [a, b, operation],
  )

  const controller = useStepController(steps)
  const [currentPosition, setCurrentPosition] = useState(a)

  // Reset position when inputs change
  useEffect(() => {
    setCurrentPosition(a)
  }, [a])

  useEffect(() => {
    const step = controller.currentStep
    if (step <= 1) {
      setCurrentPosition(a)
      return undefined
    }
    // Steps 2 and 3 — animate toward result
    if (reducedMotion) {
      setCurrentPosition(result)
      return undefined
    }
    const duration = Math.min(1.2, Math.abs(b) * 0.12)
    const controls = animate(a, result, {
      duration,
      ease: 'linear',
      onUpdate: (v) => setCurrentPosition(v),
    })
    return () => controls.stop()
  }, [controller.currentStep, a, b, result, reducedMotion])

  return { controller, currentPosition, result }
}
