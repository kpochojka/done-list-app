import type { Category } from '@/types'

const DEFAULT_NAME_TO_KEY: Record<string, string> = {
  Praca: 'work',
  Nauka: 'learn',
  'Język hiszpański': 'spanish',
  Zdrowie: 'health',
  Dom: 'home',
}

/**
 * Returns a translated display name for a category. Default seeded
 * categories (stored in Polish in the DB) are looked up in the
 * `categories` translation namespace; user-created categories keep
 * their custom name as-is per CLAUDE.md i18n rules.
 */
export function getCategoryDisplayName(
  category: Pick<Category, 'name'>,
  t: (key: string) => string
): string {
  const key = DEFAULT_NAME_TO_KEY[category.name]
  if (!key) return category.name
  const translated = t(key)
  return translated === key ? category.name : translated
}
