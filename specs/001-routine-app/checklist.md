# Feature Checklist: Routine App

**Purpose**: Track completion status of all features and requirements  
**Created**: 2025-12-01  
**Feature**: [spec.md](./spec.md)

---

## P1 - Core Features (MVP)

### Weekly Routines Table
- [ ] CHK001 Display routines table with all required columns
- [ ] CHK002 Routine column shows routine name
- [ ] CHK003 Daily Average (AP) column displays correctly
- [ ] CHK004 Week Target (APW) auto-calculates as AP × WD
- [ ] CHK005 Monday-Sunday columns (DOW) display point values
- [ ] CHK006 Week Results (WR) auto-calculates sum of DOW values
- [ ] CHK007 Comments column displays routine comments
- [ ] CHK008 Totals row sums all numeric columns
- [ ] CHK009 WR displays red when WR < APW
- [ ] CHK010 WR displays green when WR ≥ APW

### Daily Points Adjustment
- [ ] CHK011 Increment button (+) increases DOW value by 1
- [ ] CHK012 Decrement button (-) decreases DOW value by 1
- [ ] CHK013 DOW cannot go below 0
- [ ] CHK014 WR updates immediately on DOW change
- [ ] CHK015 Totals update immediately on DOW change
- [ ] CHK016 Auto-updated fields recalculate on DOW change

### Routine CRUD
- [ ] CHK017 Add routine with name and daily average (required)
- [ ] CHK018 Validation error if name is missing
- [ ] CHK019 Validation error if daily average is missing
- [ ] CHK020 Edit routine name
- [ ] CHK021 Edit routine daily average
- [ ] CHK022 Edit routine comments
- [ ] CHK023 Delete routine with confirmation dialog
- [ ] CHK024 Totals update after routine add/edit/delete

---

## P2 - Essential Features

### User Configuration
- [ ] CHK025 Set Available Days (AD) - range 1-7
- [ ] CHK026 Set Work Days (WD) - range 1-7, ≤ AD
- [ ] CHK027 Set Work Hours per Day (WHD) - range 1-24
- [ ] CHK028 Configuration persists across sessions
- [ ] CHK029 APW recalculates when WD changes
- [ ] CHK030 Validation: WD cannot exceed AD
- [ ] CHK031 Validation: WHD cannot exceed 24

### Auto-Updated Fields
- [ ] CHK032 Display Off Hours daily: (24 - WHD)
- [ ] CHK033 Display Available work hours week: (WHD × WD)
- [ ] CHK034 Display Hours left: (SUM(AP) - SUM(APW))
- [ ] CHK035 Display Median work per available day: (SUM(APW) / AD)
- [ ] CHK036 All fields update when configuration changes
- [ ] CHK037 All fields update when routines change

### Weekly Reset Cycle
- [ ] CHK038 DOW values reset to 0 at week start
- [ ] CHK039 Routine configurations persist after reset
- [ ] CHK040 User settings persist after reset
- [ ] CHK041 Weekly reset is automatic (no user action needed)

### Landing Page
- [ ] CHK042 Hero section with app description
- [ ] CHK043 "Download App" CTA button
- [ ] CHK044 "Sign In" CTA button links to auth
- [ ] CHK045 Features section highlighting key benefits
- [ ] CHK046 Sleek, modern design

### Authentication
- [ ] CHK047 Sign up with email and password
- [ ] CHK048 Log in with credentials
- [ ] CHK049 Log out functionality
- [ ] CHK050 Dashboard protected from unauthenticated access
- [ ] CHK051 Redirect to landing page on logout

---

## P3 - Supporting Features

### Static Pages
- [ ] CHK052 About page with app information
- [ ] CHK053 FAQ page with expandable Q&A sections
- [ ] CHK054 Contact page with form (name, email, message)
- [ ] CHK055 Contact form validation
- [ ] CHK056 Navigation to all static pages

---

## Edge Cases & Validation

- [ ] CHK057 Empty state when no routines exist
- [ ] CHK058 CTA to add first routine in empty state
- [ ] CHK059 Handle WHD > 24 validation error
- [ ] CHK060 Handle WD > AD validation error
- [ ] CHK061 Handle AD > 7 validation error
- [ ] CHK062 Timezone handling for weekly reset

---

## Non-Functional Requirements

### Performance
- [ ] CHK063 DOW updates reflect in UI within 100ms
- [ ] CHK064 Landing page loads in under 2 seconds

### Compatibility
- [ ] CHK065 Works on Chrome
- [ ] CHK066 Works on Firefox
- [ ] CHK067 Works on Safari
- [ ] CHK068 Works on Edge
- [ ] CHK069 Works on mobile browsers

### Responsive Design & Mobile
- [ ] CHK070 Fully functional on smartphones (320px width and up)
- [ ] CHK071 Fully functional on tablets
- [ ] CHK072 Responsive layouts adapt from 320px to 2560px
- [ ] CHK073 Touch-friendly controls (min 44x44px tap targets)
- [ ] CHK074 Routines table scrollable or card layout on mobile
- [ ] CHK075 Swipe gestures work for DOW increment/decrement
- [ ] CHK076 Navigation collapses to hamburger menu on mobile
- [ ] CHK077 Works on iOS Safari
- [ ] CHK078 Works on Android Chrome
- [ ] CHK079 Forms are usable on mobile keyboards

### Design
- [ ] CHK080 Dark mode friendly
- [ ] CHK081 Clear visual hierarchy
- [ ] CHK082 Satisfying micro-interactions for +/- buttons
- [ ] CHK083 Clean typography and whitespace
- [ ] CHK084 Mobile-first design approach

---

## Notes

- Check items off as completed: `[x]`
- P1 items are required for MVP
- P2 items are essential for full functionality
- P3 items can be deferred if needed
- **Total checklist items: 84**
