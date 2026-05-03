import type { FractionProblem, NegativeProblem, MultiplicationProblem, DivisionProblem } from '@mathviz/shared'

/** Props every calculator mode component must satisfy. */
export interface CalculatorProps {
  problem?: FractionProblem | NegativeProblem | MultiplicationProblem | DivisionProblem
  onAnswer?: (answer: string) => void
  hideResult?: boolean
  onReveal?: () => void
  showAdvancedMode?: boolean
}

/** One step in a guided animation sequence. */
export interface AnimationStep {
  id: string
  narrativeKey: string
  narrativeParams?: Record<string, string | number>
}

/** Returned by useStepController — drives the step indicator and navigation. */
export interface StepController {
  steps: AnimationStep[]
  currentStep: number
  canGoBack: boolean
  canGoForward: boolean
  goBack(): void
  goForward(): void
  reset(): void
}
