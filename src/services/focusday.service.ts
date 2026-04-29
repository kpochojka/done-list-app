import type { FocusDay } from '@/types'
import { createClient } from './supabase'

function mapFocusDay(row: Record<string, unknown>): FocusDay {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    date: row.date as string,
    categoryId: row.category_id as string,
    category: row.category as FocusDay['category'],
    taskId: row.task_id as string | null,
    task: (row.task as FocusDay['task']) ?? null,
    customTitle: row.custom_title as string | null,
    isCompleted: row.is_completed as boolean,
    completedAt: row.completed_at as string | null,
  }
}

export async function getFocusDay(userId: string, date: string): Promise<FocusDay | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('focus_days')
    .select('*, category:categories(*), task:tasks(*)')
    .eq('user_id', userId)
    .eq('date', date)
    .single()

  if (error) return null
  return mapFocusDay(data)
}

export async function upsertFocusDay(
  userId: string,
  payload: {
    date: string
    categoryId: string
    taskId?: string | null
    customTitle?: string | null
  }
): Promise<FocusDay> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('focus_days')
    .upsert(
      {
        user_id: userId,
        date: payload.date,
        category_id: payload.categoryId,
        task_id: payload.taskId ?? null,
        custom_title: payload.customTitle ?? null,
        is_completed: false,
        completed_at: null,
      },
      { onConflict: 'user_id,date' }
    )
    .select('*, category:categories(*), task:tasks(*)')
    .single()

  if (error) throw error
  return mapFocusDay(data)
}

export async function completeFocusDay(userId: string, date: string): Promise<FocusDay> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('focus_days')
    .update({ is_completed: true, completed_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('date', date)
    .select('*, category:categories(*), task:tasks(*)')
    .single()

  if (error) throw error
  return mapFocusDay(data)
}

export async function deleteFocusDay(userId: string, date: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('focus_days')
    .delete()
    .eq('user_id', userId)
    .eq('date', date)

  if (error) throw error
}
