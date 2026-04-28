'use client'

import { useState } from 'react'
import type { UserStats } from '@/types'

export function usePoints() {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(false)

  return { stats, loading, setStats }
}
