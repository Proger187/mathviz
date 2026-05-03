import type { TranslationDict, TranslateParams } from './types'

/**
 * Resolves a dot-separated key against a TranslationDict.
 * Returns the string value, or undefined if the path does not exist or leads to a nested object.
 */
function resolveDotKey(dict: TranslationDict, key: string): string | undefined {
  const parts = key.split('.')
  let current: string | TranslationDict = dict
  for (const part of parts) {
    if (typeof current !== 'object' || current === null) return undefined
    const child: string | TranslationDict | undefined = current[part]
    if (child === undefined) return undefined
    current = child
  }
  return typeof current === 'string' ? current : undefined
}

/**
 * Substitutes {placeholder} tokens in a template string.
 */
function interpolate(template: string, params: TranslateParams): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    const value = params[key]
    return value !== undefined ? String(value) : `{${key}}`
  })
}

/**
 * Returns the translated string for a given key.
 * Falls back to the English dictionary if the key is missing in the active locale.
 * Falls back to the raw key string (and warns in development) if not found in either.
 */
export function getTranslation(
  dict: TranslationDict,
  fallbackDict: TranslationDict,
  key: string,
  params?: TranslateParams,
): string {
  const raw = resolveDotKey(dict, key) ?? resolveDotKey(fallbackDict, key)

  if (raw === undefined) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[i18n] Missing translation key: "${key}"`)
    }
    return key
  }

  return params ? interpolate(raw, params) : raw
}
