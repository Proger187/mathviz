import type { ApiErrorCode } from '@mathviz/shared'

import { getAccessToken, setAccessToken } from './token'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

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

let refreshPromise: Promise<string> | null = null

async function refreshAccessToken(): Promise<string> {
  const res = await fetch(`${API_BASE}/api/v1/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error('Refresh failed')
  const body = (await res.json()) as { accessToken: string }
  setAccessToken(body.accessToken)
  return body.accessToken
}

async function doFetch(path: string, options: RequestInit): Promise<Response> {
  const token = getAccessToken()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers,
  })
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response = await doFetch(path, options)

  if (response.status === 401 && getAccessToken() && !path.includes('/auth/refresh')) {
    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken()
      }
      await refreshPromise
      response = await doFetch(path, options)
    } catch {
      // refresh failed — fall through to throw the original 401
    } finally {
      refreshPromise = null
    }
  }

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
