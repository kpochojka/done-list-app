'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
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
        <div style={styles.successIcon}>✉️</div>
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
        <div style={styles.successIcon}>✉️</div>
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
    borderRadius: 24,
    padding: '32px 24px',
    boxShadow: 'var(--shadow-modal)',
    border: '1px solid var(--border-default)',
    width: '100%',
    maxWidth: 400,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 800,
    color: 'var(--text-primary)',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: 'var(--text-secondary)',
    lineHeight: 1.5,
  },
  tabs: {
    display: 'flex',
    gap: 8,
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
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--text-secondary)',
    cursor: 'pointer',
  },
  tabActive: {
    flex: 1,
    padding: '8px 0',
    border: 'none',
    background: 'var(--bg-surface)',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 700,
    color: 'var(--color-primary)',
    cursor: 'pointer',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--text-secondary)',
  },
  input: {
    padding: '12px 14px',
    borderRadius: 12,
    border: '1.5px solid var(--border-default)',
    background: 'var(--bg-surface-2)',
    color: 'var(--text-primary)',
    fontSize: 15,
    outline: 'none',
    transition: 'border-color 0.15s',
  },
  error: {
    fontSize: 13,
    color: '#ef4444',
    background: '#fef2f2',
    borderRadius: 8,
    padding: '8px 12px',
  },
  button: {
    marginTop: 4,
    padding: '14px',
    borderRadius: 14,
    border: 'none',
    background: 'var(--color-primary)',
    color: 'var(--text-inverse)',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  buttonDisabled: {
    marginTop: 4,
    padding: '14px',
    borderRadius: 14,
    border: 'none',
    background: 'var(--color-primary-light)',
    color: 'var(--text-inverse)',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'not-allowed',
    opacity: 0.7,
  },
  switchRow: {
    marginTop: 20,
    display: 'flex',
    justifyContent: 'center',
    gap: 6,
    fontSize: 14,
  },
  switchText: {
    color: 'var(--text-secondary)',
  },
  switchLink: {
    color: 'var(--color-primary)',
    fontWeight: 700,
    textDecoration: 'none',
  },
  successIcon: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 800,
    color: 'var(--text-primary)',
    textAlign: 'center',
    marginBottom: 10,
  },
  successText: {
    fontSize: 15,
    color: 'var(--text-secondary)',
    textAlign: 'center',
    lineHeight: 1.6,
  },
}
