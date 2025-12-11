-- Migration: 004_rls_policies.sql
-- Row Level Security policies for all tables

-- Enable RLS on all tables
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_data ENABLE ROW LEVEL SECURITY;

-- ========================================
-- User Settings Policies
-- ========================================

-- Users can view only their own settings
DROP POLICY IF EXISTS "Users can view own settings" ON user_settings;
CREATE POLICY "Users can view own settings"
  ON user_settings FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert only their own settings
DROP POLICY IF EXISTS "Users can insert own settings" ON user_settings;
CREATE POLICY "Users can insert own settings"
  ON user_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update only their own settings
DROP POLICY IF EXISTS "Users can update own settings" ON user_settings;
CREATE POLICY "Users can update own settings"
  ON user_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- ========================================
-- Routines Policies
-- ========================================

-- Users can view only their own routines
DROP POLICY IF EXISTS "Users can view own routines" ON routines;
CREATE POLICY "Users can view own routines"
  ON routines FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert only their own routines
DROP POLICY IF EXISTS "Users can insert own routines" ON routines;
CREATE POLICY "Users can insert own routines"
  ON routines FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update only their own routines
DROP POLICY IF EXISTS "Users can update own routines" ON routines;
CREATE POLICY "Users can update own routines"
  ON routines FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete only their own routines
DROP POLICY IF EXISTS "Users can delete own routines" ON routines;
CREATE POLICY "Users can delete own routines"
  ON routines FOR DELETE
  USING (auth.uid() = user_id);

-- ========================================
-- Weekly Data Policies
-- ========================================

-- Users can view weekly data for their own routines
DROP POLICY IF EXISTS "Users can view own weekly data" ON weekly_data;
CREATE POLICY "Users can view own weekly data"
  ON weekly_data FOR SELECT
  USING (
    routine_id IN (
      SELECT id FROM routines WHERE user_id = auth.uid()
    )
  );

-- Users can insert weekly data for their own routines
DROP POLICY IF EXISTS "Users can insert own weekly data" ON weekly_data;
CREATE POLICY "Users can insert own weekly data"
  ON weekly_data FOR INSERT
  WITH CHECK (
    routine_id IN (
      SELECT id FROM routines WHERE user_id = auth.uid()
    )
  );

-- Users can update weekly data for their own routines
DROP POLICY IF EXISTS "Users can update own weekly data" ON weekly_data;
CREATE POLICY "Users can update own weekly data"
  ON weekly_data FOR UPDATE
  USING (
    routine_id IN (
      SELECT id FROM routines WHERE user_id = auth.uid()
    )
  );

-- Users can delete weekly data for their own routines
DROP POLICY IF EXISTS "Users can delete own weekly data" ON weekly_data;
CREATE POLICY "Users can delete own weekly data"
  ON weekly_data FOR DELETE
  USING (
    routine_id IN (
      SELECT id FROM routines WHERE user_id = auth.uid()
    )
  );
