'use client'

import { useMemo, useEffect, useState } from 'react'

import { useReducedMotion } from '@/features/calculators/hooks/useReducedMotion'
import { useStepController } from '@/features/calculators/hooks/useStepController'
import type { AnimationStep, StepController } from '@/features/calculators/types'

import { groupItems } from '../utils'

export interface DivisionAnimationResult {
  controller: StepController
  distributedSoFar: number
  showAdvancedAnnotation: boolean
  toggleAdvanced(): void
}

const ITEM_DURATION_MS = 120
const MAX_ANIMATED_DURATION_MS = 1200

export function useDivisionAnimation(
  total: number,
  groups: number,
  _showAdvancedMode: boolean,
): DivisionAnimationResult {
  const reducedMotion = useReducedMotion()
  const dist = groupItems(total, groups)

  const steps: AnimationStep[] = useMemo(
    () => [
      {
        id: 'step0',
        narrativeKey: 'modes.division.step0',
        narrativeParams: { total, groups },
      },
      {
        id: 'step1',
        narrativeKey: 'modes.division.step1',
        narrativeParams: { total, groups },
      },
      {
        id: 'step2',
        narrativeKey: 'modes.division.step2',
        narrativeParams: { quotient: dist.itemsPerGroup, groups, total },
      },
      {
        id: 'step3',
        narrativeKey: dist.remainder > 0 ? 'modes.division.step3Remainder' : 'modes.division.step3',
        narrativeParams: {
          total,
          groups,
          quotient: dist.itemsPerGroup,
          remainder: dist.remainder,
        },
      },
    ],
    [total, groups],
  )

  const controller = useStepController(steps)
  const [distributedSoFar, setDistributedSoFar] = useState(0)
  const [showAdvancedAnnotation, setShowAdvancedAnnotation] = useState(false)

  // Reset when inputs change
  useEffect(() => {
    setDistributedSoFar(0)
    setShowAdvancedAnnotation(false)
  }, [total, groups])

  useEffect(() => {
    const step = controller.currentStep

    if (step === 0) {
      setDistributedSoFar(0)
      return undefined
    }

    if (step >= 2) {
      // Show all distributed items (excluding remainder)
      setDistributedSoFar(total - dist.remainder)
      return undefined
    }

    // Step 1 — animate distribution
    const itemsToDistribute = total - dist.remainder

    if (reducedMotion || itemsToDistribute === 0) {
      setDistributedSoFar(itemsToDistribute)
      return undefined
    }

    const maxAnimated = Math.min(
      itemsToDistribute,
      Math.floor(MAX_ANIMATED_DURATION_MS / ITEM_DURATION_MS),
    )

    let count = 0
    const timers: ReturnType<typeof setTimeout>[] = []

    const placeNext = () => {
      count++
      setDistributedSoFar(count)
      if (count < maxAnimated) {
        const t = setTimeout(placeNext, ITEM_DURATION_MS)
        timers.push(t)
      } else {
        // Fast-forward remaining
        setDistributedSoFar(itemsToDistribute)
      }
    }

    const start = setTimeout(placeNext, 0)
    timers.push(start)
    return () => timers.forEach(clearTimeout)
  }, [controller.currentStep, total, groups, dist.remainder, reducedMotion])

  function toggleAdvanced() {
    setShowAdvancedAnnotation((v) => !v)
  }

  return { controller, distributedSoFar, showAdvancedAnnotation, toggleAdvanced }
}
