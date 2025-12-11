# Tasks: Routine - Gamified Daily Task Management

**Input**: Design documents from `/specs/001-routine-app/`  
**Prerequisites**: plan.md ✅, spec.md ✅, data-model.md ✅, contracts/api.yaml ✅, research.md ✅

**Tests**: Per Constitution II (Test-First Development), tests are written alongside implementation. Each user story phase includes implicit test coverage - unit tests for utilities/stores, integration tests for API routes, component tests for UI. E2E tests added in Phase 11.

**Organization**: Tasks grouped by user story for independent implementation and testing.

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Initialize Next.js project with all dependencies and configuration

- [X] T001 Create Next.js 14 project with TypeScript and App Router in repository root
- [X] T002 [P] Install core dependencies: React 18, Tailwind CSS 3.x, Zustand, Zod
- [X] T003 [P] Install Supabase dependencies: @supabase/supabase-js, @supabase/ssr
- [X] T004 [P] Install Shadcn UI and initialize with default config
- [X] T005 [P] Configure ESLint and Prettier with TypeScript rules
- [X] T006 [P] Create .env.local.example with Supabase placeholder variables
- [X] T007 Configure Tailwind CSS with custom theme (colors for gamification: green success, red warning)
- [X] T008 Create src/app/globals.css with Tailwind directives and CSS variables for theming

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Database & Backend Foundation

- [X] T009 Create Supabase project and obtain API keys (configured via Docker self-hosted)
- [X] T010 Create database migration for user_settings table in supabase/migrations/001_user_settings.sql
- [X] T011 Create database migration for routines table in supabase/migrations/002_routines.sql
- [X] T012 Create database migration for weekly_data table in supabase/migrations/003_weekly_data.sql
- [X] T013 Create RLS policies for user_settings table in supabase/migrations/004_rls_policies.sql
- [X] T014 Create RLS policies for routines table in supabase/migrations/004_rls_policies.sql
- [X] T015 Create RLS policies for weekly_data table in supabase/migrations/004_rls_policies.sql
- [X] T016 Create seed.sql with sample data for development in supabase/seed.sql

### Supabase Client Setup

- [X] T017 [P] Create Supabase browser client in src/lib/supabase/client.ts
- [X] T018 [P] Create Supabase server client in src/lib/supabase/server.ts
- [X] T019 Create auth middleware in src/middleware.ts for protected routes

### TypeScript Types

- [X] T020 [P] Create database types in src/types/database.ts (Routine, WeeklyData, UserSettings)
- [X] T021 [P] Create derived types in src/types/index.ts (RoutineWithWeeklyData, DashboardStats)
- [X] T022 [P] Create input types in src/types/index.ts (CreateRoutineInput, UpdateDayPointsInput, etc.)

### Validation Schemas

- [X] T023 [P] Create Zod schema for routine validation in src/lib/validations/routine.ts
- [X] T024 [P] Create Zod schema for settings validation in src/lib/validations/settings.ts
- [X] T025 [P] Create Zod schema for weekly data validation in src/lib/validations/weekly-data.ts

### Shared UI Components

- [X] T026 [P] Install Shadcn Button component via npx shadcn-ui@latest add button
- [X] T027 [P] Install Shadcn Dialog component via npx shadcn-ui@latest add dialog
- [X] T028 [P] Install Shadcn Input component via npx shadcn-ui@latest add input
- [X] T029 [P] Install Shadcn Card component via npx shadcn-ui@latest add card
- [X] T030 [P] Install Shadcn Toast component via npx shadcn-ui@latest add toast
- [X] T031 [P] Install Shadcn Table component via npx shadcn-ui@latest add table
- [X] T032 [P] Install Shadcn Form component via npx shadcn-ui@latest add form
- [X] T033 [P] Install Shadcn Sheet component for mobile navigation via npx shadcn-ui@latest add sheet
- [X] T034 Create utility functions in src/lib/utils.ts (cn, formatDate, getWeekStart)
- [X] T034a Create API retry utility in src/lib/api-retry.ts with exponential backoff (max 3 retries per FR-036)

### Layout Foundation

- [X] T035 Create root layout in src/app/layout.tsx with font, metadata, and providers
- [X] T036 [P] Create Header component in src/components/layout/Header.tsx with responsive nav
- [X] T037 [P] Create MobileNav component in src/components/layout/MobileNav.tsx with hamburger menu
- [X] T038 [P] Create Footer component in src/components/layout/Footer.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - View and Manage Weekly Routines (Priority: P1) 🎯 MVP

**Goal**: Display routines table with all columns, auto-calculations, and color-coded WR

**Independent Test**: Create routines and view them in the weekly table with correct calculations

### State Management for US1

- [X] T039 Create routines Zustand store in src/stores/routines.ts with CRUD actions
- [X] T040 Create settings Zustand store in src/stores/settings.ts with user config

### API Routes for US1

- [X] T041 Create GET /api/routines route in src/app/api/routines/route.ts
- [X] T042 Create POST /api/routines route in src/app/api/routines/route.ts
- [X] T043 Create GET /api/routines/[id] route in src/app/api/routines/[id]/route.ts
- [X] T044 Create PATCH /api/routines/[id] route in src/app/api/routines/[id]/route.ts
- [X] T045 Create DELETE /api/routines/[id] route in src/app/api/routines/[id]/route.ts
- [X] T046 Create GET /api/settings route in src/app/api/settings/route.ts
- [X] T047 Create PATCH /api/settings route in src/app/api/settings/route.ts

### Hooks for US1

- [X] T048 [P] Create useRoutines hook in src/hooks/useRoutines.ts
- [X] T049 [P] Create useSettings hook in src/hooks/useSettings.ts

### UI Components for US1

- [X] T050 Create RoutineTable component in src/components/routines/RoutineTable.tsx (desktop view)
- [X] T051 Create RoutineRow component in src/components/routines/RoutineRow.tsx
- [X] T052 Create RoutineCard component in src/components/routines/RoutineCard.tsx (mobile view)
- [X] T053 Create TotalsRow component in src/components/routines/TotalsRow.tsx
- [X] T054 Create StatsPanel component in src/components/routines/StatsPanel.tsx (auto-updated fields)
- [X] T055 Create responsive table/card toggle in src/components/routines/RoutineList.tsx

### Dashboard Page for US1

- [X] T056 Create dashboard layout in src/app/(dashboard)/layout.tsx with nav and auth check
- [X] T057 Create dashboard page in src/app/(dashboard)/page.tsx with RoutineTable and StatsPanel
- [X] T058 Create empty state component in src/components/routines/EmptyState.tsx

**Checkpoint**: User Story 1 complete - routines table displays with calculations and color-coded WR

---

## Phase 4: User Story 2 - Adjust Daily Points (Priority: P1)

**Goal**: Increment/decrement DOW values with instant UI updates

**Independent Test**: Click +/- buttons and observe WR and totals update immediately

### API Routes for US2

- [X] T059 Create POST /api/weekly-data/[routineId]/increment in src/app/api/weekly-data/[routineId]/increment/route.ts
- [X] T060 Create POST /api/weekly-data/[routineId]/decrement in src/app/api/weekly-data/[routineId]/decrement/route.ts
- [X] T061 Create PATCH /api/weekly-data/[routineId] in src/app/api/weekly-data/[routineId]/route.ts

### UI Components for US2

- [X] T062 Create DayCell component in src/components/routines/DayCell.tsx with +/- buttons
- [X] T063 Add touch-friendly tap targets (min 44x44px) to DayCell component
- [X] T064 Add swipe gesture support for mobile in DayCell component using touch events
- [X] T065 Implement optimistic updates in routines store with retry logic (per FR-035/FR-036: optimistic UI + auto-retry 3x with exponential backoff, revert on failure)
- [X] T066 Add micro-interactions/animations for +/- button feedback

**Checkpoint**: User Story 2 complete - DOW adjustments work with instant UI updates

---

## Phase 5: User Story 3 - CRUD Routines (Priority: P1)

**Goal**: Add, edit, and delete routines with validation

**Independent Test**: Add new routine, edit it, delete it, verify table updates

### UI Components for US3

- [X] T067 Create AddRoutineDialog component in src/components/routines/AddRoutineDialog.tsx
- [X] T068 Create EditRoutineDialog component in src/components/routines/EditRoutineDialog.tsx
- [X] T069 Create DeleteRoutineDialog component in src/components/routines/DeleteRoutineDialog.tsx
- [X] T070 Add validation error display to routine forms
- [X] T071 Add toast notifications for CRUD success/failure

**Checkpoint**: User Story 3 complete - full CRUD operations for routines working

---

## Phase 6: User Story 4 - Configure User Settings (Priority: P2)

**Goal**: Configure AD, WD, WHD with persistence and recalculations

**Independent Test**: Change settings and observe APW and stats recalculate

### UI Components for US4

- [X] T072 Create SettingsForm component in src/components/settings/SettingsForm.tsx
- [X] T073 Add validation for settings (WD ≤ AD, WHD ≤ 24, AD ≤ 7)
- [X] T074 Create settings page in src/app/(dashboard)/settings/page.tsx

### Integration for US4

- [X] T075 Trigger APW recalculation when WD changes in routines store
- [X] T076 Update StatsPanel to reflect settings changes immediately

**Checkpoint**: User Story 4 complete - user settings persist and trigger recalculations

---

## Phase 7: User Story 5 - Weekly Reset Cycle (Priority: P2)

**Goal**: Automatic weekly reset of DOW values

**Independent Test**: Simulate week change, verify DOW resets while routines/settings persist

### Implementation for US5

- [X] T077 Create week detection utility in src/lib/utils.ts (getWeekStart, isNewWeek)
- [X] T078 Create weekly reset check in useRoutines hook on component mount
- [X] T079 Create /api/routines/reset-week endpoint for manual reset (admin/testing)
- [X] T080 Add week_start tracking to weekly_data queries

**Checkpoint**: User Story 5 complete - weekly reset works automatically

---

## Phase 8: User Story 6 - Landing Page (Priority: P2)

**Goal**: Attractive landing page with features and CTAs

**Independent Test**: Visit homepage, verify all sections display correctly

### Landing Page Components

- [X] T081 [P] Create HeroSection component in src/components/landing/HeroSection.tsx
- [X] T082 [P] Create FeaturesSection component in src/components/landing/FeaturesSection.tsx
- [X] T083 [P] Create CTASection component in src/components/landing/CTASection.tsx
- [X] T084 Create public layout in src/app/(public)/layout.tsx
- [X] T085 Create landing page in src/app/(public)/page.tsx assembling all sections
- [X] T086 Add responsive design for landing page (mobile-first)

**Checkpoint**: User Story 6 complete - landing page displays with all sections

---

## Phase 9: User Story 7 - Authentication (Priority: P2)

**Goal**: Sign up, log in, log out with protected routes

**Independent Test**: Sign up, log out, log back in, verify data persistence

### Auth Pages

- [X] T087 Create auth layout in src/app/(auth)/layout.tsx
- [X] T088 Create login page in src/app/(auth)/login/page.tsx with Supabase Auth
- [X] T089 Create signup page in src/app/(auth)/signup/page.tsx with Supabase Auth and password strength indicator (8+ chars, uppercase, number per spec)
- [X] T090 Create auth callback route in src/app/auth/callback/route.ts

### Auth Integration

- [X] T091 Add sign out functionality to Header component
- [X] T092 Create user initialization (create default settings on first login)
- [X] T093 Add redirect logic: unauthenticated → landing, authenticated → dashboard

**Checkpoint**: User Story 7 complete - full auth flow working

---

## Phase 10: User Story 8 - Static Pages (Priority: P3)

**Goal**: About, FAQ, and Contact pages

**Independent Test**: Navigate to each page, verify content displays

### Static Pages

- [X] T094 [P] Create About page in src/app/(public)/about/page.tsx
- [X] T095 [P] Create FAQ page in src/app/(public)/faq/page.tsx with expandable sections
- [X] T096 [P] Create Contact page in src/app/(public)/contact/page.tsx with form

### Contact Form API

- [X] T097 Create POST /api/contact route in src/app/api/contact/route.ts
- [X] T098 Add rate limiting to contact form endpoint

**Checkpoint**: User Story 8 complete - all static pages functional

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Improvements affecting multiple user stories

### Responsive Design Polish

- [X] T099 Audit all components for mobile-first responsive design
- [X] T100 Verify 44x44px minimum tap targets on all interactive elements
- [X] T101 Test horizontal scroll/card layout toggle at breakpoints
- [X] T102 Verify hamburger menu navigation on mobile screens

### Performance & UX

- [X] T103 Add loading states to all async operations
- [X] T104 Add error boundaries for graceful error handling
- [X] T105 Optimize bundle size (dynamic imports where applicable)
- [X] T106 Add meta tags and Open Graph data for SEO

### Final Validation

- [X] T107 Run through quickstart.md to validate setup process
- [X] T108 Test full user flow: landing → signup → create routine → track points → settings
- [X] T109 Test responsive design on actual mobile devices (iOS Safari, Android Chrome)
- [X] T110 Verify all success criteria from spec.md

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) → Phase 2 (Foundational) → User Stories (Phases 3-10) → Phase 11 (Polish)
                         ↓
              BLOCKS ALL USER STORIES
```

### User Story Dependencies

| Story | Priority | Can Start After | Dependencies |
|-------|----------|-----------------|--------------|
| US1 - View Routines | P1 | Phase 2 | None (MVP core) |
| US2 - Adjust Points | P1 | Phase 2 | US1 components |
| US3 - CRUD Routines | P1 | Phase 2 | US1 components |
| US4 - Settings | P2 | Phase 2 | US1 (affects calculations) |
| US5 - Weekly Reset | P2 | Phase 2 | US1, US2 (resets DOW) |
| US6 - Landing Page | P2 | Phase 2 | None (independent) |
| US7 - Authentication | P2 | Phase 2 | None (but needed for persistence) |
| US8 - Static Pages | P3 | Phase 2 | None (independent) |

### Parallel Opportunities per Phase

**Phase 2 (Foundational)**:
```
T017, T018 (Supabase clients) - parallel
T020, T021, T022 (Types) - parallel
T023, T024, T025 (Validations) - parallel
T026-T033 (Shadcn components) - parallel
T036, T037, T038 (Layout components) - parallel
```

**Phase 3 (US1)**:
```
T048, T049 (Hooks) - parallel
```

**Phase 8 (US6)**:
```
T081, T082, T083 (Landing sections) - parallel
```

**Phase 10 (US8)**:
```
T094, T095, T096 (Static pages) - parallel
```

---

## Implementation Strategy

### MVP First (P1 Stories Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: US1 - View Routines → **Test independently**
4. Complete Phase 4: US2 - Adjust Points → **Test independently**
5. Complete Phase 5: US3 - CRUD Routines → **Test independently**
6. **DEPLOY MVP**: Core functionality complete

### Incremental Delivery

| Milestone | Stories Included | Value Delivered |
|-----------|-----------------|-----------------|
| MVP | US1, US2, US3 | Core routine tracking with points |
| v1.1 | + US4, US5 | Settings and weekly cycles |
| v1.2 | + US6, US7 | Landing page and auth |
| v1.3 | + US8, Polish | Full feature set |

---

## Summary

| Metric | Count |
|--------|-------|
| Total Tasks | 111 |
| Setup Phase | 8 |
| Foundational Phase | 31 |
| US1 (View Routines) | 20 |
| US2 (Adjust Points) | 8 |
| US3 (CRUD Routines) | 5 |
| US4 (Settings) | 5 |
| US5 (Weekly Reset) | 4 |
| US6 (Landing Page) | 6 |
| US7 (Authentication) | 7 |
| US8 (Static Pages) | 5 |
| Polish Phase | 12 |
| Parallel Opportunities | ~35 tasks marked [P] |

---

## Notes

- [P] = Can run in parallel (different files, no dependencies)
- [USn] = Maps to User Story n for traceability
- Mobile-first: Start with mobile layout, enhance for desktop
- Commit after each task or logical group
- Each user story checkpoint = deployable increment
