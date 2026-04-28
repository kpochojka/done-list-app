import type { UserStats } from '@/types'
import { createClient } from './supabase'

export async function getUserStats(userId: string): Promise<UserStats | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) return null
  return {
    userId: data.user_id as string,
    totalPoints: data.total_points as number,
    currentLevel: data.current_level as number,
    updatedAt: data.updated_at as string,
  }
}

export async function addPoints(userId: string, pointsToAdd: number): Promise<UserStats> {
  const supabase = createClient()
  const { data, error } = await supabase.rpc('add_points', {
    p_user_id: userId,
    p_points: pointsToAdd,
  })

  if (error) throw error
  return data as UserStats
}
