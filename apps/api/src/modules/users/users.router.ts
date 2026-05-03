import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'

import { authenticate } from '../../middleware/authenticate.js'

import { getMe, getMyBadges, getMyHistory } from './users.service.js'

export const usersRouter = Router()

usersRouter.get(
  '/me',
  authenticate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) { next(new Error('Not authenticated')); return }
      const profile = await getMe(req.user.id)
      res.json({ data: profile })
    } catch (err) {
      next(err)
    }
  },
)

usersRouter.get(
  '/me/badges',
  authenticate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) { next(new Error('Not authenticated')); return }
      const limit = Number(req.query['limit']) || 20
      const badgeList = await getMyBadges(req.user.id, limit)
      res.json({ data: badgeList })
    } catch (err) {
      next(err)
    }
  },
)

usersRouter.get(
  '/me/history',
  authenticate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) { next(new Error('Not authenticated')); return }
      const history = await getMyHistory(req.user.id)
      res.json({ data: history })
    } catch (err) {
      next(err)
    }
  },
)
