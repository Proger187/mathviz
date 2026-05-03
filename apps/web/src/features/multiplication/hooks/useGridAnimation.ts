'use client'

import { useMemo, useEffect, useState } from 'react'

import { useReducedMotion } from '@/features/calculators/hooks/useReducedMotion'
import { useStepController } from '@/features/calculators/hooks/useStepController'
import type { AnimationStep, StepController } from '@/features/calculators/types'

export interface GridAnimationResult {
  controller: StepController
  filledRows: number
  isFlipped: boolean
  showPartialProducts: boolean
  flipGrid(): void
  togglePartialProducts(): void
}

export function useGridAnimation(a: number, b: number): GridAnimationResult {
  const reducedMotion = useReducedMotion()

  const steps: AnimationStep[] = useMemo(
    () => [
      {
        id: 'step0',
        narrativeKey: 'modes.multiplication.step0',
        narrativeParams: { a, b },
      },
      {
        id: 'step1',
        narrativeKey: 'modes.multiplication.step1',
        narrativeParams: { filled: 0, total: a * b },
      },
      {
        id: 'step2',
        narrativeKey: 'modes.multiplication.step2',
        narrativeParams: { a, b, result: a * b },
      },
    ],
    [a, b],
  )

  const controller = useStepController(steps)
  const [filledRows, setFilledRows] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [showPartialProducts, setShowPartialProducts] = useState(false)

  // Reset when inputs change
  useEffect(() => {
    setFilledRows(0)
    setIsFlipped(false)
    setShowPartialProducts(false)
  }, [a, b])

  useEffect(() => {
    const step = controller.currentStep

    if (step === 0) {
      setFilledRows(0)
      return undefined
    }

    if (step === 1) {
      if (reducedMotion) {
        setFilledRows(a)
        return undefined
      }
      // Stagger row fills
      let row = 0
      const timers: ReturnType<typeof setTimeout>[] = []

      const fillNext = () => {
        if (row >= a) return
        row++
        setFilledRows(row)
        const t = setTimeout(fillNext, 150)
        timers.push(t)
      }

      const start = setTimeout(fillNext, 0)
      timers.push(start)
      return () => timers.forEach(clearTimeout)
    }

    if (step === 2) {
      setFilledRows(a)
    }

    return undefined
  }, [controller.currentStep, a, reducedMotion])

  function flipGrid() {
    setIsFlipped((v) => !v)
  }

  function togglePartialProducts() {
    setShowPartialProducts((v) => !v)
  }

  return {
    controller,
    filledRows,
    isFlipped,
    showPartialProducts,
    flipGrid,
    togglePartialProducts,
  }
}
