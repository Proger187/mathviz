import type { Locale } from '@mathviz/shared'


import en from './en.json'
import kg from './kg.json'
import ru from './ru.json'
import type { TranslationDict } from './types'

export const translations: Record<Locale, TranslationDict> = { en, ru, kg }

export { getTranslation } from './getTranslation'
export type { TranslationDict, TranslateParams } from './types'
