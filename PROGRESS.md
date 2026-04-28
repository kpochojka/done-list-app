# PROGRESS.md

---

## Session 3 — Tasks Screen

### 1. Completed in this session

**Files created:**
- `src/services/categories.service.ts` — `getCategories(userId)`
- `src/components/tasks/categoryName.ts` — `getCategoryDisplayName()` helper that translates default seeded category names via the `categories` i18n namespace and passes user-created names through unchanged
- `src/components/tasks/ProgressDots.tsx` — max-5 filled/hollow dots with `+N` overflow badge
- `src/components/tasks/Tabs.tsx` — segmented `Wszystkie / Aktywne / Ukończone` control (translated)
- `src/components/tasks/CategoryChips.tsx` — horizontal-scroll category filter (all + each category)
- `src/components/tasks/TaskCard.tsx` — active task card: colored category icon tile, title, category name, progress dots, "Zakończ zadanie (+5 pkt)" outlined button
- `src/components/tasks/CompletedTaskCard.tsx` — greyed/strikethrough completed card with "Ukończone ✓" badge and no actions
- `src/components/tasks/AddTaskModal.tsx` — bottom-sheet modal: title input + category chip picker + Save / Cancel buttons, ESC + backdrop close, autofocused title field
- `src/components/tasks/TasksClient.tsx` — orchestrator: header with `+` button, tabs, category filter, active section, completed section, empty states, loading state

**Files modified:**
- `src/app/[locale]/(main)/tasks/page.tsx` — server component now fetches the auth user and renders `<TasksClient userId={user.id} />`
- `src/services/tasks.service.ts` — added `deleteTask`, `getTaskEntryCounts(userId)` (groups `daily_entries` by `task_id` to compute progress dot counts)
- `src/hooks/useTasks.ts` — full implementation: parallel fetch of tasks + categories + entry counts, `createTask`, `completeTask`, `refresh`, optimistic local updates, error state
- `src/messages/pl.json`, `en.json`, `de.json` — added `tasks.filterAll`, `tasks.addNewButton`; updated `tasks.completedBadge` to include the "✓" so spec text "Ukończone ✓" is fully translatable instead of being assembled in JSX

**Mid-session follow-ups (after first verification in dev server):**
- `src/i18n/navigation.ts` (new) — locale-aware `Link` / `usePathname` / `useRouter` via next-intl's `createNavigation(routing)`. Routes like `/tasks` automatically resolve to `/tasks` for Polish (default) and `/en/tasks` / `/de/tasks` for other locales
- `src/components/ui/BottomNav.tsx` (new) — fixed bottom navigation with 5 items (Dziś / Zadania / Drzewo / Nagrody / Historia). Active item highlighted with `--color-primary` text + `--color-primary-subtle` background. All labels via `t('nav.*')`, all colors via CSS variables, includes `safe-area-inset-bottom` padding for iOS PWA. Reason for adding now: `/today` and most other main screens are still `null` stubs, so without a nav the user lands on a blank page after login with no way to reach the only built screen (`/tasks`)
- `src/app/[locale]/(main)/layout.tsx` — renders `<BottomNav />` after `{children}` so the nav appears on every authenticated screen
- `src/components/tasks/CategoryChips.tsx` and `src/components/tasks/AddTaskModal.tsx` — replaced the `border` shorthand in chip base styles with explicit `borderWidth` / `borderStyle` / `borderColor`. React was warning at runtime ("Removing a style property during rerender (borderColor) when a conflicting property is set (border)") because the active variant overrides only `borderColor` while the inactive variant set the shorthand. Using long-form properties throughout lets React reconcile the toggle cleanly with no visual change

---

### 2. Current state of the app

**What works end-to-end on `/tasks`:**
- Authenticated user can navigate to `/tasks` via the new bottom nav (locale-aware: `/tasks`, `/en/tasks`, `/de/tasks`)
- Page fetches the user's tasks, categories, and per-task `daily_entries` count in parallel on mount
- Three tabs (`Wszystkie / Aktywne / Ukończone`) filter which sections render — labels come from `t('tasks.tabAll' | 'tabActive' | 'tabDone')`
- Category filter chips horizontally scroll; `Wszystkie` chip shows all, each category chip filters by `categoryId`. Active chip uses `--color-primary` background and inverse text
- Active task cards render the colored category icon tile (using `category.color` from DB), title, translated category name, progress dots (filled = entries, hollow = remaining up to 5, `+N` if >5), and the purple-outlined "Zakończ zadanie (+5 pkt)" button. Button uses `t('tasks.completeButton', { points: POINTS.TASK_COMPLETED })`
- Clicking complete: optimistically marks the task done in the UI and persists via `tasks.service.completeTask`. The task immediately re-renders as a completed card
- Completed tasks section: greyed background, strikethrough title, green "Ukończone ✓" badge, no buttons
- Empty states use translated copy (`emptyActive`, `emptyCompleted`) inside a soft dashed card
- `+` button in header opens a bottom-sheet `AddTaskModal`. Modal has: title input, category chip grid (defaults to first category), Cancel + Save buttons. Save is disabled until title is non-empty. Submitting calls `tasks.service.createTask` and prepends the new task to the list

**Bottom navigation (mounted in `(main)/layout.tsx`):**
- 5 tabs: Dziś (☀️) / Zadania (✅) / Drzewo (🌳) / Nagrody (🎁) / Historia (📅)
- Locale-aware links via `createNavigation(routing)` — clicking a tab while in `/en/...` keeps the locale prefix
- Currently active route is highlighted via `usePathname` from next-intl
- Console warning about mixing `border` shorthand with `borderColor` overrides on the category chip toggles is fixed (no visual change)

**Theming + i18n compliance:**
- Zero hardcoded hex values in any new component — everything goes through `var(--...)` (text, surfaces, borders, primary, success, shadows, overlay). The only colors that are not CSS variables are the per-category `category.color` strings, which come from the database (each user's categories store their own hex per the schema)
- Zero hardcoded UI strings — every visible text uses `t('tasks.*')`, `t('common.*')`, or `t('categories.*')`. Default category names ("Praca", "Nauka", …) are translated via a name-to-key map in `categoryName.ts`; user-created categories pass through

**Build:**
- `next build` passes (Turbopack, 30 routes, TypeScript clean)
- `/tasks` route is correctly marked `ƒ` (server-rendered on demand) since it reads cookies via Supabase

**Infrastructure still working from earlier sessions:**
- Theme system, i18n routing, auth (login/register/magic-link/callback), session refresh proxy, RLS, default-category seeding on signup

---

### 3. Not finished / known issues

- **Task completion does not yet award points.** `completeTask` only updates `tasks.is_completed` + `completed_at`. The "+5 pkt" in the button label is informational; wiring the actual `total_points += 5` and level-up check is deferred to step 7 of CLAUDE.md's dev order ("Points system + user_stats updates"). `points.service.addPoints` calls an `add_points` RPC that doesn't exist in the migration yet.
- ~~**No bottom navigation between main screens.**~~ — **DONE mid-session.** Bottom nav added in `(main)/layout.tsx` so all 5 main routes are reachable. Tabs other than Zadania still go to blank stub screens.
- **No optimistic confetti / success overlay on task completion.** CLAUDE.md mentions celebratory feedback for entries; same treatment for task completion is deferred until points wiring lands.
- **Other main screens are still stubs** (`/today`, `/tree`, `/rewards`, `/history`, `/settings`). The bottom nav is visible on all of them but tapping any of these shows only the nav over a blank background until each screen is built.
- **Root redirect `/` → `/today` lands on a blank stub.** Until `/today` is implemented, a brand-new login lands on an empty screen with only the bottom nav. Decision: don't change the redirect target; the bottom nav makes the situation recoverable, and `/today` will be the next session's work anyway.
- **AuthForm still uses hardcoded Polish strings** (carried over from Session 2 — not in scope for this session).
- **`useTheme` still localStorage-only** — `user_preferences` sync deferred to Settings phase.

---

### 4. Exact next step (start of Session 4)

**Build the Today screen (`/today`).**

Per CLAUDE.md Screen Specification §1:
1. Implement `entries.service.ts` (already partially exists — verify mappers, add `deleteEntry`)
2. Implement `useToday.ts` and `usePoints.ts`
3. Build header row, points cards (today + total), section label, daily entries list, "+ Dodaj co dziś zrobiłem" button
4. Build the Add Entry bottom-sheet modal (two tabs: from task list / custom entry) — this consumes the tasks list already wired in Session 3
5. Wire up the points-on-creation flow:
   - Either add the `add_points` SQL RPC migration, or update `user_stats` directly from the client
   - Apply +5 retroactive support to `tasks.completeTask` flow once points service is real

---

### 5. Decisions that differ from CLAUDE.md

| Decision | CLAUDE.md spec | What was done | Reason |
|---|---|---|---|
| Task completion → points | "When a task is marked completed → `total_points += 5`" | UI marks task as done in DB; points are NOT yet incremented | Points system is step 7 of CLAUDE.md's dev order and depends on a real `addPoints` implementation. The button label still shows "+5 pkt" so the UX is correct; only the side-effect is deferred. |
| `tasks.completedBadge` translation key | "Ukończone ✓" badge | Updated all three locale files so the "✓" is part of the translated string (`"Ukończone ✓"`, `"Completed ✓"`, `"Abgeschlossen ✓"`) | Avoids hardcoding the "✓" character in JSX, which would split a translatable phrase across code and i18n files. |
| Category name translation | "default category names come from `categories` translation namespace, but user-created categories store their custom name as-is" | Implemented as a Polish-name → key map (`Praca → work`, `Nauka → learn`, …) in `categoryName.ts` | DB rows for default categories are seeded in Polish (per the existing trigger in `001_initial_schema.sql`). Matching by Polish name keeps the seed migration unchanged; if categories grow a `slug` column later, this helper can switch to slug lookup with no caller changes. |
| Modal layout | "Add Task FAB / modal" | Bottom-sheet style (rounded-top sheet anchored to viewport bottom, drag-handle, ESC + backdrop close) | Matches CLAUDE.md's general design guidance "Bottom sheet modals — no full-screen takeovers for minor actions". |
| Bottom navigation | Implied by 5 main routes; not formally specced in CLAUDE.md | Added a fixed bottom nav now (originally planned for later) | Without it, an authenticated user lands on `/today` (still a stub) with no way to reach the only built screen. The nav is built only with theme tokens and translated labels, so it doesn't lock in any visual decisions for later sessions. |
| Locale-aware navigation | Not specified | Switched from raw `next/navigation` `Link` to next-intl's `createNavigation(routing)` for the new BottomNav | Required so links keep the active locale prefix (`/en/tasks` stays `/en/...` after click). Existing `useLocale.ts` keeps using `next/navigation` — only new client navigation uses the locale-aware helpers. |

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
