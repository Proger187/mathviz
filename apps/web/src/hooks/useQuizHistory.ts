import useSWR from 'swr'

import type { ModeId } from '@mathviz/shared'

import { apiFetch } from '@/lib/api-client'

export interface QuizHistoryEntry {
  id: string
  mode: ModeId
  score: number
  xpEarned: number
  completedAt: string
}

interface ApiResponse<T> {
  data: T
}

export function useQuizHistory() {
  const { data: raw, error, isLoading } = useSWR<ApiResponse<QuizHistoryEntry[]>>(
    '/api/v1/users/me/history',
    apiFetch,
  )
  return { data: raw?.data ?? null, error, isLoading }
}
