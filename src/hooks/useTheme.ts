'use client'

import { useState, useEffect, useCallback } from 'react'
import type { ThemeId } from '@/lib/themes'

export type ThemeName = ThemeId
export type ThemeMode = 'light' | 'dark' | 'system'

interface ThemeState {
  theme: ThemeName
  mode: 'light' | 'dark'
  rawMode: ThemeMode
  setTheme: (t: ThemeName) => void
  setMode: (m: ThemeMode) => void
}

function resolveMode(rawMode: ThemeMode): 'light' | 'dark' {
  if (rawMode !== 'system') return rawMode
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme(): ThemeState {
  const [theme, setThemeState] = useState<ThemeName>('purple')
  const [rawMode, setRawModeState] = useState<ThemeMode>('system')
  const [mode, setModeState] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeName | null
    const savedMode = localStorage.getItem('themeMode') as ThemeMode | null
    if (savedTheme) setThemeState(savedTheme)
    const resolvedRaw = savedMode ?? 'system'
    setRawModeState(resolvedRaw as ThemeMode)
    setModeState(resolveMode(resolvedRaw as ThemeMode))
  }, [])

  useEffect(() => {
    if (rawMode !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => setModeState(mq.matches ? 'dark' : 'light')
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [rawMode])

  const setTheme = useCallback((t: ThemeName) => {
    setThemeState(t)
    localStorage.setItem('theme', t)
  }, [])

  const setMode = useCallback((m: ThemeMode) => {
    setRawModeState(m)
    const resolved = resolveMode(m)
    setModeState(resolved)
    localStorage.setItem('themeMode', m)
  }, [])

  return { theme, mode, rawMode, setTheme, setMode }
}
