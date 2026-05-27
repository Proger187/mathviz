/**
 * Database initialization script
 * Handles database creation, migrations, and seeding
 * Run automatically on dev startup
 */
import { Pool } from 'pg'
import { execSync } from 'child_process'
import { config } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const currentDir = dirname(fileURLToPath(import.meta.url))
const rootEnvPath = resolve(currentDir, '../../../../.env')
const apiEnvPath = resolve(currentDir, '../../.env')

config({ path: rootEnvPath })
config({ path: apiEnvPath })

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required')
}

async function initDatabase() {
  const url = new URL(DATABASE_URL)
  const dbName = url.pathname.slice(1) // Remove leading /
  const adminUrl = new URL(DATABASE_URL)
  adminUrl.pathname = '/postgres' // Connect to default postgres database

  const pool = new Pool({ connectionString: adminUrl.toString() })

  try {
    // Check if database exists
    const result = await pool.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName])

    if (result.rows.length === 0) {
      console.log(`[db] Creating database: ${dbName}`)
      await pool.query(`CREATE DATABASE "${dbName}"`)
      console.log(`[db] ✓ Database created`)
    } else {
      console.log(`[db] Database already exists: ${dbName}`)
    }
  } finally {
    await pool.end()
  }

  // Run migrations
  console.log(`[db] Running migrations…`)
  try {
    execSync('drizzle-kit migrate', {
      cwd: resolve(currentDir, '../..'),
      stdio: 'inherit',
    })
    console.log(`[db] ✓ Migrations complete`)
  } catch (err) {
    console.error(`[db] ✗ Migration failed:`, err)
    throw err
  }

  // Seed database
  console.log(`[db] Seeding database…`)
  try {
    execSync('tsx src/db/seed.ts', {
      cwd: resolve(currentDir, '../..'),
      stdio: 'inherit',
    })
    console.log(`[db] ✓ Database initialized and seeded`)
  } catch (err) {
    console.error(`[db] ✗ Seeding failed:`, err)
    throw err
  }
}

// Run initialization
initDatabase().catch((err) => {
  console.error('[db] Initialization failed:', err.message)
  process.exit(1)
})
