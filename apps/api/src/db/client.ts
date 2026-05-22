import { neon } from '@neondatabase/serverless'
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http'
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

import { env } from '../config/env'

import * as schema from './schema'

function isNeonDatabaseUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url)
    return hostname.endsWith('.neon.tech')
  } catch {
    return false
  }
}

function createDb() {
  if (isNeonDatabaseUrl(env.DATABASE_URL)) {
    const sql = neon(env.DATABASE_URL)
    return drizzleNeon(sql, { schema })
  }

  const pool = new Pool({ connectionString: env.DATABASE_URL })
  return drizzlePg(pool, { schema })
}

export const db = createDb()
