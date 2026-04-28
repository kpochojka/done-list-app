-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.categories (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES auth.users NOT NULL,
  name        text NOT NULL,
  icon        text NOT NULL,
  color       text NOT NULL,
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tasks (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid REFERENCES auth.users NOT NULL,
  category_id   uuid REFERENCES public.categories NOT NULL,
  title         text NOT NULL,
  is_completed  boolean DEFAULT false,
  completed_at  timestamptz,
  created_at    timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.daily_entries (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid REFERENCES auth.users NOT NULL,
  task_id       uuid REFERENCES public.tasks,
  category_id   uuid REFERENCES public.categories NOT NULL,
  title         text NOT NULL,
  points        integer DEFAULT 1,
  is_focus      boolean DEFAULT false,
  date          date NOT NULL,
  created_at    timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.focus_days (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid REFERENCES auth.users NOT NULL,
  date          date NOT NULL,
  category_id   uuid REFERENCES public.categories NOT NULL,
  task_id       uuid REFERENCES public.tasks,
  custom_title  text,
  is_completed  boolean DEFAULT false,
  completed_at  timestamptz,
  UNIQUE(user_id, date)
);

CREATE TABLE IF NOT EXISTS public.rewards (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid REFERENCES auth.users NOT NULL,
  title           text NOT NULL,
  description     text,
  required_level  integer NOT NULL,
  image_url       text,
  is_claimed      boolean DEFAULT false,
  claimed_at      timestamptz,
  created_at      timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_stats (
  user_id         uuid PRIMARY KEY REFERENCES auth.users,
  total_points    integer DEFAULT 0,
  current_level   integer DEFAULT 1,
  updated_at      timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id     uuid PRIMARY KEY REFERENCES auth.users,
  theme       text DEFAULT 'purple',
  theme_mode  text DEFAULT 'system',
  locale      text DEFAULT 'pl',
  updated_at  timestamptz DEFAULT now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.categories       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_entries    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_days       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- categories
CREATE POLICY "Users can view own categories"
  ON public.categories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own categories"
  ON public.categories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories"
  ON public.categories FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories"
  ON public.categories FOR DELETE
  USING (auth.uid() = user_id);

-- tasks
CREATE POLICY "Users can view own tasks"
  ON public.tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks"
  ON public.tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
  ON public.tasks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
  ON public.tasks FOR DELETE
  USING (auth.uid() = user_id);

-- daily_entries
CREATE POLICY "Users can view own daily entries"
  ON public.daily_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily entries"
  ON public.daily_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily entries"
  ON public.daily_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own daily entries"
  ON public.daily_entries FOR DELETE
  USING (auth.uid() = user_id);

-- focus_days
CREATE POLICY "Users can view own focus days"
  ON public.focus_days FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own focus days"
  ON public.focus_days FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own focus days"
  ON public.focus_days FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own focus days"
  ON public.focus_days FOR DELETE
  USING (auth.uid() = user_id);

-- rewards
CREATE POLICY "Users can view own rewards"
  ON public.rewards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own rewards"
  ON public.rewards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own rewards"
  ON public.rewards FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own rewards"
  ON public.rewards FOR DELETE
  USING (auth.uid() = user_id);

-- user_stats
CREATE POLICY "Users can view own stats"
  ON public.user_stats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own stats"
  ON public.user_stats FOR UPDATE
  USING (auth.uid() = user_id);

-- user_preferences
CREATE POLICY "Users can view own preferences"
  ON public.user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON public.user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON public.user_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================
-- SEED FUNCTION: default categories + stats + prefs on signup
-- ============================================================

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
    (NEW.id, 'Praca',              '💼', '#3b82f6'),
    (NEW.id, 'Nauka',              '📚', '#06b6d4'),
    (NEW.id, 'Język hiszpański',   '🇪🇸', '#ec4899'),
    (NEW.id, 'Zdrowie',            '❤️',  '#10b981'),
    (NEW.id, 'Dom',                '🏠', '#f59e0b');

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
