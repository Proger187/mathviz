import type { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'

import { env } from '../config/env'
import { AppError } from '../lib/AppError'
import { logger } from '../lib/logger'

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ code: err.code, message: err.message })
    return
  }

  if (err instanceof ZodError) {
    res.status(422).json({ code: 'VALIDATION_ERROR', issues: err.issues })
    return
  }

  // Unknown error — log full details in dev, return opaque 500 in prod
  if (env.NODE_ENV !== 'production' && err instanceof Error) {
    const cause = (err as Error & { cause?: unknown }).cause
    logger.error(err.message, {
      stack: err.stack,
      ...(cause instanceof Error && { cause: cause.message }),
    })
  } else {
    logger.error('Unhandled error')
  }

  res.status(500).json({ code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' })
}
