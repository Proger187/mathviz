import crypto from 'crypto'

import { eq, and } from 'drizzle-orm'

import { db } from '../../db/client'
import { users, refreshTokens as refreshTokensTable } from '../../db/schema'
import { AppError } from '../../lib/AppError'
import { hashPassword, verifyPassword } from '../../lib/bcrypt'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../lib/jwt'

import type { AuthTokenPair, LoginInput, RegisterInput, SafeUser } from './auth.types'

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}

function toSafeUser(row: typeof users.$inferSelect): SafeUser {
  return {
    id: row.id,
    email: row.email,
    username: row.username,
    xp: row.xp,
    level: row.level,
    streak: row.streak,
  }
}

function issueTokenPair(user: SafeUser): AuthTokenPair {
  const payload = { sub: user.id, email: user.email, username: user.username }
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  }
}

export async function registerUser(input: RegisterInput): Promise<SafeUser> {
  const [existingEmail] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, input.email))
    .limit(1)

  if (existingEmail) throw new AppError('AUTH_EMAIL_TAKEN', 'Email is already registered')

  const [existingUsername] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.username, input.username))
    .limit(1)

  if (existingUsername) throw new AppError('AUTH_USERNAME_TAKEN', 'Username is already taken')

  const passwordHash = await hashPassword(input.password)

  const [inserted] = await db
    .insert(users)
    .values({ email: input.email, username: input.username, passwordHash })
    .returning()

  if (!inserted) throw new AppError('INTERNAL_ERROR', 'Failed to create user')

  return toSafeUser(inserted)
}

export async function loginUser(
  input: LoginInput,
): Promise<{ user: SafeUser; tokens: AuthTokenPair }> {
  const [row] = await db
    .select()
    .from(users)
    .where(eq(users.email, input.email))
    .limit(1)

  // Use the same error for missing user and wrong password to prevent enumeration
  const valid = row ? await verifyPassword(input.password, row.passwordHash) : false
  if (!row || !valid) {
    throw new AppError('AUTH_INVALID_CREDENTIALS', 'Incorrect email or password')
  }

  const user = toSafeUser(row)
  const tokens = issueTokenPair(user)

  // Store hashed refresh token with 7-day expiry
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  await db.insert(refreshTokensTable).values({
    userId: user.id,
    tokenHash: hashToken(tokens.refreshToken),
    expiresAt,
  })

  return { user, tokens }
}

export async function refreshTokens(token: string): Promise<AuthTokenPair> {
  const payload = verifyRefreshToken(token) // throws AppError on invalid/expired

  const tokenHash = hashToken(token)
  const [stored] = await db
    .select()
    .from(refreshTokensTable)
    .where(and(eq(refreshTokensTable.userId, payload.sub), eq(refreshTokensTable.tokenHash, tokenHash)))
    .limit(1)

  if (!stored) throw new AppError('AUTH_TOKEN_INVALID', 'Refresh token not recognised')

  // Delete old token (rotation)
  await db.delete(refreshTokensTable).where(eq(refreshTokensTable.id, stored.id))

  const newTokens = issueTokenPair({
    id: payload.sub,
    email: payload.email,
    username: payload.username,
    xp: 0,
    level: 1,
    streak: 0,
  })

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  await db.insert(refreshTokensTable).values({
    userId: payload.sub,
    tokenHash: hashToken(newTokens.refreshToken),
    expiresAt,
  })

  return newTokens
}

export async function logoutUser(token: string): Promise<void> {
  const tokenHash = hashToken(token)
  await db.delete(refreshTokensTable).where(eq(refreshTokensTable.tokenHash, tokenHash))
}
