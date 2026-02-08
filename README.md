# Daily Routine Tracker

A production-ready, Strides-inspired habit tracking web application.

## Features

- ✅ Daily habit checklist
- 📊 Real-time analytics & charts
- 📈 Daily, monthly, and yearly completion tracking
- 🔄 Bulletproof daily reset logic
- 💾 Local-first storage (no login required)
- 📱 Mobile-first responsive design

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **State Management**: Zustand
- **Date Handling**: date-fns
- **Build Tool**: Vite

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture

### Data Model

**Habit**
- id: unique identifier
- name: habit name
- active: whether habit is currently tracked
- createdAt: creation timestamp

**CompletionRecord**
- habitId: reference to habit
- date: YYYY-MM-DD format
- completed: boolean status

### Storage

- Uses localStorage for v1
- Abstracted behind StorageService for future backend integration
- Never wipes historical data

### Analytics

- **Daily %**: (completed / total active) * 100
- **Monthly %**: Average of all daily percentages in month
- **Yearly %**: Average of all monthly percentages

## Design Principles

1. **Data integrity first** - analytics must always be accurate
2. **No race conditions** - deterministic daily reset logic
3. **Separation of concerns** - UI, logic, and data layers are decoupled
4. **Mobile-first** - responsive on all screen sizes
5. **Calm design** - no gamification, focus on self-awareness

## Future Enhancements (v2)

- User authentication
- Cloud sync
- Multiple habit types (frequency, quantity)
- Habit streaks
- Data export
