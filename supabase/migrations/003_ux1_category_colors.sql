-- ============================================================
-- Migration 003 — Default category colors aligned with UX_1.png.
--
-- Rationale:
-- - The user has chosen to implement the UX_1 design exactly.
--   UX_1 shows vivid Tailwind-style category accents:
--     • Praca (briefcase)         → #3b82f6 (blue)
--     • Nauka (book)              → #8b5cf6 (purple)
--     • Język hiszpański          → #10b981 (green)
--     • Zdrowie (heart)           → #ef4444 (red)
--     • Dom (home)                → #f59e0b (amber)
--
-- - This rolls back the muted earth-tone colors set in
--   migration 002 for the SAME 5 default-seeded category rows
--   only. We match by name + lucide icon slug (set by 002) so
--   user-customised categories are NEVER touched.
--
-- - The handle_new_user trigger function is replaced so brand
--   new signups receive the UX_1 color set out of the box.
--
-- Idempotency: re-running this migration is a no-op for the
-- data UPDATEs (the WHERE clause finds the new colors and
-- skips). The function replacement is idempotent by definition.
-- ============================================================

UPDATE public.categories
SET color = '#3b82f6'
WHERE name = 'Praca' AND icon = 'briefcase' AND color <> '#3b82f6';

UPDATE public.categories
SET color = '#8b5cf6'
WHERE name = 'Nauka' AND icon = 'book' AND color <> '#8b5cf6';

UPDATE public.categories
SET color = '#10b981'
WHERE name = 'Język hiszpański' AND icon = 'languages' AND color <> '#10b981';

UPDATE public.categories
SET color = '#ef4444'
WHERE name = 'Zdrowie' AND icon = 'heart' AND color <> '#ef4444';

UPDATE public.categories
SET color = '#f59e0b'
WHERE name = 'Dom' AND icon = 'home' AND color <> '#f59e0b';

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id);

  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);

  INSERT INTO public.categories (user_id, name, icon, color) VALUES
    (NEW.id, 'Praca',              'briefcase', '#3b82f6'),
    (NEW.id, 'Nauka',              'book',      '#8b5cf6'),
    (NEW.id, 'Język hiszpański',   'languages', '#10b981'),
    (NEW.id, 'Zdrowie',            'heart',     '#ef4444'),
    (NEW.id, 'Dom',                'home',      '#f59e0b');

  RETURN NEW;
END;
$$;
