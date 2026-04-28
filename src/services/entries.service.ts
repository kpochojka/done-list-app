import type { DailyEntry } from '@/types'
import { createClient } from './supabase'

export async function getEntriesForDate(userId: string, date: string): Promise<DailyEntry[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('daily_entries')
    .select('*, category:categories(*)')
    .eq('user_id', userId)
    .eq('date', date)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []).map(mapEntry)
}

export async function createEntry(
  userId: string,
  payload: Pick<DailyEntry, 'taskId' | 'categoryId' | 'title' | 'points' | 'isFocus' | 'date'>
): Promise<DailyEntry> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('daily_entries')
    .insert({
      user_id: userId,
      task_id: payload.taskId,
      category_id: payload.categoryId,
      title: payload.title,
      points: payload.points,
      is_focus: payload.isFocus,
      date: payload.date,
    })
    .select('*, category:categories(*)')
    .single()

  if (error) throw error
  return mapEntry(data)
}

function mapEntry(row: Record<string, unknown>): DailyEntry {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    taskId: row.task_id as string | null,
    categoryId: row.category_id as string,
    category: row.category as DailyEntry['category'],
    title: row.title as string,
    points: row.points as number,
    isFocus: row.is_focus as boolean,
    date: row.date as string,
    createdAt: row.created_at as string,
  }
}
