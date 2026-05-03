import { sql } from 'drizzle-orm'
import { pgTable, uuid, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core'

import { users } from './users'

export const quizSessions = pgTable('quiz_sessions', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  mode: text('mode').notNull(),
  score: integer('score').notNull(),
  xpEarned: integer('xp_earned').notNull(),
  completedAt: timestamp('completed_at', { withTimezone: true }).notNull().defaultNow(),
})

export const quizAnswers = pgTable('quiz_answers', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  sessionId: uuid('session_id')
    .notNull()
    .references(() => quizSessions.id),
  problemId: text('problem_id').notNull(),
  userAnswer: text('user_answer').notNull(),
  isCorrect: boolean('is_correct').notNull(),
  timeTakenMs: integer('time_taken_ms').notNull(),
})
