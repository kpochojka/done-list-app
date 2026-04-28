'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useLocale as useNextIntlLocale } from 'next-intl'

export type SupportedLocale = 'pl' | 'en' | 'de'

export const LOCALES = [
  { code: 'pl' as SupportedLocale, label: 'Polski',  flag: '🇵🇱' },
  { code: 'en' as SupportedLocale, label: 'English', flag: '🇬🇧' },
  { code: 'de' as SupportedLocale, label: 'Deutsch', flag: '🇩🇪' },
] as const

export function useLocale() {
  const locale = useNextIntlLocale() as SupportedLocale
  const router = useRouter()
  const pathname = usePathname()

  const setLocale = (newLocale: SupportedLocale) => {
    const segments = pathname.split('/')
    const supportedCodes = ['pl', 'en', 'de']
    if (supportedCodes.includes(segments[1])) {
      segments[1] = newLocale === 'pl' ? '' : newLocale
    } else {
      segments.splice(1, 0, newLocale === 'pl' ? '' : newLocale)
    }
    const newPath = segments.filter(Boolean).join('/') || '/'
    router.push(newLocale === 'pl' ? `/${newPath}` : `/${newLocale}/${newPath}`)
  }

  return { locale, setLocale, locales: LOCALES }
}
