import { Sprout } from 'lucide-react'
import { AuthForm } from '@/components/ui/AuthForm'

export default async function RegisterPage({ params }: PageProps<'/[locale]/register'>) {
  const { locale } = await params

  return (
    <main style={styles.page}>
      <div style={styles.brand}>
        <span style={styles.brandIcon}>
          <Sprout size={26} strokeWidth={1.6} />
        </span>
        <span style={styles.brandName}>Progress Companion</span>
      </div>
      <AuthForm mode="register" locale={locale} />
    </main>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100dvh',
    background: 'transparent',
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
    width: 44,
    height: 44,
    borderRadius: 12,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--color-primary-subtle)',
    color: 'var(--color-primary)',
  },
  brandName: {
    fontSize: 20,
    fontWeight: 600,
    color: 'var(--color-primary)',
    fontFamily: 'var(--font-serif, serif)',
    letterSpacing: -0.01,
  },
}
