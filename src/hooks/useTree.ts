'use client'

import { useCallback, useEffect, useState } from 'react'
import { getRewards, getRewardAtLevel } from '@/services/rewards.service'
import { getUserStats } from '@/services/points.service'
import { LEVEL_THRESHOLDS } from '@/lib/constants'
import type { Reward, UserStats } from '@/types'
import type { LevelUpData } from '@/hooks/useToday'

export interface TreeNode {
  level: number
  minPoints: number
  maxPoints: number
  reward: Reward | null
  state: 'claimed' | 'current' | 'locked'
}

export interface UseTreeResult {
  nodes: TreeNode[]
  stats: UserStats | null
  loading: boolean
  pendingLevelUp: LevelUpData | null
  clearLevelUp: () => void
  refresh: () => void
}

const LAST_SEEN_KEY = 'tree_lastSeenLevel'

export function useTree(userId: string): UseTreeResult {
  const [rewards, setRewards] = useState<Reward[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [pendingLevelUp, setPendingLevelUp] = useState<LevelUpData | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [r, s] = await Promise.all([getRewards(userId), getUserStats(userId)])
      setRewards(r)
      setStats(s)

      if (s) {
        const lastSeen = parseInt(localStorage.getItem(LAST_SEEN_KEY) ?? '0', 10)
        if (s.currentLevel > lastSeen) {
          const reward = await getRewardAtLevel(userId, s.currentLevel)
          setPendingLevelUp({ newLevel: s.currentLevel, reward })
        }
      }
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => { load() }, [load])

  const clearLevelUp = useCallback(() => {
    if (pendingLevelUp) {
      localStorage.setItem(LAST_SEEN_KEY, String(pendingLevelUp.newLevel))
    }
    setPendingLevelUp(null)
  }, [pendingLevelUp])

  const currentLevel = stats?.currentLevel ?? 1

  const nodes: TreeNode[] = LEVEL_THRESHOLDS.map((t) => {
    const reward = rewards.find((r) => r.requiredLevel === t.level) ?? null
    const state: TreeNode['state'] =
      t.level > currentLevel ? 'locked' :
      t.level === currentLevel ? 'current' :
      'claimed'
    return { level: t.level, minPoints: t.minPoints, maxPoints: t.maxPoints, reward, state }
  })

  return { nodes, stats, loading, pendingLevelUp, clearLevelUp, refresh: load }
}
