# Getting Started Guide

## Prerequisites

- Node.js 18+ 
- npm or yarn

## Installation

```bash
# Navigate to project directory
cd "Daily Routine"

# Install dependencies
npm install
```

## Running the App

```bash
# Start development server
npm run dev
```

The app will open at `http://localhost:5173`

## First Steps

### 1. Add Your First Habit
- Click the "Manage Habits" tab
- Enter a habit name (e.g., "Morning Exercise")
- Click "Add Habit"

### 2. Check Off Today's Habits
- Return to the "Today" tab
- Click on habits to mark them complete
- Watch the progress ring update in real-time

### 3. View Your Analytics
- Click the "Analytics" tab
- See daily and monthly completion trends
- Charts update automatically as you track habits

## Key Features

### Daily Reset
The app automatically resets each day:
- Unchecks all habits at midnight (local time)
- Preserves your historical data
- Works even if you don't open the app every day

### Data Storage
- All data stored locally in your browser
- No account needed
- No data leaves your device
- Your privacy is protected

### Analytics
- **Daily**: See today's completion percentage
- **Monthly**: Line chart of daily progress
- **Yearly**: Bar chart of monthly averages

## Tips

1. **Start Small**: Begin with 3-5 habits you can actually maintain
2. **Be Consistent**: The app shows trends over time
3. **Review Regularly**: Use analytics to identify patterns
4. **Don't Gamify**: Focus on self-awareness, not perfect scores

## Troubleshooting

### Habits not saving?
- Check browser console for errors
- Ensure localStorage is enabled
- Try clearing cache and reloading

### Charts not showing?
- You need at least a few days of data
- Make sure you've checked off some habits

### Reset not working?
- Open browser developer tools → Application → Local Storage
- Check that `appState` exists
- Try refreshing the page

## Exporting Data

Currently in development (v2). Data is stored in browser localStorage.

To manually backup:
1. Open browser console (F12)
2. Go to Application → Local Storage
3. Copy the values for `habits`, `completions`, and `appState`

## Next Steps

- Track habits for a week to see patterns
- Adjust habits that aren't working
- Review monthly analytics to spot trends
- Keep it simple and sustainable

---

Need help? The code is well-documented. Check:
- `ARCHITECTURE.md` for technical details
- `README.md` for project overview
