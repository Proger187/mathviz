'use client'

import { useEffect } from 'react'

import { apiFetch } from '@/lib/api-client'
import { setAccessToken } from '@/lib/token'
import { useAuthStore, type User } from '@/store/auth.store'

interface RefreshResponse {
  accessToken: string
}

interface MeResponse {
  data: {
    id: string
    email: string
    username: string
    xp: number
    level: number
    streak: number
  }
}

/**
 * Runs once on app mount. Restores the session from the HttpOnly
 * refresh-token cookie that the server sets at login.
 *
 * Flow:
 *   1. POST /api/v1/auth/refresh  → new accessToken (cookie is rotated)
 *   2. GET  /api/v1/users/me      → user profile
 *   3. signIn()                   → Zustand store is hydrated
 *
 * If the cookie is absent or expired the catch block just clears
 * isLoading so the app renders as guest.
 */
export function useAuthInit() {
  const signIn = useAuthStore((s) => s.signIn)
  const setLoading = useAuthStore((s) => s.setLoading)

  useEffect(() => {
    let cancelled = false

    async function init() {
      try {
        // Step 1 — exchange the HttpOnly cookie for a fresh access token
        const { accessToken } = await apiFetch<RefreshResponse>('/api/v1/auth/refresh', {
          method: 'POST',
        })

        if (cancelled) return

        // Stash it in memory so subsequent apiFetch calls include Authorization header
        setAccessToken(accessToken)

        // Step 2 — fetch the user profile (needs the access token we just stored)
        const { data: profile } = await apiFetch<MeResponse>('/api/v1/users/me')

        if (cancelled) return

        const user: User = {
          id: profile.id,
          email: profile.email,
          username: profile.username,
          xp: profile.xp,
          level: profile.level,
          streak: profile.streak,
        }

        // Step 3 — hydrate the store (signIn also sets isLoading: false)
        signIn(user, accessToken)
      } catch {
        // No valid cookie, token expired, or network error — stay as guest
        if (!cancelled) setLoading(false)
      }
    }

    void init()

    return () => {
      cancelled = true
    }
  }, [signIn, setLoading])
}
