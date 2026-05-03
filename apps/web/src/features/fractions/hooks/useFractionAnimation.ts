'use client'

import { useMemo } from 'react'

import { useStepController } from '@/features/calculators/hooks/useStepController'
import type { StepController } from '@/features/calculators/types'

import { addFractions, subtractFractions, lcm } from '../utils'

type Operation = '+' | '-'

export interface FractionAnimationResult {
  controller: StepController
  lcd: number
}

export function useFractionAnimation(
  a: number,
  b: number,
  c: number,
  d: number,
  operation: Operation,
): FractionAnimationResult {
  const computedLcd = useMemo(() => lcm(b, d), [b, d])

  const result = useMemo(
    () =>
      operation === '+'
        ? addFractions(a, b, c, d)
        : subtractFractions(a, b, c, d),
    [a, b, c, d, operation],
  )

  const steps = useMemo(
    () => [
      {
        id: 'step0',
        narrativeKey: 'modes.fractions.step0',
        narrativeParams: { a, b, c, d } as Record<string, string | number>,
      },
      {
        id: 'step1',
        narrativeKey: 'modes.fractions.step1',
      },
      {
        id: 'step2',
        narrativeKey: 'modes.fractions.step2',
        narrativeParams: { lcd: computedLcd } as Record<string, string | number>,
      },
      {
        id: 'step3',
        narrativeKey: 'modes.fractions.step3',
        narrativeParams: { lcd: computedLcd } as Record<string, string | number>,
      },
      {
        id: 'step4',
        narrativeKey: 'modes.fractions.step4',
        narrativeParams: {
          n: result.numerator,
          d: result.denominator,
        } as Record<string, string | number>,
      },
    ],
    [a, b, c, d, operation, computedLcd, result],
  )

  const controller = useStepController(steps)

  return { controller, lcd: computedLcd }
}
