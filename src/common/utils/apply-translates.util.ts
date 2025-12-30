import { LANG } from 'src/common/enums/translation.enum'

type Translatable = {
  [key: string]: any
  translates?: { lang: LANG; field: string; value: string }[]
}

export function applyTranslations<T extends Translatable>(entities: T[], lang: LANG): T[] {
  for (const entity of entities) {
    if (entity.translates?.length) {
      const filteredTranslateList = entity.translates.filter((item) => item.lang === lang)

      if (filteredTranslateList?.length) {
        for (const translate of filteredTranslateList) {
          if (entity[translate.field] !== undefined) {
            ;(entity as Record<string, unknown>)[translate.field] = translate.value
          }
        }
      }
    }
  }
  return entities
}
