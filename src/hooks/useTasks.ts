'use client'

import { useState } from 'react'
import type { Task } from '@/types'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)

  return { tasks, loading, setTasks }
}
