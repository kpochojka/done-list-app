export interface Category {
  id: string
  userId: string
  name: string
  icon: string
  color: string
  createdAt: string
}

export interface Task {
  id: string
  userId: string
  categoryId: string
  category?: Category
  title: string
  isCompleted: boolean
  completedAt: string | null
  createdAt: string
  entryCount?: number
}

export interface DailyEntry {
  id: string
  userId: string
  taskId: string | null
  categoryId: string
  category?: Category
  title: string
  points: number
  isFocus: boolean
  date: string
  createdAt: string
}

export interface FocusDay {
  id: string
  userId: string
  date: string
  categoryId: string
  category?: Category
  taskId: string | null
  task?: Task | null
  customTitle: string | null
  isCompleted: boolean
  completedAt: string | null
}

export interface Reward {
  id: string
  userId: string
  title: string
  description: string | null
  requiredLevel: number
  imageUrl: string | null
  isClaimed: boolean
  claimedAt: string | null
  createdAt: string
}

export interface UserStats {
  userId: string
  totalPoints: number
  currentLevel: number
  updatedAt: string
}

export interface Level {
  level: number
  minPoints: number
  maxPoints: number
  reward?: Reward
}
