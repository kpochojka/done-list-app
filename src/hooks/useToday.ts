'use client'

import { useState } from 'react'
import type { DailyEntry, FocusDay } from '@/types'

export function useToday() {
  const [entries, setEntries] = useState<DailyEntry[]>([])
  const [focusDay, setFocusDay] = useState<FocusDay | null>(null)
  const [todayPoints, setTodayPoints] = useState(0)
  const [loading, setLoading] = useState(false)

  return { entries, focusDay, todayPoints, loading, setEntries, setFocusDay }
}
