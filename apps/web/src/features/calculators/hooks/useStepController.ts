'use client'

import { useState, useEffect } from 'react'

import type { AnimationStep, StepController } from '../types'

/**
 * Manages animation step state for a calculator mode.
 * Automatically resets to step 0 whenever the steps array reference changes.
 */
export function useStepController(steps: AnimationStep[]): StepController {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    setCurrentStep(0)
  }, [steps])

  return {
    steps,
    currentStep,
    canGoBack: currentStep > 0,
    canGoForward: currentStep < steps.length - 1,
    goBack: () => setCurrentStep((n) => Math.max(0, n - 1)),
    goForward: () => setCurrentStep((n) => Math.min(steps.length - 1, n + 1)),
    reset: () => setCurrentStep(0),
  }
}
