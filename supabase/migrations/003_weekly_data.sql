-- Migration: 003_weekly_data.sql
-- Weekly Data table for tracking daily points per routine per week

CREATE TABLE IF NOT EXISTS weekly_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  routine_id UUID NOT NULL REFERENCES routines(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  monday INTEGER NOT NULL DEFAULT 0 CHECK (monday >= 0),
  tuesday INTEGER NOT NULL DEFAULT 0 CHECK (tuesday >= 0),
  wednesday INTEGER NOT NULL DEFAULT 0 CHECK (wednesday >= 0),
  thursday INTEGER NOT NULL DEFAULT 0 CHECK (thursday >= 0),
  friday INTEGER NOT NULL DEFAULT 0 CHECK (friday >= 0),
  saturday INTEGER NOT NULL DEFAULT 0 CHECK (saturday >= 0),
  sunday INTEGER NOT NULL DEFAULT 0 CHECK (sunday >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT weekly_data_routine_week_unique UNIQUE (routine_id, week_start)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_weekly_data_routine_id ON weekly_data(routine_id);
CREATE INDEX IF NOT EXISTS idx_weekly_data_week_start ON weekly_data(week_start);

-- Apply updated_at trigger
DROP TRIGGER IF EXISTS weekly_data_updated_at ON weekly_data;
CREATE TRIGGER weekly_data_updated_at
  BEFORE UPDATE ON weekly_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
