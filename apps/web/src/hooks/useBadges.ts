import useSWR from 'swr'

import { apiFetch } from '@/lib/api-client'

export interface UserBadge {
  id: string
  key: string
  label: string
  description: string
  iconUrl: string | null
  earnedAt: string | null
}

interface ApiResponse<T> {
  data: T
}

export function useBadges() {
  const { data: raw, error, isLoading } = useSWR<ApiResponse<UserBadge[]>>(
    '/api/v1/users/me/badges',
    apiFetch,
  )
  return { data: raw?.data ?? null, error, isLoading }
}
