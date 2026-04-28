import type { Category } from '@/types'
import { createClient } from './supabase'

export async function getCategories(userId: string): Promise<Category[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return (data ?? []).map(mapCategory)
}

function mapCategory(row: Record<string, unknown>): Category {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    name: row.name as string,
    icon: row.icon as string,
    color: row.color as string,
    createdAt: row.created_at as string,
  }
}
