import { sql } from 'drizzle-orm'
import { pgTable, uuid, text, timestamp, primaryKey } from 'drizzle-orm/pg-core'

import { users } from './users'

export const badges = pgTable('badges', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  key: text('key').unique().notNull(),
  label: text('label').notNull(),
  description: text('description').notNull(),
  iconUrl: text('icon_url'),
})

export const userBadges = pgTable(
  'user_badges',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    badgeId: uuid('badge_id')
      .notNull()
      .references(() => badges.id),
    earnedAt: timestamp('earned_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.badgeId] })],
)
