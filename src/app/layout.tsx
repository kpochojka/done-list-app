import type { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Progress Companion',
  description: 'ADHD Progress Companion — reward progress, never punish inaction',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html data-theme="purple" data-mode="light">
      <body>{children}</body>
    </html>
  )
}
