# Implementation Plan: Routine - Gamified Daily Task Management

**Branch**: `001-routine-app` | **Date**: 2025-12-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-routine-app/spec.md`

## Summary

Build a gamified web application for managing daily task routines through a points-based system. Users track weekly progress via a dynamic table with real-time calculations, color-coded results, and automatic weekly resets. The solution uses Next.js with TypeScript for the frontend, Supabase for backend/database/auth, and Tailwind CSS with Shadcn UI for a sleek, responsive design.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 20.x LTS  
**Primary Dependencies**: Next.js 14 (App Router), React 18, Tailwind CSS 3.x, Shadcn UI, Zustand (state management)  
**Storage**: Supabase (PostgreSQL) with Row Level Security (RLS) - runs locally via Docker  
**Development**: Docker Compose orchestrates local Supabase stack (PostgreSQL, GoTrue Auth, Kong API Gateway, Studio)  
**Testing**: Vitest (unit), Playwright (E2E), React Testing Library (component)  
**Target Platform**: Web (responsive: mobile-first, 320px to 2560px)  
**Project Type**: web (monorepo with frontend using Next.js API routes)  
**Performance Goals**: <100ms UI updates for DOW changes, <2s page loads, <200ms API responses  
**Constraints**: Mobile-first responsive design, offline-capable for viewing (stretch goal)  
**Scale/Scope**: 10k users, ~10 pages, real-time calculations

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Separation of Concerns | ✅ PASS | Frontend (Next.js pages/components) separate from backend (API routes + Supabase). Communication via REST API with JSON. |
| II. Test-First Development | ✅ PASS | Vitest for unit tests, Playwright for E2E, React Testing Library for components. TDD approach planned. |
| III. API-First Design | ✅ PASS | API contracts defined in `/contracts/` before implementation. Supabase provides typed client. |
| IV. Security by Default | ✅ PASS | Supabase Auth for authentication. RLS policies protect data. Input validation via Zod. HTTPS via Vercel. |
| V. Simplicity | ✅ PASS | Single Next.js project with API routes (no separate backend service). Supabase handles DB/Auth complexity. |

**Gate Status**: ✅ PASSED - Proceed to Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/001-routine-app/
├── plan.md              # This file
├── spec.md              # Feature specification
├── checklist.md         # Implementation checklist
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (OpenAPI specs)
│   └── api.yaml
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── app/                      # Next.js App Router
│   ├── (public)/             # Public routes (no auth required)
│   │   ├── page.tsx          # Landing page
│   │   ├── about/
│   │   ├── faq/
│   │   └── contact/
│   ├── (auth)/               # Auth routes
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/          # Protected routes
│   │   ├── layout.tsx        # Dashboard layout with nav
│   │   ├── page.tsx          # Main routines dashboard
│   │   └── settings/
│   ├── api/                  # API routes
│   │   ├── routines/
│   │   ├── weekly-data/
│   │   └── settings/
│   ├── layout.tsx            # Root layout
│   └── globals.css
├── components/
│   ├── ui/                   # Shadcn UI components
│   ├── routines/             # Routine-specific components
│   │   ├── RoutineTable.tsx
│   │   ├── RoutineRow.tsx
│   │   ├── DayCell.tsx
│   │   ├── AddRoutineDialog.tsx
│   │   └── StatsPanel.tsx
│   ├── layout/               # Layout components
│   │   ├── Header.tsx
│   │   ├── MobileNav.tsx
│   │   └── Footer.tsx
│   └── landing/              # Landing page components
├── lib/
│   ├── supabase/
│   │   ├── client.ts         # Browser client
│   │   ├── server.ts         # Server client
│   │   └── middleware.ts     # Auth middleware
│   ├── validations/          # Zod schemas
│   └── utils.ts
├── stores/                   # Zustand stores
│   ├── routines.ts
│   └── settings.ts
├── types/
│   └── index.ts              # TypeScript types/interfaces
└── hooks/                    # Custom React hooks
    ├── useRoutines.ts
    └── useSettings.ts

tests/
├── e2e/                      # Playwright E2E tests
│   ├── auth.spec.ts
│   ├── routines.spec.ts
│   └── landing.spec.ts
├── integration/              # API integration tests
│   └── api/
└── unit/                     # Unit tests
    ├── components/
    └── lib/

supabase/
├── migrations/               # Database migrations
├── seed.sql                  # Seed data for development
└── docker/                   # Docker init scripts
    ├── init/                 # SQL scripts run on first startup
    │   ├── 00-setup-supabase.sql
    │   ├── 01-user-settings.sql
    │   ├── 02-routines.sql
    │   ├── 03-weekly-data.sql
    │   └── 04-rls-policies.sql
    └── kong.yml              # Kong API Gateway config

# Docker files (repository root)
docker-compose.yml            # Full local Supabase stack
Dockerfile                    # Production Next.js build
Dockerfile.dev                # Development with hot reload
.env.docker                   # Docker environment variables
.env.local.docker             # Next.js env for Docker
```

**Structure Decision**: Single Next.js project (monorepo not needed). Using App Router with route groups for logical separation: `(public)` for marketing pages, `(auth)` for authentication, `(dashboard)` for protected app features. API routes handle backend logic with Supabase as the database layer.

## Complexity Tracking

> No violations detected. Stack is appropriately simple for the requirements.

| Decision | Rationale |
|----------|-----------|
| Next.js API Routes over NestJS | Project scale is small (~10 pages, single-tenant per user). API routes sufficient. |
| Supabase over custom backend | Provides auth, DB, and real-time out of the box. Reduces complexity. |
| Zustand over Redux | Lightweight state management suitable for this scale. |
| Shadcn UI over custom components | Pre-built accessible components accelerate development. |
