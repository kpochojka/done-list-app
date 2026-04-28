'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { Mail } from 'lucide-react'
import { login, register, sendMagicLink, type AuthState } from '@/app/actions/auth'

type Mode = 'login' | 'register'
type LoginTab = 'password' | 'magic'

const initialState: AuthState = {}

interface AuthFormProps {
  mode: Mode
  locale: string
}

export function AuthForm({ mode, locale }: AuthFormProps) {
  const [loginTab, setLoginTab] = useState<LoginTab>('password')

  const action = mode === 'login'
    ? (loginTab === 'password' ? login : sendMagicLink)
    : register

  const [state, formAction, pending] = useActionState(action, initialState)

  const isLogin = mode === 'login'
  const isMagic = isLogin && loginTab === 'magic'
  const switchHref = locale === 'pl'
    ? (isLogin ? '/register' : '/login')
    : (isLogin ? `/${locale}/register` : `/${locale}/login`)

  if (state.message === 'check-email') {
    return (
      <div style={styles.card}>
        <div style={styles.successIcon}>
          <Mail size={28} strokeWidth={1.6} />
        </div>
        <h2 style={styles.successTitle}>Sprawdź swoją skrzynkę!</h2>
        <p style={styles.successText}>
          Link potwierdzający konto został wysłany. Kliknij go, by się zalogować.
        </p>
      </div>
    )
  }

  if (state.message === 'magic-link-sent') {
    return (
      <div style={styles.card}>
        <div style={styles.successIcon}>
          <Mail size={28} strokeWidth={1.6} />
        </div>
        <h2 style={styles.successTitle}>Sprawdź swoją skrzynkę!</h2>
        <p style={styles.successText}>
          Magic link do logowania został wysłany. Kliknij go w wiadomości email.
        </p>
      </div>
    )
  }

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          {isLogin ? 'Witaj z powrotem' : 'Zacznij swoją przygodę'}
        </h1>
        <p style={styles.subtitle}>
          {isLogin
            ? 'Zaloguj się, by kontynuować swój progres.'
            : 'Zbuduj nawyki, które działają dla Ciebie.'}
        </p>
      </div>

      {isLogin && (
        <div style={styles.tabs}>
          <button
            type="button"
            onClick={() => setLoginTab('password')}
            style={loginTab === 'password' ? styles.tabActive : styles.tab}
          >
            Hasło
          </button>
          <button
            type="button"
            onClick={() => setLoginTab('magic')}
            style={loginTab === 'magic' ? styles.tabActive : styles.tab}
          >
            Magic Link
          </button>
        </div>
      )}

      <form action={formAction} style={styles.form}>
        <div style={styles.field}>
          <label htmlFor="email" style={styles.label}>Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="twoj@email.com"
            style={styles.input}
          />
        </div>

        {!isMagic && (
          <div style={styles.field}>
            <label htmlFor="password" style={styles.label}>Hasło</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              placeholder="••••••••"
              style={styles.input}
            />
          </div>
        )}

        {state.error && (
          <p style={styles.error}>{state.error}</p>
        )}

        <button type="submit" disabled={pending} style={pending ? styles.buttonDisabled : styles.button}>
          {pending
            ? 'Ładowanie...'
            : isMagic
              ? 'Wyślij magic link'
              : isLogin
                ? 'Zaloguj się'
                : 'Utwórz konto'}
        </button>
      </form>

      <div style={styles.switchRow}>
        <span style={styles.switchText}>
          {isLogin ? 'Nie masz konta?' : 'Masz już konto?'}
        </span>
        <Link href={switchHref} style={styles.switchLink}>
          {isLogin ? 'Zarejestruj się' : 'Zaloguj się'}
        </Link>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: 'var(--bg-surface)',
    borderRadius: 18,
    padding: '32px 26px',
    boxShadow: 'var(--shadow-modal)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--border-default)',
    width: '100%',
    maxWidth: 400,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 700,
    color: 'var(--text-primary)',
    marginBottom: 6,
    letterSpacing: -0.022,
  },
  subtitle: {
    fontSize: 14,
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
  },
  tabs: {
    display: 'flex',
    gap: 4,
    marginBottom: 20,
    background: 'var(--bg-surface-2)',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    padding: '8px 0',
    border: 'none',
    background: 'transparent',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--text-secondary)',
    cursor: 'pointer',
  },
  tabActive: {
    flex: 1,
    padding: '8px 0',
    border: 'none',
    background: 'var(--bg-surface)',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--color-primary)',
    cursor: 'pointer',
    boxShadow: 'var(--shadow-card)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    padding: '12px 14px',
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--border-default)',
    background: 'var(--bg-surface-2)',
    color: 'var(--text-primary)',
    fontSize: 15,
    outline: 'none',
    transition: 'border-color 0.15s',
    fontFamily: 'inherit',
  },
  error: {
    fontSize: 13,
    color: 'var(--color-primary-dark)',
    background: 'var(--color-warning-subtle)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-focus-border)',
    borderRadius: 8,
    padding: '8px 12px',
  },
  button: {
    marginTop: 4,
    padding: '13px',
    borderRadius: 12,
    border: 'none',
    background: 'var(--gradient-primary, var(--color-primary))',
    color: 'var(--text-inverse)',
    fontSize: 15,
    fontWeight: 600,
    letterSpacing: 0.2,
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(124, 58, 237, 0.22)',
    transition: 'transform 0.15s, box-shadow 0.15s',
  },
  buttonDisabled: {
    marginTop: 4,
    padding: '13px',
    borderRadius: 12,
    border: 'none',
    background: 'var(--bg-surface-3)',
    color: 'var(--text-muted)',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'not-allowed',
  },
  switchRow: {
    marginTop: 20,
    display: 'flex',
    justifyContent: 'center',
    gap: 6,
    fontSize: 13,
  },
  switchText: {
    color: 'var(--text-secondary)',
  },
  switchLink: {
    color: 'var(--color-primary)',
    fontWeight: 600,
    textDecoration: 'none',
  },
  successIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    margin: '0 auto 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--color-primary-subtle)',
    color: 'var(--color-primary)',
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: 'var(--text-primary)',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.018,
  },
  successText: {
    fontSize: 14,
    color: 'var(--text-secondary)',
    textAlign: 'center',
    lineHeight: 1.6,
  },
}
