export type TranslationDict = {
  [key: string]: string | TranslationDict
}

export type TranslateParams = Record<string, string | number>
