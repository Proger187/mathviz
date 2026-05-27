import rateLimit from 'express-rate-limit'

import { AppError } from '../lib/AppError'

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(new AppError('RATE_LIMIT_EXCEEDED', 'Too many requests — try again later'))
  },
})
