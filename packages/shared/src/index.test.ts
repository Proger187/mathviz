import { describe, it, expect } from 'vitest'
import {
  RegisterSchema,
  LoginSchema,
  RefreshTokenSchema,
  MODES,
  DIFFICULTY,
  LOCALES,
  DEFAULT_LOCALE,
  BASE_XP,
  CORRECTNESS_MULTIPLIER,
  API_ERROR_CODES,
} from './index'

// ─── Auth schemas ──────────────────────────────────────────────────

describe('RegisterSchema', () => {
  it('accepts valid input', () => {
    const result = RegisterSchema.safeParse({
      email: 'user@example.com',
      password: 'secret123',
      username: 'alice',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = RegisterSchema.safeParse({
      email: 'not-an-email',
      password: 'secret123',
      username: 'alice',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.path).toContain('email')
    }
  })

  it('rejects password shorter than 8 chars', () => {
    const result = RegisterSchema.safeParse({
      email: 'user@example.com',
      password: 'short',
      username: 'alice',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.path).toContain('password')
    }
  })

  it('rejects username shorter than 3 chars', () => {
    const result = RegisterSchema.safeParse({
      email: 'user@example.com',
      password: 'secret123',
      username: 'ab',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.path).toContain('username')
    }
  })

  it('rejects missing fields', () => {
    const result = RegisterSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})

describe('LoginSchema', () => {
  it('accepts valid input', () => {
    const result = LoginSchema.safeParse({
      email: 'user@example.com',
      password: 'secret123',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = LoginSchema.safeParse({ email: 'bad', password: 'secret123' })
    expect(result.success).toBe(false)
  })

  it('rejects empty password', () => {
    const result = LoginSchema.safeParse({ email: 'user@example.com', password: '' })
    expect(result.success).toBe(false)
  })
})

describe('RefreshTokenSchema', () => {
  it('accepts valid token string', () => {
    const result = RefreshTokenSchema.safeParse({ refreshToken: 'some.jwt.token' })
    expect(result.success).toBe(true)
  })

  it('rejects empty token', () => {
    const result = RefreshTokenSchema.safeParse({ refreshToken: '' })
    expect(result.success).toBe(false)
  })
})

// ─── Constants ─────────────────────────────────────────────────────

describe('MODES constant', () => {
  it('has the four expected mode IDs', () => {
    expect(Object.keys(MODES)).toEqual(
      expect.arrayContaining(['fractions', 'negative', 'multiplication', 'division']),
    )
  })

  it('each mode has an id and icon', () => {
    for (const mode of Object.values(MODES)) {
      expect(typeof mode.id).toBe('string')
      expect(typeof mode.icon).toBe('string')
      expect(mode.icon.length).toBeGreaterThan(0)
    }
  })
})

describe('DIFFICULTY constant', () => {
  it('has easy, medium, hard', () => {
    expect(DIFFICULTY.easy).toBe('easy')
    expect(DIFFICULTY.medium).toBe('medium')
    expect(DIFFICULTY.hard).toBe('hard')
  })
})

describe('LOCALES and DEFAULT_LOCALE', () => {
  it('includes en, ru, kg', () => {
    expect(LOCALES).toContain('en')
    expect(LOCALES).toContain('ru')
    expect(LOCALES).toContain('kg')
  })

  it('DEFAULT_LOCALE is en', () => {
    expect(DEFAULT_LOCALE).toBe('en')
  })
})

describe('XP constants', () => {
  it('BASE_XP is a positive integer', () => {
    expect(typeof BASE_XP).toBe('number')
    expect(BASE_XP).toBeGreaterThan(0)
    expect(Number.isInteger(BASE_XP)).toBe(true)
  })

  it('CORRECTNESS_MULTIPLIER has correct keys with numeric values', () => {
    expect(CORRECTNESS_MULTIPLIER.correctFirstTry).toBe(1.0)
    expect(CORRECTNESS_MULTIPLIER.correctAfterHint).toBe(0.5)
    expect(CORRECTNESS_MULTIPLIER.wrong).toBe(0.0)
  })
})

describe('API_ERROR_CODES', () => {
  it('each key equals its string value', () => {
    for (const [key, value] of Object.entries(API_ERROR_CODES)) {
      expect(key).toBe(value)
    }
  })

  it('includes expected codes', () => {
    expect(API_ERROR_CODES.AUTH_EMAIL_TAKEN).toBe('AUTH_EMAIL_TAKEN')
    expect(API_ERROR_CODES.INTERNAL_ERROR).toBe('INTERNAL_ERROR')
    expect(API_ERROR_CODES.NOT_FOUND).toBe('NOT_FOUND')
  })
})
