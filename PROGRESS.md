# Session Progress

## 1. Phase 1 — Project Foundation: COMPLETE ✅

All eight Phase 1 deliverables verified and working. `next build` succeeds; all locale routes are registered and the next-intl Proxy (Middleware) is wired in.

### What was built

- **Dependencies installed**: `next-intl@^4.9.2`, `@supabase/supabase-js@^2.105.1`, `@supabase/ssr@^0.10.2`, `next-pwa@^5.6.0`
- **Folder structure**: full architecture from CLAUDE.md (see section 4 below for tree)
- **Theme CSS files**: `purple.css`, `ocean.css`, `forest.css`, `sunset.css` — each with full light + dark CSS variable contract (backgrounds, text, brand, semantic, borders/shadows, category colors)
- **Translation files**: `pl.json`, `en.json`, `de.json` — identical key structure, full coverage of all namespaces (common, nav, today, focusDay, addEntry, tasks, tree, rewards, history, settings, categories, auth)
- **ThemeProvider + useTheme hook**: applies `data-theme` / `data-mode` to `<html>`, persists preference to localStorage, follows system preference when `mode='system'`, reacts to OS theme changes via `matchMedia`
- **next-intl routing**: `pl` (default) / `en` / `de`, `as-needed` locale prefix; `next.config.ts` wraps config with `createNextIntlPlugin('./src/i18n/request.ts')`; Proxy (Next.js 16's renamed Middleware) lives at `src/proxy.ts`
- **TypeScript types**: `Category`, `Task`, `DailyEntry`, `FocusDay`, `Reward`, `UserStats`, `Level` in `src/types/index.ts`
- **Constants**: `POINTS` and `LEVEL_THRESHOLDS` (10 levels) in `src/lib/constants.ts`

### Phase 1 fixes applied this session

1. Added the missing `/src/components/{today,tasks,tree,rewards,history}/` subfolders (with `.gitkeep` placeholders, since UI was deferred per instructions).
2. Wrapped `next.config.ts` with `withNextIntl(...)` — required for next-intl to load `src/i18n/request.ts` at request time.
3. Deleted the duplicate `/app/` directory (the unused `create-next-app` scaffold). The real app lives in `/src/app/` only.

### Correction to previous PROGRESS.md note

A prior note claimed `src/proxy.ts` was misnamed and should be `middleware.ts`. **That was wrong.** Next.js 16 renamed the `middleware` file convention to `proxy` (see `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md` — *"the middleware file convention is deprecated and has been renamed to proxy"*). The docs explicitly allow `proxy.ts` to live at the project root **or inside `src/`**. The build output confirms it: `ƒ Proxy (Middleware)` is registered.

---

## 2. Current State of the App

The app does **not render any visible UI** yet — by design (UI was deferred). What is fully functional at the infrastructure level:

- **Theme system**: 4 themes × 2 modes wired through CSS variables; `ThemeProvider` applies attributes to `<html>`; `useTheme` reads/writes localStorage and reacts to system preference changes.
- **i18n routing**: `next-intl` configured; `pl` is default with no prefix, `/en/...` and `/de/...` for the others; messages auto-loaded per locale on the server.
- **Translation files**: All three locales contain identical keys covering every screen.
- **Locale layout**: `src/app/[locale]/layout.tsx` properly wires `NextIntlClientProvider` + `ThemeProvider` around all locale routes.
- **TypeScript types**: All domain types defined.
- **Constants**: Point values and level thresholds defined.
- **Supabase client factory**: `createClient()` browser client ready (needs env vars in `.env.local`).
- **Build verified**: `next build` succeeds, all locale routes generated, Proxy registered.

---

## 3. Not Yet Built (intentionally — these are later phases)

### No env / no DB yet
- `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` not set
- Supabase project not provisioned, no schema migrations run yet
- No RLS policies

### No UI / no business logic yet (all stubs)
- All page files in `src/app/[locale]/(auth)/*` and `src/app/[locale]/(main)/*` return `null`
- All hooks except `useTheme` are stubs
- All `*.service.ts` functions are stubs
- No components built beyond `ThemeProvider`
- No bottom navigation
- No level-up celebration / confetti / success animations
- PWA manifest + service worker not configured (next-pwa is installed but not wired into `next.config.ts`)

---

## 4. Folder Structure (verified)

```
done-list/
├── middleware.ts            ← (none — Next.js 16 uses src/proxy.ts instead)
├── next.config.ts           ← wraps config with createNextIntlPlugin('./src/i18n/request.ts')
├── package.json
├── tsconfig.json            ← '@/*' → './src/*'
├── public/
└── src/
    ├── proxy.ts             ← next-intl Proxy (Next.js 16 replacement for middleware)
    ├── app/
    │   ├── layout.tsx       ← root <html>, imports globals.css
    │   └── [locale]/
    │       ├── layout.tsx   ← NextIntlClientProvider + ThemeProvider
    │       ├── page.tsx     ← redirect stub
    │       ├── (auth)/
    │       │   ├── login/page.tsx       ← stub
    │       │   └── register/page.tsx    ← stub
    │       └── (main)/
    │           ├── today/page.tsx       ← stub
    │           ├── tasks/page.tsx       ← stub
    │           ├── tree/page.tsx        ← stub
    │           ├── rewards/page.tsx     ← stub
    │           ├── history/page.tsx     ← stub
    │           └── settings/page.tsx    ← stub
    ├── components/
    │   ├── ui/
    │   │   └── ThemeProvider.tsx
    │   ├── today/           ← (empty, ready for components)
    │   ├── tasks/           ← (empty)
    │   ├── tree/            ← (empty)
    │   ├── rewards/         ← (empty)
    │   └── history/         ← (empty)
    ├── hooks/
    │   ├── useTheme.ts      ← IMPLEMENTED
    │   ├── useLocale.ts     ← types/constants
    │   ├── useToday.ts      ← stub
    │   ├── useTasks.ts      ← stub
    │   ├── usePoints.ts     ← stub
    │   ├── useRewards.ts    ← stub
    │   ├── useHistory.ts    ← stub
    │   └── useFocusDay.ts   ← stub
    ├── i18n/
    │   ├── routing.ts       ← pl/en/de, default pl, prefix as-needed
    │   └── request.ts       ← server config, dynamic message import
    ├── lib/
    │   ├── constants.ts     ← POINTS, LEVEL_THRESHOLDS
    │   ├── themes.ts        ← THEMES registry
    │   └── utils.ts
    ├── messages/
    │   ├── pl.json          ← full
    │   ├── en.json          ← full
    │   └── de.json          ← full
    ├── services/
    │   ├── supabase.ts      ← createClient() browser client
    │   ├── entries.service.ts   ← stub
    │   ├── tasks.service.ts     ← stub
    │   ├── points.service.ts    ← stub
    │   ├── rewards.service.ts   ← stub
    │   └── levels.service.ts    ← stub
    ├── styles/
    │   ├── globals.css      ← Tailwind import + theme imports + base resets
    │   └── themes/
    │       ├── purple.css   ← light + dark, full variable contract
    │       ├── ocean.css    ← light + dark
    │       ├── forest.css   ← light + dark
    │       └── sunset.css   ← light + dark
    └── types/
        └── index.ts         ← Category, Task, DailyEntry, FocusDay, Reward, UserStats, Level
```

---

## 5. Recommended Next Step

**Phase 2: Auth screens.** Per CLAUDE.md's Development Order, the next steps are:

1. Provision the Supabase project, run schema migrations from CLAUDE.md (categories, tasks, daily_entries, focus_days, rewards, user_stats, user_preferences) with RLS policies.
2. Add `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Build the login / register screens (`src/app/[locale]/(auth)/login/page.tsx` + `register/page.tsx`) — first user-visible UI, all subsequent screens depend on having an authenticated user.
4. On signup, seed the five default categories (Praca, Nauka, Język hiszpański, Zdrowie, Dom) for the new user.

---

## 6. Decisions That Differ from CLAUDE.md

| Decision | CLAUDE.md spec | What was done | Reason |
|---|---|---|---|
| Middleware filename | implied `middleware.ts` (older Next.js convention) | `src/proxy.ts` | **Next.js 16 renamed the convention.** `proxy.ts` is the current correct name; `middleware.ts` is deprecated. |
| `useTheme` persistence | Supabase `user_preferences` table | localStorage only | Supabase not connected yet; localStorage is the correct fallback until auth is working. Will be extended once auth is in place. |
| Service functions | fully implemented | all stubs | Following CLAUDE.md's recommended dev order — infrastructure before features. |
| Hook implementations (except `useTheme`) | fully implemented | all stubs | Same reason — they need Supabase + auth first. |
| `next-pwa` | configured in `next.config.ts` | installed but not wired | Deferred to step 14 of CLAUDE.md's dev order. |
