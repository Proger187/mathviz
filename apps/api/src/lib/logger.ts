import { env } from '../config/env'

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
const SENSITIVE_KEYS = new Set(['password', 'passwordHash', 'token', 'accessToken', 'refreshToken', 'tokenHash'])

function maskEmail(str: string): string {
  return str.replace(EMAIL_RE, '[email]')
}

function sanitize(value: unknown): unknown {
  if (typeof value === 'string') return maskEmail(value)
  if (Array.isArray(value)) return value.map(sanitize)
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [
        k,
        SENSITIVE_KEYS.has(k) ? '[redacted]' : sanitize(v),
      ]),
    )
  }
  return value
}

function fmt(level: string, msg: string, meta?: unknown): string {
  const ts = new Date().toISOString()
  const safe = meta !== undefined ? ` ${JSON.stringify(sanitize(meta))}` : ''
  return `${ts} [${level}] ${maskEmail(msg)}${safe}`
}

export const logger = {
  info: (msg: string, meta?: unknown) => console.log(fmt('INFO', msg, meta)),
  warn: (msg: string, meta?: unknown) => console.warn(fmt('WARN', msg, meta)),
  error: (msg: string, meta?: unknown) => console.error(fmt('ERROR', msg, meta)),
  debug: (msg: string, meta?: unknown) => {
    if (env.NODE_ENV !== 'production') console.debug(fmt('DEBUG', msg, meta))
  },
}
