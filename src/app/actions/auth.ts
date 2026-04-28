'use server'

import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export type AuthState = {
  error?: string
  message?: 'check-email' | 'magic-link-sent'
}

export async function login(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/today')
}

export async function register(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase.auth.signUp({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })

  if (error) {
    return { error: error.message }
  }

  // Session is available immediately when email confirmation is disabled
  if (data.session) {
    redirect('/today')
  }

  return { message: 'check-email' }
}

export async function sendMagicLink(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createServerSupabaseClient()
  const headersList = await headers()
  const origin = headersList.get('origin') ?? 'http://localhost:3000'

  const { error } = await supabase.auth.signInWithOtp({
    email: formData.get('email') as string,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { message: 'magic-link-sent' }
}

export async function logout(): Promise<void> {
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()
  redirect('/login')
}
