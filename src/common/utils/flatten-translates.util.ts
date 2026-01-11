import { LANG } from 'src/common/enums/translation.enum'

type Translatable = {
  [key: string]: any
  translates?: { lang: LANG; field: string; value: string }[]
}

/**
 * Flattens translations into separate fields like title_ua, title_en, subtitle_ua, subtitle_en
 * Also applies the current language translation to the base field.
 * This is useful for entities that need to return all localized versions in the API response.
 */
export function flattenTranslations<T extends Translatable>(entities: T[], lang: LANG): T[] {
  for (const entity of entities) {
    if (entity.translates?.length) {
      for (const translate of entity.translates) {
        // Apply current language translation to the base field
        if (translate.lang === lang) {
          ;(entity as Record<string, unknown>)[translate.field] = translate.value
        }

        // Create language-suffixed fields (e.g., title_ua, title_en, subtitle_ua, subtitle_en)
        const fieldKey = `${translate.field}_${translate.lang}`
        ;(entity as Record<string, unknown>)[fieldKey] = translate.value
      }
    }
  }
  return entities
}
