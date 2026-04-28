# PROGRESS.md

---

## Session 5 — Design System Rework: UX_1.png Implementation (Purple Dream)

### 0. Context

The user iterated through the design direction inside this single session, ending on "implement exactly the design from UX_1.png, colors too!". The final state is therefore an exact match to `src/design/UX_1.png` — the original Purple Dream visual identity from CLAUDE.md. Earlier intermediate explorations ("modern light no-purple" → "shades of light green and gold with gradients" → "UX_1 layout with green/gold palette") are NOT preserved on disk; only the final UX_1 result is. The gradient design tokens introduced during the green/gold exploration are kept (they're useful regardless of palette).

---

### 1. Completed in this session

**Files created:**
- `supabase/migrations/003_ux1_category_colors.sql` — idempotent migration that updates the 5 default seeded categories to UX_1's vivid hexes (`#3b82f6` / `#8b5cf6` / `#10b981` / `#ef4444` / `#f59e0b`) and replaces `handle_new_user()` so brand-new signups receive them out of the box. Matches by `name + icon = '<lucide slug>'` so user-customised rows are never touched. Depends on migration 002 having been applied first (it expects lucide slug icons, not emojis)

**Files modified:**

Theme system:
- `src/styles/themes/purple.css` — full rewrite to **Purple Dream** matching UX_1: white `--bg-app`, soft purple surfaces (`#f8f7ff` / `#f1efff`), deep indigo text (`#1e1b4b`), `#7c3aed` primary with the lighter `#a78bfa` for accents, vivid `--cat-*` set
- `src/styles/themes/ocean.css` — full rewrite to **Ocean Calm** (cyan primary `#0891b2`, white surfaces)
- `src/styles/themes/forest.css` — full rewrite to **Forest Focus** (green primary `#16a34a`, white surfaces)
- `src/styles/themes/sunset.css` — full rewrite to **Sunset Energy** (orange primary `#ea580c`, peach surfaces)
- All four themes share the same `--cat-*` set so categories look consistent regardless of theme choice
- All four themes now also expose new gradient tokens: `--gradient-bg` (radial overlay for the body), `--gradient-primary` (135° purple→darker-purple for CTA buttons), `--gradient-primary-hover`, `--gradient-accent`. Light AND dark mode values defined per theme
- `src/styles/globals.css` — `:root` defaults rewritten to Purple Dream (so SSR before `ThemeProvider` mounts no longer flashes a different palette); paper-grain noise gradient removed; added `body::before { position: fixed; inset: 0; z-index: -1; background-image: var(--gradient-bg) }` so the soft purple wash visible in UX_1's top-right corner stays anchored to the viewport on scroll; `h1/h2/h3` rule simplified to use the sans family with weight 700 + tighter tracking (no serif)
- `src/lib/themes.ts` — registry restored to **Purple Dream / Ocean Calm / Forest Focus / Sunset Energy** with `swatch`/`swatchInk` hex pairs ready for the future Settings theme picker
- `src/app/layout.tsx` — Lora serif font dropped (no longer needed for the modern UX_1 look). Inter remains as `--font-sans`. `--font-serif` is now aliased to `var(--font-sans)` directly on `<html>` via inline style so the handful of components that still set `fontFamily: 'var(--font-serif, serif)'` cleanly fall through to Inter rather than the browser's Times default

Components (UX_1 layout):
- `src/components/tasks/TaskCard.tsx` — restructured from the old vertical layout (button below content) to UX_1's **horizontal** layout: colored category tile (44×44, `border-radius: 12`, soft tint via `color-mix(in oklab, <cat.color> 16%, var(--bg-surface))`) on the left → title + category name + entry-count text + colored progress dots in the middle → 96px outlined "Zakończ zadanie (+5 pkt)" pill button on the right (`borderWidth: 1.5`, `borderColor: var(--color-primary)`, transparent bg, purple text). The button width forces the existing translated string to naturally wrap to two lines, so no new translation key was needed for the split
- `src/components/tasks/ProgressDots.tsx` — added optional `color?` prop. When provided, both filled dots and the `+N` overflow indicator render in that color. Falls back to `--color-primary`. Used by `TaskCard` to colour each row's dots with its own category color (matches UX_1's coloured-dot indicator)
- `src/components/tasks/CategoryChips.tsx` — full rewrite to UX_1's **vertical mini-card** layout. Each chip is now a column: 44×44 rounded-square tile on top with the lucide `CategoryIcon` in the category color on a soft category-color tint, label below in 11px text. The "Wszystkie" chip mirrors the same visual using theme primary tokens (subtle bg + primary-color icon at rest → gradient + inverse icon when active). Active state intensifies the tile's background and adds a colored glow shadow. Internal `CategoryButton` helper component keeps the All chip and the per-category chips behaving identically
- `src/components/tasks/Tabs.tsx` — segmented control restyled to UX_1: pill-shaped row inside `--bg-surface-2` with a `border-subtle` outline, individual tabs are 100% rounded pills, active tab uses `background: var(--gradient-primary, var(--color-primary))` + `--text-inverse` + a soft elevation; inactive tabs are transparent with `--text-secondary` text
- `src/components/tasks/CompletedTaskCard.tsx` — dropped the inline `var(--font-serif)` on the strikethrough title; replaced with a small letter-spacing tweak. Layout/colors otherwise unchanged (the existing greyed + strikethrough + green "Ukończone ✓" badge already matched UX_1)
- `src/components/tasks/TasksClient.tsx` — `+` button now uses `var(--gradient-primary)` with a purple-tinted glow shadow (`0 4px 14px rgba(124, 58, 237, 0.28)`) layered over `var(--shadow-card)`. Title weight bumped to 700, dropped `var(--font-serif)`, tightened tracking to `-0.022em` to match UX_1's bold modern-sans heading
- `src/components/tasks/AddTaskModal.tsx` — Save button uses `var(--gradient-primary)` with a purple glow (`0 4px 12px rgba(124, 58, 237, 0.22)`). Disabled state now uses neutral `--bg-surface-3` instead of a half-opaque primary which read as broken. Title weight 700, no serif
- `src/components/ui/AuthForm.tsx` — submit button uses `var(--gradient-primary)` with the same purple glow. Titles dropped serif and went to weight 700 with tighter tracking. Disabled state uses neutral `--bg-surface-3`
- `src/components/ui/BottomNav.tsx` — active state mirrors UX_1: primary-color text + icon AND `--color-primary-subtle` pill background (the subtle background was removed in an earlier iteration of this session and restored here per UX_1)

i18n:
- `src/messages/pl.json` / `en.json` / `de.json` — added `tasks.entryCount` with proper ICU plural format:
  - `pl`: `"{count, plural, =0 {bez wpisów} =1 {1 wpis} few {# wpisy} many {# wpisów} other {# wpisów}}"`
  - `en`: `"{count, plural, =0 {no entries} =1 {1 entry} other {# entries}}"`
  - `de`: `"{count, plural, =0 {keine Einträge} =1 {1 Eintrag} other {# Einträge}}"`
  - Polish 2/3/4 → `wpisy`, 5+ → `wpisów`, 1 → `wpis`, 0 → `bez wpisów`, all driven by next-intl's plural resolver

---

### 2. Current state of the app

**Visual language now in place (matches UX_1.png):**
- Default theme **Purple Dream**: white background with a fixed soft purple radial-gradient wash anchored at the top-right and a softer wash at the bottom-left. Cards are pure white with a `0 2px 12px rgba(124, 58, 237, 0.08)` shadow. Primary accent is `#7c3aed` with `#a78bfa` for lighter accents. Deep indigo text (`#1e1b4b`)
- All four themes (Purple Dream / Ocean Calm / Forest Focus / Sunset Energy) follow the same architecture and share the same vivid `--cat-*` set (blue / purple / green / red / amber)
- Iconography: lucide monoline icons throughout chrome (nav, buttons, brand, badges) — no UI emojis. Translation strings still contain user-facing emojis the spec requires (✨🔥🎉⭐ in motivational copy etc.) — those are content, not chrome
- Typography: Inter sans throughout, weight 700 with `letter-spacing: -0.022em` on h1/h2/h3 for the modern editorial feel UX_1 uses. `--font-serif` aliased to `--font-sans` so any leftover `var(--font-serif)` references still resolve to Inter
- Soft purple shadows everywhere via `var(--shadow-card)` — adapts per theme
- Gradient design tokens consumed by every primary CTA: `addButton` in Tasks, AuthForm submit, AddTaskModal save — all render `var(--gradient-primary)` with a colored glow

**What works end-to-end on `/tasks`:**
- Authenticated user navigates to `/tasks` via the bottom nav (locale-aware)
- Header: serif-free "Zadania" h1 + circular gradient `+` button with purple glow → opens AddTaskModal
- Tabs (Wszystkie / Aktywne / Ukończone): pill segmented control, active tab has gradient fill + inverse text
- CategoryChips: vertical mini-card row, horizontally scrollable. "Wszystkie" + each user category as a tile-on-top, label-below button. Active chip intensifies the tile colour with a coloured glow
- Active task cards render the **horizontal UX_1 layout**: colored category tile (left), title + category name + translated `entryCount` ("5 wpisów") + category-coloured progress dots (middle), outlined 96px pill button "Zakończ zadanie (+5 pkt)" (right). Clicking complete optimistically marks the task done; the card re-renders as a completed card immediately
- Completed task cards: greyed background, strikethrough title, green "Ukończone ✓" badge with a real `Check` icon, no buttons
- AddTaskModal: bottom-sheet with title input + category chip grid + Cancel/Save buttons. Save uses gradient + purple glow, disabled state uses neutral surface
- Empty states use translated copy inside soft dashed cards

**Bottom nav (mounted in `(main)/layout.tsx`):**
- 5 tabs (Dziś / Zadania / Drzewo / Nagrody / Historia), locale-aware, lucide icons
- Active tab: primary-color text + icon + `--color-primary-subtle` pill background
- Tabs other than `/tasks` still go to blank stub screens

**Auth screens:**
- Login + Register render full-screen `AuthForm` with the gradient submit button + glow, sans-only titles, switch link, password and magic-link tabs on login. Strings still hardcoded Polish (i18n wiring deferred from Session 2)

**Build:**
- `next build` passes (Turbopack, 30 routes, TypeScript clean)
- No lint errors
- All component-level CSS values flow through CSS variables — every visible token is themable except per-row category hexes (which come from the database) and the four colored-glow shadows on CTA buttons (hardcoded `rgba(124, 58, 237, …)` since CSS variables can't compose with `rgba()` alpha values without `color-mix`, which would add complexity)

**Infrastructure still working from earlier sessions:**
- Theme system architecture (CSS variables, `data-theme` attribute, `THEMES` registry, swappability)
- i18n routing (pl default, `/en/...`, `/de/...`)
- Auth (login / register / magic-link / callback / session-refresh proxy)
- RLS policies, default-category seeding on signup, lucide-slug icon system

---

### 3. Not finished / known issues

- **Migration 003 not applied yet.** Until you run it in Supabase, your existing default categories still have whatever colours they had from migration 002 (muted earth tones) or the original 001 seed (bright Tailwind-but-different palette). Category icon tiles will render in those legacy colours, not UX_1's vivid blue/purple/green/red/amber. The chip tiles, the TaskCard category tiles, and the dot colours all read from `category.color` in the DB, so the design only fully matches UX_1 after migration 003 runs
- **Migration sequence dependency.** Migration 003 expects icons to already be lucide slugs (`briefcase`, `book`, `languages`, `heart`, `home`). If migration 002 was never applied, your DB still has emoji icons (`💼` etc.) and 003's UPDATEs will all skip. **Apply 002 first, then 003.** Both are idempotent
- **Today / Tree / Rewards / History / Settings screens are still stubs** — bottom nav is visible on all of them but each tab shows only the nav over a blank background until each screen is built
- **AddEntry bottom-sheet modal not built** — the Today screen depends on it. Should mirror `AddTaskModal` styling
- **Task completion still doesn't award points** — `completeTask` only updates `tasks.is_completed` + `completed_at`. The "+5 pkt" in the button label is informational; wiring `total_points += 5` and the level-up check is deferred (carry-over from Session 3)
- **No celebratory feedback on task completion** — confetti/success overlay isn't wired (carry-over)
- **AuthForm strings still hardcoded Polish** — translation keys exist in `auth` namespace; just need wiring (carry-over from Session 2)
- **Settings screen + theme picker not built** — registry has `swatch`/`swatchInk` ready but the picker UI itself is still Session-13 work per CLAUDE.md's dev order
- **`useTheme` is still localStorage-only** — `user_preferences` Supabase sync deferred to Settings phase
- **Today's "Focus Day" card / target illustration / star count badge** — not built; design language for them lives in UX_1 but no component exists yet
- **CLAUDE.md is back to being the design source of truth** — Session 4's paper/parchment direction is fully superseded. CLAUDE.md still doesn't document the new gradient tokens (`--gradient-bg`, `--gradient-primary`, `--gradient-primary-hover`, `--gradient-accent`) or the body's fixed gradient overlay; updating it is deferred

---

### 4. Exact next step (start of Session 6)

**Apply migrations + build the Today screen.**

1. In Supabase SQL Editor, run **in order**:
   - `supabase/migrations/002_paper_design_categories.sql` (if not already run — converts emoji icons to lucide slugs)
   - `supabase/migrations/003_ux1_category_colors.sql` (sets vivid UX_1 hexes)

   Verify with:
   ```sql
   SELECT name, icon, color FROM categories WHERE user_id = auth.uid();
   ```
   Expected:
   - `Praca / briefcase / #3b82f6`
   - `Nauka / book / #8b5cf6`
   - `Język hiszpański / languages / #10b981`
   - `Zdrowie / heart / #ef4444`
   - `Dom / home / #f59e0b`

2. Build the Today screen per CLAUDE.md §1 (Today section), applying the new design tokens (sans 700 h1, lucide icons, white surfaces, `var(--gradient-primary)` on the CTA, `CategoryIcon` for entry-row icons, category-coloured dots/badges):
   - Implement `entries.service.ts` — verify mappers, add `deleteEntry`
   - Implement `useToday.ts` and `usePoints.ts` hooks
   - Build header row (title + date + star count badge + avatar), Focus Day card (cream bg, two amber pill badges, target illustration placeholder), points cards (today + total with XP bar), section label, daily entries list, "+ Dodaj co dziś zrobiłem" gradient CTA
   - Build the AddEntry bottom-sheet modal (two tabs: from task list / custom entry) — mirror `AddTaskModal`'s style

3. Wire up the points-on-creation flow:
   - Either add an `add_points` SQL RPC migration, or update `user_stats` directly from the client
   - Apply +5 retroactive support to `tasks.completeTask` once the points service is real

---

### 5. Decisions that differ from CLAUDE.md

| Decision | CLAUDE.md spec | What was done | Reason |
|---|---|---|---|
| `--cat-spanish` color | Inconsistent in CLAUDE.md itself: the CSS-variable contract example says `#10b981` (green); the seed-trigger description says `#ec4899` (pink) for "Język hiszpański 🇪🇸" | Settled on `#10b981` (green) for both the CSS variable AND the DB seed (via migration 003) | UX_1.png clearly shows GREEN for Język hiszpański (chat-bubble icon). Picked the green per visual; CLAUDE.md was internally inconsistent so neither value was strictly canonical |
| Heading font | "System font stack" | Inter sans throughout (no serif). `--font-serif` is an alias to `--font-sans` | Modern productivity-app feel; sans-only matches UX_1's bold modern-sans headings (no serif visible). Inter is loaded once via `next/font/google` with `subsets: ['latin', 'latin-ext']` so Polish ą/ć/ł/etc. render correctly. `--font-serif` is kept as an alias so any inline `fontFamily: 'var(--font-serif, serif)'` references still resolve to Inter rather than browser-default Times |
| Body background | Plain `var(--bg-app)` | Plain bg PLUS a fixed `body::before` radial-gradient overlay drawn from `var(--gradient-bg)` per theme | Adds the soft directional wash visible at the top-right of UX_1.png mockups without sacrificing readability or theme-swap discipline. The overlay is `position: fixed`, `z-index: -1`, `pointer-events: none` so it stays anchored to the viewport on scroll and is always behind content |
| Theme registry shape | `preview: '🟣'` (emoji) | `swatch` + `swatchInk` (hex pair) | Carry-over from Session 4: the future Settings theme picker can render a real swatch chip + ink dot instead of an emoji |
| Default category icons + colors | "Praca 💼 #3b82f6, Nauka 📚 #06b6d4, Język hiszpański 🇪🇸 #ec4899, Zdrowie ❤️ #10b981, Dom 🏠 #f59e0b" — emoji icons + a particular bright-Tailwind palette | Lucide slug icons (briefcase / book / languages / heart / home) + UX_1's vivid hexes (#3b82f6 / #8b5cf6 / #10b981 / #ef4444 / #f59e0b) | Lucide icons came in Session 4 ("classic and stylish icons" — direct user request); this session realigns the colors to what UX_1.png actually shows. Migrations 002 (icons + muted Session-4 colors) and 003 (UX_1 colors) compose: small, readable, idempotent. `CategoryIcon` falls back to rendering raw strings as text so the app doesn't break if neither has been applied yet |
| TaskCard layout | "Each task card shows: ... [content] / 'Zakończ zadanie (+5 pkt)' button (right side, purple outlined)" | Implemented horizontal: colored category tile (left, 44×44, soft tint via `color-mix`) → content (title + category + entry-count text + coloured dots) → outlined 96px pill button (right) | Direct match to UX_1.png. Button width was tuned so the existing `Zakończ zadanie (+{points} pkt)` translation wraps naturally to two lines, avoiding the need for a separate translation key per line |
| CategoryChips layout | Not formally specced ("Category filter row (horizontal scroll chips)") | UX_1's vertical mini-card per chip: 44×44 colored rounded-square tile on top, label below in 11px text. Active state intensifies tile background and adds a coloured glow | Direct match to the chip row visible in UX_1.png Tasks screen. Tiles use `color-mix(in oklab, <cat.color> 14%, var(--bg-surface))` at rest and the full category color when selected, so the chip always identifies itself by the category's own colour |
| ProgressDots color | "filled dots for entries made" — implicitly primary | Added optional `color?` prop; falls back to `--color-primary`. TaskCard passes the category color | UX_1 shows entry-count dots in each row's category color — a small but meaningful visual cue that reinforces the category identity at a glance |
| Tabs (segmented control) | Not formally specced | Pill-shaped row with active tab using `var(--gradient-primary, var(--color-primary))` fill + inverse text + soft elevation | Matches the Wszystkie / Aktywne / Ukończone segmented control in UX_1.png — solid filled active state, clearly elevated above the inactive transparent tabs |
| Gradient design tokens | Not in CLAUDE.md | Added `--gradient-bg`, `--gradient-primary`, `--gradient-primary-hover`, `--gradient-accent` per theme + per mode. Components opt-in via `var(--gradient-primary, var(--color-primary))` | Modern UX moments (CTA buttons, body wash, decorative panels) benefit from gradients; isolating them to CSS variables keeps the theme-swap contract clean. Components fall back to the solid colour automatically if a theme doesn't define a gradient — backwards-compatible |
| Migration ordering | Single seed migration | Three sequential migrations (001 schema → 002 lucide icons + Session-4 muted colors → 003 UX_1 colors) | Each migration is small, named for its purpose, and idempotent on re-run. Composition rather than monolith — easier to read, easier to roll forward |

---

## Session 4 — Design System Rework: Paper / Parchment Aesthetic

### 1. Completed in this session

The user started reworking themes mid-session (`purple.css` → "Parchment", `ocean.css` → "Sage" — both already paper-toned in the repo when this session began). I extended that work into a complete design-system rework so the whole app reads as a calm, modern, paper-journal-style ADHD companion instead of a bright-coloured emoji-heavy app.

**New deps:**
- `lucide-react@^1.12` — modern monoline icon library (used by shadcn/ui & most modern apps)

**Files created:**
- `src/components/ui/Icon.tsx` — `CategoryIcon` component that maps category icon slugs (`briefcase`, `book`, `languages`, `heart`, `home`, plus future-friendly extras `sparkles / sprout / pen / coffee / music / dumbbell / brush / code`) to lucide icons. Falls back to rendering the raw string as text if the slug isn't in the map — so legacy emoji data ("💼" etc.) still renders without error during/after migration
- `supabase/migrations/002_paper_design_categories.sql` — migrates the 5 default seeded categories from emoji icons to lucide slugs **and** updates their colors to muted paper-palette hexes; also replaces the `handle_new_user` trigger so new signups get the new defaults. Idempotent: rerun is a no-op for the data UPDATEs (matches by old emoji + name, so user-customised rows are never touched)

**Files modified:**
- `package.json` / `package-lock.json` — `lucide-react` added
- `src/styles/themes/forest.css` — repurposed as **Linen** theme (cream linen + deep moss ink, light & dark)
- `src/styles/themes/sunset.css` — repurposed as **Terracotta** theme (warm clay paper + rust ink, light & dark)
- `src/styles/globals.css` — `:root` defaults updated to the warm parchment palette (matches `purple.css` so SSR before `ThemeProvider` mounts no longer flashes bright purple); added a barely-perceptible double-radial-gradient for paper grain on `body`; declared CSS-variable family hooks (`--font-sans`, `--font-serif`); added `h1/h2/h3` rule to use the serif family
- `src/app/layout.tsx` — added `next/font/google` Inter + Lora and bound them to `--font-sans` and `--font-serif` on `<html>` (with `subsets: ['latin', 'latin-ext']` so Polish diacritics render correctly, and `display: 'swap'`)
- `src/lib/themes.ts` — registry rewritten: themes are now Parchment / Sage / Linen / Terracotta, each with a `swatch` (paper background hex) and `swatchInk` (primary ink hex). Emoji `preview` field replaced with the swatch pair so the future Settings theme picker can render real chips instead of coloured circles
- `src/components/ui/BottomNav.tsx` — emojis replaced with lucide `Sun / ListTodo / CheckSquare / Gift / Calendar` icons (rendered with `strokeWidth={1.6}` inactive, `2` active to give a subtle "press" feel); active state highlights with `--color-primary` text + `--color-primary-subtle` background; long-form border properties throughout to avoid the React shorthand-toggle warning we hit in Session 3
- `src/components/ui/AuthForm.tsx` — ✉️ in success states replaced with a circular `--color-primary-subtle` tile + `Mail` lucide icon; serif font on titles; reduced stroke weight, refined spacing and corner radii (24 → 18, 14 → 10), error block now uses theme tokens (`--color-warning-subtle` + `--color-focus-border`) instead of hardcoded `#ef4444` / `#fef2f2`
- `src/app/[locale]/(auth)/login/page.tsx` and `register/page.tsx` — ⭐ brand emoji replaced with a tinted square tile + `Sprout` lucide icon; brand name now uses the serif family; brand container uses `--color-primary-subtle`
- `src/components/tasks/TaskCard.tsx` — category icon tile no longer fills with the raw category color (which made every card visually loud); instead uses `color-mix(in oklab, <cat.color> 14%, var(--bg-surface))` for a soft paper-tinted background, with the category color reserved for the icon stroke. Title uses serif. Border-radius softened (18 → 14). Complete button now leads with a `Check` lucide icon and the "+5 pkt" label is preserved
- `src/components/tasks/CompletedTaskCard.tsx` — emoji replaced with `CategoryIcon`; "Ukończone ✓" badge gains a real `Check` lucide icon; refined typography
- `src/components/tasks/CategoryChips.tsx` — chips render `CategoryIcon` instead of raw emoji, with thinner border (1.5 → 1), reduced font weight on inactive chips for a calmer scan
- `src/components/tasks/AddTaskModal.tsx` — "✕" close button replaced with the `X` lucide icon; form labels use the new uppercase eyebrow style; inputs use thinner borders and softer radii; category picker chips render via `CategoryIcon`
- `src/components/tasks/TasksClient.tsx` — `+` button now contains a `Plus` lucide icon; serif h1; section labels use uppercase eyebrow style; transparent page background so the body's paper texture shows through
- `src/components/tasks/Tabs.tsx` — slightly smaller, lighter font weight, `--shadow-card` on the active tab instead of a hardcoded shadow
- `src/components/tasks/ProgressDots.tsx` — dots reduced from 8px to 7px and use long-form border properties

---

### 2. Current state of the app

**Visual language now in place:**
- **Default theme (Parchment):** warm ivory background (#faf8f3) with sepia ink (#2a1a0c) and cocoa primary (#8b5a2b). All four themes (Parchment / Sage / Linen / Terracotta) are paper variants — they differ only in ink color, not in surface character, so the app is coherent regardless of which the user picks
- **Subtle paper grain** on `body` via two stacked radial-gradients (1.8% and 1.2% black noise) — invisible at a glance, gives surfaces a tactile feel
- **Typography:** Lora serif for h1/h2/h3 and prominent labels (e.g. task titles), Inter sans for body and chrome. Both loaded via `next/font/google` with `subsets: ['latin', 'latin-ext']` so Polish ą/ć/ł/etc. render correctly. Uppercase tracked eyebrows replace bold sans labels in many places
- **Iconography:** chrome and category icons are lucide monoline strokes (1.6–2px) — no more emojis in nav, buttons, success states, brand, or category tiles. Translation strings still contain the user-facing emojis the spec requires (✨🔥🎉⭐ in motivational copy etc.) — those are content, not UI chrome
- **Refined corners and shadows:** card radii dropped from 18–24 → 12–14; pill chips kept at 999; modal handle / sheet refined; soft warm-toned shadows (`rgba(44, 26, 14, 0.07)` on light) instead of pillowy purple ones
- **No hardcoded hex values added** in any new component — everything uses CSS variables. The only non-variable colors are per-row category hexes from the DB (which the migration now sets to muted earth tones), and the body's grain noise (which is meant to be theme-independent)

**Build:**
- `next build` passes (Turbopack, 30 routes, TypeScript clean)
- No lint errors

**Database migration NOT yet run:** `supabase/migrations/002_paper_design_categories.sql` has been written but you'll need to apply it in your Supabase project (paste into SQL Editor or `supabase db push` if you're using the CLI). Until you do, your existing default categories will keep their emoji `icon` strings — `<CategoryIcon />` falls back to rendering the emoji as text, so the app works either way; it just looks more cohesive after the migration

---

### 3. Not finished / known issues

- **Migration 002 not auto-applied** — see above. After applying, the 5 default categories that were seeded with emojis on signup will switch to lucide-rendered icons and muted earth-tone colors
- **CLAUDE.md still describes the old design system** (Purple Dream / Ocean Calm theme names, emoji-based category icons, "💼" / "📚" seed values, `--color-primary: #7c3aed` example, "Star emoji (⭐) for points" guidance, etc.). Updating CLAUDE.md to reflect the paper aesthetic is deferred — the source of truth for the design system is now the theme files, the `Icon.tsx` slug map, and migration 002. Future sessions implementing Today / Tree / Rewards / History should read both this PROGRESS entry and CLAUDE.md and prefer the design tokens shown here when they conflict
- **Settings screen theme picker not built** — registry now has `swatch` / `swatchInk` ready for it, but the picker UI itself is still Session-13 work per CLAUDE.md's dev order
- **Reward / focus-day icons not yet selected** — when those screens are built, they'll need lucide icons too. Suggestions live in `Icon.tsx` (`Sprout` for tree, `Gift` for rewards, etc., already imported in BottomNav). Translation strings for those screens still contain emojis (🎉🌙💜) — same content-vs-chrome distinction
- **Carry-over from Session 3:** task completion still doesn't award points; bottom nav goes to blank stubs for `/today / /tree / /rewards / /history / /settings`; AuthForm strings still hardcoded Polish (i18n wiring deferred)

---

### 4. Exact next step (start of Session 5)

**Apply migration 002 + build the Today screen.**

1. In Supabase SQL Editor, run `supabase/migrations/002_paper_design_categories.sql` to update existing default categories and the seed function. Verify: `SELECT name, icon, color FROM categories WHERE user_id = auth.uid();` should return `briefcase / #4a6a8c`, `book / #6a5a82`, etc.
2. Build the Today screen per CLAUDE.md §1, applying the new design tokens (serif h1, lucide icons, paper backgrounds, `CategoryIcon` for category icons in entry rows). The Add-Entry bottom-sheet modal should mirror `AddTaskModal`'s style.
3. Wire up the points-on-creation flow (was deferred in Session 3 — pick either an `add_points` SQL RPC migration or direct `user_stats` UPDATE from the client).

---

### 5. Decisions that differ from CLAUDE.md

| Decision | CLAUDE.md spec | What was done | Reason |
|---|---|---|---|
| Default theme palette | Purple Dream (`#7c3aed` primary, white background) | Parchment (warm ivory background, cocoa primary `#8b5a2b`) | User explicitly requested "light brown / beige colors, structure of older paper" and "less chaotic". Bright purple did not match. CLAUDE.md is being treated as superseded by the user's new design direction; theme system architecture (CSS variables, `data-theme` attribute, `THEMES` registry, swappability) is preserved unchanged so all existing components keep working |
| All four themes | Purple / Ocean / Forest / Sunset (each its own loud color) | Parchment / Sage / Linen / Terracotta — all paper variants, just with different ink colors | Coherent aesthetic across theme choices: switching theme changes the ink color, not the visual genre. The user can still pick a "favourite" without the app suddenly becoming a different product |
| Category icons | Emoji strings stored in `categories.icon` (💼📚🇪🇸❤️🏠) | Lucide slug strings (`briefcase`/`book`/`languages`/`heart`/`home`); migration 002 backfills existing default rows; `<CategoryIcon />` falls back to rendering raw string as text so user-created emoji icons still work | "Instead of emojis implement classic and stylish icons" — direct user request. Backwards compatibility kept so the app doesn't break before the migration is applied |
| UI chrome icons (nav, buttons, badges, brand) | Emojis (☀️ ✅ 🌳 🎁 📅 ⭐ ✉️ ✕) | Lucide monoline icons (`Sun`, `ListTodo`, `CheckSquare`, `Gift`, `Calendar`, `Sprout`, `Mail`, `X`, `Plus`, `Check`) | Modern UI trend for chrome icons; user's "modern and matching actual trends" brief. Emojis in *content* translation strings (motivational copy etc.) are kept since they're user-facing language, not chrome |
| Typography | "System font stack" | System sans for body + Lora serif for headings via `next/font/google` | Adds the "older paper" feel without sacrificing readability or shipping a heavy font payload. Both fonts have `latin-ext` subsets for Polish diacritics; both are `display: 'swap'` |
| Theme registry shape | `preview: '🟣'` (emoji) | `swatch` + `swatchInk` (hex pair) | Emoji preview made no sense once the themes themselves became emoji-free. Hex pair lets the future Settings theme picker render a real swatch + ink dot |
| `:root` CSS defaults | Hardcoded Purple Dream values | Hardcoded Parchment values | Same hardcoded-fallback pattern as before; just updated to match the new default. Avoids a flash of bright-purple on first paint before `ThemeProvider` runs |

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
