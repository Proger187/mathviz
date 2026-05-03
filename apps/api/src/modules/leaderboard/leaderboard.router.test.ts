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

const mockGetWeeklyLeaderboard = vi.fn()

vi.mock('../users/users.service.js', () => ({
  getWeeklyLeaderboard: (...args: unknown[]) => mockGetWeeklyLeaderboard(...args),
  // also mock other exports used in users.router.ts
  getMe: vi.fn(),
  getMyBadges: vi.fn(),
  getMyHistory: vi.fn(),
}))

import { app } from '../../index.js'

describe('GET /api/v1/leaderboard/weekly', () => {
  beforeEach(() => vi.resetAllMocks())

  it('returns 200 with leaderboard array (public endpoint)', async () => {
    const entries = [
      { rank: 1, userId: 'user-1', username: 'alice', weeklyXp: 500 },
      { rank: 2, userId: 'user-2', username: 'bob', weeklyXp: 320 },
    ]
    mockGetWeeklyLeaderboard.mockResolvedValue(entries)

    const res = await request(app).get('/api/v1/leaderboard/weekly')

    expect(res.status).toBe(200)
    expect(res.body.data).toHaveLength(2)
    expect(res.body.data[0]).toMatchObject({ rank: 1, username: 'alice' })
  })

  it('returns empty array when no entries exist', async () => {
    mockGetWeeklyLeaderboard.mockResolvedValue([])

    const res = await request(app).get('/api/v1/leaderboard/weekly')

    expect(res.status).toBe(200)
    expect(res.body.data).toEqual([])
  })

  it('does not require authentication', async () => {
    mockGetWeeklyLeaderboard.mockResolvedValue([])

    // no Authorization header
    const res = await request(app).get('/api/v1/leaderboard/weekly')
    expect(res.status).not.toBe(401)
  })
})
