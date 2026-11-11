-- ====================================================================
-- CAREERFORGE AI — SUPABASE POSTGRESQL DATABASE SCHEMA
-- ====================================================================

-- 1. USER PROFILES TABLE (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  career_goal TEXT DEFAULT 'Data Analyst',
  readiness_score INT DEFAULT 68,
  active_streak_days INT DEFAULT 7,
  total_xp INT DEFAULT 1450,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Trigger to automatically create a user_profile row on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 2. USER TOPIC PROGRESS TABLE (Tracks progress along Snake Path)
CREATE TABLE IF NOT EXISTS public.user_topic_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL,
  skill_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('LOCKED', 'STUDY_PREPARATION', 'UNLOCKED_TEST', 'FAILED_RETEST', 'PASSED', 'MASTERED', 'PASSED_DIAGNOSTIC')),
  score_percentage INT DEFAULT 0,
  cooldown_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, topic_id)
);

-- Enable RLS on user_topic_progress
ALTER TABLE public.user_topic_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own topic progress"
  ON public.user_topic_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own topic progress"
  ON public.user_topic_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own topic progress"
  ON public.user_topic_progress FOR UPDATE
  USING (auth.uid() = user_id);


-- 3. ASSESSMENT ATTEMPTS TABLE (Audit log of diagnostic and formal retests)
CREATE TABLE IF NOT EXISTS public.assessment_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL,
  attempt_type TEXT NOT NULL CHECK (attempt_type IN ('DIAGNOSTIC', 'FORMAL_TEST', 'RETEST')),
  score_percentage INT NOT NULL,
  passed BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on assessment_attempts
ALTER TABLE public.assessment_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own assessment attempts"
  ON public.assessment_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own assessment attempts"
  ON public.assessment_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);
