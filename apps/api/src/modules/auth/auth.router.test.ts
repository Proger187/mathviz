import request from 'supertest'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock environment before app import
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

// Mock auth service
const mockRegisterUser = vi.fn()
const mockLoginUser = vi.fn()
const mockRefreshTokens = vi.fn()
const mockLogoutUser = vi.fn()

vi.mock('./auth.service.js', () => ({
  registerUser: (...args: unknown[]) => mockRegisterUser(...args),
  loginUser: (...args: unknown[]) => mockLoginUser(...args),
  refreshTokens: (...args: unknown[]) => mockRefreshTokens(...args),
  logoutUser: (...args: unknown[]) => mockLogoutUser(...args),
}))

import { app } from '../../index.js'
import { AppError } from '../../lib/AppError.js'

const MOCK_USER = {
  id: 'user-uuid-1',
  email: 'alice@example.com',
  username: 'alice',
  xp: 0,
  level: 1,
  streak: 0,
}

const MOCK_TOKENS = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
}

const MOCK_LOGIN_RESULT = {
  user: MOCK_USER,
  tokens: MOCK_TOKENS,
}

describe('POST /api/v1/auth/register', () => {
  beforeEach(() => vi.resetAllMocks())

  it('returns 201 with user on success', async () => {
    mockRegisterUser.mockResolvedValue(MOCK_USER)

    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'alice@example.com', username: 'alice', password: 'password1' })

    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({ user: { email: 'alice@example.com' } })
  })

  it('returns 409 on duplicate email (AUTH_EMAIL_TAKEN)', async () => {
    mockRegisterUser.mockRejectedValue(new AppError('AUTH_EMAIL_TAKEN', 'Email is already registered'))

    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'alice@example.com', username: 'alice', password: 'password1' })

    expect(res.status).toBe(409)
    expect(res.body.code).toBe('AUTH_EMAIL_TAKEN')
  })

  it('returns 422 on invalid input (missing password)', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'alice@example.com', username: 'alice' })

    expect(res.status).toBe(422)
  })
})

describe('POST /api/v1/auth/login', () => {
  beforeEach(() => vi.resetAllMocks())

  it('returns 200 with accessToken on valid credentials', async () => {
    mockLoginUser.mockResolvedValue(MOCK_LOGIN_RESULT)

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'alice@example.com', password: 'password1' })

    expect(res.status).toBe(200)
    expect(res.body.accessToken).toBe('mock-access-token')
    expect(res.body.user).toMatchObject({ email: 'alice@example.com' })
  })

  it('returns 401 on wrong password (AUTH_INVALID_CREDENTIALS)', async () => {
    mockLoginUser.mockRejectedValue(new AppError('AUTH_INVALID_CREDENTIALS', 'Incorrect email or password'))

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'alice@example.com', password: 'wrong' })

    expect(res.status).toBe(401)
    expect(res.body.code).toBe('AUTH_INVALID_CREDENTIALS')
  })
})

describe('POST /api/v1/auth/refresh', () => {
  beforeEach(() => vi.resetAllMocks())

  it('returns 200 with new access token', async () => {
    mockRefreshTokens.mockResolvedValue(MOCK_TOKENS)

    const res = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: 'valid-refresh-token' })

    expect(res.status).toBe(200)
    expect(res.body.accessToken).toBe('mock-access-token')
  })

  it('returns 401 on invalid refresh token', async () => {
    mockRefreshTokens.mockRejectedValue(new AppError('AUTH_TOKEN_INVALID', 'Invalid or expired token'))

    const res = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: 'bad-token' })

    expect(res.status).toBe(401)
  })
})

// Logout requires authenticate middleware (valid Bearer token).
// Since JWT signing is mocked via env mocks, we skip the full flow and
// test that without auth it returns 401.
describe('POST /api/v1/auth/logout', () => {
  beforeEach(() => vi.resetAllMocks())

  it('returns 401 without a valid Bearer token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/logout')
      .send({ refreshToken: 'some-token' })

    expect(res.status).toBe(401)
  })
})
