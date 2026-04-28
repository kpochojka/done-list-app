-- ============================================================
-- Migration 002 — Default category icons & colors aligned with
-- the paper / parchment design system.
--
-- Rationale:
-- - Original seed used emoji icons (💼📚🇪🇸❤️🏠) and bright Tailwind
--   primary colors (#3b82f6, #06b6d4 …). The redesign replaces UI
--   emojis with lucide icons (rendered from a slug stored in the
--   `icon` column) and tones the palette down to muted ink colors
--   that sit naturally on the parchment background.
--
-- - Existing default category rows are updated in-place by exact
--   name + emoji match so user-customised categories are NOT
--   touched.
-- - The `handle_new_user` trigger function is replaced so new
--   signups get the new icons and colors out of the box.
--
-- Idempotent: running this twice is a no-op for the data UPDATEs
-- (the second run finds zero matching emoji rows). The function
-- replacement is idempotent by definition.
-- ============================================================

UPDATE public.categories
SET icon = 'briefcase', color = '#4a6a8c'
WHERE name = 'Praca' AND icon = '💼';

UPDATE public.categories
SET icon = 'book', color = '#6a5a82'
WHERE name = 'Nauka' AND icon = '📚';

UPDATE public.categories
SET icon = 'languages', color = '#a04c28'
WHERE name = 'Język hiszpański' AND icon = '🇪🇸';

UPDATE public.categories
SET icon = 'heart', color = '#5a7a48'
WHERE name = 'Zdrowie' AND icon = '❤️';

UPDATE public.categories
SET icon = 'home', color = '#8c6a2a'
WHERE name = 'Dom' AND icon = '🏠';

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
    (NEW.id, 'Praca',              'briefcase', '#4a6a8c'),
    (NEW.id, 'Nauka',              'book',      '#6a5a82'),
    (NEW.id, 'Język hiszpański',   'languages', '#a04c28'),
    (NEW.id, 'Zdrowie',            'heart',     '#5a7a48'),
    (NEW.id, 'Dom',                'home',      '#8c6a2a');

  RETURN NEW;
END;
$$;
