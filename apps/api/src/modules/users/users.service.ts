import { eq, gte, desc, sum } from 'drizzle-orm'

import { db } from '../../db/client.js'
import { users, badges, userBadges, quizSessions } from '../../db/schema/index.js'
import { levelFromXp, LEVEL_NAMES, LEVEL_THRESHOLDS } from '../gamification/gamification.utils.js'

function getLastMonday(): Date {
  const now = new Date()
  const day = now.getUTCDay() // 0 = Sunday, 1 = Monday …
  const daysBack = day === 0 ? 6 : day - 1
  const monday = new Date(now)
  monday.setUTCDate(now.getUTCDate() - daysBack)
  monday.setUTCHours(0, 0, 0, 0)
  return monday
}

export interface UserProfile {
  id: string
  email: string
  username: string
  xp: number
  level: number
  levelName: string
  xpToNextLevel: number | null
  streak: number
  lastQuizDate: string | null
  createdAt: string
}

export interface BadgeWithEarned {
  id: string
  key: string
  label: string
  description: string
  iconUrl: string | null
  earnedAt: string | null
}

export interface QuizHistoryItem {
  id: string
  mode: string
  score: number
  xpEarned: number
  completedAt: string
}

export interface LeaderboardItem {
  rank: number
  userId: string
  username: string
  weeklyXp: number
}

export async function getMe(userId: string): Promise<UserProfile> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  if (!user) throw new Error('User not found')

  const level = levelFromXp(user.xp)
  const levelName = LEVEL_NAMES[level - 1] ?? 'Champion'
  const nextThreshold = LEVEL_THRESHOLDS[level] ?? null
  const xpToNextLevel = nextThreshold !== undefined && nextThreshold !== null ? nextThreshold - user.xp : null

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    xp: user.xp,
    level,
    levelName,
    xpToNextLevel,
    streak: user.streak,
    lastQuizDate: user.lastQuizDate ?? null,
    createdAt: user.createdAt.toISOString(),
  }
}

export async function getMyBadges(userId: string, limit = 20): Promise<BadgeWithEarned[]> {
  const allBadges = await db.select().from(badges)

  const earned = await db
    .select({ badgeId: userBadges.badgeId, earnedAt: userBadges.earnedAt })
    .from(userBadges)
    .where(eq(userBadges.userId, userId))
    .limit(limit)

  const earnedMap = new Map(earned.map((e) => [e.badgeId, e.earnedAt.toISOString()]))

  return allBadges.map((b) => ({
    id: b.id,
    key: b.key,
    label: b.label,
    description: b.description,
    iconUrl: b.iconUrl ?? null,
    earnedAt: earnedMap.get(b.id) ?? null,
  }))
}

export async function getMyHistory(userId: string, limit = 20): Promise<QuizHistoryItem[]> {
  const sessions = await db
    .select()
    .from(quizSessions)
    .where(eq(quizSessions.userId, userId))
    .orderBy(desc(quizSessions.completedAt))
    .limit(limit)

  return sessions.map((s) => ({
    id: s.id,
    mode: s.mode,
    score: s.score,
    xpEarned: s.xpEarned,
    completedAt: s.completedAt.toISOString(),
  }))
}

export async function getWeeklyLeaderboard(limit = 50): Promise<LeaderboardItem[]> {
  const since = getLastMonday()

  const rows = await db
    .select({
      userId: quizSessions.userId,
      weeklyXp: sum(quizSessions.xpEarned).mapWith(Number),
    })
    .from(quizSessions)
    .where(gte(quizSessions.completedAt, since))
    .groupBy(quizSessions.userId)
    .orderBy(desc(sum(quizSessions.xpEarned)))
    .limit(limit)

  const userIds = rows.map((r) => r.userId)
  if (userIds.length === 0) return []

  const userRows = await db
    .select({ id: users.id, username: users.username })
    .from(users)

  const usernameMap = new Map(userRows.map((u) => [u.id, u.username]))

  return rows.map((row, idx) => ({
    rank: idx + 1,
    userId: row.userId,
    username: usernameMap.get(row.userId) ?? 'Unknown',
    weeklyXp: row.weeklyXp ?? 0,
  }))
}
