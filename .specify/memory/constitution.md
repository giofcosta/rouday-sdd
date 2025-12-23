# Web Application Constitution

## Core Principles

### I. Separation of Concerns
Frontend and backend are separate projects with clear boundaries. Frontend handles UI/UX; backend handles business logic and data. Communication via REST API with JSON payloads.

### II. Test-First Development
Tests written before implementation. Unit tests for business logic; integration tests for API endpoints; end-to-end tests for critical user flows.
### III. API-First Design
All features start with API contract definition. Endpoints documented before implementation. Breaking changes require versioning.

### IV. Security by Default
Authentication required for protected routes. Input validation on all endpoints. HTTPS in production. No secrets in code.

### V. Simplicity
Start with minimal viable solution. Add complexity only when justified. YAGNI (You Aren't Gonna Need It) principle enforced.

## Technology Stack

- **Frontend**: HTML/CSS/JavaScript (framework optional)
- **Backend**: RESTful API
- **Database**: As needed (SQL or NoSQL)
- **Testing**: Unit, integration, and E2E tests required

## Development Workflow

- All changes via feature branches
- Code review required before merge
- Tests must pass before deployment
- Documentation updated with code changes

## Data Fetching Guidelines

### VI. Centralized Data Fetching
Data fetching must be handled at the store level with built-in guards to prevent duplicate API calls. Hooks should auto-fetch on mount but NOT expose fetch functions externally. Use `hasFetched` and `isLoading` flags in zustand stores to prevent re-fetching.

### VII. Store-Based State Management
All async data operations (fetch, create, update, delete) should:
- Check guards before executing (`hasFetched`, `isLoading`)
- Set loading state before API calls
- Handle errors gracefully
- Update state atomically after success

## Governance

Constitution supersedes all other practices. Amendments require team discussion and documented approval.

**Version**: 1.0.0 | **Ratified**: 2025-12-01 | **Last Amended**: 2025-12-01
