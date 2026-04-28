import { AuthForm } from '@/components/ui/AuthForm'

export default async function LoginPage({ params }: PageProps<'/[locale]/login'>) {
  const { locale } = await params

  return (
    <main style={styles.page}>
      <div style={styles.brand}>
        <span style={styles.brandIcon}>⭐</span>
        <span style={styles.brandName}>Progress Companion</span>
      </div>
      <AuthForm mode="login" locale={locale} />
    </main>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100dvh',
    background: 'var(--bg-app)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 16px',
    gap: 28,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  brandIcon: {
    fontSize: 32,
  },
  brandName: {
    fontSize: 20,
    fontWeight: 800,
    color: 'var(--color-primary)',
  },
}
