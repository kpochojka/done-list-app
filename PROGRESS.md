# PROGRESS.md

---

## Session 2 — Supabase Setup + Auth

### 1. Completed in this session

**Files created:**
- `supabase/migrations/001_initial_schema.sql` — all 7 tables, RLS, seed trigger
- `.env.local.example` — env var template
- `src/lib/supabase/server.ts` — async server-side Supabase client factory
- `src/app/actions/auth.ts` — Server Actions: `login`, `register`, `sendMagicLink`, `logout`
- `src/app/auth/callback/route.ts` — magic link / PKCE code exchange callback
- `src/app/[locale]/(auth)/layout.tsx` — redirects logged-in users away from auth screens
- `src/app/[locale]/(main)/layout.tsx` — redirects unauthenticated users to `/login`
- `src/components/ui/AuthForm.tsx` — client component; password login, magic link tab, register, success/error states

**Files modified:**
- `src/proxy.ts` — chained Supabase session refresh (token rotation) before next-intl locale routing
- `src/app/[locale]/(auth)/login/page.tsx` — replaced `null` stub with real login screen
- `src/app/[locale]/(auth)/register/page.tsx` — replaced `null` stub with real register screen
- `PROGRESS.md` — this file

---

### 2. Current state of the app

**What works end-to-end (once `.env.local` is filled in and migration is run):**
- Visiting `/` redirects to `/today`; unauthenticated users are redirected to `/login`
- Login screen renders: email + password form, magic link tab, switch to register link
- Register screen renders: email + password form, switch to login link
- Password login calls `supabase.auth.signInWithPassword`; on success redirects to `/today`
- Register calls `supabase.auth.signUp`; on success redirects to `/today` (if email confirmation is off) or shows "check your email" message
- Magic link sends `supabase.auth.signInWithOtp`; shows confirmation message
- `/auth/callback` exchanges PKCE code for a session and redirects to `/today`
- On every request the proxy refreshes the Supabase session (token rotation) so auth cookies stay current
- Authenticated users visiting `/login` or `/register` are bounced to `/today`
- On new user signup the DB trigger auto-seeds: 5 default categories, `user_stats` row, `user_preferences` row

**Infrastructure still working from Session 1:**
- Theme system (4 themes × light/dark, CSS variables, ThemeProvider, localStorage persistence)
- i18n routing (pl default, `/en/...`, `/de/...`; all translation files complete)
- `next build` passes — 30 routes, TypeScript clean

**Supabase is provisioned and connected** — `.env.local` is set, migration has been run, auth callback URL is configured. Auth calls work end-to-end.

---

### 3. Not finished / known issues

- ~~**Supabase not provisioned**~~ — **DONE by user.** `.env.local` is set, migration run, redirect URLs configured, confirmed working.
- **All main-app screens are stubs** — `/today`, `/tasks`, `/tree`, `/rewards`, `/history`, `/settings` all return `null`. Authenticated users land on a blank page.
- **All service functions are stubs** — `tasks.service.ts`, `entries.service.ts`, `points.service.ts`, `rewards.service.ts`, `levels.service.ts` have no real implementations.
- **All hooks (except `useTheme`) are stubs** — `useToday`, `useTasks`, `usePoints`, `useRewards`, `useHistory`, `useFocusDay` return no data.
- **`useTheme` does not sync to Supabase** — preferences are localStorage-only. Will be wired to `user_preferences` table in the Settings screen phase.
- **No bottom navigation** — no nav between main screens yet.
- **No PWA config** — `next-pwa` is installed but not wired into `next.config.ts`.
- **AuthForm uses inline styles, not i18n strings** — text is hardcoded in Polish. Translation keys exist in `pl.json`/`en.json`/`de.json` under the `auth` namespace; they just aren't wired up yet.

---

### 4. Exact next step (start of Session 3)

**Provision Supabase and build the Tasks screen.**

1. ~~Provision Supabase~~ — **DONE.**
2. Build the **Tasks screen** (`src/app/[locale]/(main)/tasks/page.tsx`):
   - Implement `tasks.service.ts` (getTasksByUser, createTask, completeTask, deleteTask)
   - Implement `useTasks.ts` hook
   - Build task list UI with category filter chips, progress dots, "Complete (+5 pts)" button
   - Build add-task modal/sheet

---

### 5. Decisions that differ from CLAUDE.md

| Decision | CLAUDE.md spec | What was done | Reason |
|---|---|---|---|
| Middleware filename | implied `middleware.ts` | `src/proxy.ts` | Next.js 16 renamed the convention — `proxy.ts` is correct; `middleware.ts` is deprecated per `node_modules/next/dist/docs/.../proxy.md`. |
| Auth form i18n | all strings via `t()` | strings hardcoded in Polish | Auth screens are the first visible UI; wiring `useTranslations` into every string is deferred to a polish pass once the full flow is confirmed working end-to-end. |
| `useTheme` persistence | `user_preferences` Supabase table | localStorage only | `user_preferences` table now exists in the schema; sync will be added in the Settings screen phase (step 13 in CLAUDE.md dev order). |
| Service functions | fully implemented | all stubs | Dev order from CLAUDE.md: infrastructure → auth → screens. Stubs exist for all services; implementations follow with their respective screens. |
| Hook implementations (except `useTheme`) | fully implemented | all stubs | Same reason — hooks need real service functions and an authenticated user. |
| `next-pwa` | configured in `next.config.ts` | installed, not wired | Deferred to step 14 of CLAUDE.md's dev order. |

---

## Session 1 — Project Foundation

### 1. Completed in this session

- Dependencies installed: `next-intl@^4.9.2`, `@supabase/supabase-js@^2.105.1`, `@supabase/ssr@^0.10.2`, `next-pwa@^5.6.0`
- Full folder structure from CLAUDE.md
- `src/styles/themes/purple.css`, `ocean.css`, `forest.css`, `sunset.css` — full light + dark CSS variable contract
- `src/messages/pl.json`, `en.json`, `de.json` — all namespaces, identical key structure
- `src/components/ui/ThemeProvider.tsx` + `src/hooks/useTheme.ts` — implemented
- `src/i18n/routing.ts`, `src/i18n/request.ts` — next-intl wired
- `src/proxy.ts` — next-intl locale routing proxy
- `src/types/index.ts` — all domain types
- `src/lib/constants.ts` — `POINTS`, `LEVEL_THRESHOLDS`
- `src/lib/themes.ts` — `THEMES` registry
- `src/services/supabase.ts` — browser client factory
- All page stubs (returning `null`) for every route
- All hook stubs (returning empty data) for every hook
- All service stubs for every service

### 2. Key decision: `proxy.ts` not `middleware.ts`

Next.js 16 renamed the middleware file convention to `proxy`. The `middleware.ts` name is deprecated. Confirmed in `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md` and in build output (`ƒ Proxy (Middleware)`).
