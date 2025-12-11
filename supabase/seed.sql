-- Seed data for development
-- Run this after migrations to populate test data

-- Note: This assumes a test user exists with a specific UUID
-- In real usage, replace 'TEST_USER_UUID' with an actual auth.users id

-- Insert sample user settings (for testing without auth)
-- INSERT INTO user_settings (user_id, available_days, work_days, work_hours_day, timezone)
-- VALUES ('TEST_USER_UUID', 7, 5, 8, 'America/New_York');

-- Sample routines (uncomment and adjust user_id for testing)
-- INSERT INTO routines (user_id, name, daily_average, comments, sort_order)
-- VALUES 
--   ('TEST_USER_UUID', 'Morning Exercise', 2, '30 minutes cardio + stretching', 1),
--   ('TEST_USER_UUID', 'Deep Work', 4, 'Focus time for coding', 2),
--   ('TEST_USER_UUID', 'Reading', 1, 'Technical books or articles', 3),
--   ('TEST_USER_UUID', 'Language Learning', 1, 'Duolingo or conversation practice', 4);

-- Sample weekly data (uncomment and adjust routine_id for testing)
-- INSERT INTO weekly_data (routine_id, week_start, monday, tuesday, wednesday, thursday, friday, saturday, sunday)
-- VALUES 
--   ('ROUTINE_ID_1', '2025-12-01', 2, 2, 1, 2, 2, 0, 0),
--   ('ROUTINE_ID_2', '2025-12-01', 4, 3, 4, 4, 3, 0, 0),
--   ('ROUTINE_ID_3', '2025-12-01', 1, 1, 1, 0, 1, 1, 1),
--   ('ROUTINE_ID_4', '2025-12-01', 1, 1, 1, 1, 1, 0, 0);

-- This file is intentionally mostly commented out.
-- After creating a test user via Supabase Auth, uncomment and update the UUIDs.
