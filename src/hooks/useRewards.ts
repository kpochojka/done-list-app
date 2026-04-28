'use client'

import { useState } from 'react'
import type { Reward } from '@/types'

export function useRewards() {
  const [rewards, setRewards] = useState<Reward[]>([])
  const [loading, setLoading] = useState(false)

  return { rewards, loading, setRewards }
}
