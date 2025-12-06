# Data Model: Routine App

**Feature**: 001-routine-app  
**Date**: 2025-12-05  
**Database**: PostgreSQL (via Supabase)

---

## Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     users       │       │    routines     │       │  weekly_data    │
│  (Supabase)     │       │                 │       │                 │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (uuid) PK    │──┐    │ id (uuid) PK    │──┐    │ id (uuid) PK    │
│ email           │  │    │ user_id FK      │  │    │ routine_id FK   │
│ created_at      │  └───<│ name            │  └───<│ week_start      │
│                 │       │ daily_average   │       │ monday          │
└─────────────────┘       │ comments        │       │ tuesday         │
         │                │ sort_order      │       │ wednesday       │
         │                │ created_at      │       │ thursday        │
         │                │ updated_at      │       │ friday          │
         │                └─────────────────┘       │ saturday        │
         │                                          │ sunday          │
         │                ┌─────────────────┐       │ created_at      │
         │                │ user_settings   │       │ updated_at      │
         │                ├─────────────────┤       └─────────────────┘
         └───────────────>│ id (uuid) PK    │
                          │ user_id FK UQ   │
                          │ available_days  │
                          │ work_days       │
                          │ work_hours_day  │
                          │ timezone        │
                          │ created_at      │
                          │ updated_at      │
                          └─────────────────┘
```

---

## Entities

### 1. Users (Supabase Auth)

Managed by Supabase Auth. Extended via `user_settings` table.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | uuid | PK | Supabase auth user ID |
| email | string | unique, not null | User email |
| created_at | timestamp | not null | Account creation time |

### 2. User Settings

User configuration that persists across weekly resets.

| Field | Type | Constraints | Default | Description |
|-------|------|-------------|---------|-------------|
| id | uuid | PK | gen_random_uuid() | Primary key |
| user_id | uuid | FK → users.id, unique, not null | - | Owner reference |
| available_days | integer | 1-7, not null | 7 | Days available per week (AD) |
| work_days | integer | 1-7, ≤ available_days, not null | 5 | Work days per week (WD) |
| work_hours_day | integer | 1-24, not null | 8 | Work hours per day (WHD) |
| timezone | string | not null | 'UTC' | User timezone for weekly reset |
| created_at | timestamp | not null | now() | Record creation time |
| updated_at | timestamp | not null | now() | Last update time |

**Validation Rules**:
- `work_days` must be ≤ `available_days`
- `work_hours_day` must be between 1 and 24
- `available_days` must be between 1 and 7

### 3. Routines

User-defined tasks to track weekly.

| Field | Type | Constraints | Default | Description |
|-------|------|-------------|---------|-------------|
| id | uuid | PK | gen_random_uuid() | Primary key |
| user_id | uuid | FK → users.id, not null | - | Owner reference |
| name | string(100) | not null | - | Routine name |
| daily_average | integer | > 0, not null | - | Available points per day (AP) |
| comments | text | nullable | null | Optional notes |
| sort_order | integer | not null | 0 | Display order in table |
| created_at | timestamp | not null | now() | Record creation time |
| updated_at | timestamp | not null | now() | Last update time |

**Validation Rules**:
- `name` is required, max 100 characters
- `daily_average` is required, must be positive integer
- Unique constraint on (`user_id`, `name`) - no duplicate routine names per user

### 4. Weekly Data

Points tracked per routine per week. Resets each Monday.

| Field | Type | Constraints | Default | Description |
|-------|------|-------------|---------|-------------|
| id | uuid | PK | gen_random_uuid() | Primary key |
| routine_id | uuid | FK → routines.id, not null | - | Routine reference |
| week_start | date | not null | - | Monday of the week (ISO week) |
| monday | integer | ≥ 0, not null | 0 | Points for Monday |
| tuesday | integer | ≥ 0, not null | 0 | Points for Tuesday |
| wednesday | integer | ≥ 0, not null | 0 | Points for Wednesday |
| thursday | integer | ≥ 0, not null | 0 | Points for Thursday |
| friday | integer | ≥ 0, not null | 0 | Points for Friday |
| saturday | integer | ≥ 0, not null | 0 | Points for Saturday |
| sunday | integer | ≥ 0, not null | 0 | Points for Sunday |
| created_at | timestamp | not null | now() | Record creation time |
| updated_at | timestamp | not null | now() | Last update time |

**Validation Rules**:
- All day values must be ≥ 0
- Unique constraint on (`routine_id`, `week_start`) - one record per routine per week
- `week_start` must be a Monday

---

## Derived/Calculated Fields (Client-Side)

These are NOT stored in the database - calculated on the fly.

| Field | Formula | Description |
|-------|---------|-------------|
| APW (Week Target) | `daily_average × work_days` | Target points for the week |
| WR (Week Results) | `monday + tuesday + ... + sunday` | Total points achieved |
| Off Hours Daily | `24 - work_hours_day` | Non-work hours per day |
| Available Work Hours Week | `work_hours_day × work_days` | Total work hours per week |
| Hours Left | `SUM(daily_average) - SUM(APW)` | Remaining capacity |
| Median Work per Available Day | `SUM(APW) / available_days` | Average daily target |

---

## Database Schema (SQL)

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Settings table
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  available_days INTEGER NOT NULL DEFAULT 7 CHECK (available_days BETWEEN 1 AND 7),
  work_days INTEGER NOT NULL DEFAULT 5 CHECK (work_days BETWEEN 1 AND 7),
  work_hours_day INTEGER NOT NULL DEFAULT 8 CHECK (work_hours_day BETWEEN 1 AND 24),
  timezone TEXT NOT NULL DEFAULT 'UTC',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT work_days_lte_available CHECK (work_days <= available_days),
  CONSTRAINT user_settings_user_id_unique UNIQUE (user_id)
);

-- Routines table
CREATE TABLE routines (
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

-- Weekly Data table
CREATE TABLE weekly_data (
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

-- Indexes for performance
CREATE INDEX idx_routines_user_id ON routines(user_id);
CREATE INDEX idx_weekly_data_routine_id ON weekly_data(routine_id);
CREATE INDEX idx_weekly_data_week_start ON weekly_data(week_start);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables
CREATE TRIGGER user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER routines_updated_at
  BEFORE UPDATE ON routines
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER weekly_data_updated_at
  BEFORE UPDATE ON weekly_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## Row Level Security (RLS) Policies

```sql
-- Enable RLS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_data ENABLE ROW LEVEL SECURITY;

-- User Settings: Users can only access their own settings
CREATE POLICY "Users can view own settings"
  ON user_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON user_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON user_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- Routines: Users can only CRUD their own routines
CREATE POLICY "Users can view own routines"
  ON routines FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own routines"
  ON routines FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own routines"
  ON routines FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own routines"
  ON routines FOR DELETE
  USING (auth.uid() = user_id);

-- Weekly Data: Access through routine ownership
CREATE POLICY "Users can view own weekly data"
  ON weekly_data FOR SELECT
  USING (
    routine_id IN (
      SELECT id FROM routines WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own weekly data"
  ON weekly_data FOR INSERT
  WITH CHECK (
    routine_id IN (
      SELECT id FROM routines WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own weekly data"
  ON weekly_data FOR UPDATE
  USING (
    routine_id IN (
      SELECT id FROM routines WHERE user_id = auth.uid()
    )
  );
```

---

## TypeScript Types

```typescript
// types/database.ts

export interface UserSettings {
  id: string;
  user_id: string;
  available_days: number;  // 1-7
  work_days: number;       // 1-7, <= available_days
  work_hours_day: number;  // 1-24
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface Routine {
  id: string;
  user_id: string;
  name: string;
  daily_average: number;  // AP
  comments: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface WeeklyData {
  id: string;
  routine_id: string;
  week_start: string;  // ISO date (Monday)
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
  sunday: number;
  created_at: string;
  updated_at: string;
}

// Derived types for client-side
export interface RoutineWithWeeklyData extends Routine {
  weekly_data: WeeklyData | null;
  // Calculated fields
  apw: number;  // AP × WD
  wr: number;   // Sum of DOW
}

export interface DashboardStats {
  totalAP: number;
  totalAPW: number;
  totalWR: number;
  offHoursDaily: number;
  availableWorkHoursWeek: number;
  hoursLeft: number;
  medianWorkPerDay: number;
}

// Input types for API
export interface CreateRoutineInput {
  name: string;
  daily_average: number;
  comments?: string;
}

export interface UpdateRoutineInput {
  name?: string;
  daily_average?: number;
  comments?: string;
}

export interface UpdateDayPointsInput {
  routine_id: string;
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  value: number;
}

export interface UpdateSettingsInput {
  available_days?: number;
  work_days?: number;
  work_hours_day?: number;
  timezone?: string;
}
```

---

## State Transitions

### Weekly Data Lifecycle

```
[New Week Starts]
       │
       ▼
┌──────────────────┐
│  DOW values = 0  │  (Fresh week)
│  week_start set  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  User updates    │  (Throughout the week)
│  DOW values      │
└────────┬─────────┘
         │
         ▼ [Week ends]
┌──────────────────┐
│  Data archived   │  (History preserved)
│  New record      │
│  created         │
└──────────────────┘
```

### Routine Lifecycle

```
[User Creates] ──► [Active] ◄──► [User Edits]
                      │
                      ▼
               [User Deletes]
                      │
                      ▼
               [Cascade Delete]
              (WeeklyData removed)
```
