import { config } from 'dotenv'
import { z } from 'zod'

config()

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3001),
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  BCRYPT_ROUNDS: z.coerce.number().int().min(10).max(14).default(12),
  FRONTEND_ORIGIN: z.string().url('FRONTEND_ORIGIN must be a valid URL'),
})

function loadEnv() {
  const result = envSchema.safeParse(process.env)
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  • ${i.path.join('.')}: ${i.message}`)
      .join('\n')
    console.error(`\n[startup] Missing or invalid environment variables:\n${issues}\n`)
    process.exit(1)
  }
  return result.data
}

export const env = loadEnv()
