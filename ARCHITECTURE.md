# ARCHITECTURE.md

## Daily Routine Tracker - Architecture Documentation

### Overview
Production-ready habit tracking web application inspired by Strides, built with React, TypeScript, and Tailwind CSS.

---

## Data Architecture

### Data Models

#### Habit
```typescript
{
  id: string            // UUID
  name: string          // Display name
  active: boolean       // Soft delete flag
  createdAt: string     // ISO 8601 timestamp
}
```

#### CompletionRecord
```typescript
{
  habitId: string       // FK to Habit
  date: string          // YYYY-MM-DD format
  completed: boolean    // Completion status
}
```

#### AppState
```typescript
{
  lastActiveDate: string  // YYYY-MM-DD format
  initialized: boolean    // First-run flag
}
```

---

## Core Systems

### 1. Storage Layer (`storageService.ts`)

**Purpose**: Abstract data persistence for future backend migration

**Features**:
- Type-safe localStorage wrapper
- CRUD operations for habits and completions
- Error handling (quota exceeded)
- Export/import functionality
- Never throws, always returns defaults

**Design Decisions**:
- Singleton pattern for global access
- Separation from business logic
- Easy to swap with IndexedDB/API

---

### 2. Daily Reset Logic (`dailyResetService.ts`)

**Critical Requirements**:
- ✅ Never wipe historical data
- ✅ Handle timezone changes
- ✅ Handle multiple days offline
- ✅ No race conditions

**Algorithm**:
```
1. On app load:
   - Get today's date (local timezone)
   - Compare with lastActiveDate
   
2. If dates differ:
   - Initialize today's completions as unchecked
   - Preserve all historical data
   - Update lastActiveDate to today
   
3. If same:
   - No action needed
```

**Edge Cases Handled**:
- First-time app use
- Browser refresh
- Timezone changes
- App not opened for days/weeks

---

### 3. Analytics Engine (`analyticsService.ts`)

**Formulas**:

**Daily Completion %**:
```
(completed habits / total active habits) * 100
```

**Monthly Completion %**:
```
Average of all daily percentages in month
(only includes days up to today)
```

**Yearly Completion %**:
```
Average of all monthly percentages in year
(only includes months up to current month)
```

**Design Principles**:
- Deterministic (same input = same output)
- Never shows misleading data
- Handles empty data gracefully
- All percentages rounded to 2 decimals

---

### 4. State Management (`habitStore.ts`)

**Technology**: Zustand

**Why Zustand?**:
- Simpler than Redux
- Better TypeScript support than Context
- No Provider wrapper needed
- Easy to scale

**State Structure**:
```typescript
{
  habits: Habit[]
  completions: CompletionRecord[]
  isLoading: boolean
  lastResetCheck: string
}
```

**Actions**:
- `loadData()` - Initialize from storage
- `addHabit()` - Create new habit
- `updateHabit()` - Modify habit
- `deleteHabit()` - Soft delete
- `toggleCompletion()` - Toggle completion status
- `checkDailyReset()` - Trigger reset check

---

## Component Architecture

### Component Hierarchy
```
App
├── DailyChecklist
│   └── ProgressRing
├── Analytics
│   ├── MonthlyChart
│   └── YearlyChart
└── HabitManager
```

### Component Responsibilities

**App.tsx**
- Tab navigation
- Daily reset trigger on focus
- Loading state
- Layout structure

**DailyChecklist.tsx**
- Display today's habits
- Show progress ring
- Handle checkbox interactions
- Calculate real-time completion %

**ProgressRing.tsx**
- SVG circular progress indicator
- Animated percentage display

**MonthlyChart.tsx**
- Line chart of daily percentages
- Recharts integration
- Responsive container

**YearlyChart.tsx**
- Bar chart of monthly averages
- Recharts integration
- Responsive container

**HabitManager.tsx**
- CRUD operations for habits
- Inline editing
- Archive view

---

## Date Handling

**Library**: date-fns

**Principles**:
- Always use local timezone
- Store dates as YYYY-MM-DD strings
- Single source of truth for date operations

**Key Functions**:
- `getTodayString()` - Current date as YYYY-MM-DD
- `getDaysInMonth()` - All days in a month
- `getMonthsInYear()` - All months (1-12)
- `formatDisplayDate()` - Human-readable dates

---

## Performance Considerations

### Optimizations
1. **useMemo** for analytics calculations
2. **Selective re-renders** via Zustand selectors
3. **Lazy chart rendering** (only visible tab)
4. **Local storage** (< 5MB typically)

### Scalability Limits (v1)
- ~1000 habits: localStorage OK
- ~100,000 completions: localStorage OK
- Beyond: Migrate to IndexedDB

---

## Security & Privacy

**V1 (Current)**:
- All data stored locally
- No network requests
- No tracking
- No authentication

**V2 (Future)**:
- Optional cloud sync
- End-to-end encryption
- JWT authentication
- GDPR compliance

---

## Future Enhancements

### V2 Features
1. **Multi-device sync**
   - Backend API
   - Conflict resolution
   - Offline-first architecture

2. **Advanced habit types**
   - Quantity tracking (e.g., 8 glasses of water)
   - Frequency (e.g., 3x per week)
   - Time-based (e.g., 30 minutes)

3. **Insights**
   - Habit streaks
   - Best/worst days
   - Correlation analysis

4. **Export**
   - CSV export
   - PDF reports
   - Data portability

---

## Testing Strategy

### Unit Tests (Recommended)
- Analytics calculations
- Date utilities
- Storage service
- Daily reset logic

### Integration Tests
- Full user flows
- Tab navigation
- Data persistence

### E2E Tests
- Critical paths
- Multi-day scenarios
- Edge cases

---

## Deployment

### Build
```bash
npm run build
```

### Hosting Options
- Vercel (recommended)
- Netlify
- GitHub Pages
- Any static host

### Environment
- No environment variables needed (v1)
- Client-side only
- No server required

---

## Tradeoffs & Assumptions

### Assumptions
1. Users access from single device (v1)
2. localStorage is available
3. Modern browser (ES2020+)
4. JavaScript enabled

### Tradeoffs
1. **localStorage vs IndexedDB**
   - Chose localStorage for simplicity
   - Easy to migrate if needed

2. **Zustand vs Redux**
   - Zustand for less boilerplate
   - Redux unnecessary for this scale

3. **No authentication**
   - Simpler onboarding
   - Privacy by default
   - Can add later without breaking changes

4. **Boolean habits only**
   - Simpler analytics
   - Covers 80% of use cases
   - Foundation for advanced types

---

## Code Quality

### TypeScript
- Strict mode enabled
- No `any` types
- Full type coverage

### Code Organization
```
src/
├── components/     # React components
├── services/       # Business logic
├── store/          # State management
├── types/          # TypeScript types
├── utils/          # Helpers
└── App.tsx         # Main app
```

### Naming Conventions
- Components: PascalCase
- Services: camelCase + Service suffix
- Utilities: camelCase
- Types: PascalCase (interfaces)

---

## Maintenance

### Adding a New Habit Type
1. Update `Habit` type
2. Modify analytics calculations
3. Update UI components
4. Add migration logic

### Adding a New Chart
1. Create chart component
2. Add data generation to `analyticsService`
3. Import in `Analytics.tsx`

### Migrating to Backend
1. Replace `storageService` implementation
2. Add API client
3. Implement sync logic
4. Keep same interfaces
