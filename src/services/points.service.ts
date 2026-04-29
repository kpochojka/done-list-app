import type { UserStats } from '@/types'
import { LEVEL_THRESHOLDS } from '@/lib/constants'
import { createClient } from './supabase'

export interface AddPointsResult {
  stats: UserStats
  prevLevel: number
  leveledUp: boolean
}

export async function getUserStats(userId: string): Promise<UserStats | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) return null
  return mapStats(data)
}

export async function addPoints(userId: string, pointsToAdd: number): Promise<AddPointsResult> {
  const supabase = createClient()

  const current = await getUserStats(userId)
  const prevLevel = current?.currentLevel ?? 1
  const currentTotal = current?.totalPoints ?? 0
  const newTotal = currentTotal + pointsToAdd
  const newLevel = computeLevel(newTotal)

  const { data, error } = await supabase
    .from('user_stats')
    .update({
      total_points: newTotal,
      current_level: newLevel,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return { stats: mapStats(data), prevLevel, leveledUp: newLevel > prevLevel }
}

function computeLevel(totalPoints: number): number {
  let level = 1
  for (const t of LEVEL_THRESHOLDS) {
    if (totalPoints >= t.minPoints) level = t.level
  }
  return level
}

function mapStats(row: Record<string, unknown>): UserStats {
  return {
    userId: row.user_id as string,
    totalPoints: row.total_points as number,
    currentLevel: row.current_level as number,
    updatedAt: row.updated_at as string,
  }
}
