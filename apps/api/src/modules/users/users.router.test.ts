import jwt from 'jsonwebtoken'
import request from 'supertest'
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../config/env.js', () => ({
  env: {
    NODE_ENV: 'test',
    PORT: 3001,
    FRONTEND_ORIGIN: 'http://localhost:3000',
    JWT_ACCESS_SECRET: 'test-access-secret-at-least-32-chars!!',
    JWT_REFRESH_SECRET: 'test-refresh-secret-at-least-32-chars!',
    BCRYPT_ROUNDS: 10,
    DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
  },
}))

const mockGetMe = vi.fn()
const mockGetMyBadges = vi.fn()
const mockGetMyHistory = vi.fn()

vi.mock('./users.service.js', () => ({
  getMe: (...args: unknown[]) => mockGetMe(...args),
  getMyBadges: (...args: unknown[]) => mockGetMyBadges(...args),
  getMyHistory: (...args: unknown[]) => mockGetMyHistory(...args),
}))

import { app } from '../../index.js'

const JWT_SECRET = 'test-access-secret-at-least-32-chars!!'

function makeToken(userId = 'user-1') {
  return jwt.sign(
    { sub: userId, email: 'alice@example.com', username: 'alice' },
    JWT_SECRET,
    { expiresIn: '15m' },
  )
}

const MOCK_PROFILE = {
  id: 'user-1',
  email: 'alice@example.com',
  username: 'alice',
  xp: 250,
  level: 2,
  streak: 3,
  levelName: 'Apprentice',
  xpToNextLevel: 50,
}

describe('GET /api/v1/users/me', () => {
  beforeEach(() => vi.resetAllMocks())

  it('returns 401 without a Bearer token', async () => {
    const res = await request(app).get('/api/v1/users/me')
    expect(res.status).toBe(401)
    expect(res.body.code).toBe('AUTH_TOKEN_INVALID')
  })

  it('returns 200 with user profile when authenticated', async () => {
    mockGetMe.mockResolvedValue(MOCK_PROFILE)

    const res = await request(app)
      .get('/api/v1/users/me')
      .set('Authorization', `Bearer ${makeToken()}`)

    expect(res.status).toBe(200)
    expect(res.body.data).toMatchObject({ username: 'alice', level: 2 })
    expect(mockGetMe).toHaveBeenCalledWith('user-1')
  })
})

describe('GET /api/v1/users/me/badges', () => {
  beforeEach(() => vi.resetAllMocks())

  it('returns 401 without auth', async () => {
    const res = await request(app).get('/api/v1/users/me/badges')
    expect(res.status).toBe(401)
  })

  it('returns badges array when authenticated', async () => {
    const badges = [
      { key: 'first_quiz', label: 'First Quiz', earnedAt: '2026-01-01T00:00:00Z' },
    ]
    mockGetMyBadges.mockResolvedValue(badges)

    const res = await request(app)
      .get('/api/v1/users/me/badges')
      .set('Authorization', `Bearer ${makeToken()}`)

    expect(res.status).toBe(200)
    expect(res.body.data).toHaveLength(1)
    expect(res.body.data[0].key).toBe('first_quiz')
  })
})

describe('GET /api/v1/users/me/history', () => {
  beforeEach(() => vi.resetAllMocks())

  it('returns 401 without auth', async () => {
    const res = await request(app).get('/api/v1/users/me/history')
    expect(res.status).toBe(401)
  })

  it('returns quiz history array when authenticated', async () => {
    const history = [
      { id: 'sess-1', mode: 'fractions', score: 8, xpEarned: 80, completedAt: '2026-01-01' },
    ]
    mockGetMyHistory.mockResolvedValue(history)

    const res = await request(app)
      .get('/api/v1/users/me/history')
      .set('Authorization', `Bearer ${makeToken()}`)

    expect(res.status).toBe(200)
    expect(res.body.data).toHaveLength(1)
    expect(res.body.data[0].mode).toBe('fractions')
  })
})
