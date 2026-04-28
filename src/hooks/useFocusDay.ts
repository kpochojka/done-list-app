'use client'

import { useState } from 'react'
import type { FocusDay } from '@/types'

export function useFocusDay() {
  const [focusDay, setFocusDay] = useState<FocusDay | null>(null)
  const [loading, setLoading] = useState(false)

  return { focusDay, loading, setFocusDay }
}
