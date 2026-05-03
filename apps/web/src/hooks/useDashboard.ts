import useSWR from 'swr'

import { apiFetch } from '@/lib/api-client'

export interface UserProfile {
  id: string
  email: string
  username: string
  xp: number
  level: number
  levelName: string
  xpToNextLevel: number | null
  streak: number
  lastQuizDate: string | null
  createdAt: string
}

interface ApiResponse<T> {
  data: T
}

export function useDashboard() {
  const { data: raw, error, isLoading } = useSWR<ApiResponse<UserProfile>>(
    '/api/v1/users/me',
    apiFetch,
  )
  return { data: raw?.data ?? null, error, isLoading }
}
