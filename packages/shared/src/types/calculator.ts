import type { Difficulty } from '../constants/difficulty'
import type { ModeId } from '../constants/modes'

/**
 * Structural metadata for a calculator mode.
 * TComponent is the concrete component type, resolved in the consuming app.
 * No label/description here — those come from t('modes.<id>.label/description').
 */
export interface CalculatorMode<TComponent = unknown> {
  id: ModeId
  icon: string
  component: () => Promise<{ default: TComponent }>
}

export interface FractionProblem {
  numeratorA: number
  denominatorA: number
  numeratorB: number
  denominatorB: number
  operation: '+' | '-'
  expectedNumerator: number
  expectedDenominator: number
}

export interface NegativeProblem {
  a: number
  b: number
  operation: '+' | '-'
  expected: number
}

export interface MultiplicationProblem {
  a: number
  b: number
  expected: number
}

export interface DivisionProblem {
  dividend: number
  divisor: number
  expectedQuotient: number
  expectedRemainder: number
}

export interface QuizQuestion {
  id: string
  mode: ModeId
  difficulty: Difficulty
  problem: FractionProblem | NegativeProblem | MultiplicationProblem | DivisionProblem
  correctAnswer: string
}

export interface QuizFeedback {
  isCorrect: boolean
  correctAnswer: string
  xpAwarded: number
  timeTakenMs: number
}
