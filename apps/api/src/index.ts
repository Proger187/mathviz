import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'

import { env } from './config/env.js'
import { errorHandler } from './middleware/errorHandler.js'
import { authRouter } from './modules/auth/auth.router.js'
import { leaderboardRouter } from './modules/leaderboard/leaderboard.router.js'
import { usersRouter } from './modules/users/users.router.js'

export const app = express()

app.use(helmet())
app.use(
  cors({
    origin: env.FRONTEND_ORIGIN,
    credentials: true,
  }),
)
app.use(cookieParser())
app.use(express.json())
if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev'))
}

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', env: env.NODE_ENV })
})

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', usersRouter)
app.use('/api/v1/leaderboard', leaderboardRouter)

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ code: 'NOT_FOUND', message: 'Route not found' })
})

app.use(errorHandler)

// Only listen when not in test mode
if (env.NODE_ENV !== 'test') {
  const PORT = env.PORT
  app.listen(PORT, () => {
    console.log(`API server listening on http://localhost:${PORT}`)
  })
}
