-- Migration: 001_user_settings.sql
-- User Settings table for storing user configuration

CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,  -- FK to auth.users added after GoTrue creates auth tables
  available_days INTEGER NOT NULL DEFAULT 7 CHECK (available_days BETWEEN 1 AND 7),
  work_days INTEGER NOT NULL DEFAULT 5 CHECK (work_days BETWEEN 1 AND 7),
  work_hours_day INTEGER NOT NULL DEFAULT 8 CHECK (work_hours_day BETWEEN 1 AND 24),
  timezone TEXT NOT NULL DEFAULT 'UTC',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT work_days_lte_available CHECK (work_days <= available_days),
  CONSTRAINT user_settings_user_id_unique UNIQUE (user_id)
);

-- Create index for user lookups
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

-- Updated_at trigger function (shared by all tables)
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to user_settings
DROP TRIGGER IF EXISTS user_settings_updated_at ON user_settings;
CREATE TRIGGER user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Grant permissions
GRANT ALL ON user_settings TO authenticated;
GRANT SELECT ON user_settings TO anon;
