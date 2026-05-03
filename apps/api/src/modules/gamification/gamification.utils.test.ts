import { describe, it, expect } from 'vitest'

import {
  computeXp,
  levelFromXp,
  didLevelUp,
  updateStreak,
  LEVEL_THRESHOLDS,
} from './gamification.utils'

describe('computeXp', () => {
  const limit = 30_000 // 30s time limit

  it('wrong answer earns 0 XP', () => {
    expect(computeXp(false, false, 5_000, limit)).toBe(0)
    expect(computeXp(false, true, 5_000, limit)).toBe(0)
  })

  it('correct without hint, no speed bonus (>75% time used)', () => {
    expect(computeXp(true, false, 25_000, limit)).toBe(10)
  })

  it('correct with hint, no speed bonus', () => {
    expect(computeXp(true, true, 25_000, limit)).toBe(5)
  })

  it('+1 speed bonus at ≤75% time', () => {
    expect(computeXp(true, false, 22_000, limit)).toBe(11) // 73% — bonus 1
  })

  it('+3 speed bonus at ≤50% time', () => {
    expect(computeXp(true, false, 14_000, limit)).toBe(13) // 46% — bonus 3
  })

  it('+5 speed bonus at ≤25% time', () => {
    expect(computeXp(true, false, 7_000, limit)).toBe(15) // 23% — bonus 5
  })

  it('hint + speed bonus combined', () => {
    expect(computeXp(true, true, 7_000, limit)).toBe(10) // 5 base + 5 speed
  })

  it('zero time limit — no speed bonus (ratio treated as 1)', () => {
    expect(computeXp(true, false, 0, 0)).toBe(10)
  })
})

describe('levelFromXp', () => {
  it('0 XP is level 1 (Novice)', () => {
    expect(levelFromXp(0)).toBe(1)
  })

  it('just below level 2 threshold', () => {
    expect(levelFromXp((LEVEL_THRESHOLDS[1] ?? 0) - 1)).toBe(1)
  })

  it('at level 2 threshold (Apprentice)', () => {
    expect(levelFromXp(LEVEL_THRESHOLDS[1] ?? 0)).toBe(2)
  })

  it('at level 3 threshold (Scholar)', () => {
    expect(levelFromXp(LEVEL_THRESHOLDS[2] ?? 0)).toBe(3)
  })

  it('at level 4 threshold (Master)', () => {
    expect(levelFromXp(LEVEL_THRESHOLDS[3] ?? 0)).toBe(4)
  })

  it('at level 5 threshold (Champion)', () => {
    expect(levelFromXp(LEVEL_THRESHOLDS[4] ?? 0)).toBe(5)
  })

  it('well above max threshold stays at max level', () => {
    expect(levelFromXp(999_999)).toBe(5)
  })
})

describe('didLevelUp', () => {
  it('no level-up when staying in same level', () => {
    expect(didLevelUp(50, 10)).toBe(false)
  })

  it('level-up crossing threshold', () => {
    expect(didLevelUp(95, 10)).toBe(true) // 95 → 105, crosses 100
  })

  it('exact at threshold is not a level-up (already at that level)', () => {
    expect(didLevelUp(100, 0)).toBe(false)
  })
})

describe('updateStreak', () => {
  const DAY = 86_400_000

  it('null lastQuizDate returns 1 (new streak)', () => {
    expect(updateStreak(null, new Date())).toBe(1)
  })

  it('same calendar day returns 0 (no change)', () => {
    const now = new Date('2026-05-01T15:00:00Z')
    const earlier = new Date('2026-05-01T08:00:00Z')
    expect(updateStreak(earlier, now)).toBe(0)
  })

  it('next consecutive day returns 1 (increment)', () => {
    const yesterday = new Date('2026-04-30T12:00:00Z')
    const today = new Date('2026-05-01T12:00:00Z')
    expect(updateStreak(yesterday, today)).toBe(1)
  })

  it('2-day gap returns -1 (reset)', () => {
    const twoDaysAgo = new Date(Date.now() - 2 * DAY)
    expect(updateStreak(twoDaysAgo, new Date())).toBe(-1)
  })

  it('1-week gap returns -1 (reset)', () => {
    const weekAgo = new Date(Date.now() - 7 * DAY)
    expect(updateStreak(weekAgo, new Date())).toBe(-1)
  })
})
