'use client'

import { useState } from 'react'
import type { DailyEntry } from '@/types'

export function useHistory() {
  const [entries, setEntries] = useState<DailyEntry[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  return { entries, selectedDate, loading, setEntries, setSelectedDate }
}
