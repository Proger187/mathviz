import type { z } from 'zod'

import type { RegisterSchema, LoginSchema, RefreshTokenSchema } from '@mathviz/shared'

export type RegisterInput = z.infer<typeof RegisterSchema>
export type LoginInput = z.infer<typeof LoginSchema>
export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>

export interface AuthTokenPair {
  accessToken: string
  refreshToken: string
}

export interface SafeUser {
  id: string
  email: string
  username: string
  xp: number
  level: number
  streak: number
}
