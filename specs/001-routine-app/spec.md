# Feature Specification: Routine - Gamified Daily Task Management

**Feature Branch**: `001-routine-app`  
**Created**: 2025-12-01  
**Status**: Draft  
**Input**: User description: "Web application for controlling daily task routines based on points and gamification"

---

## Overview

Routine is a sleek, gamified web application that helps users manage their daily task routines through a points-based system. Originally built as a spreadsheet, this app transforms routine tracking into an engaging experience with weekly cycles, progress visualization, and real-time calculations.

---

## User Scenarios & Testing

### User Story 1 - View and Manage Weekly Routines (Priority: P1)

As a user, I want to view my routines for the current week in a table format so I can track my daily progress and see my points at a glance.

**Why this priority**: This is the core functionality - the main dashboard that users will interact with daily. Without this, the app has no value.

**Independent Test**: Can be fully tested by creating routines and viewing them in the weekly table, delivering immediate value for routine tracking.

**Acceptance Scenarios**:

1. **Given** I am logged in, **When** I navigate to the dashboard, **Then** I see a table with all my routines showing: Routine name, Daily Average (AP), Week Target (APW), Monday-Sunday columns (DOW), Week Results (WR), and Comments.

2. **Given** I am viewing my routines table, **When** I look at any routine row, **Then** APW is automatically calculated as (AP × WD) and WR is the sum of all DOW values.

3. **Given** I am viewing the routines table, **When** WR < APW for a routine, **Then** WR displays in red; **When** WR ≥ APW, **Then** WR displays in green.

4. **Given** I am viewing the routines table, **When** I look at the bottom row, **Then** I see totals for all numeric columns (sum of all routine values).

---

### User Story 2 - Adjust Daily Points (Priority: P1)

As a user, I want to increase or decrease points for each routine on any day so I can track my actual progress throughout the week.

**Why this priority**: This is the primary daily interaction - users need to update their points as they complete routines.

**Independent Test**: Can be tested by clicking +/- buttons on any DOW cell and observing WR and totals update instantly.

**Acceptance Scenarios**:

1. **Given** I am viewing a routine row, **When** I click the increase button on a DOW cell, **Then** the points for that day increase by 1 and WR updates immediately.

2. **Given** I am viewing a routine row, **When** I click the decrease button on a DOW cell, **Then** the points for that day decrease by 1 (minimum 0) and WR updates immediately.

3. **Given** I change any DOW value, **When** the change is saved, **Then** all auto-updated variables (Hours left, Median work per available day) recalculate and display immediately.

---

### User Story 3 - CRUD Routines (Priority: P1)

As a user, I want to add, edit, and delete routines so I can customize my weekly tracking to my needs.

**Why this priority**: Users must be able to configure their own routines for the app to be useful.

**Independent Test**: Can be tested by adding a new routine with name and daily average, editing it, and deleting it.

**Acceptance Scenarios**:

1. **Given** I want to add a routine, **When** I click "Add Routine" and enter a name and daily average (required fields), **Then** a new routine row appears in the table with APW auto-calculated.

2. **Given** I want to edit a routine, **When** I click edit on a routine row, **Then** I can modify the name, daily average, and comments.

3. **Given** I want to delete a routine, **When** I click delete and confirm, **Then** the routine is removed from the table and totals update.

4. **Given** I try to add a routine without a name or daily average, **When** I submit, **Then** I see validation errors and the routine is not created.

---

### User Story 4 - Configure User Settings (Priority: P2)

As a user, I want to configure my Available Days (AD), Work Days (WD), and Work Hours per Day (WHD) so the system calculates my targets correctly.

**Why this priority**: Configuration is needed for accurate calculations but can have sensible defaults initially.

**Independent Test**: Can be tested by changing settings and observing that APW and auto-updated fields recalculate.

**Acceptance Scenarios**:

1. **Given** I navigate to settings, **When** I update AD, WD, or WHD, **Then** my preferences are saved and persist across sessions.

2. **Given** I change WD, **When** I return to the dashboard, **Then** all APW values recalculate (AP × new WD).

3. **Given** my settings are configured, **When** I view auto-updated fields, **Then** I see:
   - Off Hours daily: (24 - WHD)
   - Available work hours week: (WHD × WD)
   - Hours left: (SUM(AP) - SUM(APW))
   - Median work per available day: (SUM(APW) / AD)

4. **Given** a new week starts, **When** I log in, **Then** my configuration (AD, WD, WHD) remains unchanged.

---

### User Story 5 - Weekly Reset Cycle (Priority: P2)

As a user, I want the system to reset my weekly progress automatically so I start fresh each week with my configured routines.

**Why this priority**: The weekly cycle is essential for the gamification loop but requires the core features first.

**Independent Test**: Can be tested by simulating a week change and verifying DOW points reset to 0 while routines and settings persist.

**Acceptance Scenarios**:

1. **Given** a new week begins, **When** the system updates, **Then** all DOW values reset to 0 for all routines.

2. **Given** a new week begins, **When** the system updates, **Then** my routine configurations (name, AP, comments) persist.

3. **Given** a new week begins, **When** the system updates, **Then** my user settings (AD, WD, WHD) persist unchanged.

---

### User Story 6 - Landing Page (Priority: P2)

As a visitor, I want to see an attractive landing page that explains the app's features so I can decide to sign up or download.

**Why this priority**: Needed for user acquisition but not for core functionality.

**Independent Test**: Can be tested by visiting the homepage and verifying all sections display correctly.

**Acceptance Scenarios**:

1. **Given** I visit the homepage, **When** the page loads, **Then** I see a hero section with app description and CTA buttons for "Download App" (links to mobile app waitlist) and "Sign In".

2. **Given** I am on the landing page, **When** I scroll down, **Then** I see sections highlighting key features: Points-based tracking, Gamification, Weekly cycles, Progress visualization.

3. **Given** I am on the landing page, **When** I click "Sign In", **Then** I am taken to the authentication page.

---

### User Story 7 - Authentication (Priority: P2)

As a user, I want to sign up and log in so my data is saved and accessible only to me.

**Why this priority**: Required for multi-user support and data persistence.

**Independent Test**: Can be tested by signing up, logging out, and logging back in to verify data persistence.

**Password Policy**: Minimum 8 characters, must include at least one uppercase letter and one number.

**Acceptance Scenarios**:

1. **Given** I am a new user, **When** I sign up with email and password meeting policy (8+ chars, uppercase, number), **Then** my account is created and I am logged in.

2. **Given** I am a returning user, **When** I log in with valid credentials, **Then** I see my dashboard with my routines.

3. **Given** I am logged in, **When** I log out, **Then** I am redirected to the landing page and cannot access the dashboard.

4. **Given** I am signing up, **When** I enter a password that doesn't meet policy, **Then** I see specific validation errors indicating missing requirements.

---

### User Story 8 - Static Pages (Priority: P3)

As a visitor, I want to access About, FAQ, and Contact pages so I can learn more about the app and get help.

**Why this priority**: Nice-to-have content pages that support the main product.

**Independent Test**: Can be tested by navigating to each page and verifying content displays.

**Acceptance Scenarios**:

1. **Given** I click "About" in the navigation, **When** the page loads, **Then** I see information about the app and its mission.

2. **Given** I click "FAQ" in the navigation, **When** the page loads, **Then** I see common questions and answers in an expandable format.

3. **Given** I click "Contact" in the navigation, **When** the page loads, **Then** I see a contact form with name, email, and message fields.

---

### Edge Cases

- What happens when a user has no routines configured? → Show empty state with CTA to add first routine.
- What happens if WHD > 24? → Validation error, max 24 hours.
- What happens if WD > AD? → Validation error, work days cannot exceed available days.
- What happens if AD > 7? → Validation error, max 7 days per week.
- What happens if user tries to decrease DOW below 0? → Minimum is 0, button disabled or no action.
- What happens on timezone differences for weekly reset? → Use user's configured timezone or UTC.

---

## Requirements

### Functional Requirements

**Core System**
- **FR-001**: System MUST display routines in a table with columns: Routine, Daily Average (AP), Week Target (APW), Monday-Sunday (DOW), Week Results (WR), Comments.
- **FR-002**: System MUST calculate APW dynamically as (AP × WD).
- **FR-003**: System MUST calculate WR dynamically as sum of all DOW values for each routine.
- **FR-004**: System MUST display WR in red when WR < APW, green when WR ≥ APW.
- **FR-005**: System MUST show a totals row with sum of all numeric columns.
- **FR-006**: System MUST allow users to increment/decrement DOW values with immediate UI update.
- **FR-007**: System MUST recalculate all auto-updated fields when any DOW value changes.

**Routine Management**
- **FR-008**: Users MUST be able to create a routine with name (required) and daily average (required).
- **FR-009**: Users MUST be able to edit routine name, daily average, and comments.
- **FR-010**: Users MUST be able to delete a routine with confirmation.

**User Configuration**
- **FR-011**: Users MUST be able to set Available Days (AD) - range 1-7.
- **FR-012**: Users MUST be able to set Work Days (WD) - range 1-7, must be ≤ AD.
- **FR-013**: Users MUST be able to set Work Hours per Day (WHD) - range 1-24.
- **FR-014**: System MUST persist user configuration across sessions and weekly resets.

**Auto-Updated Fields**
- **FR-015**: System MUST calculate and display Off Hours daily: (24 - WHD).
- **FR-016**: System MUST calculate and display Available work hours week: (WHD × WD).
- **FR-017**: System MUST calculate and display Hours left: (SUM(AP) - SUM(APW)).
- **FR-018**: System MUST calculate and display Median work per available day: (SUM(APW) / AD).

**Weekly Cycle**
- **FR-019**: System MUST reset all DOW values to 0 at the start of each week.
- **FR-020**: System MUST preserve routine configurations during weekly reset.
- **FR-021**: System MUST preserve user settings during weekly reset.

**Public Pages**
- **FR-022**: System MUST display a landing page with app features and sign-in/download CTAs.
- **FR-023**: System MUST provide an About page with app information.
- **FR-024**: System MUST provide a FAQ page with expandable Q&A sections.
- **FR-025**: System MUST provide a Contact page with a functional contact form.

**Authentication**
- **FR-026**: System MUST allow users to sign up with email and password.
- **FR-027**: System MUST allow users to log in with credentials.
- **FR-028**: System MUST protect dashboard routes from unauthenticated access.

**Responsive Design**
- **FR-029**: System MUST be fully functional on mobile devices (smartphones and tablets).
- **FR-030**: System MUST use responsive layouts that adapt to screen sizes from 320px to 2560px.
- **FR-031**: System MUST provide touch-friendly controls with minimum tap target size of 44x44px.
- **FR-032**: Routines table MUST be horizontally scrollable or use card layout on small screens.
- **FR-033**: System MUST support swipe gestures for incrementing/decrementing DOW values on touch devices.
- **FR-034**: Navigation MUST collapse to a hamburger menu on mobile screens.

**Error Handling & Resilience**
- **FR-035**: System MUST use optimistic UI updates for all data mutations (points, routines, settings).
- **FR-036**: System MUST automatically retry failed API calls up to 3 times with exponential backoff.
- **FR-037**: System MUST revert optimistic UI changes and show error toast if all retries fail.
- **FR-038**: System MUST log errors to console and Vercel logs for debugging.

---

### Key Entities

- **User**: Account holder with email, password, and configuration settings (AD, WD, WHD). Owns multiple routines.

- **Routine**: A trackable task with name, daily average (AP), comments. Belongs to a user. Has weekly data (DOW points).

- **WeeklyData**: Points assigned per day for a routine within a specific week. Contains Monday-Sunday values. Resets each week.

- **UserConfiguration**: User's settings - Available Days, Work Days, Work Hours per Day. Persists across weeks.

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can create a routine and start tracking points within 30 seconds of first login.
- **SC-002**: DOW increment/decrement actions reflect in UI within 100ms (perceived instant).
- **SC-003**: Weekly reset completes automatically without user intervention.
- **SC-004**: 95% of users can configure their settings without external help (intuitive UI).
- **SC-005**: Landing page loads in under 2 seconds on average connections.
- **SC-006**: App works correctly on desktop browsers (Chrome, Firefox, Safari, Edge) and mobile browsers.
- **SC-007**: All features are fully usable on smartphones (iOS Safari, Android Chrome) with screen widths as small as 320px.
- **SC-008**: Touch interactions (tap, swipe) feel responsive and natural on mobile devices.

---

## Visual Design Notes

- Sleek, modern design that stands out
- **Responsive design - mobile-first approach**
- **Touch-friendly UI with appropriately sized tap targets (min 44x44px)**
- **Swipe gestures for DOW point adjustments on mobile**
- **Collapsible/scrollable table for smaller screens**
- Light mode only for MVP (dark mode deferred to future iteration)
- Clear visual hierarchy in routine table
- Satisfying micro-interactions for +/- buttons (gamification feel)
- Progress indicators using color (red/green for WR)
- Clean typography and adequate whitespace

---

## Out of Scope (Future Considerations)

- Mobile native apps (iOS/Android)
- Historical data and analytics across weeks
- Achievements/badges system
- Social features (sharing, leaderboards)
- Notifications/reminders
- Multiple routine templates
- Data export

---

## Clarifications

### Session 2025-12-06

- Q: Landing page has "Download App" CTA but mobile apps are out of scope - how to handle? → A: Keep as placeholder linking to waitlist for future mobile apps
- Q: How should dark mode be triggered (system preference, manual toggle, or deferred)? → A: Light mode only for MVP; defer dark mode to future iteration
- Q: What level of observability/logging for MVP? → A: Basic error logging to console + Vercel logs; alert on critical failures only
- Q: What password policy should be enforced? → A: Standard - 8+ characters, require uppercase + number
- Q: How should API failures be handled? → A: Optimistic updates with auto-retry (2-3x), revert UI if all retries fail
