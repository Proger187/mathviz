/**
 * Idempotent badge seed script.
 * Run: npx tsx src/db/seed.ts
 */
import { db } from './client.js'
import { badges } from './schema/index.js'

const BADGE_DEFINITIONS = [
  {
    key: 'first_quiz',
    label: 'First Steps',
    description: 'Complete your first quiz.',
    iconUrl: null,
  },
  {
    key: 'streak_7',
    label: 'On Fire',
    description: 'Maintain a 7-day quiz streak.',
    iconUrl: null,
  },
  {
    key: 'fractions_perfect',
    label: 'Fractions Master',
    description: 'Score 100% on a fractions quiz.',
    iconUrl: null,
  },
  {
    key: 'multiplication_master',
    label: 'Multiplication Master',
    description: 'Complete 10 multiplication quiz sessions.',
    iconUrl: null,
  },
] as const

async function seed() {
  console.log('Seeding badge definitions…')

  for (const badge of BADGE_DEFINITIONS) {
    await db
      .insert(badges)
      .values(badge)
      .onConflictDoUpdate({
        target: badges.key,
        set: {
          label: badge.label,
          description: badge.description,
          iconUrl: badge.iconUrl,
        },
      })
    console.log(`  ✓ ${badge.key}`)
  }

  console.log('Done.')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
