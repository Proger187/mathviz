// @mathviz/shared — single source of truth for types, schemas, and constants.

// Constants
export { MODES } from './constants/modes'
export type { ModeId } from './constants/modes'

export { LOCALES, DEFAULT_LOCALE } from './constants/locales'
export type { Locale } from './constants/locales'

export { DIFFICULTY } from './constants/difficulty'
export type { Difficulty } from './constants/difficulty'

export { BASE_XP, CORRECTNESS_MULTIPLIER } from './constants/xp'
export type { CorrectnessKey } from './constants/xp'

// Schemas + inferred input types
export {
  RegisterSchema,
  LoginSchema,
  RefreshTokenSchema,
} from './schemas/auth'
export type { RegisterInput, LoginInput, RefreshTokenInput } from './schemas/auth'

export { API_ERROR_CODES } from './schemas/errors'
export type { ApiErrorCode } from './schemas/errors'

// Calculator types
export type {
  CalculatorMode,
  FractionProblem,
  NegativeProblem,
  MultiplicationProblem,
  DivisionProblem,
  QuizQuestion,
  QuizFeedback,
} from './types/calculator'

