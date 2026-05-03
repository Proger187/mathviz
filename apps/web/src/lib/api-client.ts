import type { ApiErrorCode } from '@mathviz/shared'

import { getAccessToken } from './token'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

export interface ApiError {
  code: ApiErrorCode
  message: string
}

export class ApiResponseError extends Error {
  readonly code: ApiErrorCode
  readonly status: number

  constructor(code: ApiErrorCode, message: string, status: number) {
    super(message)
    this.name = 'ApiResponseError'
    this.code = code
    this.status = status
  }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAccessToken()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include', // send HttpOnly refresh-token cookie
    headers,
  })

  if (!response.ok) {
    let code: ApiErrorCode = 'INTERNAL_ERROR'
    let message = response.statusText

    try {
      const body = (await response.json()) as Partial<ApiError>
      if (body.code) code = body.code
      if (body.message) message = body.message
    } catch {
      // response body was not JSON — keep defaults
    }

    throw new ApiResponseError(code, message, response.status)
  }

  return response.json() as Promise<T>
}
