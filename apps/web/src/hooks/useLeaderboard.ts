import useSWR from 'swr'

import { apiFetch } from '@/lib/api-client'

export interface LeaderboardEntry {
  rank: number
  userId: string
  username: string
  weeklyXp: number
}

interface ApiResponse<T> {
  data: T
}

export function useLeaderboard() {
  const { data: raw, error, isLoading } = useSWR<ApiResponse<LeaderboardEntry[]>>(
    '/api/v1/leaderboard/weekly',
    apiFetch,
  )
  return { data: raw?.data ?? null, error, isLoading }
}
