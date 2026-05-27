import { create } from 'zustand'

import { clearAccessToken, setAccessToken } from '@/lib/token'

export interface User {
  id: string
  email: string
  username: string
  xp: number
  level: number
  streak: number
}

interface AuthState {
  user: User | null
  accessToken: string | null
  isLoading: boolean
  isAuthenticated: boolean
}

interface AuthActions {
  signIn: (user: User, accessToken: string) => void
  signOut: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  user: null,
  accessToken: null,
  // Start in loading state: we don't know if there's a valid session until
  // useAuthInit finishes its refresh-token check on mount.
  isLoading: true,
  isAuthenticated: false,

  signIn: (user, accessToken) => {
    setAccessToken(accessToken)
    set({ user, accessToken, isAuthenticated: true, isLoading: false })
  },

  signOut: () => {
    clearAccessToken()
    set({ user: null, accessToken: null, isAuthenticated: false })
  },

  setLoading: (loading) => {
    set({ isLoading: loading })
  },
}))
