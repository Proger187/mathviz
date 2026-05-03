import { describe, it, expect, vi } from 'vitest'

import { getTranslation } from './getTranslation'
import type { TranslationDict } from './types'

const EN: TranslationDict = {
  common: { appName: 'MathViz', error: 'Something went wrong' },
  greeting: 'Hello, {name}!',
  nested: { deep: { key: 'deep value' } },
}

const RU: TranslationDict = {
  common: { appName: 'МатВиз' },
  greeting: 'Привет, {name}!',
}

describe('getTranslation', () => {
  it('resolves a top-level string key', () => {
    expect(getTranslation(EN, EN, 'greeting')).toBe('Hello, {name}!')
  })

  it('resolves nested dot-separated key', () => {
    expect(getTranslation(EN, EN, 'common.appName')).toBe('MathViz')
    expect(getTranslation(EN, EN, 'nested.deep.key')).toBe('deep value')
  })

  it('substitutes named {placeholder} tokens', () => {
    expect(getTranslation(EN, EN, 'greeting', { name: 'Alice' })).toBe('Hello, Alice!')
  })

  it('falls back to English dict when key missing in active locale', () => {
    // RU has no 'nested' key — should fall back to EN
    expect(getTranslation(RU, EN, 'nested.deep.key')).toBe('deep value')
  })

  it('returns the raw key when missing in both locales', () => {
    expect(getTranslation(RU, EN, 'totally.missing.key')).toBe('totally.missing.key')
  })

  it('warns in development when key is missing', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    const originalEnv = process.env['NODE_ENV']
    // @ts-expect-error override read-only
    process.env['NODE_ENV'] = 'development'

    getTranslation(RU, EN, 'totally.missing.key')
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('totally.missing.key'))

    // @ts-expect-error -- restore process.env which has stricter type than string
    process.env['NODE_ENV'] = originalEnv
    spy.mockRestore()
  })

  it('does not substitute if no params provided', () => {
    expect(getTranslation(EN, EN, 'greeting')).toBe('Hello, {name}!')
  })

  it('leaves unreferenced placeholders intact', () => {
    expect(getTranslation(EN, EN, 'greeting', {})).toBe('Hello, {name}!')
  })
})
