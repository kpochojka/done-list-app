@AGENTS.md
# CLAUDE.md — ADHD Progress Companion

## Project Overview

A mobile-first web application (PWA) designed for people with ADHD. The core philosophy:
**reward progress, never punish inaction**. Every small step counts. The app tracks daily
activity through optional entries, awards points, and unlocks user-defined rewards on a
visual reward tree — without deadlines, streaks, or percentage-based pressure.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| i18n | next-intl (Polish, English, German) |
| Database + Auth | Supabase (PostgreSQL + Supabase Auth) |
| Storage | Supabase Storage (reward images) |
| Deployment | Vercel |
| Future mobile | React Native / Expo (architecture must support this) |

---

## Project Architecture

```
/src
  /app                    ← Next.js App Router pages
    /app/(auth)/          ← Login / Register screens
    /app/(main)/          ← Authenticated app screens
      /today/             ← Daily screen (default landing)
      /tasks/             ← Global task list
      /tree/              ← Reward tree
      /rewards/           ← Reward management
      /history/           ← Calendar history
  /components             ← UI components only, NO business logic
    /ui/                  ← Base components (Button, Card, Badge, Modal)
    /today/               ← Today-specific components
    /tasks/               ← Task-specific components
    /tree/                ← Tree-specific components
    /rewards/             ← Reward-specific components
    /history/             ← History-specific components
  /hooks                  ← All business logic as custom hooks (reusable in React Native)
    useToday.ts
    useTasks.ts
    usePoints.ts
    useRewards.ts
    useHistory.ts
    useFocusDay.ts
  /services               ← Supabase calls, pure functions (reusable in React Native)
    supabase.ts           ← Supabase client init
    tasks.service.ts
    entries.service.ts
    points.service.ts
    rewards.service.ts
    levels.service.ts
  /types                  ← All TypeScript types (shared, reusable in React Native)
    index.ts
  /lib
    constants.ts          ← Point values, level thresholds
    themes.ts             ← Theme registry and types
    utils.ts
  /styles
    globals.css           ← Base resets, imports theme files
    /themes
      purple.css          ← DEFAULT (light + dark)
      ocean.css           ← light + dark
      forest.css          ← light + dark
      sunset.css          ← light + dark
  /messages               ← i18n translation files (next-intl)
    pl.json               ← Polish (default)
    en.json               ← English
    de.json               ← German
  /i18n
    request.ts            ← next-intl server config
    routing.ts            ← locale routing config
```

> **Architecture rule:** Components never call Supabase directly. All data flows through
> hooks → services. This enables future React Native port with zero changes to business logic.

---

## Database Schema (Supabase / PostgreSQL)

### `categories`
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id     uuid REFERENCES auth.users NOT NULL
name        text NOT NULL
icon        text NOT NULL        -- emoji
color       text NOT NULL        -- hex color
created_at  timestamptz DEFAULT now()
```
Default categories seeded on user signup: Praca 💼 #3b82f6, Nauka 📚 #06b6d4,
Język hiszpański 🇪🇸 #ec4899, Zdrowie ❤️ #10b981, Dom 🏠 #f59e0b

### `tasks`
```sql
id            uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id       uuid REFERENCES auth.users NOT NULL
category_id   uuid REFERENCES categories NOT NULL
title         text NOT NULL
is_completed  boolean DEFAULT false
completed_at  timestamptz
created_at    timestamptz DEFAULT now()
```
- No deadline field — intentional
- No priority field — intentional
- `is_completed` is set manually by user ("Complete 100%")

### `daily_entries`
```sql
id            uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id       uuid REFERENCES auth.users NOT NULL
task_id       uuid REFERENCES tasks       -- nullable (custom entries have no task)
category_id   uuid REFERENCES categories NOT NULL
title         text NOT NULL               -- user-written description e.g. "30 min tutorial"
points        integer DEFAULT 1
is_focus      boolean DEFAULT false       -- true if entry is linked to today's Focus Day
date          date NOT NULL               -- local date (not timestamp)
created_at    timestamptz DEFAULT now()
```

### `focus_days`
```sql
id            uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id       uuid REFERENCES auth.users NOT NULL
date          date NOT NULL
category_id   uuid REFERENCES categories NOT NULL
task_id       uuid REFERENCES tasks       -- nullable (user can set custom focus)
custom_title  text                        -- used when task_id is null
is_completed  boolean DEFAULT false       -- user manually marks focus as done
completed_at  timestamptz
UNIQUE(user_id, date)
```

### `rewards`
```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id         uuid REFERENCES auth.users NOT NULL
title           text NOT NULL
description     text
required_level  integer NOT NULL
image_url       text                      -- Supabase Storage URL or emoji fallback
is_claimed      boolean DEFAULT false
claimed_at      timestamptz
created_at      timestamptz DEFAULT now()
```

### `user_stats`
```sql
user_id         uuid PRIMARY KEY REFERENCES auth.users
total_points    integer DEFAULT 0
current_level   integer DEFAULT 1
updated_at      timestamptz DEFAULT now()
```

> Points are also derivable from `daily_entries` + completed `tasks` + completed `focus_days`.
> `user_stats` is a denormalized cache for fast reads. Always update it in the same transaction.

---

## TypeScript Types (`/src/types/index.ts`)

```typescript
export interface Category {
  id: string
  userId: string
  name: string
  icon: string
  color: string
  createdAt: string
}

export interface Task {
  id: string
  userId: string
  categoryId: string
  category?: Category
  title: string
  isCompleted: boolean
  completedAt: string | null
  createdAt: string
  entryCount?: number   // denormalized count for UI dots
}

export interface DailyEntry {
  id: string
  userId: string
  taskId: string | null
  categoryId: string
  category?: Category
  title: string
  points: number
  isFocus: boolean
  date: string          // 'YYYY-MM-DD'
  createdAt: string
}

export interface FocusDay {
  id: string
  userId: string
  date: string
  categoryId: string
  category?: Category
  taskId: string | null
  task?: Task | null
  customTitle: string | null
  isCompleted: boolean
  completedAt: string | null
}

export interface Reward {
  id: string
  userId: string
  title: string
  description: string | null
  requiredLevel: number
  imageUrl: string | null
  isClaimed: boolean
  claimedAt: string | null
  createdAt: string
}

export interface UserStats {
  userId: string
  totalPoints: number
  currentLevel: number
  updatedAt: string
}

export interface Level {
  level: number
  minPoints: number
  maxPoints: number
  reward?: Reward
}
```

---

## Points System

### Point values (defined in `/src/lib/constants.ts`)

```typescript
export const POINTS = {
  DAILY_ENTRY: 1,           // Any daily entry added
  FOCUS_ENTRY: 2,           // Daily entry linked to Focus Day task/category
  TASK_COMPLETED: 5,        // User manually marks task as 100% done
  FOCUS_COMPLETED: 7,       // User manually marks Focus Day as completed
} as const
```

### Level thresholds

```typescript
export const LEVEL_THRESHOLDS = [
  { level: 1, minPoints: 0,   maxPoints: 20  },
  { level: 2, minPoints: 21,  maxPoints: 50  },
  { level: 3, minPoints: 51,  maxPoints: 100 },
  { level: 4, minPoints: 101, maxPoints: 200 },
  { level: 5, minPoints: 201, maxPoints: 350 },
  // continues...
] as const
```

### Point rules
- `total_points` in `user_stats` **never resets**
- `today_points` is computed on the fly: `SUM(points) WHERE date = today`
- When a `daily_entry` is saved → `total_points += entry.points` + check for level up
- When a task is marked completed → `total_points += 5` + check for level up
- When Focus Day is marked completed → `total_points += 7` + check for level up
- Level up triggers unlock animation and checks if a reward at that level exists

---

## Focus Day Logic

- One Focus Day per user per date (enforced by `UNIQUE(user_id, date)` constraint)
- Optional: if no Focus Day is set, all entries earn +1 point as normal
- User selects a **category** OR a specific **task** from the task list OR writes custom text
- Any `daily_entry` with `is_focus = true` earns +2 points (not +1)
- Focus Day can be changed/deleted during the day — no penalty
- Focus Day marked as completed earns +7 points (one time)
- No red alerts, no "you didn't complete your focus" messages — ever

---

## Screen Specifications

### 1. Today (`/today`) — Default screen

**Layout (top to bottom):**
1. **Header row:** "Dziś" title + date (e.g. "15 maja, środa") + avatar top-right
2. **Focus Day card** (if set):
   - Label: "Fokus dnia ?" (with tooltip explaining Focus Day)
   - Task/category name + icon
   - Two pill badges: "+2 pkt za każdy wpis w fokusie dnia" | "+7 pkt za zakończenie fokusa dnia"
   - Tap to change focus → opens Focus Day selector sheet
   - If not set: soft dashed card "Ustaw fokus dnia (opcjonalnie) →"
3. **Points row:** Two cards side by side:
   - Left: "Dzisiejsze punkty" + number + star + motivational line (e.g. "Świetna robota! 🔥")
   - Right: "Łącznie punktów" + number + star + "Poziom X" + small XP bar
4. **Section label:** "Co dziś zrobiłem?"
5. **Daily entries list:** Each entry shows:
   - Category icon (colored) + title + point badge (+1 or +2) + time
   - Focus entries get a small ⭐ indicator
6. **CTA button:** "+ Dodaj co dziś zrobiłem" (full width, purple)

**Motivational messages (rotate randomly):**
- "1 punkt to 1 punkt więcej niż wczoraj."
- "Każdy krok ma znaczenie! ✨"
- "Świetna robota! 🔥"
- "To więcej niż wczoraj! 🔥"

### 2. Add Entry Modal (bottom sheet)

Triggered by "+ Dodaj co dziś zrobiłem" button.

**Two tabs:** "Z bazy zadań" | "Własny wpis"

**Tab 1 — Z bazy zadań:**
- Category filter row (horizontal scroll chips)
- List of active tasks filtered by selected category
- Each task shows: category icon + title + category name
- Radio selection (one at a time)
- Text input below: "Opisz co zrobiłaś (np. 30 minut tutorialu)"
- If today's Focus Day category matches selected task → show "+2 pkt" badge
- Bottom reminder: "Każdy wpis = +1 punkt. Mały krok też się liczy! ✨"
- "Dodaj wpis" button (disabled until task selected)

**Tab 2 — Własny wpis:**
- Category selector (grid of category chips)
- Text input: "Co zrobiłaś?"
- "Dodaj wpis" button

**After adding entry → Success overlay:**
- Confetti animation
- Character emoji (mascot)
- "Super! 🌟 Zdobywasz +1 punkt" (or +2 if focus)
- Task title + category
- "Dzisiejsze punkty: X ⭐"
- "Świetnie!" button to dismiss

### 3. Focus Day Selector (bottom sheet)

**Header:** "Wybierz fokus dnia" + "Usuń" (top right, only if focus already set)
**Subtitle:** "Wybierz jeden obszar, na którym chcesz się dziś skupić."

**Options (vertical list):**
- Each default category as a tappable row (icon + name)
- "+ Własny fokus" option at bottom
- Selected item gets a green checkmark
- "Pamiętaj!" info box: "Każdy wpis w Twoim fokusie dnia to +2 pkt. Zakończenie fokusa dnia to aż +7 pkt! 🎉"
- "Zapisz fokus" primary button

**Focus Day Completed overlay** (when user marks focus done):
- "Fokus dnia zakończony! 🎉"
- "Niesamowite! Ukończyłaś swój fokus:"
- Category/task chip
- "+7 ⭐ punktów"
- "Dzisiejsze punkty: X ⭐"
- "Świetnie!" dismiss button

### 4. Tasks (`/tasks`)

**Header:** "Zadania" + "+" button (add new task)

**Tabs:** Wszystkie | Aktywne | Ukończone

**Category filter:** Horizontal scroll chips (all + each category)

**Active tasks list:**
Each task card shows:
- Category icon (colored square) + task title + category name
- Progress dots: filled dots for entries made (e.g. ●●● = 3 entries, ○○ = 0/no entries)
  - Max 5 dots shown, overflow shown as number
- "Zakończ zadanie (+5 pkt)" button (right side, purple outlined)

**Completed tasks section:**
- Greyed out, strikethrough title
- "Ukończone ✓" badge
- No action buttons

**Add Task FAB / modal:**
- Title input
- Category selector
- Save button

### 5. Reward Tree (`/tree`)

**Design: UX_2 style** — winding path / organic tree layout (NOT straight vertical list)

**Header:** "Drzewo nagród"

**Top summary card:**
- Small tree seedling icon + "Masz X punktów" + "Poziom Y"
- Progress bar: "Do poziomu Z zostało X punktów" + "X / Y pkt"
- The bar is subtle — shows progress but is NOT the focal point

**Tree path visual:**
- Organic winding path from bottom to top
- Each level = a node on the path
- Level numbers (1, 2, 3...) shown as circles on the path line
- Each node has:
  - Reward image (large, rounded rectangle card)
  - Level number + point range (e.g. "0–5 pkt")
  - Reward title (e.g. "Twoja ulubiona kawa")
  - Lock icon overlay if locked, green checkmark if claimed

**Node states:**
- `claimed`: full color image + green ✓ checkmark — no lock
- `current` (unlocked, not yet claimed): full color image + subtle glow/highlight
- `locked`: image slightly desaturated + 🔒 lock icon overlay

**Unlock animation:**
Triggered when user reaches a new level:
- Confetti burst
- Large gift box image
- "Nowa nagroda odblokowana! 🎉"
- "Osiągnąłeś poziom X 🎉"
- Reward image + title
- Reward description
- "Super! ✨" button

### 6. Rewards (`/rewards`)

**Header:** "Nagrody" + "+" button

**Tabs:** Moje nagrody | Szablony

**Moje nagrody tab:**

Section "Odblokowane":
- Each reward card: large image + title + "Poziom X" + green "Odblokowana" badge
- Tapping shows full detail + "Odbierz nagrodę" button

Section "Zablokowane":
- Same card layout, image slightly dimmed + lock icon
- Shows which level is needed

**"+" Add Reward flow:**
- Title input
- Description input (optional)
- Level selector (number picker or stepper)
- Image: emoji picker OR upload from device (Supabase Storage)
- If no image selected → show a default emoji based on level

**Szablony tab:**
- Preset reward suggestions by category (food, experiences, shopping, travel)
- User can tap to add template to their rewards

### 7. History (`/history`)

**Toggle:** Dzień | Miesiąc (top right)

**Month view:**
- Standard calendar grid (Mon–Sun)
- Days with entries: purple dot indicator below date number
- Today: purple circle around date
- Empty days: no red, no X, no indication of failure — just empty
- Tap a day → switches to Day view for that date

**Day view:**
- Selected date header + total points for that day + star
- List of all entries for that day:
  - Category icon + entry title + points + time
- If no entries: soft message "Dzień odpoczynku 🌙" — never "no activity"

**Footer message (always visible in month view):**
"Każdy wpis = dzień odpoczynku, nie porażka 💜
Każdy dzień jest dobry, żeby wrócić do swoich celów."

**Stats card (below calendar):**
- "Łącznie punktów: X ⭐ — Nigdy się nie resetuje"
- "Poziom: X 🌱 — Świetna robota!"
- "Zobacz drzewo nagród →" button

---

## Design System

### Theming Architecture

The entire visual appearance of the app is controlled by a **theme system** that supports:
- Light / Dark mode (user toggle + follows system preference by default)
- Swappable color themes (e.g. Purple, Ocean, Forest, Sunset) — user picks in Settings
- All components consume **only CSS variables** — never hardcoded color values

This architecture means: swapping a theme = changing one file. No component ever needs to be touched.

---

### Theme File Structure

```
/src
  /styles
    globals.css           ← imports theme variables, base resets
    /themes
      purple.css          ← DEFAULT theme (matches UX_1 mockup)
      ocean.css
      forest.css
      sunset.css
  /lib
    themes.ts             ← theme registry and types
  /hooks
    useTheme.ts           ← reads/writes theme preference to Supabase + localStorage
  /components
    /ui
      ThemeProvider.tsx   ← wraps app, applies [data-theme] + [data-mode] to <html>
      ThemeSelector.tsx   ← UI for picking theme in Settings
```

---

### CSS Variable Contract

Every component **must** use only these semantic variables — never raw hex values.
These variables are redefined per theme and per mode.

```css
/* ── BACKGROUNDS ── */
--bg-app          /* Main app background */
--bg-surface      /* Card / sheet background */
--bg-surface-2    /* Nested card, slightly different */
--bg-surface-3    /* Hover / pressed state */
--bg-overlay      /* Modal backdrop */

/* ── TEXT ── */
--text-primary    /* Headings, important content */
--text-secondary  /* Labels, descriptions */
--text-muted      /* Timestamps, hints */
--text-inverse    /* Text on colored backgrounds */

/* ── BRAND / ACTIONS ── */
--color-primary        /* Main CTA, active nav, buttons */
--color-primary-light  /* Badges, accents, point numbers */
--color-primary-dark   /* Hover state for primary */
--color-primary-subtle /* Very light tint for card backgrounds */

/* ── SEMANTIC ── */
--color-success        /* Completed states, checkmarks */
--color-success-subtle /* Completed card backgrounds */
--color-warning        /* Focus day, stars, amber accents */
--color-warning-subtle /* Focus card background */
--color-focus-border   /* Focus Day card border */

/* ── BORDERS & SHADOWS ── */
--border-default  /* Standard card border */
--border-subtle   /* Dividers */
--shadow-card     /* Card elevation */
--shadow-modal    /* Bottom sheet elevation */

/* ── CATEGORY COLORS (fixed across themes, only opacity changes per mode) ── */
--cat-work        /* Blue */
--cat-learn       /* Purple */
--cat-spanish     /* Green */
--cat-health      /* Red/coral */
--cat-home        /* Amber */
```

---

### Default Theme: Purple Light (`/styles/themes/purple.css`)

```css
[data-theme="purple"][data-mode="light"] {
  --bg-app:           #ffffff;
  --bg-surface:       #f8f7ff;
  --bg-surface-2:     #f1efff;
  --bg-surface-3:     #e8e5ff;
  --bg-overlay:       rgba(0, 0, 0, 0.4);

  --text-primary:     #1e1b4b;
  --text-secondary:   #64748b;
  --text-muted:       #94a3b8;
  --text-inverse:     #ffffff;

  --color-primary:        #7c3aed;
  --color-primary-light:  #a78bfa;
  --color-primary-dark:   #6d28d9;
  --color-primary-subtle: #f3f0ff;

  --color-success:        #10b981;
  --color-success-subtle: #f0fdf4;
  --color-warning:        #f59e0b;
  --color-warning-subtle: #fffbeb;
  --color-focus-border:   #f59e0b;

  --border-default: #e8e5ff;
  --border-subtle:  #f1efff;
  --shadow-card:    0 2px 12px rgba(124, 58, 237, 0.08);
  --shadow-modal:   0 -4px 32px rgba(124, 58, 237, 0.12);

  --cat-work:     #3b82f6;
  --cat-learn:    #8b5cf6;
  --cat-spanish:  #10b981;
  --cat-health:   #ef4444;
  --cat-home:     #f59e0b;
}

[data-theme="purple"][data-mode="dark"] {
  --bg-app:           #0f0e1a;
  --bg-surface:       #1a1828;
  --bg-surface-2:     #221f35;
  --bg-surface-3:     #2d2a45;
  --bg-overlay:       rgba(0, 0, 0, 0.6);

  --text-primary:     #f1f0ff;
  --text-secondary:   #9ca3b8;
  --text-muted:       #5c6070;
  --text-inverse:     #ffffff;

  --color-primary:        #8b5cf6;
  --color-primary-light:  #c4b5fd;
  --color-primary-dark:   #7c3aed;
  --color-primary-subtle: #1e1a35;

  --color-success:        #34d399;
  --color-success-subtle: #0d2318;
  --color-warning:        #fbbf24;
  --color-warning-subtle: #261c06;
  --color-focus-border:   #fbbf2466;

  --border-default: #2d2a45;
  --border-subtle:  #221f35;
  --shadow-card:    0 2px 12px rgba(0, 0, 0, 0.3);
  --shadow-modal:   0 -4px 32px rgba(0, 0, 0, 0.5);

  --cat-work:     #60a5fa;
  --cat-learn:    #a78bfa;
  --cat-spanish:  #34d399;
  --cat-health:   #f87171;
  --cat-home:     #fbbf24;
}
```

---

### Additional Themes (implement same variable contract)

**Ocean** (`purple` → `ocean`):
- Light: white + teal/cyan primary (`#0891b2`), soft blue surfaces
- Dark: deep navy background, bright cyan accents

**Forest** (`purple` → `forest`):
- Light: warm white + green primary (`#16a34a`), soft sage surfaces
- Dark: deep forest green background, bright lime accents

**Sunset** (`purple` → `sunset`):
- Light: warm white + coral/orange primary (`#ea580c`), soft peach surfaces
- Dark: deep warm dark background, bright orange accents

Each theme file follows the exact same variable names — only values differ.

---

### Theme Provider Implementation

```tsx
// /src/components/ui/ThemeProvider.tsx
'use client'

import { useEffect } from 'react'
import { useTheme } from '@/hooks/useTheme'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, mode } = useTheme()

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', theme)   // e.g. "purple"
    root.setAttribute('data-mode', mode)     // e.g. "light" | "dark"
  }, [theme, mode])

  return <>{children}</>
}
```

---

### Theme Hook

```typescript
// /src/hooks/useTheme.ts
export type ThemeName = 'purple' | 'ocean' | 'forest' | 'sunset'
export type ThemeMode = 'light' | 'dark' | 'system'

interface ThemeState {
  theme: ThemeName
  mode: 'light' | 'dark'           // resolved — never 'system'
  rawMode: ThemeMode                // what user actually set
  setTheme: (t: ThemeName) => void
  setMode: (m: ThemeMode) => void
}
```

- Default: theme = `purple`, mode = `system` (follows OS preference)
- Preference saved to `user_preferences` table in Supabase + localStorage fallback
- Mode toggle available in app Settings screen and as a quick-toggle icon in header

---

### Theme Registry

```typescript
// /src/lib/themes.ts
export const THEMES = [
  {
    id: 'purple',
    name: 'Purple Dream',
    primaryLight: '#7c3aed',
    primaryDark: '#8b5cf6',
    preview: '🟣',
  },
  {
    id: 'ocean',
    name: 'Ocean Calm',
    primaryLight: '#0891b2',
    primaryDark: '#22d3ee',
    preview: '🔵',
  },
  {
    id: 'forest',
    name: 'Forest Focus',
    primaryLight: '#16a34a',
    primaryDark: '#4ade80',
    preview: '🟢',
  },
  {
    id: 'sunset',
    name: 'Sunset Energy',
    primaryLight: '#ea580c',
    primaryDark: '#fb923c',
    preview: '🟠',
  },
] as const
```

---

### Supabase: User Preferences Table

```sql
CREATE TABLE user_preferences (
  user_id     uuid PRIMARY KEY REFERENCES auth.users,
  theme       text DEFAULT 'purple',
  theme_mode  text DEFAULT 'system',   -- 'light' | 'dark' | 'system'
  updated_at  timestamptz DEFAULT now()
);
```

---

### Component Rules for Theming

**Always use CSS variables:**
```tsx
// ✅ CORRECT
<div style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)' }}>

// ✅ CORRECT with Tailwind (use arbitrary values)
<div className="bg-[var(--bg-surface)] text-[var(--text-primary)]">

// ❌ WRONG — breaks theming
<div className="bg-white text-gray-900">
<div style={{ background: '#ffffff' }}>
```

**Never use Tailwind color utilities directly** (e.g. `bg-purple-600`, `text-gray-500`).
Use only `bg-[var(--...)]`, `text-[var(--...)]`, `border-[var(--...)]` patterns.
Exception: category color dots can use inline style with `var(--cat-*)`.

---

### Settings Screen (add to app)

Add a `/settings` screen (accessible from avatar/header) with:
- **Appearance section:**
  - Mode toggle: `☀️ Light` | `🌙 Dark` | `⚙️ System` (segmented control)
  - Theme picker: horizontal scroll of theme preview chips, each showing theme name + color dot + preview swatch
- Changes apply instantly (no save button needed — optimistic update)

---

### Typography
- Font: System font stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI'`)
- Headings: `font-weight: 800`, uses `var(--text-primary)`
- Body: `font-weight: 400–600`, uses `var(--text-secondary)`
- Point numbers: `font-weight: 900`, large, uses `var(--color-primary-light)`

### Design Principles (from UX_1 mockup)
- **Default is light theme** — white background, soft purple surfaces (UX_1 style)
- **Dark mode is fully supported** — every surface, text, border, shadow has a dark value
- **Rounded everything** — `border-radius: 16–24px` for cards, `border-radius: 12px` for chips
- **Soft shadows** — use `var(--shadow-card)` — adapts per theme/mode
- **No hard edges, no red indicators**
- **Mascot/character** — friendly purple creature appears in success states
- **Illustrated rewards** — reward images should feel warm and aspirational
- **Star emoji (⭐)** for points, always accompanied by the number
- **Bottom sheet modals** — no full-screen takeovers for minor actions

### Animations
- Entry added: confetti burst + "+X pkt" float-up animation
- Level up: full overlay celebration with gift box
- Focus completed: celebratory overlay
- Tree unlock: node glow + scale animation
- All transitions: `duration: 200–300ms`, `ease: ease-out`
- **Never** show progress bars decreasing or numbers going down

---

## Key UX Rules (ADHD-friendly — enforce these everywhere)

1. **No deadlines anywhere** — no date pickers on tasks, no "overdue" states
2. **No streaks** — no "X day streak" counter, no streak broken notifications
3. **No percentage bars on tasks** — progress dots (●●○) only, max 5
4. **Empty calendar days are neutral** — never red, never crossed out
5. **Points never decrease** — total_points is append-only
6. **Focus Day is always optional** — its card is soft/dashed when unset, never alarming
7. **Every action gets positive feedback** — even adding 1 entry gets a celebration
8. **Motivational copy is always positive** — "1 punkt to 1 punkt więcej niż wczoraj" style
9. **No "you should" language** — all prompts are invitations, not obligations
10. **Reward tree shows the future** — locked rewards are visible and enticing, not hidden

---

## Authentication

- Supabase Auth (email + password)
- Magic link option (easier for ADHD users — no password to remember)
- On first login → seed default categories for user
- All DB queries use Row Level Security (RLS) — users only see their own data
- Session persisted in localStorage (Next.js + Supabase SSR helpers)

---

## Internationalisation (i18n)

### Supported Languages

| Code | Language | Default |
|------|----------|---------|
| `pl` | Polish   | ✅ yes  |
| `en` | English  | no      |
| `de` | German   | no      |

---

### Library

Use **`next-intl`** — the standard i18n solution for Next.js App Router.

```bash
npm install next-intl
```

---

### Routing Strategy

Use **path-based locale prefix** — clean, SEO-friendly, works with PWA:

```
/pl/today    ← Polish (default, also accessible at /today)
/en/today    ← English
/de/today    ← German
```

Configure in `/src/i18n/routing.ts`:

```typescript
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['pl', 'en', 'de'],
  defaultLocale: 'pl',
  localePrefix: 'as-needed',  // /today works for Polish, /en/today for English
})
```

---

### Translation File Structure

All translation strings live in `/messages/{locale}.json`.
**Never hardcode UI strings in components** — always use the `t()` function.

```
/messages
  pl.json
  en.json
  de.json
```

#### Translation key structure (`pl.json` as reference):

```json
{
  "common": {
    "save": "Zapisz",
    "cancel": "Anuluj",
    "delete": "Usuń",
    "add": "Dodaj",
    "done": "Gotowe",
    "points": "pkt",
    "level": "Poziom",
    "loading": "Ładowanie..."
  },
  "nav": {
    "today": "Dziś",
    "tasks": "Zadania",
    "tree": "Drzewo",
    "rewards": "Nagrody",
    "history": "Historia"
  },
  "today": {
    "title": "Dziś",
    "greeting": "Cześć, {name} 👋",
    "todayPoints": "Dzisiejsze punkty",
    "totalPoints": "Łącznie punktów",
    "sectionLabel": "Co dziś zrobiłem?",
    "addButton": "+ Dodaj co dziś zrobiłem",
    "noEntries": "Jeszcze nic dziś — każdy krok się liczy! ✨",
    "motivational_0": "1 punkt to 1 punkt więcej niż wczoraj.",
    "motivational_1": "Każdy krok ma znaczenie! ✨",
    "motivational_2": "Świetna robota! 🔥",
    "motivational_3": "To więcej niż wczoraj! 🔥"
  },
  "focusDay": {
    "label": "Fokus dnia",
    "tooltip": "Wybierz jeden obszar, na którym chcesz się dziś skupić.",
    "setPrompt": "Ustaw fokus dnia (opcjonalnie) →",
    "bonusEntry": "+{points} pkt za każdy wpis w fokusie dnia",
    "bonusComplete": "+{points} pkt za zakończenie fokusa dnia",
    "selectorTitle": "Wybierz fokus dnia",
    "selectorSubtitle": "Wybierz jeden obszar, na którym chcesz się dziś skupić.",
    "customOption": "+ Własny fokus",
    "reminder": "Każdy wpis w Twoim fokusie dnia to +{entry} pkt. Zakończenie fokusa dnia to aż +{complete} pkt! 🎉",
    "saveButton": "Zapisz fokus",
    "removeButton": "Usuń",
    "completedTitle": "Fokus dnia zakończony! 🎉",
    "completedSubtitle": "Niesamowite! Ukończyłaś swój fokus:",
    "completedPoints": "+{points} ⭐ punktów",
    "dismissButton": "Świetnie!"
  },
  "addEntry": {
    "title": "Co dziś zrobiłaś?",
    "tabFromList": "Z bazy zadań",
    "tabCustom": "Własny wpis",
    "categoryLabel": "Wybierz kategorię",
    "taskLabel": "Wybierz zadanie z bazy",
    "descriptionPlaceholder": "Opisz co zrobiłaś (np. 30 minut tutorialu)",
    "customPlaceholder": "Co zrobiłaś?",
    "focusBadge": "+{points} pkt (fokus!)",
    "reminder": "Każdy wpis = +1 punkt. Mały krok też się liczy! ✨",
    "submitButton": "Dodaj wpis",
    "successTitle": "Super! 🌟",
    "successPoints": "Zdobywasz +{points} punkt",
    "successDayPoints": "Dzisiejsze punkty: {total} ⭐",
    "successDismiss": "Świetnie!"
  },
  "tasks": {
    "title": "Zadania",
    "tabAll": "Wszystkie",
    "tabActive": "Aktywne",
    "tabDone": "Ukończone",
    "activeSection": "Aktywne zadania",
    "completedSection": "Ukończone zadania",
    "completeButton": "Zakończ zadanie (+{points} pkt)",
    "completedBadge": "Ukończone",
    "addTitle": "Nowe zadanie",
    "titlePlaceholder": "Nazwa zadania",
    "categoryLabel": "Kategoria",
    "emptyActive": "Brak aktywnych zadań. Dodaj swoje pierwsze! ✨",
    "emptyCompleted": "Jeszcze żadnych ukończonych. Do dzieła! 💪"
  },
  "tree": {
    "title": "Drzewo nagród",
    "pointsSummary": "Masz {points} punktów",
    "nextLevel": "Do poziomu {level} zostało {remaining} punktów",
    "nodeUnlocked": "Odblokowane ✓",
    "nodeLocked": "{points} pkt do odblokowania",
    "unlockTitle": "Nowa nagroda odblokowana! 🎉",
    "unlockSubtitle": "Osiągnąłeś poziom {level} 🎉",
    "unlockDismiss": "Super! ✨"
  },
  "rewards": {
    "title": "Nagrody",
    "tabMine": "Moje nagrody",
    "tabTemplates": "Szablony",
    "sectionUnlocked": "Odblokowane",
    "sectionLocked": "Zablokowane",
    "unlockedBadge": "Odblokowana",
    "lockedBadge": "Zablokowana",
    "claimButton": "Odbierz nagrodę",
    "addButton": "+ Dodaj nagrodę",
    "levelRequired": "Poziom {level}",
    "addTitle": "Nowa nagroda",
    "titlePlaceholder": "Nazwa nagrody",
    "descriptionPlaceholder": "Opis (opcjonalnie)",
    "levelLabel": "Wymagany poziom",
    "imageLabel": "Zdjęcie lub emoji"
  },
  "history": {
    "title": "Historia",
    "toggleDay": "Dzień",
    "toggleMonth": "Miesiąc",
    "dayRest": "Dzień odpoczynku 🌙",
    "footerMessage": "Każdy wpis = dzień odpoczynku, nie porażka 💜\nKażdy dzień jest dobry, żeby wrócić do swoich celów.",
    "statsPoints": "Łącznie punktów",
    "statsNeverReset": "Nigdy się nie resetuje",
    "statsLevel": "Poziom",
    "statsCta": "Zobacz drzewo nagród →"
  },
  "settings": {
    "title": "Ustawienia",
    "appearanceSection": "Wygląd",
    "languageSection": "Język",
    "modeLight": "Jasny",
    "modeDark": "Ciemny",
    "modeSystem": "Systemowy",
    "themeLabel": "Motyw kolorystyczny",
    "languageLabel": "Język aplikacji"
  },
  "categories": {
    "work": "Praca",
    "learn": "Nauka",
    "spanish": "Język hiszpański",
    "health": "Zdrowie",
    "home": "Dom"
  },
  "auth": {
    "loginTitle": "Witaj z powrotem",
    "loginSubtitle": "Zaloguj się, by kontynuować swój progres.",
    "registerTitle": "Zacznij swoją przygodę",
    "registerSubtitle": "Zbuduj nawyki, które działają dla Ciebie.",
    "emailLabel": "Email",
    "passwordLabel": "Hasło",
    "loginButton": "Zaloguj się",
    "registerButton": "Utwórz konto",
    "magicLinkButton": "Wyślij magic link",
    "switchToRegister": "Nie masz konta? Zarejestruj się",
    "switchToLogin": "Masz już konto? Zaloguj się"
  }
}
```

The `en.json` and `de.json` files must contain **identical keys** with translated values.

#### `en.json` sample (key selections):

```json
{
  "common": { "save": "Save", "cancel": "Cancel", "points": "pts", "level": "Level" },
  "nav": { "today": "Today", "tasks": "Tasks", "tree": "Tree", "rewards": "Rewards", "history": "History" },
  "today": {
    "greeting": "Hey, {name} 👋",
    "sectionLabel": "What did I do today?",
    "addButton": "+ Add what I did today",
    "motivational_0": "1 point is 1 point more than yesterday.",
    "motivational_1": "Every step counts! ✨",
    "motivational_2": "Great work! 🔥",
    "motivational_3": "That's more than yesterday! 🔥"
  },
  "history": {
    "dayRest": "Rest day 🌙",
    "footerMessage": "No entry = a rest day, not a failure 💜\nEvery day is a good day to come back to your goals."
  }
}
```

#### `de.json` sample (key selections):

```json
{
  "common": { "save": "Speichern", "cancel": "Abbrechen", "points": "Pkt", "level": "Level" },
  "nav": { "today": "Heute", "tasks": "Aufgaben", "tree": "Baum", "rewards": "Belohnungen", "history": "Verlauf" },
  "today": {
    "greeting": "Hallo, {name} 👋",
    "sectionLabel": "Was habe ich heute gemacht?",
    "addButton": "+ Hinzufügen, was ich heute gemacht habe",
    "motivational_0": "1 Punkt ist 1 Punkt mehr als gestern.",
    "motivational_1": "Jeder Schritt zählt! ✨",
    "motivational_2": "Tolle Arbeit! 🔥",
    "motivational_3": "Das ist mehr als gestern! 🔥"
  },
  "history": {
    "dayRest": "Ruhetag 🌙",
    "footerMessage": "Kein Eintrag = ein Ruhetag, kein Versagen 💜\nJeder Tag ist ein guter Tag, um zu deinen Zielen zurückzukehren."
  }
}
```

---

### Using Translations in Components

```tsx
// Server Component
import { getTranslations } from 'next-intl/server'

export default async function TodayPage() {
  const t = await getTranslations('today')
  return <h1>{t('title')}</h1>
}

// Client Component
'use client'
import { useTranslations } from 'next-intl'

export function AddEntryButton() {
  const t = useTranslations('today')
  return <button>{t('addButton')}</button>
}

// With variables
t('focusDay.bonusEntry', { points: 2 })
// → "+2 pkt za każdy wpis w fokusie dnia"
```

---

### Language Persistence

User's language preference is stored in `user_preferences` table (same as theme):

```sql
ALTER TABLE user_preferences
ADD COLUMN locale text DEFAULT 'pl';   -- 'pl' | 'en' | 'de'
```

Logic:
1. On first visit → detect browser language (`navigator.language`), map to supported locale, default to `pl` if unsupported
2. After login → load locale from `user_preferences`, override browser detection
3. Language change in Settings → update `user_preferences` + redirect to new locale path

---

### useLocale Hook

```typescript
// /src/hooks/useLocale.ts
export type SupportedLocale = 'pl' | 'en' | 'de'

export const LOCALES = [
  { code: 'pl', label: 'Polski',  flag: '🇵🇱' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
] as const

interface LocaleState {
  locale: SupportedLocale
  setLocale: (l: SupportedLocale) => void
}
```

---

### Settings Screen — Language Section

In the Settings screen, add a **Language** section below Appearance:

```
🌐 Language / Język / Sprache

  🇵🇱 Polski      ← tappable row, checkmark if active
  🇬🇧 English
  🇩🇪 Deutsch
```

- Changing language triggers instant redirect to `/{locale}/...` equivalent of current page
- No page reload — Next.js navigation handles it
- The Settings screen labels should show all three language names simultaneously
  (e.g. section header: "Language / Język / Sprache") so user can find it regardless of current lang

---

### Date & Number Formatting

Use `next-intl` formatters — they automatically respect locale:

```tsx
import { useFormatter } from 'next-intl'

const format = useFormatter()

// Date formatting
format.dateTime(new Date(), { weekday: 'long', day: 'numeric', month: 'long' })
// pl: "środa, 15 maja"
// en: "Wednesday, May 15"
// de: "Mittwoch, 15. Mai"

// Number formatting (points)
format.number(1234)
// pl: "1 234"
// en: "1,234"
// de: "1.234"
```

---

### i18n Rules for Components

1. **No hardcoded strings anywhere** — every visible text goes through `t()`
2. **No string concatenation** — use `t('key', { variable })` for dynamic content
3. **Emoji are NOT translated** — they stay in translation files as-is
4. **ADHD-friendly tone must be preserved in all languages** — translations must be warm, encouraging, never clinical
5. **Category names are translatable** — default category names come from `categories` translation namespace, but user-created categories store their custom name as-is

---

## API / Data Fetching Patterns

- Use Supabase JS client v2
- Server Components for initial page load (SSR)
- Client Components + hooks for interactive parts (adding entries, real-time points)
- Optimistic updates for entry creation (show entry immediately, sync in background)
- Use `react-query` or Supabase Realtime for live point updates

---

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=     # server-side only
```

---

## PWA Configuration

- `next-pwa` package
- Manifest: name "Progress Companion", theme color `#7c3aed`
- Offline support: cache today's screen and task list
- Add to home screen prompt on mobile
- Icon: app icon (purple with ⭐ or seedling)

---

## File Naming Conventions

- Components: `PascalCase.tsx` (e.g. `FocusDayCard.tsx`)
- Hooks: `camelCase.ts` prefixed with `use` (e.g. `useFocusDay.ts`)
- Services: `camelCase.service.ts`
- Types: all in `/src/types/index.ts`
- Pages: Next.js App Router convention (`page.tsx`, `layout.tsx`)

---

## What NOT to Build

- No social features (no sharing, no leaderboards)
- No notifications / reminders (Phase 2 only)
- No AI-generated task suggestions (Phase 2)
- No recurring tasks (Phase 2)
- No sub-tasks or dependencies
- No time tracking or Pomodoro timer
- No gamification beyond the defined point/level/reward system

---

## Development Order (recommended)

1. Supabase project setup + schema migration + RLS policies (include `user_preferences` table)
2. Theme system setup: CSS variable files (all 4 themes × light/dark), ThemeProvider, useTheme hook
3. i18n setup: next-intl config, routing, all three translation files (pl/en/de)
4. Auth (login/register screens)
4. Category seeding on signup
5. Tasks screen (CRUD)
6. Today screen — entry list + add entry modal
7. Points system + user_stats updates
8. Focus Day selector + focus entry logic
9. Reward Tree screen (visual path)
10. Rewards management screen
11. History screen (calendar + day view)
12. Level up celebration overlay
13. Settings screen (theme picker + dark/light/system mode toggle)
14. PWA configuration
15. Polish: animations, success states, motivational messages