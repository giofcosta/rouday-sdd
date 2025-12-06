# Routine App Development Guidelines

Auto-generated from feature plans. Last updated: 2025-12-05

## Active Technologies

- TypeScript 5.x + Next.js 14 (App Router) + React 18 (001-routine-app)
- Tailwind CSS 3.x + Shadcn UI (styling)
- Supabase (PostgreSQL + Auth + Real-time)
- Zustand (state management)
- Vitest + Playwright + React Testing Library (testing)

## Project Structure

```text
src/
├── app/                      # Next.js App Router
│   ├── (public)/             # Landing, About, FAQ, Contact
│   ├── (auth)/               # Login, Signup
│   ├── (dashboard)/          # Protected app (main routines)
│   └── api/                  # API routes
├── components/
│   ├── ui/                   # Shadcn UI components
│   ├── routines/             # Routine-specific components
│   ├── layout/               # Header, MobileNav, Footer
│   └── landing/              # Landing page components
├── lib/
│   ├── supabase/             # Supabase clients
│   └── validations/          # Zod schemas
├── stores/                   # Zustand stores
├── types/                    # TypeScript types
└── hooks/                    # Custom React hooks

tests/
├── e2e/                      # Playwright E2E tests
├── integration/              # API integration tests
└── unit/                     # Unit tests

supabase/
└── migrations/               # Database migrations
```

## Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm lint         # Run ESLint
pnpm test         # Run unit tests (Vitest)
pnpm test:e2e     # Run E2E tests (Playwright)
```

## Code Style

- TypeScript: Strict mode, explicit return types on functions
- React: Functional components, hooks only
- Use "use client" directive only for interactive components
- Server Components for static content (landing pages)
- Tailwind: Mobile-first responsive utilities

## Key Patterns

- Optimistic updates for DOW increment/decrement
- Derived calculations client-side (APW, WR, stats)
- RLS policies for data isolation
- Zod for input validation

## Recent Changes

- 001-routine-app: Added TypeScript + Next.js 14 + Supabase stack

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
