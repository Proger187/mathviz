import { create } from 'zustand'

import type { ModeId } from '@mathviz/shared'
import type { QuizQuestion } from '@mathviz/shared'

interface QuizSessionState {
  sessionId: string | null
  mode: ModeId | null
  questions: QuizQuestion[]
  currentIndex: number
  answers: Record<string, string>
  score: number
  xpEarned: number
  isComplete: boolean
}

interface QuizSessionActions {
  startSession: (sessionId: string, mode: ModeId, questions: QuizQuestion[]) => void
  submitAnswer: (questionId: string, answer: string, isCorrect: boolean, xp: number) => void
  completeSession: () => void
  resetSession: () => void
}

const initialState: QuizSessionState = {
  sessionId: null,
  mode: null,
  questions: [],
  currentIndex: 0,
  answers: {},
  score: 0,
  xpEarned: 0,
  isComplete: false,
}

export const useQuizSessionStore = create<QuizSessionState & QuizSessionActions>((set) => ({
  ...initialState,

  startSession: (sessionId, mode, questions) => {
    set({ ...initialState, sessionId, mode, questions })
  },

  submitAnswer: (questionId, answer, isCorrect, xp) => {
    set((state) => ({
      answers: { ...state.answers, [questionId]: answer },
      currentIndex: state.currentIndex + 1,
      score: isCorrect ? state.score + 1 : state.score,
      xpEarned: state.xpEarned + xp,
    }))
  },

  completeSession: () => {
    set({ isComplete: true })
  },

  resetSession: () => {
    set(initialState)
  },
}))
