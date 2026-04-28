import type { Task } from '@/types'
import { createClient } from './supabase'

export async function getTasks(userId: string): Promise<Task[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('tasks')
    .select('*, category:categories(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []).map(mapTask)
}

export async function createTask(
  userId: string,
  payload: Pick<Task, 'title' | 'categoryId'>
): Promise<Task> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('tasks')
    .insert({ user_id: userId, category_id: payload.categoryId, title: payload.title })
    .select('*, category:categories(*)')
    .single()

  if (error) throw error
  return mapTask(data)
}

export async function completeTask(taskId: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('tasks')
    .update({ is_completed: true, completed_at: new Date().toISOString() })
    .eq('id', taskId)

  if (error) throw error
}

export async function deleteTask(taskId: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('tasks').delete().eq('id', taskId)
  if (error) throw error
}

/**
 * Returns a map of taskId → number of daily_entries linked to that task.
 * Used to render progress dots on task cards. Done as a separate query
 * because Supabase JS doesn't expose a clean grouped-count primitive.
 */
export async function getTaskEntryCounts(userId: string): Promise<Record<string, number>> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('daily_entries')
    .select('task_id')
    .eq('user_id', userId)
    .not('task_id', 'is', null)

  if (error) throw error

  const counts: Record<string, number> = {}
  for (const row of data ?? []) {
    const taskId = (row as { task_id: string | null }).task_id
    if (!taskId) continue
    counts[taskId] = (counts[taskId] ?? 0) + 1
  }
  return counts
}

function mapTask(row: Record<string, unknown>): Task {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    categoryId: row.category_id as string,
    category: row.category as Task['category'],
    title: row.title as string,
    isCompleted: row.is_completed as boolean,
    completedAt: row.completed_at as string | null,
    createdAt: row.created_at as string,
    entryCount: (row.entry_count as number) ?? 0,
  }
}
