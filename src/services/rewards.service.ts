import type { Reward } from '@/types'
import { createClient } from './supabase'

export async function getRewards(userId: string): Promise<Reward[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('rewards')
    .select('*')
    .eq('user_id', userId)
    .order('required_level', { ascending: true })

  if (error) throw error
  return (data ?? []).map(mapReward)
}

export async function createReward(
  userId: string,
  payload: Pick<Reward, 'title' | 'description' | 'requiredLevel' | 'imageUrl'>
): Promise<Reward> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('rewards')
    .insert({
      user_id: userId,
      title: payload.title,
      description: payload.description,
      required_level: payload.requiredLevel,
      image_url: payload.imageUrl,
    })
    .select()
    .single()

  if (error) throw error
  return mapReward(data)
}

export async function claimReward(rewardId: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('rewards')
    .update({ is_claimed: true, claimed_at: new Date().toISOString() })
    .eq('id', rewardId)

  if (error) throw error
}

function mapReward(row: Record<string, unknown>): Reward {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    title: row.title as string,
    description: row.description as string | null,
    requiredLevel: row.required_level as number,
    imageUrl: row.image_url as string | null,
    isClaimed: row.is_claimed as boolean,
    claimedAt: row.claimed_at as string | null,
    createdAt: row.created_at as string,
  }
}
