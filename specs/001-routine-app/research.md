# Research: Routine App Technical Decisions

**Feature**: 001-routine-app  
**Date**: 2025-12-05  
**Purpose**: Resolve technical unknowns and document architecture decisions

---

## 1. Frontend Framework: Next.js 14 with App Router

### Decision
Use Next.js 14 with App Router and TypeScript.

### Rationale
- **Server Components**: Reduce client-side JavaScript bundle, improve initial load
- **App Router**: Modern routing with layouts, loading states, and error boundaries built-in
- **API Routes**: Serverless functions in the same project (no separate backend needed)
- **TypeScript**: Type safety, better DX, catches errors at compile time
- **Vercel optimization**: Seamless deployment with edge functions and caching

### Alternatives Considered
| Alternative | Reason Rejected |
|-------------|-----------------|
| Vite + React SPA | No SSR/SSG, worse SEO for landing pages |
| Remix | Smaller ecosystem, less Supabase integration examples |
| Pages Router | Legacy pattern, App Router is the future |

### Implementation Notes
- Use `"use client"` directive only for interactive components (RoutineTable, DayCell)
- Server Components for landing, about, FAQ pages (static content)
- Route groups: `(public)`, `(auth)`, `(dashboard)` for layout separation

---

## 2. Styling: Tailwind CSS + Shadcn UI

### Decision
Use Tailwind CSS 3.x with Shadcn UI component library.

### Rationale
- **Utility-first**: Rapid prototyping, consistent design tokens
- **Shadcn UI**: Copy-paste components (not a dependency), fully customizable
- **Accessibility**: Shadcn uses Radix UI primitives (WCAG compliant)
- **Dark mode**: Built-in support via CSS variables
- **Mobile-first**: Responsive utilities (`sm:`, `md:`, `lg:`)

### Alternatives Considered
| Alternative | Reason Rejected |
|-------------|-----------------|
| Material UI | Heavier bundle, harder to customize, opinionated design |
| Chakra UI | Runtime CSS-in-JS, slower than Tailwind |
| Tremor | Great for dashboards but overkill, less flexible |

### Implementation Notes
- Initialize with `npx shadcn-ui@latest init`
- Install components as needed: Button, Dialog, Input, Table, Card, Toast
- Custom color palette for gamification (green success, red warning)
- CSS variables for theming in `globals.css`

---

## 3. Backend: Supabase (PostgreSQL + Auth + Real-time)

### Decision
Use Supabase as the backend-as-a-service platform.

### Rationale
- **PostgreSQL**: Robust relational database, perfect for structured routine data
- **Row Level Security (RLS)**: User data isolation at database level
- **Built-in Auth**: Email/password, social logins, session management
- **Typed client**: `@supabase/supabase-js` with TypeScript support
- **Real-time subscriptions**: Future feature for live updates (optional)
- **Free tier**: Generous limits for MVP and early users

### Alternatives Considered
| Alternative | Reason Rejected |
|-------------|-----------------|
| Firebase | NoSQL (Firestore) less suitable for relational routine data |
| PlanetScale | No built-in auth, requires additional setup |
| NestJS + Postgres | Overkill for this scale, more infrastructure to manage |

### Implementation Notes
- Create Supabase project at supabase.com
- Enable email auth in dashboard
- Define RLS policies: users can only CRUD their own data
- Use `@supabase/ssr` for Next.js App Router integration

---

## 4. State Management: Zustand

### Decision
Use Zustand for client-side state management.

### Rationale
- **Lightweight**: ~1KB bundle, minimal boilerplate
- **Simple API**: No providers, hooks-based
- **Persist middleware**: Easy localStorage persistence for offline support
- **TypeScript**: Excellent type inference
- **React 18 compatible**: Works with concurrent features

### Alternatives Considered
| Alternative | Reason Rejected |
|-------------|-----------------|
| Redux Toolkit | Overkill for this scale, more boilerplate |
| Jotai | Atomic model less intuitive for this use case |
| Context API | Performance issues with frequent updates (DOW changes) |

### Implementation Notes
- `routinesStore`: Current week's routines and DOW values
- `settingsStore`: User configuration (AD, WD, WHD)
- Use `persist` middleware for offline viewing
- Optimistic updates for DOW increment/decrement

---

## 5. Weekly Reset Strategy

### Decision
Use Supabase scheduled functions (pg_cron) for weekly reset.

### Rationale
- **Automatic**: No user action required
- **Database-level**: Consistent, no race conditions
- **Timezone handling**: Store user timezone, calculate reset time per user

### Implementation Approach
```sql
-- Weekly reset job (runs every Monday 00:00 UTC)
SELECT cron.schedule(
  'weekly-reset',
  '0 0 * * 1',  -- Every Monday at midnight UTC
  $$
    UPDATE weekly_data 
    SET monday = 0, tuesday = 0, wednesday = 0, 
        thursday = 0, friday = 0, saturday = 0, sunday = 0,
        week_start = date_trunc('week', now())
    WHERE week_start < date_trunc('week', now())
  $$
);
```

### Alternative Approach (Client-side)
If pg_cron not available, check week on login:
```typescript
const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
if (userWeekData.weekStart < currentWeekStart) {
  // Reset DOW values via API
}
```

---

## 6. Real-time Calculations

### Decision
Calculate derived values client-side with Zustand selectors.

### Rationale
- **Instant feedback**: No API round-trip for UI updates
- **Reduced server load**: Calculations are simple arithmetic
- **Optimistic updates**: UI reflects changes immediately

### Calculations
| Field | Formula | Location |
|-------|---------|----------|
| APW (Week Target) | `AP × WD` | Client (derived) |
| WR (Week Results) | `SUM(monday...sunday)` | Client (derived) |
| Off Hours daily | `24 - WHD` | Client (derived) |
| Available work hours week | `WHD × WD` | Client (derived) |
| Hours left | `SUM(AP) - SUM(APW)` | Client (derived) |
| Median work per available day | `SUM(APW) / AD` | Client (derived) |

### Implementation
```typescript
// Zustand selector for derived values
const useRoutineStats = () => useRoutinesStore((state) => ({
  totalAP: state.routines.reduce((sum, r) => sum + r.dailyAverage, 0),
  totalAPW: state.routines.reduce((sum, r) => sum + r.dailyAverage * state.workDays, 0),
  totalWR: state.routines.reduce((sum, r) => sum + sumDOW(r.weeklyData), 0),
}));
```

---

## 7. Mobile Responsiveness Strategy

### Decision
Mobile-first design with responsive table/card hybrid.

### Rationale
- **Mobile-first**: Start with smallest screen, enhance for larger
- **Touch targets**: 44x44px minimum for +/- buttons
- **Table alternative**: Card layout on mobile for better UX

### Implementation
| Screen Size | Layout |
|-------------|--------|
| < 640px (mobile) | Card layout, swipe for DOW adjustments |
| 640px - 1024px (tablet) | Horizontal scroll table |
| > 1024px (desktop) | Full table visible |

### Tailwind Breakpoints
```jsx
// Card on mobile, table on larger screens
<div className="block sm:hidden">
  <RoutineCards routines={routines} />
</div>
<div className="hidden sm:block">
  <RoutineTable routines={routines} />
</div>
```

---

## 8. Authentication Flow

### Decision
Use Supabase Auth with email/password, middleware protection.

### Rationale
- **Built-in**: No custom auth logic needed
- **Secure**: JWT tokens, refresh token rotation
- **SSR compatible**: Works with Next.js middleware

### Implementation
```typescript
// middleware.ts - Protect dashboard routes
export async function middleware(request: NextRequest) {
  const supabase = createMiddlewareClient({ req: request });
  const { data: { session } } = await supabase.auth.getSession();
  
  if (request.nextUrl.pathname.startsWith('/dashboard') && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
```

---

## 9. Testing Strategy

### Decision
Three-tier testing: Unit (Vitest), Component (RTL), E2E (Playwright).

### Rationale
- **Vitest**: Fast, Vite-native, Jest-compatible API
- **React Testing Library**: Test behavior, not implementation
- **Playwright**: Cross-browser E2E, mobile emulation

### Test Coverage Goals
| Layer | Coverage | Focus |
|-------|----------|-------|
| Unit | 80%+ | Calculation functions, validation, utilities |
| Component | Key flows | RoutineTable interactions, forms |
| E2E | Critical paths | Auth flow, CRUD routines, DOW updates |

---

## 10. Deployment Strategy

### Decision
Deploy to Vercel with automatic preview deployments.

### Rationale
- **Next.js optimized**: Zero-config deployment
- **Preview URLs**: PR previews for testing
- **Edge functions**: Low latency API routes
- **Environment variables**: Secure Supabase keys

### Environment Setup
```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx  # Server-side only
```

---

## Summary of Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js (App Router) | 14.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 3.x |
| Components | Shadcn UI | Latest |
| State | Zustand | 4.x |
| Backend | Supabase | Latest |
| Database | PostgreSQL | 15 (via Supabase) |
| Auth | Supabase Auth | Built-in |
| Testing | Vitest, Playwright, RTL | Latest |
| Deployment | Vercel | - |
| Email | Resend (future) | - |
