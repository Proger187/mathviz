import { eq } from 'drizzle-orm'

import { db } from '../../db/client.js'
import { users, badges, userBadges, quizSessions } from '../../db/schema/index.js'

import { levelFromXp, updateStreak } from './gamification.utils.js'

/**
 * Apply XP and streak after a completed quiz session.
 * Returns the updated user row.
 */
export async function applyQuizCompletion(
  userId: string,
  xpEarned: number,
  completedAt: Date,
): Promise<{ newXp: number; newLevel: number; newStreak: number; leveledUp: boolean }> {
  const [user] = await db
    .select({
      xp: users.xp,
      level: users.level,
      streak: users.streak,
      lastQuizDate: users.lastQuizDate,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  if (!user) throw new Error(`User ${userId} not found`)

  const lastDate = user.lastQuizDate ? new Date(user.lastQuizDate) : null
  const streakSignal = updateStreak(lastDate, completedAt)

  let newStreak: number
  if (streakSignal === 0) {
    newStreak = user.streak // same day, no change
  } else if (streakSignal === 1) {
    newStreak = user.streak + 1 // consecutive day
  } else {
    newStreak = 1 // gap: reset
  }

  const newXp = user.xp + xpEarned
  const newLevel = levelFromXp(newXp)
  const leveledUp = newLevel > user.level
  const completedDateStr = completedAt.toISOString().slice(0, 10)

  await db
    .update(users)
    .set({
      xp: newXp,
      level: newLevel,
      streak: newStreak,
      lastQuizDate: completedDateStr,
    })
    .where(eq(users.id, userId))

  return { newXp, newLevel, newStreak, leveledUp }
}

/**
 * Evaluate and award any badges the user has newly earned.
 * This is idempotent — already-awarded badges are skipped via the PK constraint.
 */
export async function evaluateBadges(userId: string): Promise<void> {
  // Fetch all badge definitions
  const allBadges = await db.select().from(badges)

  // Fetch already-earned badge IDs for this user
  const earned = await db
    .select({ badgeId: userBadges.badgeId })
    .from(userBadges)
    .where(eq(userBadges.userId, userId))

  const earnedIds = new Set(earned.map((e) => e.badgeId))
  const unearnedBadges = allBadges.filter((b) => !earnedIds.has(b.id))
  if (unearnedBadges.length === 0) return

  const [user] = await db
    .select({
      streak: users.streak,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  if (!user) return

  // Count quiz sessions for the user
  const sessions = await db
    .select({ id: quizSessions.id, mode: quizSessions.mode, score: quizSessions.score })
    .from(quizSessions)
    .where(eq(quizSessions.userId, userId))

  const totalSessions = sessions.length
  const fractionsPerfect = sessions.some((s) => s.mode === 'fractions' && s.score === 100)
  const multiplicationSessions = sessions.filter((s) => s.mode === 'multiplication').length

  const toAward: { userId: string; badgeId: string }[] = []

  for (const badge of unearnedBadges) {
    let shouldAward = false
    switch (badge.key) {
      case 'first_quiz':
        shouldAward = totalSessions >= 1
        break
      case 'streak_7':
        shouldAward = user.streak >= 7
        break
      case 'fractions_perfect':
        shouldAward = fractionsPerfect
        break
      case 'multiplication_master':
        shouldAward = multiplicationSessions >= 10
        break
      default:
        break
    }
    if (shouldAward) {
      toAward.push({ userId, badgeId: badge.id })
    }
  }

  if (toAward.length > 0) {
    // Insert ignoring conflicts (badge already awarded in a race condition)
    await db.insert(userBadges).values(toAward).onConflictDoNothing()
  }
}
