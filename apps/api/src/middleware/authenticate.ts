import type { Request, Response, NextFunction } from 'express'

import { AppError } from '../lib/AppError'
import { verifyAccessToken } from '../lib/jwt'
import type { JwtPayload } from '../lib/jwt'

// Augment Express Request type to carry the authenticated user
/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & { id: string }
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization']
  if (!authHeader?.startsWith('Bearer ')) {
    next(new AppError('AUTH_TOKEN_INVALID', 'Missing Bearer token'))
    return
  }

  const token = authHeader.slice(7)
  try {
    const payload = verifyAccessToken(token)
    req.user = { ...payload, id: payload.sub }
    next()
  } catch (err) {
    next(err)
  }
}
