import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Progress Companion',
  description: 'ADHD Progress Companion — reward progress, never punish inaction',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      data-theme="purple"
      data-mode="light"
      className={inter.variable}
      style={{ ['--font-serif' as string]: 'var(--font-sans)' }}
    >
      <body>{children}</body>
    </html>
  )
}
