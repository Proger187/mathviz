import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'

import { getWeeklyLeaderboard } from '../users/users.service.js'

export const leaderboardRouter = Router()

leaderboardRouter.get(
  '/weekly',
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const entries = await getWeeklyLeaderboard()
      res.json({ data: entries })
    } catch (err) {
      next(err)
    }
  },
)
