import type { ApiErrorCode } from '@mathviz/shared'

const STATUS_MAP: Record<ApiErrorCode, number> = {
  AUTH_EMAIL_TAKEN: 409,
  AUTH_USERNAME_TAKEN: 409,
  AUTH_INVALID_CREDENTIALS: 401,
  AUTH_TOKEN_EXPIRED: 401,
  AUTH_TOKEN_INVALID: 401,
  QUIZ_SESSION_NOT_FOUND: 404,
  QUIZ_ALREADY_COMPLETED: 409,
  VALIDATION_ERROR: 422,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
}

export class AppError extends Error {
  readonly statusCode: number
  readonly code: ApiErrorCode

  constructor(code: ApiErrorCode, message: string) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.statusCode = STATUS_MAP[code] ?? 500
  }
}
