import type { Request, Response, NextFunction } from 'express'
import type { ZodSchema } from 'zod'

import { AppError } from '../lib/AppError'

export function validate(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      next(new AppError('VALIDATION_ERROR', 'Validation failed'))
      return
    }
    req.body = result.data
    next()
  }
}
