-- Migration: 002_routines.sql
-- Routines table for storing user-defined tasks

CREATE TABLE IF NOT EXISTS routines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  daily_average INTEGER NOT NULL CHECK (daily_average > 0),
  comments TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT routines_user_name_unique UNIQUE (user_id, name)
);

-- Create index for user lookups
CREATE INDEX IF NOT EXISTS idx_routines_user_id ON routines(user_id);

-- Apply updated_at trigger
DROP TRIGGER IF EXISTS routines_updated_at ON routines;
CREATE TRIGGER routines_updated_at
  BEFORE UPDATE ON routines
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
