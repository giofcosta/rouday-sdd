#!/bin/bash
# Initialize database for Routine App after Docker containers are up
# Run this script after `docker-compose up -d`

set -e

echo "Waiting for database to be ready..."
until docker exec routine-db pg_isready -U postgres -h localhost > /dev/null 2>&1; do
  echo "Database not ready, waiting..."
  sleep 2
done
echo "Database is ready!"

echo ""
echo "Configuring database roles..."
docker exec routine-db psql -U postgres -c "
  ALTER ROLE supabase_auth_admin WITH LOGIN PASSWORD 'postgres';
  ALTER ROLE authenticator WITH LOGIN PASSWORD 'postgres';
  ALTER ROLE supabase_admin WITH LOGIN PASSWORD 'postgres';
"

echo ""
echo "Creating auth schema..."
docker exec routine-db psql -U postgres -c "
  CREATE SCHEMA IF NOT EXISTS auth;
  GRANT ALL ON SCHEMA auth TO supabase_auth_admin;
  GRANT ALL ON SCHEMA public TO supabase_auth_admin;
  GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated, service_role;
"

echo ""
echo "Waiting for auth service to apply migrations..."
sleep 10

echo ""
echo "Applying app database migrations..."

# Apply user_settings migration
docker exec -i routine-db psql -U postgres << 'EOF'
-- User Settings Table
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  theme TEXT NOT NULL DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  notifications_enabled BOOLEAN NOT NULL DEFAULT true,
  week_start_day INTEGER NOT NULL DEFAULT 0 CHECK (week_start_day >= 0 AND week_start_day <= 6),
  timezone TEXT NOT NULL DEFAULT 'UTC',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS user_settings_updated_at ON user_settings;
CREATE TRIGGER user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

GRANT SELECT, INSERT, UPDATE ON user_settings TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON user_settings TO service_role;
EOF

# Apply routines migration
docker exec -i routine-db psql -U postgres << 'EOF'
-- Routines Table
CREATE TABLE IF NOT EXISTS routines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL CHECK (length(title) > 0 AND length(title) <= 100),
  target_days_per_week INTEGER NOT NULL CHECK (target_days_per_week >= 1 AND target_days_per_week <= 7),
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_routines_user_id ON routines(user_id);

DROP TRIGGER IF EXISTS routines_updated_at ON routines;
CREATE TRIGGER routines_updated_at
  BEFORE UPDATE ON routines
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

GRANT SELECT, INSERT, UPDATE, DELETE ON routines TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON routines TO service_role;
EOF

# Apply weekly_data migration
docker exec -i routine-db psql -U postgres << 'EOF'
-- Weekly Data Table
CREATE TABLE IF NOT EXISTS weekly_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  routine_id UUID NOT NULL REFERENCES routines(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  completed_days JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(routine_id, week_start)
);

CREATE INDEX IF NOT EXISTS idx_weekly_data_user_id ON weekly_data(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_data_routine_week ON weekly_data(routine_id, week_start);

DROP TRIGGER IF EXISTS weekly_data_updated_at ON weekly_data;
CREATE TRIGGER weekly_data_updated_at
  BEFORE UPDATE ON weekly_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

GRANT SELECT, INSERT, UPDATE, DELETE ON weekly_data TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON weekly_data TO service_role;
EOF

# Apply RLS policies
docker exec -i routine-db psql -U postgres << 'EOF'
-- Enable RLS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_data ENABLE ROW LEVEL SECURITY;

-- User Settings Policies
DROP POLICY IF EXISTS "Users can view own settings" ON user_settings;
CREATE POLICY "Users can view own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own settings" ON user_settings;
CREATE POLICY "Users can insert own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own settings" ON user_settings;
CREATE POLICY "Users can update own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- Routines Policies
DROP POLICY IF EXISTS "Users can view own routines" ON routines;
CREATE POLICY "Users can view own routines" ON routines
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own routines" ON routines;
CREATE POLICY "Users can insert own routines" ON routines
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own routines" ON routines;
CREATE POLICY "Users can update own routines" ON routines
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own routines" ON routines;
CREATE POLICY "Users can delete own routines" ON routines
  FOR DELETE USING (auth.uid() = user_id);

-- Weekly Data Policies
DROP POLICY IF EXISTS "Users can view own weekly data" ON weekly_data;
CREATE POLICY "Users can view own weekly data" ON weekly_data
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own weekly data" ON weekly_data;
CREATE POLICY "Users can insert own weekly data" ON weekly_data
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own weekly data" ON weekly_data;
CREATE POLICY "Users can update own weekly data" ON weekly_data
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own weekly data" ON weekly_data;
CREATE POLICY "Users can delete own weekly data" ON weekly_data
  FOR DELETE USING (auth.uid() = user_id);
EOF

echo ""
echo "✅ Database initialization complete!"
echo ""
echo "Services running:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""
echo "Next steps:"
echo "1. Copy environment file: cp .env.local.docker .env.local"
echo "2. Start the app: npm run dev"
echo "3. Open http://localhost:3000"
