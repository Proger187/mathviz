import { Router } from 'express'

import { RegisterSchema, LoginSchema, RefreshTokenSchema } from '@mathviz/shared'

import { AppError } from '../../lib/AppError'
import { authenticate } from '../../middleware/authenticate'
import { authRateLimiter } from '../../middleware/rateLimiter'
import { validate } from '../../middleware/validate'

import {
  registerUser,
  loginUser,
  refreshTokens,
  logoutUser,
} from './auth.service'

const COOKIE_NAME = 'refreshToken'

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'strict' as const,
  secure: process.env['NODE_ENV'] === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  path: '/',
}

export const authRouter = Router()

authRouter.post('/register', validate(RegisterSchema), async (req, res, next) => {
  try {
    const user = await registerUser(req.body)
    res.status(201).json({ user })
  } catch (err) {
    next(err)
  }
})

authRouter.post('/login', authRateLimiter, validate(LoginSchema), async (req, res, next) => {
  try {
    const { user, tokens } = await loginUser(req.body)
    res.cookie(COOKIE_NAME, tokens.refreshToken, COOKIE_OPTIONS)
    res.json({ user, accessToken: tokens.accessToken })
  } catch (err) {
    next(err)
  }
})

authRouter.post('/refresh', validate(RefreshTokenSchema), async (req, res, next) => {
  try {
    // Accept token from cookie (preferred) or body
    const token: string | undefined =
      (req.cookies as Record<string, string | undefined>)[COOKIE_NAME] ??
      (req.body as { refreshToken?: string }).refreshToken

    if (!token) throw new AppError('AUTH_TOKEN_INVALID', 'No refresh token provided')

    const tokens = await refreshTokens(token)
    res.cookie(COOKIE_NAME, tokens.refreshToken, COOKIE_OPTIONS)
    res.json({ accessToken: tokens.accessToken })
  } catch (err) {
    next(err)
  }
})

authRouter.post('/logout', authenticate, async (req, res, next) => {
  try {
    const token: string | undefined =
      (req.cookies as Record<string, string | undefined>)[COOKIE_NAME]

    if (token) await logoutUser(token)

    res.clearCookie(COOKIE_NAME, { path: '/' })
    res.status(204).send()
  } catch (err) {
    next(err)
  }
})
