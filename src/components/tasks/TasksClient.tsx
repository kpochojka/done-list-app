'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useTasks } from '@/hooks/useTasks'
import { Tabs, type TaskTab } from './Tabs'
import { CategoryChips } from './CategoryChips'
import { TaskCard } from './TaskCard'
import { CompletedTaskCard } from './CompletedTaskCard'
import { AddTaskModal } from './AddTaskModal'

interface TasksClientProps {
  userId: string
}

export function TasksClient({ userId }: TasksClientProps) {
  const t = useTranslations('tasks')
  const tCommon = useTranslations('common')

  const { tasks, categories, loading, createTask, completeTask } =
    useTasks(userId)

  const [tab, setTab] = useState<TaskTab>('all')
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [completingId, setCompletingId] = useState<string | null>(null)

  const filteredTasks = useMemo(() => {
    return categoryFilter
      ? tasks.filter((task) => task.categoryId === categoryFilter)
      : tasks
  }, [tasks, categoryFilter])

  const activeTasks = filteredTasks.filter((task) => !task.isCompleted)
  const completedTasks = filteredTasks.filter((task) => task.isCompleted)

  const showActive = tab === 'all' || tab === 'active'
  const showCompleted = tab === 'all' || tab === 'done'

  const handleComplete = async (taskId: string) => {
    setCompletingId(taskId)
    try {
      await completeTask(taskId)
    } finally {
      setCompletingId(null)
    }
  }

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>{t('title')}</h1>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          style={styles.addButton}
          aria-label={t('addNewButton')}
        >
          +
        </button>
      </header>

      <div style={styles.tabsWrap}>
        <Tabs
          value={tab}
          onChange={setTab}
          labels={{
            all: t('tabAll'),
            active: t('tabActive'),
            done: t('tabDone'),
          }}
        />
      </div>

      <div style={styles.chipsWrap}>
        <CategoryChips
          categories={categories}
          selectedId={categoryFilter}
          onSelect={setCategoryFilter}
        />
      </div>

      <div style={styles.body}>
        {loading ? (
          <p style={styles.muted}>{tCommon('loading')}</p>
        ) : (
          <>
            {showActive && (
              <section style={styles.section}>
                {showCompleted && (
                  <h2 style={styles.sectionLabel}>{t('activeSection')}</h2>
                )}
                {activeTasks.length === 0 ? (
                  <p style={styles.empty}>{t('emptyActive')}</p>
                ) : (
                  <div style={styles.list}>
                    {activeTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onComplete={handleComplete}
                        busy={completingId === task.id}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}

            {showCompleted && (
              <section style={styles.section}>
                {showActive && (
                  <h2 style={styles.sectionLabel}>{t('completedSection')}</h2>
                )}
                {completedTasks.length === 0 ? (
                  <p style={styles.empty}>{t('emptyCompleted')}</p>
                ) : (
                  <div style={styles.list}>
                    {completedTasks.map((task) => (
                      <CompletedTaskCard key={task.id} task={task} />
                    ))}
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </div>

      <AddTaskModal
        open={modalOpen}
        categories={categories}
        onClose={() => setModalOpen(false)}
        onSubmit={createTask}
      />
    </main>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100dvh',
    background: 'var(--bg-app)',
    padding: '20px 16px 80px',
    maxWidth: 560,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 800,
    color: 'var(--text-primary)',
    letterSpacing: -0.3,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    border: 'none',
    background: 'var(--color-primary)',
    color: 'var(--text-inverse)',
    fontSize: 22,
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'var(--shadow-card)',
  },
  tabsWrap: {
    marginTop: 4,
  },
  chipsWrap: {
    marginTop: 2,
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: 22,
    marginTop: 6,
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    color: 'var(--text-muted)',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  empty: {
    fontSize: 14,
    color: 'var(--text-muted)',
    background: 'var(--bg-surface)',
    border: '1px dashed var(--border-default)',
    padding: '20px 16px',
    borderRadius: 16,
    textAlign: 'center',
    lineHeight: 1.5,
  },
  muted: {
    fontSize: 14,
    color: 'var(--text-muted)',
    textAlign: 'center',
    padding: 20,
  },
}
