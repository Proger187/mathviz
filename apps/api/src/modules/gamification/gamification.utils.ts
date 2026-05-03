/**
 * Level thresholds for XP progression.
 * Level 1: 0 XP, Level 2: 100, Level 3: 300, Level 4: 700 (Novice→Apprentice→Scholar→Master)
 */
export const LEVEL_THRESHOLDS = [0, 100, 300, 700, 1500] as const

export const LEVEL_NAMES = ['Novice', 'Apprentice', 'Scholar', 'Master', 'Champion'] as const

const BASE_XP_AWARD = 10

/**
 * Compute XP awarded for a single quiz answer.
 *
 * Formula:
 *   base = 10
 *   correctness multiplier: correct first try = 1.0, with hint = 0.5, wrong = 0
 *   speed bonus: +5 if answered in ≤ 25% of timeLimitMs, +3 if ≤ 50%, +1 if ≤ 75%, else 0
 */
export function computeXp(
  isCorrect: boolean,
  usedHint: boolean,
  timeTakenMs: number,
  timeLimitMs: number,
): number {
  if (!isCorrect) return 0

  const correctnessMultiplier = usedHint ? 0.5 : 1.0
  const base = Math.round(BASE_XP_AWARD * correctnessMultiplier)

  const ratio = timeLimitMs > 0 ? timeTakenMs / timeLimitMs : 1
  const speedBonus = ratio <= 0.25 ? 5 : ratio <= 0.5 ? 3 : ratio <= 0.75 ? 1 : 0

  return base + speedBonus
}

/**
 * Find the level (1-based) corresponding to `totalXp`.
 * Returns the highest level whose threshold has been reached.
 */
export function levelFromXp(totalXp: number): number {
  let level = 1
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
    if (totalXp >= (LEVEL_THRESHOLDS[i] ?? 0)) {
      level = i + 1
    } else {
      break
    }
  }
  return level
}

/** Returns true if gaining `gainedXp` causes a level change. */
export function didLevelUp(previousXp: number, gainedXp: number): boolean {
  return levelFromXp(previousXp + gainedXp) > levelFromXp(previousXp)
}

/**
 * Compute the new streak count.
 *  - Same calendar day as lastQuizDate: streak unchanged.
 *  - Next consecutive calendar day: streak + 1.
 *  - Gap of 2+ days: streak resets to 1.
 *  - No previous quiz (null): streak starts at 1.
 */
export function updateStreak(lastQuizDate: Date | null, now: Date): number {
  if (lastQuizDate === null) return 1

  const msPerDay = 86_400_000
  const lastDay = Math.floor(lastQuizDate.getTime() / msPerDay)
  const today = Math.floor(now.getTime() / msPerDay)
  const diff = today - lastDay

  if (diff === 0) return 0 // already quizzed today — caller keeps existing streak
  if (diff === 1) return 1 // consecutive day — caller should add 1
  return -1 // gap — caller should reset to 1
}
