import { z } from 'zod'

import { DIFFICULTY } from '../constants/difficulty'
import { MODES } from '../constants/modes'

const modeValues = Object.values(MODES).map((m) => m.id) as [string, ...string[]]
const difficultyValues = Object.values(DIFFICULTY) as [string, ...string[]]

export const StartQuizSchema = z.object({
  mode: z.enum(modeValues as [string, ...string[]]),
  difficulty: z.enum(difficultyValues as [string, ...string[]]),
})

export type StartQuizInput = z.infer<typeof StartQuizSchema>

export const SubmitAnswerSchema = z.object({
  answer: z.string().min(1, 'Answer is required'),
  timeTakenMs: z.number().int().nonnegative(),
})

export type SubmitAnswerInput = z.infer<typeof SubmitAnswerSchema>
